'use client';

import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/helpers/auth-client';

const SignOutButton = () => {
  const router = useRouter();

  const params = useParams();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push(`/${params.locale}/sign-in`);
    } catch (e) {
      console.error('Failed to sign out', e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="mt-6 text-red-500 text-sm hover:underline"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
