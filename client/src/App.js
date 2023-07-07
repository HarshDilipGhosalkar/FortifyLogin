import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/register';
import Success from './components/success';

/** root routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Register />,
},
{
  path : '/success',
  element : <Success />
},
    
    
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
