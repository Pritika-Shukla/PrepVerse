import { isAuthenticated } from '@/lib/auth.actions';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const RootLayout = async ({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/signin");
  return (
    <div>
      {children}
    </div>
  )
}

export default RootLayout