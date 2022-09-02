import { GunUser } from 'gun';
import {
  createContext, PropsWithChildren, useContext, useEffect, useState,
} from 'react';
import { gun } from 'services/gun';
import { login } from 'services/snappy-recovery-snap';
import { useMetaMask } from './metamask';

interface AuthContext {
  isLoggedIn: boolean;
  user: GunUser | null;
  login: () => void;
  identiconAddress?: string;
  publicKey?: string;
}

const authContext = createContext<AuthContext>({ isLoggedIn: false, user: null, login: () => {} });

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<GunUser | null>(null);
  const [identiconAddress, setIdenticonAddress] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();

  const { isSnappyRecoverySnapInstalled } = useMetaMask();

  useEffect(() => {
    gun.on('auth', async (u) => {
      setUser(u);
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (isSnappyRecoverySnapInstalled && !user) {
        const keys = await login();
        setIdenticonAddress(keys.gun.identiconAddress);
        setPublicKey(keys.gun.pub);
      }
    })();
  }, [isSnappyRecoverySnapInstalled, user]);

  return (
    <authContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        identiconAddress,
        publicKey,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
