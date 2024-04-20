import { Article, TrendingDown, TrendingUp } from '@mui/icons-material'
import {
  Button,
  CardActions,
  CardContent,
  IconButton,
  Paper,
  Skeleton,
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
import ReactApexChart from 'react-apexcharts'
import {
  CardInfo,
  createValidationResult,
  generateBarOptions,
  generateBarSeries,
  generateBrokenLineOptions,
  generateBrokenLineSeries,
  generateSectorDiagramOptions,
  generateSectorDiagramSeries,
  ValidationData,
  ValidationResult,
  validationTypeMap
} from '../../dataHandler'
import { useEffect, useState } from 'react'
import { getBackendUrl } from '../../api'
import { NavLink } from 'react-router-dom'
import React from 'react'

class VideoInfo {
  title: string
  description: string
  constructor (title: string, description: string) {
    this.title = title
    this.description = description
  }
}

export function ChartsPanel () {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>()

  const fetchVideoInfo = () => {
    fetch(getBackendUrl() + '/api/video/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=xQTSBtaE4do'
      })
    })
      .then(response => response.json())
      .then(data => {
        setVideoInfo(new VideoInfo(data.title, data.description))
      })
  }

  useEffect(() => {
    fetchVideoInfo()
  }, [])



  const cards = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ] as (CardInfo | null)[]


  return (
    <main className='main flex flex-col pl-4 pr-4 pb-4 gap-10 overflow-y-auto'>
      <div className='pt-8 flex flex-row items-center gap-4'>
        <Card
          className='flex-1'
          style={{
            backgroundColor: '#F7F9FB',
            borderRadius: '1.5rem'
          }}
          elevation={0}
        >
          <CardContent className='flex flex-row items-center justify-center'>
            <Typography>查看详情:</Typography>
            <NavLink to={'/detail'}>
              <IconButton
                aria-label='add an alarm'
                onClick={() => {
                  // generateHtmlFile()
                }}
              >
                <Article />
              </IconButton>
            </NavLink>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-row gap-5 flex-wrap justify-start'>
        {cards.map(card => (
          <div className='w-100 p-4 h-100 bg-slate-300 '>
            <Typography variant='h5' color='textPrimary' gutterBottom>{videoInfo ? videoInfo.title : ''}</Typography>
            <Typography variant='body1' color='textPrimary' gutterBottom>
              {videoInfo
                ? videoInfo.description.split('\\n').map((line, index) =>{ 
					console.log('line:', line,"-------------",videoInfo.description)
					return (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  )
				})
                : ''}
            </Typography>
          </div>
        ))}
      </div>
    </main>
  )
}
