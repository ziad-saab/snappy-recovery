import { useLocation, useNavigate } from 'react-router-dom';
import { gunData, userData } from 'services/gun';
import { assistWithRecovery, getSnappyKeys } from 'services/snappy-recovery-snap';
import { Box, Button } from '@mui/material';

export const Assist = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [friendPublicKey, recoveryPublicKey] = decodeURIComponent(hash.replace('#', '')).split(':', 2);

  const acceptRecovery = async () => {
    const myKeys = await getSnappyKeys();
    const encryptedBackupKeypairPart = await userData('recoveryPartsByPublicKey', friendPublicKey).get(myKeys.gun.pub).then();

    if (encryptedBackupKeypairPart) {
      const { backupKeypairPartEncryptedWithTargetUserPublicKey } = await assistWithRecovery({
        encryptedBackupKeypairPart,
        targetUserPublicKeyHex: recoveryPublicKey,
      });

      await gunData('snappyRecoveries')
        .get(recoveryPublicKey)
        .get(myKeys.gun.pub)
        .put(backupKeypairPartEncryptedWithTargetUserPublicKey)
        .then();

      alert('You have successfully helped your friend.');
      navigate('/dashboard', { replace: true });
    } else {
      alert('You are not part of your friend\'s recovery network.');
    }
  };

  const renderContent = () => {
    if (friendPublicKey && recoveryPublicKey) {
      return (
        <>
          <p>A friend with public key <code>{friendPublicKey}</code> has requested your assistance to recover their private key.</p>
          <p>Make sure the request came from the actual person before accepting!</p>
          <p>
            <Button onClick={acceptRecovery}>OK, help the poor bastard</Button>
          </p>
        </>
      );
    }

    return (
      <p>This URL is invalid. Please make sure you copied it correctly.</p>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>Assist a friend with recovering their private key!</h2>
      {renderContent()}
    </Box>
  );
};
