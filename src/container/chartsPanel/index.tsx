import { Article, TrendingDown, TrendingUp } from '@mui/icons-material'
import {
  Button,
  CardActions,
  CardContent,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import Card from '@mui/material/Card'
import ReactApexChart from 'react-apexcharts'
import {
  CardInfo,
  createValidationResult,
  generateBarOptions,
  generateBarSeries,
  generateBrokenLineOptions,
  generateBrokenLineSeries,
  generateSectorDiagramOptions,
  generateSectorDiagramSeries,
  ValidationData,
  ValidationResult,
  validationTypeMap
} from '../../dataHandler'
import { useEffect, useState } from 'react'
import { getBackendUrl } from '../../api'
import { NavLink } from 'react-router-dom'

export function ChartsPanel () {
  // fetch 获取最近的数据
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null)
  const [htmlData, setHtmlData] = useState<string>('')
  const fetchRecentData = () => {
    fetch(getBackendUrl() + '/api/records/recent')
      .then(response => response.json())
      .then(data => {
        setValidationResult(createValidationResult(data))
      })
  }
  useEffect(() => {
    // fetchRecentData()
  }, [])
  const cards = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ] as (CardInfo | null)[]

  return (
    <main className='main flex flex-col pl-4 pr-4 pb-4 gap-10 overflow-y-auto'>
      <div className='pt-8 flex flex-row items-center gap-4'>
        <Card
          className='flex-1'
          style={{
            backgroundColor: '#F7F9FB',
            borderRadius: '1.5rem'
          }}
          elevation={0}
        >
          <CardContent className='flex flex-row items-center justify-center'>
            <Typography>查看详情:</Typography>
            <NavLink to={'/detail'}>
              <IconButton
                aria-label='add an alarm'
                onClick={() => {
                  // generateHtmlFile()
                }}
              >
                <Article />
              </IconButton>
            </NavLink>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-row gap-5 flex-wrap justify-start'>
        {cards.map(card => (
          <Skeleton
            variant='rectangular'
            className='w-100 p-4 '
            style={{
              borderRadius: '2rem',
              height: '20rem'
            }}
          />
        ))}
      </div>
    </main>
  )
}
