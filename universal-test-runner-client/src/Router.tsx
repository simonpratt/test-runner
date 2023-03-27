import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './App';
import JobsList from './components/jobs/JobsList';

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
        element: <JobsList />,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
