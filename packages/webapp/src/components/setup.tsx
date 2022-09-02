import { FriendKeys } from '@snappy-recovery/shared';
import {
  FormEvent, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { userData } from 'services/gun';
import { finishSetup, setupRecovery } from 'services/snappy-recovery-snap';
import {
  Box, TextField, Button, List, ListItem, Divider, Paper, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

export const Setup = () => {
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const publicKeyInput = useRef<HTMLInputElement | null>(null);
  const hasEnoughPublicKeys = publicKeys.length === 5;

  const [isSettingUp, setIsSettingUp] = useState(false);

  const addPublicKey = (e: FormEvent) => {
    e.preventDefault();
    if (publicKeyInput.current && !hasEnoughPublicKeys) {
      const newPublicKey = publicKeyInput.current.value.trim();
      if (newPublicKey && !publicKeys.includes(newPublicKey)) {
        setPublicKeys([
          ...publicKeys,
          newPublicKey,
        ]);
      }
      publicKeyInput.current.value = '';
      publicKeyInput.current.focus();
    }
  };

  const navigate = useNavigate();
  const doSetup = async () => {
    if (hasEnoughPublicKeys) {
      setIsSettingUp(true);
      try {
        const friendsKeys = await Promise.all(publicKeys.map(async (gunPublicKey): Promise<FriendKeys> => {
          const backupPublicKeyHex = await userData('backupPublicKeyHex', gunPublicKey).then();

          if (!backupPublicKeyHex) {
            throw new Error(`Could not find backup public key for friend ${gunPublicKey}`);
          }

          return {
            gunPublicKey,
            backupPublicKeyHex,
          };
        }));
        const recoveryData = await setupRecovery({ friendsKeys });
        await finishSetup(recoveryData);

        alert('Setup completed!');
        navigate('/profile');
      } catch (err) {
        if (err instanceof Error) {
          alert(`An error occurred during setup: ${err.message}`);
        } else {
          alert('An unknown error occurred during setup');
        }
      } finally {
        setIsSettingUp(false);
      }
    }
  };

  const deleteKey = (pubKey: string) => {
    setPublicKeys(publicKeys.filter((k) => k !== pubKey));
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>Setup</h2>
      <p>
        First, make sure to save your Snappy Recovery Public Key somewhere. As the name says, this key is public so you can save it anywhere (email, cloud storage, ...)
      </p>
      <p>
        Ask five of your friends to install Snappy Recovery and give you their Snappy Recovery Public Key. Enter the keys below:
      </p>
      {
        publicKeys.length > 0 && (
          <Paper sx={{ maxWidth: 700, fontSize: 12, mb: 2 }}>
            <List>
              {
                publicKeys.map((pubKey) => (
                  <div key={pubKey}>
                    <ListItem sx={{ display: 'flex' }}>
                      <Box sx={{ flex: 1 }}>{pubKey}</Box>
                      <IconButton
                        size="small"
                        disabled={isSettingUp}
                        onClick={() => deleteKey(pubKey)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </div>
                ))
              }
            </List>
          </Paper>
        )
      }
      {!hasEnoughPublicKeys && (
        <Box sx={{ display: 'flex', maxWidth: 500 }} component="form" onSubmit={addPublicKey}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <TextField
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              fullWidth
              variant="standard"
              placeholder="Enter a public key"
              inputProps={{
                ref: publicKeyInput,
              }}
            />
          </Box>
          <Button
            disabled={publicKeys.length === 5}
            type="submit"
          >
            Add key
          </Button>
        </Box>
      )}
      <p>
        <Button
          disabled={!hasEnoughPublicKeys || isSettingUp}
          onClick={doSetup}
        >
          Setup Recovery
        </Button>
      </p>
    </Box>
  );
};
