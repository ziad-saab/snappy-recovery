import {
  Box,
  Divider, MenuItem, MenuList, Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
      <h2>Dashboard</h2>
      <Paper sx={{ maxWidth: 500, '& a': { textDecoration: 'none' } }}>
        <MenuList>
          <Link to="/how-it-works">
            <MenuItem>
              How it works
            </MenuItem>
          </Link>
          <Divider />
          <Link to="/setup">
            <MenuItem>
              Setup Recovery
            </MenuItem>
          </Link>
          <Divider />
          <Link to="/recovery">
            <MenuItem>
              I lost my private key!
            </MenuItem>
          </Link>
        </MenuList>
      </Paper>
    </Box>
  );
};
