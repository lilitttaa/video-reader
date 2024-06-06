import {
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getBackendUrl } from '../../api'
class TranscriptInfo {
  title: string
  desc: string
  text: string
  constructor (
    title: string,
    desc: string,
    text: string
  ) {
    this.title = title
    this.desc = desc
    this.text = text
  }
}

export function DetailPanel () {
  const [wordInfoList, setWordInfoList] = useState<TranscriptInfo[]>([])

  const fetchTranscriptsList = () => {
    console.log("fetchTranscriptsList")
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

  useEffect(() => {
    fetchTranscriptsList()
  }, [])

  return (
    <main className='main flex flex-col p-4 gap-10 overflow-y-auto'>
      <div>
        <ul className='words-list w-full flex flex-col gap-2'>
          {wordInfoList.map((wordInfo, index) => {
            return (
              <li
                key={index}
                className='words-list-item bg-slate-400 w-auto rounded-xl pl-4 pr-4 pt-1 pb-1 flex flex-col gap-1'
              >
                <Typography variant='h5'>
                  {wordInfo.title}</Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Context:  </span>
                  {wordInfo.desc}</Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Interpret:  </span>
                  {wordInfo.text}</Typography>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
