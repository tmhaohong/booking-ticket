import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getSession } from '@/helpers/session';

const PrivateLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in?expired=true');
  }

  return <>{children}</>;
};

export default PrivateLayout;
