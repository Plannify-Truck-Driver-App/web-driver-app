import { refreshTokenApi } from 'api/user/refresh-token.api';
import { TokenPayload } from 'models/payload-token.model';
import LocalStorageLoadingPage from 'pages/utils/local-storage-loading.page';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItem, removeItem, setItem } from 'utils/indexed-db';
import { tokenToPayload } from 'utils/token-to-payload.util';

export interface AuthentificationProviderProps {
    authentification: {
      accessToken: string;
      refreshToken: string;
      payload: TokenPayload;
    } | null;
    setAuthentification: React.Dispatch<React.SetStateAction<{
        accessToken: string;
        refreshToken: string;
        payload: TokenPayload;
    } | null>>;
};


const AuthContext = createContext<AuthentificationProviderProps>({ authentification: null, setAuthentification: () => null});

export const AuthProvider = ({ children }: any) => {
  const [authentification, setAuthentification] = useState<{ accessToken: string, refreshToken: string, payload: TokenPayload } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTokens = async () => {
      const accessToken: string | null = await getItem('accessToken');
      const refreshToken: string | null = await getItem('refreshToken');

      if (accessToken && refreshToken) {
        const refreshPayload: TokenPayload = await tokenToPayload(refreshToken);
        if (refreshPayload.exp * 1000 < Date.now()) {
          setAuthentification(null);
          navigate('/connexion');
          return;
        }
        
        const payload: TokenPayload = await tokenToPayload(accessToken);

        const timeMs: number = (payload.exp * 1000 - 1000 * 10) - Date.now()

        setAuthentification({ accessToken: accessToken, refreshToken: refreshToken, payload: payload });
        scheduleTokenRefresh({ accessToken: accessToken, refreshToken: refreshToken, payload: payload }, timeMs > 0 ? timeMs : 0);
      }

      setLoading(false);
    }

    loadTokens();
  }, []);

  useEffect(() => {
    const updateTokens = async () => {
      if (authentification && authentification.accessToken && authentification.refreshToken && authentification.payload) {
        await setItem('accessToken', authentification.accessToken);
        await setItem('refreshToken', authentification.refreshToken);

        scheduleTokenRefresh({ accessToken: authentification.accessToken, refreshToken: authentification.refreshToken, payload: authentification.payload }, authentification.payload.exp * 1000 - Date.now());
      } else {
        await removeItem('accessToken');
        await removeItem('refreshToken');
      }
    };

    updateTokens();
  }, [authentification])

  const scheduleTokenRefresh = (tokens: { accessToken: string, refreshToken: string, payload: TokenPayload }, delay: number) => {
    setTimeout(async () => {
      const result: { success: boolean, message: string, data: { accessToken: string, refreshToken: string } | null } = await refreshTokenApi({ navigation: navigate, authentification: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, payload: tokens.payload }, setAuthentification: setAuthentification })

      if (!result.success) {
        setAuthentification(null);
        navigate('/connexion');
      }
    }, delay);
  };

  return (
    <>
      {
        loading ?
        <LocalStorageLoadingPage />:
        <AuthContext.Provider value={{ authentification, setAuthentification }}>
          {children}
        </AuthContext.Provider>
      }
    </>
  );
};

export default AuthContext;
