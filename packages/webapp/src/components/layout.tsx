import { Link, Outlet } from 'react-router-dom';
import { useMetaMask } from 'hooks/metamask';
import { connectToMetaMask } from 'services/ethereum';
import { useAuth } from 'hooks/auth';
import {
  AppBar, Box, Button, Paper, Toolbar, Typography,
} from '@mui/material';
import Identicon from '@polkadot/react-identicon';

export const Layout = () => {
  const { isSnappyRecoverySnapInstalled, isDevMode } = useMetaMask();

  const { isLoggedIn, identiconAddress } = useAuth();

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" enableColorOnDark color="default">
        <Toolbar>
          <Link className="clean" to="/">
            <Typography
              variant="h5"
              component="h1"
              sx={{
                marginRight: 2,
                fontWeight: 'bold',
              }}
            >
              💥 Snappy Recovery
            </Typography>
          </Link>
          {isSnappyRecoverySnapInstalled && isDevMode && (
            <Button sx={{ marginRight: 2 }} onClick={connectToMetaMask}>Re-install</Button>
          )}
          <Box sx={{ marginLeft: 'auto' }}>
            {identiconAddress && (
              <Link to="/profile">
                <Identicon
                  value={identiconAddress}
                  size={32}
                  theme="ethereum"
                  style={{ display: 'block', cursor: 'inherit' }}
                />
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Paper>
  );
};
