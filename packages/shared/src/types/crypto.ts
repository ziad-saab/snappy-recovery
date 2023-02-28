import type { Encrypted } from 'eth-crypto';

export type AesEncryptedData = {
  initializationVectorInBase64: string;
  encryptedDataInBase64: string;
};

export type EncryptedBackupKeypairPart = Encrypted;
