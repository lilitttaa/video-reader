import {
	Autocomplete,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { getBackendUrl } from '../../api'
import { ArrowUpward, Input, Search } from '@mui/icons-material'
const TriggerPanel = () => {
  const [isRunning, setIsRunning] = useState(false)
  const fetchTriggerStatus = () => {
    fetch(getBackendUrl()+'/api/trigger/status')
    .then(response => response.json())
    .then(data => {
      setIsRunning(data.status === 'running')
    })
  }
  useEffect(() => {
    fetchTriggerStatus()
    const interval = setInterval(() => {
      fetchTriggerStatus()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const fetchWorkers = () =>{
	setIsLoading(true)
	// 使用timer模拟请求
	setTimeout(() => {
		setIsLoading(false)
	}, 1000)

	// fetch(getBackendUrl()+'/api/trigger/workers')
	// .then(response => response.json())
	// .then(data => {
	// 	setIsLoading(false)
	// })
  }

  const triggerValidation = async() => {
    fetch(getBackendUrl()+'/api/trigger/launch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
    }).then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to trigger validation'+response.status)
      }
      return response.json()
    }).then(data => {
      setIsRunning(true)
    }).catch(error => {
      alert(error)
    })
  }

  return (
    <main className='main h-full w-full flex flex-col items-center justify-center'>
      <Card
        className='p-4'
        style={{
          borderRadius: '2rem'
        }}
      >
        <CardContent className='w-150'>
          <div className='flex flex-col gap-4 justify-center'>
			<div className='flex flex-row items-center justify-center gap-2 '>
			<TextField label='YOUTUBE URL:' />
			<Button disabled={isLoading} onClick={fetchWorkers}>
				{/* <ArrowUpward /> */}
				Upload
			</Button>
			{isLoading ? (
                <CircularProgress disableShrink />
              ) : (
                <CheckCircleIcon color='success' fontSize='large' />
              )}
			</div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default TriggerPanel
