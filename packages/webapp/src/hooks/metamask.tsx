import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import {
  createContext, PropsWithChildren, useContext, useEffect, useState,
} from 'react';
import { isSnappyRecoverySnapInstalled } from 'services/snappy-recovery-snap';
import { delay } from 'utils/delay';

interface MetaMaskContext {
  checkingMetaMaskFlask: boolean;
  isMetaMaskFlask: boolean | null;
  checkingSnappyRecoverySnapInstalled: boolean;
  isSnappyRecoverySnapInstalled: boolean | null;
  isDevMode: boolean;
}

const metaMaskContext = createContext<MetaMaskContext>({
  checkingMetaMaskFlask: true,
  isMetaMaskFlask: false,
  checkingSnappyRecoverySnapInstalled: true,
  isSnappyRecoverySnapInstalled: false,
  isDevMode: false,
});

export const MetaMaskProvider = ({ children }: PropsWithChildren) => {
  const [isMetaMaskFlask, setIsMetaMaskFlask] = useState<boolean | null>(null);
  const checkingMetaMaskFlask = isMetaMaskFlask === null;

  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const checkingSnappyRecoverySnapInstalled = isInstalled === null;

  useEffect(() => {
    let check = true;
    (async () => {
      while (check) {
        // eslint-disable-next-line no-await-in-loop
        const installed = await isSnappyRecoverySnapInstalled();
        setIsInstalled(installed);

        if (installed) {
          check = false;
        } else {
          // eslint-disable-next-line no-await-in-loop
          await delay(500);
        }
      }
    })();

    return () => { check = false; };
  }, []);

  useEffect(() => {
    (async () => {
      const provider = await detectEthereumProvider() as MetaMaskInpageProvider | undefined;
      const isFlask = (
        await provider?.request({ method: 'web3_clientVersion' }) as string | undefined
      )?.includes('flask');

      setIsMetaMaskFlask(!!isFlask);
    })();
  }, []);

  return (
    <metaMaskContext.Provider
      value={{
        checkingMetaMaskFlask,
        isMetaMaskFlask,
        checkingSnappyRecoverySnapInstalled,
        isSnappyRecoverySnapInstalled: isInstalled,
        isDevMode: window.location.origin.startsWith('http://localhost'),
      }}
    >
      {children}
    </metaMaskContext.Provider>
  );
};

export const useMetaMask = () => useContext(metaMaskContext);
