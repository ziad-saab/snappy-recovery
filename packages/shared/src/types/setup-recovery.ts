import { AesEncryptedData, EncryptedBackupKeypairPart } from './crypto';

export interface FriendKeys {
  gunPublicKey: string;
  backupPublicKeyHex: string;
}

export interface SetupRecoveryParams {
  friendsKeys: FriendKeys[];
}

export interface SetupRecoveryResult {
  encryptedEthereumNode: AesEncryptedData;
  encryptedAssignedBackupKeypairParts: Record<string, EncryptedBackupKeypairPart>;
}
