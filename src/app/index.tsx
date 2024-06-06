import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import DefaultLayout from '../layout/defaultLayout'
import { WordsPanel } from '../container/chartsPanel'
import TriggerPanel from '../container/triggerPanel'
import { GuestGuard, Login } from '../component/login'
import HistoryPanel from '../container/historyPanel'
import { SignUp } from '../component/signUp'
import { TranscriptPanel } from '../container/transcriptPanel'

const App: React.FC = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<WordsPanel />} />
            <Route path='/word' element={<Navigate to='/' />} />
            <Route path='/transcript' element={<TranscriptPanel/>}/>
            <Route path='/login' element={<Login />} />
            <Route path='/sign_up' element={<SignUp />} />
            <Route path='/history' element={<HistoryPanel />} />
            <Route
              path='/trigger'
              element={
                // <GuestGuard>
                  <TriggerPanel />
                // </GuestGuard>
              }
            />
            <Route path='*' element={<Navigate to='/' />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
