import React from 'react'
import { ReactNode, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from '../../images/logo/logo.svg'
interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode
  activeCondition: boolean
}

const SidebarLinkGroup = ({
  children,
  activeCondition
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition)

  const handleClick = () => {
    setOpen(!open)
  }

  return <li>{children(handleClick, open)}</li>
}

type sidebarItem = {
  title: string
  link: string
  icon: ReactNode
  multi?: boolean
  keyword: string
  children?: sidebarSubItem[]
}

type sidebarSubItem = {
  title: string
  link: string
  keyword: string
}

type sidebarCategory = {
  title: string
  children: sidebarItem[]
}

const exampleIcon = (
  <svg
    className='fill-current'
    width='18'
    height='19'
    viewBox='0 0 18 19'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_130_9801)'>
      <path
        d='M10.8563 0.55835C10.5188 0.55835 10.2095 0.8396 10.2095 1.20522V6.83022C10.2095 7.16773 10.4907 7.4771 10.8563 7.4771H16.8751C17.0438 7.4771 17.2126 7.39272 17.3251 7.28022C17.4376 7.1396 17.4938 6.97085 17.4938 6.8021C17.2688 3.28647 14.3438 0.55835 10.8563 0.55835ZM11.4751 6.15522V1.8521C13.8095 2.13335 15.6938 3.8771 16.1438 6.18335H11.4751V6.15522Z'
        fill=''
      />
      <path
        d='M15.3845 8.7427H9.1126V2.69582C9.1126 2.35832 8.83135 2.07707 8.49385 2.07707C8.40947 2.07707 8.3251 2.07707 8.24072 2.07707C3.96572 2.04895 0.506348 5.53645 0.506348 9.81145C0.506348 14.0864 3.99385 17.5739 8.26885 17.5739C12.5438 17.5739 16.0313 14.0864 16.0313 9.81145C16.0313 9.6427 16.0313 9.47395 16.0032 9.33332C16.0032 8.99582 15.722 8.7427 15.3845 8.7427ZM8.26885 16.3083C4.66885 16.3083 1.77197 13.4114 1.77197 9.81145C1.77197 6.3802 4.47197 3.53957 7.8751 3.3427V9.36145C7.8751 9.69895 8.15635 10.0083 8.52197 10.0083H14.7938C14.6813 13.4958 11.7845 16.3083 8.26885 16.3083Z'
        fill=''
      />
    </g>
    <defs>
      <clipPath id='clip0_130_9801'>
        <rect
          width='18'
          height='18'
          fill='white'
          transform='translate(0 0.052124)'
        />
      </clipPath>
    </defs>
  </svg>
)

const sidebarItems: sidebarCategory[] = [
  {
    title: 'MENU',
    children: [
      {
        title: 'Dashboard',
        link: '/dashboard',
        keyword: 'dashboard',
        icon: exampleIcon
      },
      {
        title: 'Trigger',
        link: '/trigger',
        keyword: 'trigger',
        icon: exampleIcon
      },
      {
        title: 'Test',
        link: '/test',
        keyword: 'test',
        icon: exampleIcon
      },
      {
        title: 'Test nest',
        multi: true,
        icon: exampleIcon,
        keyword: 'ui',
        children: [
          {
            title: 'Alerts',
            link: '/ui/alerts',
            keyword: 'alerts'
          },
          {
            title: 'Buttons',
            link: '/ui/buttons',
            keyword: 'buttons'
          }
        ]
      }
    ]
  },
  {
    title: 'AUTH',
    children: []
  }
] as sidebarCategory[]

const downUpIcon = (isDown: boolean) => (
  <svg
    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
      isDown && 'rotate-180'
    }`}
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z'
      fill=''
    />
  </svg>
)

function SidebarHeader (props: {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}) {
  return (
    <div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
      <NavLink to='/'>
        <img src={Logo} alt='Logo' />
      </NavLink>

      <button
        onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
        aria-controls='sidebar'
        aria-expanded={props.sidebarOpen}
        className='block lg:hidden'
      >
        <svg
          className='fill-current'
          width='20'
          height='18'
          viewBox='0 0 20 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z'
            fill=''
          />
        </svg>
      </button>
    </div>
  )
}

function SidebarMenu (props: {
  pathname: string
  sidebarExpanded: boolean
  setSidebarExpanded: (arg: boolean) => void
}) {
  return (
    <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
      {/* <!-- Sidebar Menu --> */}
      <nav className='mt-5 py-4 px-4 lg:mt-9 lg:px-6'>
        {sidebarItems.map((item, index) => (
          <div>
            <h3 className='mb-4 ml-4 text-sm font-semibold text-bodydark2'>
              {item.title}
            </h3>

            <ul className='mb-6 flex flex-col gap-1.5'>
              {/* <!-- Menu Item Chart --> */}
              {item.children.map((child, index) =>
                child.multi ? (
                  <SidebarLinkGroup
                    activeCondition={
                      props.pathname === child.link ||
                      props.pathname.includes(child.keyword)
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <NavLink
                            to='#'
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (props.pathname === child.link ||
                                props.pathname.includes(child.keyword)) &&
                              'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={e => {
                              e.preventDefault()
                              props.sidebarExpanded
                                ? handleClick()
                                : props.setSidebarExpanded(true)
                            }}
                          >
                            {child.icon}
                            {child.title}
                            {downUpIcon(open)}
                          </NavLink>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && 'hidden'
                            }`}
                          >
                            <ul className='mb-5.5 mt-4 flex flex-col gap-2.5 pl-6'>
                              {child.children?.map((child, index) => (
                                <li key={index}>
                                  <NavLink
                                    to={child.link}
                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                      props.pathname.includes(child.keyword) &&
                                      '!text-white'
                                    }`}
                                  >
                                    {child.title}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      )
                    }}
                  </SidebarLinkGroup>
                ) : (
                  <li>
                    <NavLink
                      to={child.link}
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        props.pathname.includes(child.keyword) &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      {child.icon}
                      {child.title}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </nav>
      {/* <!-- Sidebar Menu --> */}
    </div>
  )
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation()
  const { pathname } = location
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <SidebarHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      ></SidebarHeader>
      <SidebarMenu
        pathname={pathname}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      ></SidebarMenu>
    </aside>
  )
}

export default Sidebar
