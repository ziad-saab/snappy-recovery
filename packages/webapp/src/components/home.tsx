import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'hooks/auth';

import { Box, Button } from '@mui/material';
import { useContext } from 'react';
import { MetamaskActions, MetaMaskContext } from 'hooks/metamask';
import { connectSnap, getSnap } from 'utils/metamask';
import { SNAPPY_RECOVERY_SNAP_ID } from 'utils/constants';

export const Home = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const { isLoggedIn } = useAuth();
  const [params] = useSearchParams();
  const urlAfterLoggedIn = params.get('return');

  if (isLoggedIn) {
    return <Navigate replace to={urlAfterLoggedIn || '/dashboard'} />;
  }

  if (!state.isFlask) {
    return (
      <h2>Please install <a href="https://metamask.io/flask/">MetaMask Flask</a> to continue</h2>
    );
  }

  const doConnect = async () => {
    await connectSnap(SNAPPY_RECOVERY_SNAP_ID);
    const installedSnap = await getSnap();
    console.log('installed', installedSnap);

    dispatch({
      type: MetamaskActions.SetInstalled,
      payload: installedSnap,
    });
  };

  if (!state.installedSnap) {
    return (
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Button onClick={doConnect}>Connect Metamask</Button>
      </Box>
    );
  }

  return (
    <div>loading...</div>
  );
};
