import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  ListItem,
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
class TaskInfo {
  url: string
  constructor (url: string) {
    this.url = url
  }
}
const TriggerPanel = () => {
  const [runningTask, setRunningTask] = useState<TaskInfo | null>(null)
  const [pendingTasks, setPendingTasks] = useState<TaskInfo[]>([])
  const [url, setUrl] = useState('')
  function parseTasks (data: any) {
    let task_state = data.task_state
    let runningTask = task_state.running_task
      ? new TaskInfo(task_state.running_task)
      : null
    return {
      runningTask,
      pendingTasks: task_state.tasks.map((task: any) => {
        return new TaskInfo(task)
      })
    }
  }
  const fetchTaskState = () => {
    fetch(getBackendUrl() + '/api/trigger/task_state')
      .then(response => response.json())
      .then(data => {
        const { runningTask, pendingTasks } = parseTasks(data)
        setRunningTask(runningTask)
        setPendingTasks(pendingTasks)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  useEffect(() => {
    fetchTaskState()
    const interval = setInterval(() => {
      fetchTaskState()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const triggerGenerate = () => {
    fetch(getBackendUrl() + '/api/trigger/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url
      })
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Failed to trigger validation' + response.status)
        }
        return response.json()
      })
      .then(data => {
        const { runningTask, pendingTasks } = parseTasks(data)
        setRunningTask(runningTask)
        setPendingTasks(pendingTasks)
      })
      .catch(error => {
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
              <TextField value={url} onChange={(e)=>{
				setUrl(e.target.value)
			  }} label='YOUTUBE URL:' />
              <Button onClick={triggerGenerate}>
                {/* <ArrowUpward /> */}
                Upload
              </Button>
            </div>
          </div>
          <div className='flex flex-col'>
            {runningTask ? (
              <ListItem>
                <Typography>Running Task:</Typography>
                <Typography>{runningTask?.url}</Typography>
                <CircularProgress disableShrink />
              </ListItem>
            ) : null}

            {pendingTasks.map((task, index) => {
              return (
                <ListItem key={index}>
                  <Typography>Pending Task:</Typography>
                  <Typography>{task.url}</Typography>
                </ListItem>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default TriggerPanel
