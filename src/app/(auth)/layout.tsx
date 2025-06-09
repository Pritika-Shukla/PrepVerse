import { isAuthenticated } from '@/lib/auth.actions';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const AuthLayout = async ({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");
  return (
    <div>
     {children} 
    </div>
  )
}

export default AuthLayout
