import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getSession } from '@/helpers/session';

export const dynamic = 'force-dynamic';

const PrivateLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  let session = null;

  try {
    session = await getSession();
  } catch (error) {
    // Suppress crash, surface as expired session
  }

  if (!session) {
    redirect(`/${locale}/sign-in?expired=true`);
  }

  return <>{children}</>;
};

export default PrivateLayout;
