import React from 'react';
import { Outlet } from 'react-router-dom';

import { BodyStyle, DarkThemeProvider, MinimalMenu } from '@dtdot/lego';

import Menu from './components/core/Menu';
import { TRPCProvider } from './core/tRPC.provider';

function App() {
  return (
    <DarkThemeProvider>
      <BodyStyle />
      <TRPCProvider>
        <Menu />
        <MinimalMenu.Page>
          <Outlet />
        </MinimalMenu.Page>
      </TRPCProvider>
    </DarkThemeProvider>
  );
}

export default App;
