import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppDetails } from './components/AppDetails.jsx';

const router = createBrowserRouter([
  {
    // sets this url path to App.jsx component
    path: "/",
    element: <App/>
  },
  {
    // sets this url path to AppDetails.jsx component
    path: "/appDetails/",
    element: <AppDetails/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
