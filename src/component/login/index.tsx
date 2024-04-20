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
import { Copyright } from '@mui/icons-material'
import { getBackendUrl } from '../../api'

let user: any = null
export const GuestGuard = ({ children }: { children: JSX.Element }) => {
  let location = useLocation()
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return children
}

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  let navigate = useNavigate()
  let location = useLocation()
  let { from } = location.state || { from: { pathname: '/' } }
  let login = async () => {
    let response = await fetch(getBackendUrl()+'/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (response.status === 200) {
      user = true
      if (from.pathname === '/sign_up') {
        navigate('/')
      } else {
        navigate(from)
      }
    }
    else {
      const error = await response.json()
      alert('login failed: ' + error.message)
    }
  }
  return (
    <main className='w-full h-full flex flex-col items-center pt-30'>
      <div className='max-w-100'>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={(e) => {
          login()
          e.preventDefault()
        }} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
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
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign_up" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
    </main>
  )
}
