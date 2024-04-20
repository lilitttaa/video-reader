import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material'
import { getBackendUrl } from '../../api'

export const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  let navigate = useNavigate()
  let location = useLocation()
  let { from } = location.state || { from: { pathname: '/' } }
  let register = async () => {
    // 请求restful api
    let response = await fetch(getBackendUrl()+'/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    })
    if (response.status === 201) {
      navigate('/login')
    } else {
      console.log(response)
      alert('register failed: ' + response.status)
    }
  }
  return (
    <main className='w-full h-full flex flex-col items-center pt-30'>
      <div className='max-w-100'>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Box
          component='form'
          onSubmit={e => {
            e.preventDefault()
            register()
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='User Name'
            name='username'
            autoComplete='username'
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
        <Grid container>
          <Grid item>
            <Link href='/login' variant='body2'>
              {'<- Back to Login'}
            </Link>
          </Grid>
        </Grid>
      </div>
    </main>
  )
}
