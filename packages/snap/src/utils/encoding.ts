import { base64url } from 'multiformats/bases/base64';

const b = require('buffer/');

console.log('Buffer', b);

export const uint8ArrayToBase64UrlEncode = (bytes: Uint8Array): string => {
  return base64url.baseEncode(bytes);
};

export const hexStringToBase64UrlEncode = (hexString: string): string => {
  return base64url.baseEncode(Buffer.from(hexString, 'hex'));
};

export const base64UrlEncodeToHexString = (base64Data: string): string => {
  return Buffer.from(base64url.baseDecode(base64Data)).toString('hex');
};

export const uint8ArrayToBase64 = (array: Uint8Array): string => {
  return Buffer.from(array).toString('base64');
};

export const base64ToUint8Array = (base64Data: string): Uint8Array => {
  return Buffer.from(base64Data, 'base64');
};
