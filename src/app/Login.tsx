import React from 'react'
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

let user: any = null
export const GuestGuard = ({ children }: { children: JSX.Element }) => {
  let location = useLocation()
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return children
}

export const Login = () => {
  let navigate = useNavigate()
  let location = useLocation()
  let { from } = location.state || { from: { pathname: '/' } }
  let login = () => {
    user = { name: 'user' }
    navigate(from)
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
        <Box component='form' onSubmit={()=>login()} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
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
              <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
    </main>
  )
}
