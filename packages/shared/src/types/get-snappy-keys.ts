export interface GetSnappyKeysResult {
  gun: {
    epub: string;
    epriv: string;
    pub: string;
    priv: string;
    identiconAddress: string;
  };
  backupPublicKeyHex: string;
}
