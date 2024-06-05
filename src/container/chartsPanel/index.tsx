import { Article, TrendingDown, TrendingUp } from '@mui/icons-material'
import {
  Button,
  CardActions,
  CardContent,
  IconButton,
  Paper,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  constructor (
    word: string,
    context: string,
    interpret: string
  ) {
    this.word = word
    this.context = context
    this.interpret = interpret
  }
}

export function ChartsPanel () {
  const [wordInfoList, setWordInfoList] = useState<WordInfo[]>([])

  const fetchWordsList = () => {
    console.log("fetchWordsList")
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

  useEffect(() => {
    fetchWordsList()
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
                  {wordInfo.word}</Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Context:  </span>
                  {wordInfo.context}</Typography>
                <Typography variant='body1'>
                  <span className='font-bold'>Interpret:  </span>
                  {wordInfo.interpret}</Typography>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
