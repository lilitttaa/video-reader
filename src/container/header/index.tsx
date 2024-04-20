import {
  Autocomplete,
  Breadcrumbs,
  IconButton,
  Link,
  TextField
} from '@mui/material'
import { StarBorder, ViewSidebarOutlined } from '@mui/icons-material'

export function Header ({
  OnOpenLeftSideBar,
  OnOpenRightSideBar
}: {
  OnOpenLeftSideBar: () => void
  OnOpenRightSideBar: () => void
}) {
  return (
    <header className='header flex flex-row justify-between border-b-slate-300 border-b-2 pl-4 pr-4 pt-4 pb-4 '>
      <div className='flex flex-row gap-4 items-center'>
        <IconButton aria-label='add an alarm' onClick={OnOpenLeftSideBar}>
          <ViewSidebarOutlined />
        </IconButton>

        <StarBorder />
        <Breadcrumbs>
          <Link underline='hover' color='inherit' href='/'>
            HOME
          </Link>
          <Link underline='hover' color='inherit' href='/test'>
            CHARTS
          </Link>
          {/* <Typography color='text.primary'>Breadcrumbs</Typography> */}
        </Breadcrumbs>
      </div>

      <div className='flex flex-row gap-4 items-center'>
        <Autocomplete
          size='small'
          className='min-w-50'
          options={[
            {
              label: 'The Shawshank Redemption',
              year: 1994
            }
          ]}
          renderInput={params => <TextField {...params} label='Search' />}
        />
        <StarBorder />
		<IconButton aria-label='add an alarm' onClick={OnOpenRightSideBar}>
          <ViewSidebarOutlined />
        </IconButton>
      </div>
    </header>
  )
}
