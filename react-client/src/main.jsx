import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { FirebaseConfig } from './firebase/Config';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Account from './components/Account';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

import './index.css'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:3000'
  })
});

const app = initializeApp(FirebaseConfig);
const analytics = getAnalytics(app);

const router = createBrowserRouter([
  {
      path: "",
      element: <App />,
      errorElement: <Error />,
      children: [
          {
              path: "/",
              element: <Home />
          },
          {
              path: '/sign-in',
              element: <SignIn />
          },
          {
              path: '/sign-up',
              element: <SignUp />
          },
          {
            path: '/account',
            element: <Account />
          },
          {
            path: '/change-password',
            element: <ChangePassword />
          },
          {
            path: '/forgot-password',
            element: <ForgotPassword />
          },

      ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ApolloProvider>,
)