import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Switch,
  Typography
} from '@mui/material'
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { getBackendUrl } from '../../api'
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
        <CardContent>
          <div className='flex flex-row gap-4'>
            <div className='h-full'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticTimePicker
                  defaultValue={dayjs('2022-04-17T15:30')}
                  localeText={{ toolbarTitle: '设置定时器' }}
                  ampm={false}
                  displayStaticWrapperAs='desktop'
                  
                />
              </LocalizationProvider>
              <div className='flex flex-row justify-between'>
                <Typography>启用定时器</Typography>
                <Switch />
              </div>
            </div>
            <div className='flex flex-col items-center justify-around gap-4'>
              <Typography variant='h5' component='div'>
                {'当前校验器状态：' + (isRunning ? '运行中' : '空闲')}
              </Typography>
              {isRunning ? (
                <CircularProgress disableShrink />
              ) : (
                <CheckCircleIcon color='success' fontSize='large' />
              )}
              <Button
                disabled={isRunning}
                onClick={() => {
                  triggerValidation()
                }}
              >
                开始校验
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default TriggerPanel
