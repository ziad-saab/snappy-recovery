import { Box } from '@mui/material';
import { useAuth } from 'hooks/auth';
import { useEffect, useState } from 'react';
import { userData } from 'services/gun';

export const Profile = () => {
  const [shardIds, setShardIds] = useState<string[]>([]);
  const isRecoverySetup = shardIds.length > 0;
  useEffect(() => {
    (async () => {
      const shards = await userData('recoveryPartsByPublicKey').then();
      if (shards) {
        const ids = Object.keys(shards).filter((k) => k !== '_');
        setShardIds(ids);
      }
    })();
  }, []);

  const { publicKey } = useAuth();

  return (
    <Box sx={{ p: 2 }}>
      <h2>Profile</h2>
      <h3>Your public key</h3>
      <p>
        <code>{publicKey}</code>
      </p>
      {
        isRecoverySetup && (
          <section>
            <p>Your recovery data has already been setup. Here are your friends' public keys:</p>
            <ul>
              {shardIds.map((id) => <li key={id}>{id}</li>)}
            </ul>
          </section>
        )
      }
    </Box>
  );
};
