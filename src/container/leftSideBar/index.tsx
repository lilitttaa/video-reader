import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material'
import {
  BarChart,
  ExpandLess,
  ExpandMore,
  RadioButtonChecked,
  StarBorder,
  History,
  AccountBox
} from '@mui/icons-material'
import { ReactNode, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

type sidebarItem = {
  title: string
  link: string
  icon: ReactNode
  keyword: string
  open?: boolean
  children?: sidebarSubItem[]
}

type sidebarSubItem = {
  title: string
  link: string
  keyword: string
}

export type sidebarCategory = {
  title: string
  children: sidebarItem[]
}

export function LeftSideBar () {
  const location = useLocation()
  const { pathname } = location
  const [sidebarItems, setSidebarItems] = useState<sidebarCategory[]>([
    {
      title: 'MENU',
      children: [
        {
          title: 'Word',
          link: '/word',
          keyword: 'word',
          icon: <BarChart />
        },
        {
          title: 'Trigger',
          link: '/trigger',
          keyword: 'trigger',
          icon: <RadioButtonChecked />
        },
        {
          title: 'History',
          link: '/history',
          keyword: 'history',
          icon: <History />
        },
        {
          title: 'Transcript',
          link: '/transcript',
          keyword: 'transcript',
          icon: <History />
        },
      ]
    }
  ] as sidebarCategory[])

  return (
    <aside className='left-bar h-full min-w-60  flex flex-col  border-r-slate-300 border-r-2 overflow-y-auto'>
      <List
        className='profile bg-white flex flex-col  pl-3.5 pr-3.5 pt-2.5 pb-2.5 '
        component={'div'}
      >
        <div className='flex flex-row items-center pl-10 pr-10 pt-4 pb-4'>
          <NavLink className='w-auto h-auto' to={'/login'}>
            <ListItemIcon>{<AccountBox />}</ListItemIcon>
          </NavLink>
          <ListItemText primary={'GUEST'} />
        </div>
      </List>
      {sidebarItems.map((category, index) => {
        return (
          <List
            key={index}
            className='profile bg-white flex flex-col  pl-3.5 pr-3.5 pt-2.5 pb-2.5 '
            component='nav'
            subheader={
              <ListSubheader component={'div'}>{category.title}</ListSubheader>
            }
          >
            {category.children
              .map((item, index) => {
                let items = []
                items.push(
                  <ListItem key={index}>
                    <NavLink to={item.link} className={'w-full h-full'}>
                      <ListItemButton
                        dense={true}
                        style={{
                          borderRadius: '4rem'
                        }}
                        onClick={() => {
                          item.open = !item.open
                          setSidebarItems([...sidebarItems])
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                        {item.children ? (
                          item.open ? (
                            <ExpandMore />
                          ) : (
                            <ExpandLess />
                          )
                        ) : null}
                      </ListItemButton>
                    </NavLink>
                  </ListItem>
                )
                if (item.children && item.open) {
                  items.push(
                    <Collapse
                      key={index}
                      in={true}
                      timeout='auto'
                      unmountOnExit
                    >
                      <List component='div' disablePadding>
                        {item.children.map((subItem, index) => {
                          return (
                            <ListItem key={index}>
                              <NavLink
                                to={subItem.link}
                                className={'w-full h-full'}
                              >
                                <ListItemButton
                                  dense={true}
                                  sx={{
                                    pl: 4
                                  }}
                                  style={{
                                    borderRadius: '4rem'
                                  }}
                                >
                                  <ListItemIcon></ListItemIcon>
                                  <ListItemText primary={subItem.title} />
                                </ListItemButton>
                              </NavLink>
                            </ListItem>
                          )
                        })}
                      </List>
                    </Collapse>
                  )
                }
                return items
              })
              .reduce((acc, val) => acc.concat(val), [])}
          </List>
        )
      })}
    </aside>
  )
}
