'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/helpers/auth-client';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/sign-in');
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
