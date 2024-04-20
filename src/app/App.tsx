import React, { useEffect, useState } from 'react'
import './App.css'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation} from 'react-router-dom'
import DefaultLayout from '../layout/defaultLayout'
import { ChartsPanel } from '../container/chartsPanel'
import TriggerPanel from '../container/triggerPanel'
import { GuestGuard, Login } from './Login'
import HistoryPanel from '../container/historyPanel'


const App: React.FC = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<ChartsPanel/>} />
            <Route path='/charts' element={<Navigate to='/' />} />
            <Route path='/login' element={<Login />} />
			<Route path='/history' element={<HistoryPanel/>}/>
            <Route
              path='/trigger'
              element={
                <GuestGuard>
                  <TriggerPanel/>
                </GuestGuard>
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
