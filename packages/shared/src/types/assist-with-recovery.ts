import { EncryptedBackupKeypairPart } from './crypto';

export interface AssistWithRecoveryParams {
  encryptedBackupKeypairPart: EncryptedBackupKeypairPart;
  targetUserPublicKeyHex: string;
}

export interface AssistWithRecoveryResult {
  backupKeypairPartEncryptedWithTargetUserPublicKey: EncryptedBackupKeypairPart;
}
