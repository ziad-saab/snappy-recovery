import {
  Box, Button, CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, TextField,
} from '@mui/material';
import Identicon from '@polkadot/react-identicon';
import {
  EncryptedBackupKeypairPart, RecoveredAddress, RecoveredAddressIndices, RECOVERY_THRESHOLD_PARTS, RECOVERY_TOTAL_PARTS,
} from '@snappy-recovery/shared';
import {
  FormEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { userData, gunData } from 'services/gun';
import { getRecoveredAddresses, getRecoveryPublicKey, showPrivateKeyForRecoveredAddress } from 'services/snappy-recovery-snap';

export const useRecovery = () => {
  const [originalPublicKey, setOriginalPublicKey] = useState('');
  const [recoveryPublicKey, setRecoveryPublicKey] = useState('');
  const recoveryUrl = (
    originalPublicKey && recoveryPublicKey
      ? `${window.location.origin}/assist#${encodeURIComponent(`${originalPublicKey}:${recoveryPublicKey}`)}`
      : null
  );

  const setupRecoveryUrl = useCallback(async (originalPk: string) => {
    const { publicKeyHex: recoveryPk } = await getRecoveryPublicKey();
    setOriginalPublicKey(originalPk);
    setRecoveryPublicKey(recoveryPk);
  }, []);

  const [recoveryShards, setRecoveryShards] = useState<Record<string, EncryptedBackupKeypairPart>>({});
  const numRecoveryShards = Object.keys(recoveryShards).length;
  const isRecoveryReady = numRecoveryShards >= RECOVERY_THRESHOLD_PARTS;

  useEffect(() => {
    if (recoveryPublicKey) {
      const listener = gunData('snappyRecoveries').get(recoveryPublicKey).map(undefined).on((encryptedBackupKeyPart, friendPublicKey) => {
        setRecoveryShards((rs) => ({
          ...rs,
          [friendPublicKey]: encryptedBackupKeyPart,
        }));
      });

      return () => { listener.off(); };
    }
  }, [recoveryPublicKey]);

  const [recoveredAddresses, setRecoveredAddresses] = useState<RecoveredAddress[] | null>(null);
  const doRecovery = useCallback(async () => {
    if (isRecoveryReady) {
      const encryptedBackupKeypairParts = Object.values(recoveryShards);
      const encryptedEthereumNode = await userData('encryptedEthereumNode', originalPublicKey).then();

      const { recoveredAddresses: recovered } = await getRecoveredAddresses({
        encryptedBackupKeypairParts,
        encryptedEthereumNode,
      });

      setRecoveredAddresses(recovered);
    }
  }, [isRecoveryReady, recoveryShards, originalPublicKey]);

  const showPrivateKey = useCallback(async (addressIndices: RecoveredAddressIndices) => {
    if (isRecoveryReady) {
      const encryptedBackupKeypairParts = Object.values(recoveryShards);
      const encryptedEthereumNode = await userData('encryptedEthereumNode', originalPublicKey).then();

      await showPrivateKeyForRecoveredAddress({
        encryptedBackupKeypairParts,
        encryptedEthereumNode,
        addressIndices,
      });
    }
  }, [isRecoveryReady, recoveryShards, originalPublicKey]);

  return {
    setupRecoveryUrl,
    recoveryUrl,
    numRecoveryShards,
    isRecoveryReady,
    recoveryShards,
    doRecovery,
    recoveredAddresses,
    showPrivateKey,
  };
};

export const Recovery = () => {
  const {
    recoveryUrl,
    numRecoveryShards,
    isRecoveryReady,
    setupRecoveryUrl,
    doRecovery,
    recoveredAddresses,
    showPrivateKey,
  } = useRecovery();
  const pubkeyRef = useRef<HTMLInputElement | null>(null);

  const getRecoveryUrl = async (e: FormEvent) => {
    e.preventDefault();
    const originalPk = pubkeyRef.current?.value.trim();
    if (originalPk) {
      setupRecoveryUrl(originalPk);
    }
  };

  const renderContent = () => {
    if (recoveredAddresses) {
      return (
        <>
          <h3>Here are your recovered addresses:</h3>
          <Paper sx={{ maxWidth: 750 }}>
            <List>
              {recoveredAddresses.map(({
                address, balanceInEth, numTransactions, accountIndex, addressIndex,
              }) => (
                <div key={address}>
                  <ListItem>
                    <ListItemIcon>
                      <Identicon
                        theme="ethereum"
                        value={address}
                        size={32}
                        style={{ cursor: 'auto' }}
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <strong>{address}</strong>
                      <ul>
                        <li>Balance: {balanceInEth} ether</li>
                        <li>Outgoing transaction count: {numTransactions}</li>
                      </ul>
                    </ListItemText>
                    <Button onClick={() => showPrivateKey({ accountIndex, addressIndex })}>Show private key</Button>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Paper>
        </>
      );
    }

    if (recoveryUrl) {
      return (
        <>
          <h3>Here's your recovery URL:</h3>
          <p><code>{recoveryUrl}</code></p>
          <p>
            Send this URL to the people with whom you setup your recovery. As they respond to your request, the counter below will update in real-time.
          </p>
          <p>
            <strong>{numRecoveryShards}/{RECOVERY_TOTAL_PARTS}</strong> friends have responded to your request (minimum {RECOVERY_THRESHOLD_PARTS})
            {' '}
            {!isRecoveryReady && <CircularProgress size={20} />}
          </p>
          <p>
            <Button onClick={doRecovery} disabled={!isRecoveryReady}>Recover my ETH!</Button>
          </p>
        </>
      );
    }

    return (
      <Box sx={{ display: 'flex' }} component="form" onSubmit={getRecoveryUrl}>
        <Box sx={{ flex: 1, mr: 2, maxWidth: 500 }}>
          <TextField
            variant="standard"
            fullWidth
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="false"
            inputProps={{
              ref: pubkeyRef,
            }}
            placeholder="Enter your original public key"
          />
        </Box>
        <Button type="submit">Get recovery URL</Button>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>Recovery of your private key</h2>
      {renderContent()}
    </Box>
  );
};
