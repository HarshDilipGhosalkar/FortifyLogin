import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/register';
import Profile from './components/profile';
import { AuthorizeUser } from './middleware/auth';
/** root routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Register />,
},
{
  path : '/profile',
  element :<AuthorizeUser> <Profile /> </AuthorizeUser>
},
    
    
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
