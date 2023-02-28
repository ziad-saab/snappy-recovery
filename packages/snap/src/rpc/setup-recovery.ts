import { share, str2hex } from 'secrets.js-grempe';
import { Encrypted, encryptWithPublicKey } from 'eth-crypto';
import {
  RECOVERY_THRESHOLD_PARTS, RECOVERY_TOTAL_PARTS, SetupRecoveryParams, SetupRecoveryResult,
} from '@snappy-recovery/shared';
import {
  encryptAes,
  generateAesKey,
  getParentEthereumNode,
} from '../utils/keys';

export function isSetupRecoveryParams(params: unknown): asserts params is SetupRecoveryParams {
  if (!(
    params
    && typeof params === 'object'
    && 'friendsKeys' in params
    // @ts-expect-error
    && Array.isArray(params.friendsKeys)
    // @ts-expect-error
    && params.friendsKeys.every((k: unknown) => typeof k === 'object')
  )) {
    throw new Error('Must provide friendsKeys as an array of 5 key objects');
  }
}

export const setupRecovery = async ({ friendsKeys }: SetupRecoveryParams): Promise<SetupRecoveryResult> => {
  if (friendsKeys.length !== RECOVERY_TOTAL_PARTS) {
    throw new Error(`Must provide ${RECOVERY_TOTAL_PARTS} public keys to setup recovery`);
  }

  // Extract the user's parent Ethereum node, used to generate all their Ethereum accounts
  const parentEthereumNode = await getParentEthereumNode();

  // Encrypt the ethereum node with a fresh key
  const backupKeypair = await generateAesKey();
  const encryptedEthereumNode = await encryptAes(JSON.stringify(parentEthereumNode), backupKeypair);

  // Split the backup keypair using a Shamir 3-of-5 scheme
  const exportedBackupKeypair = await crypto.subtle.exportKey('jwk', backupKeypair);
  const jsonBackupKeypair = JSON.stringify(exportedBackupKeypair);
  const hexBackupKeypair = str2hex(jsonBackupKeypair);
  const backupKeypairParts = share(hexBackupKeypair, RECOVERY_TOTAL_PARTS, RECOVERY_THRESHOLD_PARTS);

  const encryptedAssignedBackupKeypairParts: Record<string, Encrypted> = {};
  for (let i = 0; i < RECOVERY_TOTAL_PARTS; i++) {
    const part = backupKeypairParts[i];
    const { gunPublicKey, backupPublicKeyHex } = friendsKeys[i];
    // eslint-disable-next-line no-await-in-loop
    const encryptedPart = await encryptWithPublicKey(
      backupPublicKeyHex,
      part,
    );
    encryptedAssignedBackupKeypairParts[gunPublicKey] = encryptedPart;
  }

  return {
    encryptedEthereumNode,
    encryptedAssignedBackupKeypairParts,
  };
};
