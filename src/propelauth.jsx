// PropelAuth Config

import { AuthProvider } from '@propelauth/react';

const authUrl = 'http://localhost:3000.propelauthtest.com'

export const PropelAuthProvider = ({ children }) => (
  <AuthProvider authUrl={authUrl}>
    {children}
  </AuthProvider>
);