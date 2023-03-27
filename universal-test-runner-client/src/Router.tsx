import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to='/queue' replace={true} />,
      },
      {
        path: '/queue',
        element: <div>queue...</div>,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
