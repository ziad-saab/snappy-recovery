import { decryptWithPrivateKey, encryptWithPublicKey } from 'eth-crypto';
import type { AssistWithRecoveryParams, AssistWithRecoveryResult } from '@snappy-recovery/shared';
import { getSnappyBackupKey } from './get-snappy-keys';

export function isAssistWithRecoveryParams(_params: unknown): asserts _params is AssistWithRecoveryParams {
  // @TODO
}

export const assistWithRecovery = async ({ encryptedBackupKeypairPart, targetUserPublicKeyHex }: AssistWithRecoveryParams): Promise<AssistWithRecoveryResult> => {
  // First, decrypt the backup keypair part with our own private key
  const snappyBackupKey = await getSnappyBackupKey();
  const decryptedBackupKeypairPart = await decryptWithPrivateKey(
    snappyBackupKey.privateKey!.toString(),
    encryptedBackupKeypairPart,
  );

  // Then, re-encrypt with the recovery public key of the user we're helping
  const backupKeypairPartEncryptedWithTargetUserPublicKey = await encryptWithPublicKey(
    targetUserPublicKeyHex,
    decryptedBackupKeypairPart,
  );

  return { backupKeypairPartEncryptedWithTargetUserPublicKey };
};
