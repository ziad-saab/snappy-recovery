declare module 'ethjs-unit' {
  import * as BN from 'bn.js';

  export function fromWei(weiInput: string | number | BN, unit: string): string;
}
