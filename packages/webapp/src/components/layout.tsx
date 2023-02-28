import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { connectSnap, getSnap } from 'utils/metamask';
import { useAuth } from 'hooks/auth';
import {
  AppBar, Box, Button, Paper, Toolbar, Typography,
} from '@mui/material';
import Identicon from '@polkadot/react-identicon';
import { MetamaskActions, MetaMaskContext } from 'hooks/metamask';
import { SNAPPY_RECOVERY_SNAP_ID } from 'utils/constants';

export const Layout = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const { identiconAddress } = useAuth();

  const doConnect = async () => {
    await connectSnap(SNAPPY_RECOVERY_SNAP_ID);
    const installedSnap = await getSnap();
    console.log('installed', installedSnap);

    dispatch({
      type: MetamaskActions.SetInstalled,
      payload: installedSnap,
    });
  };

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
          {state.installedSnap && (
            <Button sx={{ marginRight: 2 }} onClick={doConnect}>Re-install</Button>
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
