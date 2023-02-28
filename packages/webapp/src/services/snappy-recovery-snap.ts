import type {
  AssistWithRecoveryParams,
  AssistWithRecoveryResult,
  GetRecoveredAddressesParams,
  GetRecoveredAddressesResult,
  GetRecoveryPublicKeyResult,
  GetSnappyKeysResult,
  SetupRecoveryParams,
  SetupRecoveryResult,
  ShowPrivateKeyForRecoveredAddressParams,
} from '@snappy-recovery/shared';
import { Buffer } from 'buffer';
import { SNAPPY_RECOVERY_SNAP_ID } from 'utils/constants';
import { user, userData } from './gun';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Buffer = Buffer;

export const getSnappyKeys = () => ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: SNAPPY_RECOVERY_SNAP_ID,
    request: {
      method: 'getSnappyKeys',
    },
  },
}) as Promise<GetSnappyKeysResult>;

const authUserWithKeypairs = (keypairs: GetSnappyKeysResult) => {
  return new Promise<void>((resolve, reject) => {
    try {
      user.auth(keypairs.gun, (result) => {
        if ('err' in result) {
          reject(new Error(result.err));
        } else {
          userData('backupPublicKeyHex').put(keypairs.backupPublicKeyHex);
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const login = async () => {
  const keypairs = await getSnappyKeys();
  await authUserWithKeypairs(keypairs);

  return keypairs;
};

export const setupRecovery = (setupParams: SetupRecoveryParams) => ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: SNAPPY_RECOVERY_SNAP_ID,
    request: {
      method: 'setupRecovery',
      params: setupParams,
    },
  },
}) as Promise<SetupRecoveryResult>;

export const finishSetup = async (recoveryData: SetupRecoveryResult): Promise<void> => {
  // Save all backup key shards to Gun db
  const saves: Promise<unknown>[] = [];
  for (const [friendPublicKey, friendRecoveryShard] of Object.entries(recoveryData.encryptedAssignedBackupKeypairParts)) {
    saves.push(userData('recoveryPartsByPublicKey').get(friendPublicKey).put(friendRecoveryShard).then());
  }

  // Save user's encrypted node to Gun db
  saves.push(userData('encryptedEthereumNode').put(recoveryData.encryptedEthereumNode).then());

  await Promise.all(saves);
};

export const getRecoveryPublicKey = () => ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: SNAPPY_RECOVERY_SNAP_ID,
    request: {
      method: 'getRecoveryPublicKey',
    },
  },
}) as Promise<GetRecoveryPublicKeyResult>;

export const assistWithRecovery = (assistParams: AssistWithRecoveryParams) => ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: SNAPPY_RECOVERY_SNAP_ID,
    request: {
      method: 'assistWithRecovery',
      params: assistParams,
    },
  },
}) as Promise<AssistWithRecoveryResult>;

export const getRecoveredAddresses = (recoveryParams: GetRecoveredAddressesParams) => ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: SNAPPY_RECOVERY_SNAP_ID,
    request: {
      method: 'getRecoveredAddresses',
      params: recoveryParams,
    },
  },
}) as Promise<GetRecoveredAddressesResult>;

export const showPrivateKeyForRecoveredAddress = (recoveryParams: ShowPrivateKeyForRecoveredAddressParams) => ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: SNAPPY_RECOVERY_SNAP_ID,
    request: {
      method: 'showPrivateKeyForRecoveredAddress',
      params: recoveryParams,
    },
  },
}) as Promise<void>;
