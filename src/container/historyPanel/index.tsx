import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { createValidationResult, ValidationResult } from '../../dataHandler'
import { getBackendUrl } from '../../api'

const HistoryPanel = () => {
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null)

  const fetchRecentData = () => {
    fetch(getBackendUrl()+'/api/records/all')
      .then(response => response.json())
      .then(data => {
        setValidationResult(createValidationResult(data))
      })
  }
  const columns: GridColDef<typeof rows[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90, sortable: false },
    { field: 'startTime', headerName: '开始时间', width: 300, sortable: false },
    {
      field: 'totalQuantity',
      headerName: '数量',
      width: 150,
      sortable: false
    },
    {
      field: 'errorRate',
      headerName: '错误率',
      width: 150,
      sortable: false
    },
    {
      field: 'errorQuantity',
      headerName: '错误数量',
      width: 150,
      sortable: false
    },
    {
      field: 'duration',
      headerName: '时长',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160
    }
  ]

  const rows = validationResult ? validationResult.generateTableInfos().map((resultRow, index) => ({
    id: index,
    startTime: resultRow.startTime,
    totalQuantity: resultRow.totalQuantity,
    errorRate: resultRow.errorRate,
    errorQuantity: resultRow.errorQuantity,
    duration: resultRow.duration
  })) : []
  useEffect(() => {
    fetchRecentData()
  }, [])
  return (
    <main className='w-full h-full flex flex-col'>
      {/* <div>
			<TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>开始时间</TableCell>
                <TableCell align='left'>数量</TableCell>
                <TableCell align='left'>错误率</TableCell>
                <TableCell align='left'>错误数量</TableCell>
                <TableCell align='left'>时长</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.generateTableInfos().map(row => (
                <TableRow key={row.startTime}>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell align='left'>{row.totalQuntity}</TableCell>
                  <TableCell align='left'>{row.errorRate}</TableCell>
                  <TableCell align='left'>{row.errorCount}</TableCell>
                  <TableCell align='left'>{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
			</div> */}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </main>
  )
}

export default HistoryPanel
