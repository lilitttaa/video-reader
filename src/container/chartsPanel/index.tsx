import { Article, TrendingDown, TrendingUp } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  CardActions,
  CardContent,
  IconButton,
  Input,
  Paper,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import Card from '@mui/material/Card'
import { useEffect, useState } from 'react'
import { getBackendUrl } from '../../api'
import { NavLink } from 'react-router-dom'
import React from 'react'

class WordInfo {
  word: string
  context: string
  interpret: string
  constructor (word: string, context: string, interpret: string) {
    this.word = word
    this.context = context
    this.interpret = interpret
  }
}

export function WordsPanel () {
  const [wordInfoList, setWordInfoList] = useState<WordInfo[]>([])
  const [word, setWord] = useState('')
  const [context, setContext] = useState('')

  const fetchWordsList = () => {
    console.log('fetchWordsList')
    fetch(getBackendUrl() + '/api/words/list')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setWordInfoList(
          data.words.map((wordInfo: any) => {
            return new WordInfo(
              wordInfo.word,
              wordInfo.context,
              wordInfo.interpret
            )
          })
        )
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const addWord = () => {
    console.log('addWord')
    fetch(getBackendUrl() + '/api/words/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word: word,
        context: context
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setWordInfoList(
          data.words.map((wordInfo: any) => {
            return new WordInfo(
              wordInfo.word,
              wordInfo.context,
              wordInfo.interpret
            )
          })
        )
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  useEffect(() => {
    fetchWordsList()
  }, [])

  return (
    <main className='main flex flex-col p-4 gap-10 overflow-y-auto'>
      <div className='flex flex-row justify-center'>
        <form
          className='w-80'
          onSubmit={e => {
			console.log('event')
            addWord()
			e.preventDefault()
          }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            // id='email'
            label='Word'
            name='word'
            autoFocus
            onChange={e => {
              setWord(e.target.value)
            }}
            value={word}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='context'
            label='Context'
            onChange={e => {
              setContext(e.target.value)
            }}
            value={context}
            // id='password'
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
                <Typography variant='h5'>{wordInfo.word}</Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Context: </span>
                  {wordInfo.context}
                </Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Interpret: </span>
                  {wordInfo.interpret}
                </Typography>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
