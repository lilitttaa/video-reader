import { ApexOptions } from 'apexcharts'
import BrokenLineGraph from '../component/brokenLineGraph'
// import Card from '../component/card'
import { BarGraph, SectorDiagram } from './dashboard'
import useColorMode from '../hooks/useColorMode'

import {
  AppBar,
  Autocomplete,
  Breadcrumbs,
  Button,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import Card from '@mui/material/Card'
import MenuIcon from '@mui/icons-material/Menu'
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material'
import ReactApexChart from 'react-apexcharts'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
const datas = [
  {
    validation_result: {
      StaticMesh: {
        count: 123,
        failed: 5
      },
      Texture2D: {
        count: 320,
        failed: 15
      },
      Material: {
        count: 580,
        failed: 10
      }
    },
    is_success: false,
    count: 1023,
    failed: 30,
    time: 1630000000000,
    duration: 150000
  },
  {
    validation_result: {
      StaticMesh: {
        count: 123,
        failed: 5
      },
      Texture2D: {
        count: 420,
        failed: 25
      },
      Material: {
        count: 580,
        failed: 10
      }
    },
    is_success: false,
    count: 1033,
    failed: 40,
    time: 1630300001000,
    duration: 123123
  },
  {
    validation_result: {
      StaticMesh: {
        count: 123,
        failed: 5
      },
      Texture2D: {
        count: 420,
        failed: 25
      },
      Material: {
        count: 580,
        failed: 10
      }
    },
    is_success: false,
    count: 1033,
    failed: 40,
    time: 1630300001000,
    duration: 123123
  },
  {
    validation_result: {
      StaticMesh: {
        count: 123,
        failed: 5
      },
      Texture2D: {
        count: 420,
        failed: 25
      },
      Material: {
        count: 580,
        failed: 10
      }
    },
    is_success: false,
    count: 1033,
    failed: 40,
    time: 1630300001000,
    duration: 123123
  },
  {
    validation_result: {
      StaticMesh: {
        count: 123,
        failed: 5
      },
      Texture2D: {
        count: 420,
        failed: 25
      },
      Material: {
        count: 580,
        failed: 10
      }
    },
    is_success: false,
    count: 1033,
    failed: 40,
    time: 1630300001000,
    duration: 123123
  },
  {
    validation_result: {
      StaticMesh: {
        count: 123,
        failed: 5
      },
      Texture2D: {
        count: 420,
        failed: 25
      },
      Material: {
        count: 580,
        failed: 10
      }
    },
    is_success: false,
    count: 1033,
    failed: 40,
    time: 1630300001000,
    duration: 123123
  }
]
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
// 保留两位小数
const calcuateRate = (last: number, current: number) => {
  return (((current - last) / last) * 100).toFixed(2) + '%'
}

// 小数点后保留两位
const calculateSuccessRate = (total: number, failed: number) => {
  return (((total - failed) / total) * 1e4) / 1e2
}

const toReadableDuration = (duration: number) => {
  let isNegative = false
  if (duration < 0) {
    isNegative = true
    duration = -duration
  }
  const seconds = duration / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if (days >= 1) {
    return isNegative ? `${-days.toFixed(2)} days` : `${days.toFixed(2)} days`
  } else if (hours >= 1) {
    return isNegative
      ? `${-hours.toFixed(2)} hours`
      : `${hours.toFixed(2)} hours`
  } else if (minutes >= 1) {
    return isNegative
      ? `${-minutes.toFixed(2)} minutes`
      : `${minutes.toFixed(2)} minutes`
  } else {
    return isNegative
      ? `${-seconds.toFixed(2)} seconds`
      : `${seconds.toFixed(2)} seconds`
  }
}

// 带月份,日期,时间的表示,尽可能短,中文
const toShortReadableTime = (time: number) => {
  return new Date(time).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

const generateXAxis = () => {
  let xAxis: string[] = []
  datas.forEach(data => {
    xAxis.push(toShortReadableTime(data.time))
  })
  return xAxis
}

const generateSuccessRate = () => {
  let successRate: number[] = []
  datas.forEach(data => {
    successRate.push(calculateSuccessRate(data.count, data.failed))
  })
  return successRate
}
const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left'
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1
    },

    toolbar: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350
        }
      }
    }
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight'
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5
    }
  },
  xaxis: {
    type: 'category',
    categories: generateXAxis(),
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px'
      }
    },
    min: 90,
    max: 100,
    decimalsInFloat: 2
  }
}
const sectorDiagramOptions: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut'
  },
  colors: ['#3C50E0', '#6577F3'],
  labels: ['Pass', 'Fail'],
  legend: {
    show: false,
    position: 'bottom'
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380
        }
      }
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200
        }
      }
    }
  ]
}

const sectorDiagramSeries = [65, 34]

const barOptions: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%'
          }
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last'
    }
  },
  dataLabels: {
    enabled: false
  },

  xaxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99
    }
  },
  fill: {
    opacity: 1
  }
}
const barSeries = [
  {
    name: 'Sales',
    data: [44, 55, 41, 67, 22, 43, 65]
  },
  {
    name: 'Revenue',
    data: [13, 23, 20, 8, 13, 27, 15]
  }
]

const brokenLineOptions: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left'
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1
    },

    toolbar: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350
        }
      }
    }
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight'
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5
    }
  },
  xaxis: {
    type: 'category',
    categories: generateXAxis(),
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px'
      }
    },
    min: 90,
    max: 100,
    decimalsInFloat: 2
  }
}
const brokenLineSeries = [
  {
    name: 'Product One',
    data: generateSuccessRate()
  }
]
const state = {
  series: [
    {
      name: 'Product One',
      data: generateSuccessRate()
    }
  ]
}

function LeftSideBar () {
  return (
    <aside className='left-bar h-full min-w-60  flex flex-col  border-r-slate-300 border-r-2 overflow-y-auto'>
      <List
        className='profile bg-white flex flex-col  pl-3.5 pr-3.5 pt-2.5 pb-2.5 '
        component='nav'
        subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
      >
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
            <ExpandMore />
          </ListItemButton>
        </ListItem>
        <Collapse in={true} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem>
              <ListItemButton
                dense={true}
                sx={{
                  pl: 4
                }}
                style={{
                  borderRadius: '4rem'
                }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary='Starred' />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
      <List
        className='classify1 bg-white flex flex-col pl-3.5 pr-3.5 pt-2.5 pb-2.5'
        subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
      >
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
            <ExpandMore />
          </ListItemButton>
        </ListItem>
        <Collapse in={true} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem>
              <ListItemButton
                dense={true}
                sx={{
                  pl: 4
                }}
                style={{
                  borderRadius: '4rem'
                }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary='Starred' />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
      <List
        className='classify2 bg-white flex flex-col pl-3.5 pr-3.5 pt-2.5 pb-2.5'
        subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
      >
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
            <ExpandMore />
          </ListItemButton>
        </ListItem>
        <Collapse in={true} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem>
              <ListItemButton
                dense={true}
                sx={{
                  pl: 4
                }}
                style={{
                  borderRadius: '4rem'
                }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary='Starred' />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
      <List
        className='classify3 bg-white flex flex-col pl-3.5 pr-3.5 pt-2.5 pb-2.5'
        subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
      >
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            dense={true}
            style={{
              borderRadius: '4rem'
            }}
          >
            <ListItemIcon>{exampleIcon}</ListItemIcon>
            <ListItemText primary='Item 1' />
            <ExpandMore />
          </ListItemButton>
        </ListItem>
        <Collapse in={true} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem>
              <ListItemButton
                dense={true}
                sx={{
                  pl: 4
                }}
                style={{
                  borderRadius: '4rem'
                }}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary='Starred' />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </aside>
  )
}

const columns: GridColDef<typeof rows[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
  }
]

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
]

const TestContaner2: React.FC = () => {
  //   const [colorMode, setColorMode] = useColorMode()
  return (
    <div className='h-screen flex flex-row '>
      <LeftSideBar></LeftSideBar>
      <div className='flex-auto flex flex-col'>
        <div className='header flex flex-row justify-between border-b-slate-300 border-b-2 pl-4 pr-4 pt-4 pb-4 '>
          <div className='flex flex-row gap-4 items-center'>
            <StarBorder />
            <StarBorder />
            <Breadcrumbs>
              <Link underline='hover' color='inherit' href='/'>
                MUI
              </Link>
              <Link
                underline='hover'
                color='inherit'
                href='/material-ui/getting-started/installation/'
              >
                Core
              </Link>
              <Typography color='text.primary'>Breadcrumbs</Typography>
            </Breadcrumbs>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            <Autocomplete
              size='small'
              className='min-w-50'
              options={[{ label: 'The Shawshank Redemption', year: 1994 }]}
              renderInput={params => <TextField {...params} label='Movie' />}
            />
            <StarBorder />
            <StarBorder />
          </div>
        </div>
        <div className='main flex flex-col pl-4 pr-4 gap-4 overflow-y-auto'>
          <div className='p-8'>
            <Typography>Charts</Typography>
          </div>
          <div className='flex flex-row gap-4'>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
          </div>
          <div className='flex flex-row gap-4'>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
                <ReactApexChart
                  options={sectorDiagramOptions}
                  series={sectorDiagramSeries}
                  type='donut'
                />
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
                <ReactApexChart
                  options={barOptions}
                  series={barSeries}
                  type='bar'
                  height={350}
                />
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
          </div>
          <div className='flex flex-row gap-4'>
            <Card className='flex-1'>
              <CardContent>
                <ReactApexChart
                  options={brokenLineOptions}
                  series={brokenLineSeries}
                  type='area'
                  height={350}
                  width={'100%'}
                />
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-3'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
          </div>
          <div className='flex flex-row gap-4'>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
            <Card className='flex-1'>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant='h5' component='div'>
                  test
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  adjective
                </Typography>
                <Typography variant='body2'>
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
          </div>
          <div >
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </div>
      </div>
      {/* <aside className='right-bar h-full min-w-60  flex flex-col gap-y-2.5 border-l-slate-300 border-l-2 overflow-y-auto'>
        <List
          className='profile bg-white flex flex-col  pl-3.5 pr-3.5 pt-2.5 pb-2.5 '
          component='nav'
          subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
        >
          <ListItem className='p-0'>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
              <ExpandMore />
            </ListItemButton>
          </ListItem>
          <Collapse in={true} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem>
                <ListItemButton
                  dense={true}
                  sx={{ pl: 4 }}
                  style={{
                    borderRadius: '4rem'
                  }}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary='Starred' />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
        <List
          className='classify1 bg-white flex flex-col pl-3.5 pr-3.5 pt-2.5 pb-2.5'
          subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
        >
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
              <ExpandMore />
            </ListItemButton>
          </ListItem>
          <Collapse in={true} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem>
                <ListItemButton
                  dense={true}
                  sx={{ pl: 4 }}
                  style={{
                    borderRadius: '4rem'
                  }}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary='Starred' />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
        <List
          className='classify2 bg-white flex flex-col pl-3.5 pr-3.5 pt-2.5 pb-2.5'
          subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
        >
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
              <ExpandMore />
            </ListItemButton>
          </ListItem>
          <Collapse in={true} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem>
                <ListItemButton
                  dense={true}
                  sx={{ pl: 4 }}
                  style={{
                    borderRadius: '4rem'
                  }}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary='Starred' />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
        <List
          className='classify3 bg-white flex flex-col pl-3.5 pr-3.5 pt-2.5 pb-2.5'
          subheader={<ListSubheader component={'div'}>Subheader</ListSubheader>}
        >
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              dense={true}
              style={{
                borderRadius: '4rem'
              }}
            >
              <ListItemIcon>{exampleIcon}</ListItemIcon>
              <ListItemText primary='Item 1' />
              <ExpandMore />
            </ListItemButton>
          </ListItem>
          <Collapse in={true} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem>
                <ListItemButton
                  dense={true}
                  sx={{ pl: 4 }}
                  style={{
                    borderRadius: '4rem'
                  }}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary='Starred' />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </aside> */}
    </div>
  )
}

export default TestContaner2
