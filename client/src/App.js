import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/register';

/** root routes */
const router = createBrowserRouter([
    {
        path : '/',
        element : <Register />
    },
    
    
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
