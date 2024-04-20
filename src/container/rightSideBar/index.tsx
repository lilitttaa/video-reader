import {
  Collapse, List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material';
import { ExpandMore, StarBorder } from '@mui/icons-material';

export function RightSideBar() {
  return (
    <aside className='right-bar h-full min-w-80  flex flex-col gap-y-2.5 border-l-slate-300 border-l-2 overflow-y-auto'>
      <List
        className='profile bg-white flex flex-col  pl-3.5 pr-3.5 pt-2.5 pb-2.5 '
        component='nav'
        subheader={<ListSubheader component={'div'}>Events</ListSubheader>}
      >
      </List>
    </aside>
  );
}
