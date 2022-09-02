import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'hooks/auth';
import { useMetaMask } from 'hooks/metamask';
import { connectToMetaMask } from 'services/ethereum';
import { Box, Button } from '@mui/material';

export const Home = () => {
  const {
    isMetaMaskFlask,
    isSnappyRecoverySnapInstalled,
    checkingMetaMaskFlask,
    checkingSnappyRecoverySnapInstalled,
  } = useMetaMask();
  const { isLoggedIn } = useAuth();
  const [params] = useSearchParams();
  const urlAfterLoggedIn = params.get('return');

  if (isLoggedIn) {
    return <Navigate replace to={urlAfterLoggedIn || '/dashboard'} />;
  }

  if (checkingMetaMaskFlask) {
    return <div>loading...</div>;
  }

  if (!isMetaMaskFlask) {
    return (
      <h2>Please install <a href="https://metamask.io/flask/">MetaMask Flask</a> to continue</h2>
    );
  }

  if (checkingSnappyRecoverySnapInstalled) {
    return <div>loading...</div>;
  }

  if (!isSnappyRecoverySnapInstalled) {
    return (
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Button onClick={connectToMetaMask}>Connect Metamask</Button>
      </Box>
    );
  }

  return (
    <div>loading...</div>
  );
};
