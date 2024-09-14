// PropelAuth Config

import { AuthProvider } from '@propelauth/react';

const authUrl = 'process.env.REACT_APP_PROPELAUTH_AUTH_URL;'

export const PropelAuthProvider = ({ children }) => (
  <AuthProvider authUrl={authUrl}>
    {children}
  </AuthProvider>
);