import { ApexOptions } from 'apexcharts'
import BrokenLineGraph from '../component/brokenLineGraph'
import Card from '../component/card'
import { BarGraph, SectorDiagram } from './dashboard'
import useColorMode from '../hooks/useColorMode'

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

const state = {
  series: [
    {
      name: 'Product One',
      data: generateSuccessRate()
    }
  ]
}


const TestContainer: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <div className='TestContainer h-screen flex flex-row'>
      <div className='LeftSideBar bg-white border-gray-3 border-4 h-full min-w-70 p-4'>
        <div className='Profile w-auto flex flex-col gap-2'>
          <div className='p-2'>ByeWind</div>
          <div className='flex flex-row gap-4'>
            <div className=' text-slate-400'>Favorites</div>
            <div className='text-slate-400'>Recently</div>
          </div>
          <div>
            <div>- Overview</div>
            <div>- Projects</div>
          </div>
        </div>
        <div className='Dashboards'></div>
        <div className='Pages'></div>
      </div>
      <div className='flex-auto flex flex-col'>
        <div className='Header p-4'>
          <div className='p-4'>HeaderTest</div>
        </div>
        <div className='Main pl-40 pr-40 pt-4 overflow-y-scroll overflow-x-hidden'>
          <div className='flex flex-row justify-between p-4'>
            <div>Overview</div>
            <div>Tody</div>
          </div>
          <div className='grid grid-cols-8 gap-x-4 grid-rows-6 gap-y-1 h-[100rem] '>
            <div className='col-start-1 col-end-3 p-4 '>
              <Card
                title='校验成功率'
                total={
                  calculateSuccessRate(datas[1].count, datas[1].failed).toFixed(
                    2
                  ) + '%'
                }
                rate={calcuateRate(
                  calculateSuccessRate(datas[0].count, datas[0].failed),
                  calculateSuccessRate(datas[1].count, datas[1].failed)
                )}
                levelDown
              >
                { exampleIcon}
              </Card>
            </div>
            <div className='col-start-3 col-end-5 p-4 '>
              <Card
                title='校验时长'
                total={toReadableDuration(datas[1].duration)}
                rate={toReadableDuration(datas[1].duration - datas[0].duration)}
                levelDown
              >
                { exampleIcon}
              </Card>
            </div>
            <div className='col-start-5 col-end-7 p-4 '>
              <Card
                title='校验总数'
                total={datas[1].count.toString()}
                rate={(datas[1].count - datas[0].count).toString()}
                levelUp
              >
                { exampleIcon}
              </Card>
            </div>
            <div className='col-start-7 col-end-9 p-4 '>
              <Card title='Test' total='Test' rate='Test'>
                Test
              </Card>
            </div>

            <div className='col-start-1 col-end-4 row-start-2 row-end-4 p-4'>
              <SectorDiagram />
            </div>
            <div className='col-start-4 col-end-9 row-start-2 row-end-4  p-4'>
              <BarGraph />
            </div>

            <div className='col-start-1 col-end-7 row-start-4 row-end-6 p-4'>
              <BrokenLineGraph options={options} state={state} />
            </div>
            <div className='col-start-7 col-end-9 row-start-4 row-end-6 bg-slate-100 rounded-2xl p-4'>
              <div>Test</div>
            </div>

            {/* <div className = 'row-span-1'>Test</div> */}
          </div>
        </div>
      </div>

      <div className='RightSideBar bg-white h-full min-w-80 p-4'>
        <div>Notification</div>
      </div>
    </div>
  )
}

export default TestContainer
