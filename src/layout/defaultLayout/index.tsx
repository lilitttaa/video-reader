import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../../container/header'
import { RightSideBar } from '../../container/rightSideBar'
import { LeftSideBar } from '../../container/leftSideBar'

function DefaultLayout () {
  const [openLeftSideBar, setOpenLeftSideBar] = useState(true)
  const [openRightSideBar, setOpenRightSideBar] = useState(true)
  const OnOpenLeftSideBar = () => {
	setOpenLeftSideBar(!openLeftSideBar)
  }
  const OnOpenRightSideBar = () => {
	setOpenRightSideBar(!openRightSideBar)
  }
  return (
    <div className='h-screen w-screen flex flex-row overflow-y-hidden overflow-x-hidden'>
      {openLeftSideBar && <LeftSideBar />}
      <div className='flex-1 min-w-0 flex flex-col'>
        <Header OnOpenLeftSideBar= {OnOpenLeftSideBar} OnOpenRightSideBar= {OnOpenRightSideBar} />
        <Outlet />
      </div>
	  {openRightSideBar && <RightSideBar />}
    </div>
  )
}

export default DefaultLayout
