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

class VideoInfo {
  title: string
  description: string
  titleZH: string
  descriptionZH: string
  constructor (title: string, description: string, titleZH: string, descriptionZH: string) {
    this.title = title
    this.description = description
	this.titleZH = titleZH
	this.descriptionZH = descriptionZH
  }
}

enum LanuageMode {
  zh = 'zh',
  en = 'en'
}

export function ChartsPanel () {
	const [videoInfos, setVideoInfos] = useState<VideoInfo[]>([])
  const [languageMode, setLanguageMode] = useState<LanuageMode>(LanuageMode.en)

  const fetchVideoInfo = () => {
    fetch(getBackendUrl() + '/api/video/info')
      .then(response => response.json())
      .then(data => {
		setVideoInfos(data.video_infos.map((videoInfo: any) => {
			return new VideoInfo(videoInfo.title, videoInfo.description, videoInfo.title_zh, videoInfo.description_zh)
		}))})
		.catch((error) => {
			console.error('Error:', error);
		  });
  }

  useEffect(() => {
	fetchVideoInfo()
	const interval = setInterval(() => {
	  fetchVideoInfo()
	}, 5000)
	return () => clearInterval(interval)
  }, [])



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
<div className='flex flex-row items-center'>
	<Typography variant='h5' color='textPrimary' gutterBottom>
	English/中文
	</Typography>
	<Switch value={languageMode===LanuageMode.en} onChange={()=>{
		setLanguageMode(languageMode===LanuageMode.en?LanuageMode.zh:LanuageMode.en)
	}}></Switch>

</div>
      <div className='flex flex-row gap-5 flex-wrap justify-start'>
        {videoInfos.map(videoInfo => (
          <div className='w-100 p-4 h-100 bg-slate-300 overflow-y-auto'>
            <Typography variant='h5' color='textPrimary' gutterBottom>
              {languageMode === LanuageMode.en ? videoInfo.title : videoInfo.titleZH}
            </Typography>
            <Typography variant='body1' color='textPrimary' gutterBottom>
              {(languageMode === LanuageMode.en ? videoInfo.description : videoInfo.descriptionZH).split('\\n').map((line, index) => {
                    return (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    )
                  })}
            </Typography>
          </div>
        ))}
      </div>
    </main>
  )
}
