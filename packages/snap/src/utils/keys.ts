import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { AesEncryptedData } from '@snappy-recovery/shared';
import { Buffer } from 'buffer';
import { ec as Ec } from 'elliptic';
import {
  base64ToUint8Array,
  base64UrlEncodeToHexString,
  hexStringToBase64UrlEncode,
  uint8ArrayToBase64,
  uint8ArrayToBase64UrlEncode,
} from './encoding';

const p256JwkConv = (prvivateKeyHex: string, publicKeyHex: string) => {
  const pubKeyArray = new Uint8Array(Buffer.from(publicKeyHex, 'hex').buffer);

  return {
    kty: 'EC',
    crv: 'P-256',
    d: hexStringToBase64UrlEncode(prvivateKeyHex),
    x: uint8ArrayToBase64UrlEncode(pubKeyArray.slice(1, 33)),
    y: uint8ArrayToBase64UrlEncode(pubKeyArray.slice(33, 66)),
  };
};

const curve = new Ec('p256'); // Gun DB uses p256, we're only using this for the Gun keys
export const p256JwkFromPrivateKey = (privateKeyHex: string) => {
  // We need to calculate the p256 public key, since bip32 uses secp256k1
  const key = curve.keyFromPrivate(privateKeyHex);
  const publicKeyHex = key.getPublic().encode('hex', false);
  return p256JwkConv(privateKeyHex, publicKeyHex);
};

export const base64UrlPubkeyToHex = (base64Pubkey: string): string => {
  return base64Pubkey.split('.').map((coord) => base64UrlEncodeToHexString(coord)).join('');
};

export const getParentEthereumNode = () => wallet.request({
  method: 'snap_getBip44Entropy_60',
}) as Promise<JsonBIP44CoinTypeNode>;

export const generateAesKey = () => {
  return crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  ) as Promise<CryptoKey>;
};

export const importAesKey = (jwk: JsonWebKey) => crypto.subtle.importKey(
  'jwk',
  jwk,
  {
    name: 'AES-GCM',
    length: 256,
  },
  true,
  ['encrypt', 'decrypt'],
);

export const encryptAes = async (data: string, key: CryptoKey): Promise<AesEncryptedData> => {
  const textEncoder = new TextEncoder();
  const initializationVector = crypto.getRandomValues(new Uint8Array(15));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: initializationVector,
    },
    key,
    textEncoder.encode(data).buffer,
  );

  return {
    initializationVectorInBase64: uint8ArrayToBase64(initializationVector),
    encryptedDataInBase64: uint8ArrayToBase64(encrypted),
  };
};

export const decryptAes = async (data: AesEncryptedData, key: CryptoKey): Promise<string> => {
  const uint8ArrayData = base64ToUint8Array(data.encryptedDataInBase64);
  const initializationVector = base64ToUint8Array(data.initializationVectorInBase64);
  const textDecoder = new TextDecoder();
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: initializationVector,
    },
    key,
    uint8ArrayData,
  );

  return textDecoder.decode(decrypted);
};
