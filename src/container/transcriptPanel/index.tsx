import { Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getBackendUrl } from '../../api'
class TranscriptInfo {
  title: string
  desc: string
  text: string
  constructor (title: string, desc: string, text: string) {
    this.title = title
    this.desc = desc
    this.text = text
  }
}

export function TranscriptPanel () {
  const [wordInfoList, setWordInfoList] = useState<TranscriptInfo[]>([]) //TODO
  const [url, setUrl] = useState('')
  const fetchTranscriptsList = () => {
    console.log('fetchTranscriptsList')
    fetch(getBackendUrl() + '/api/transcript/list')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setWordInfoList(
          data.transcripts.map((transcriptInfo: any) => {
            return new TranscriptInfo(
              transcriptInfo.title,
              transcriptInfo.desc,
              transcriptInfo.text
            )
          })
        )
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const addTranscript = () => {
    console.log('addTranscript')
    fetch(getBackendUrl() + '/api/transcript/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setWordInfoList(
          data.transcripts.map((transcriptInfo: any) => {
            return new TranscriptInfo(
              transcriptInfo.title,
              transcriptInfo.desc,
              transcriptInfo.text
            )
          })
        )
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  useEffect(() => {
    fetchTranscriptsList()
  }, [])

  function splitTextByLineBreaks (text: string) {
	return text.split(/\\n|\n/)
  }

  function texts2Span (texts: string[]) {
	console.log('texts',texts)
	return texts.map((text, index) => {
	  return (
		<span key={index}>
		  {text}
		  <br />
		</span>
	  )
	})
  }


  return (
    <main className='main flex flex-col p-4 gap-10 overflow-y-auto'>
      <div className='flex flex-row justify-center'>
        <form
          className='w-80'
          onSubmit={e => {
            console.log('event')
            addTranscript()
            e.preventDefault()
          }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            label='Url'
            name='url'
            autoFocus
            onChange={e => {
              setUrl(e.target.value)
            }}
            value={url}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Add
          </Button>
        </form>
      </div>

      <div>
        <ul className='words-list w-full flex flex-col gap-2'>
          {wordInfoList.map((wordInfo, index) => {
            return (
              <li
                key={index}
                className='words-list-item bg-slate-400 w-auto rounded-xl pl-4 pr-4 pt-1 pb-1 flex flex-col gap-1'
              >
                <Typography variant='h5'>{wordInfo.title}</Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Context: </span>
				  {texts2Span(splitTextByLineBreaks(wordInfo.desc))}
                </Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Interpret: </span>
                  {texts2Span(splitTextByLineBreaks(wordInfo.text))}
                </Typography>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
