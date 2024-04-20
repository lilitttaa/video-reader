import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

const BrokenLineGraph = (prop: {
  options: ApexOptions
  state: {
    series: ApexOptions['series']
  }
}) => {
  return (
    <div className='h-full w-full bg-slate-100 rounded-2xl col-span-12  border border-stroke px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12'>
      <div className='flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap'>
        <div className='flex w-full flex-wrap gap-3 sm:gap-5'>
          <div className='flex min-w-47.5'>
            <span className='mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary'>
              <span className='block h-2.5 w-full max-w-2.5 rounded-full bg-primary'></span>
            </span>
            <div className='w-full'>
              <p className='font-semibold text-primary'>历史成功率</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id='chartOne' className='-ml-5'>
          <ReactApexChart
            options={prop.options}
            series={prop.state.series}
            type='area'
            height={350}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}

export default BrokenLineGraph
