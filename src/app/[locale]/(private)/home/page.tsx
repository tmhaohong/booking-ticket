import SignOutButton from '@/components/sign-out-button';
import { getSession } from '@/helpers/session';

const HomePage = async () => {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-lg">
        <h1 className="mb-4 font-bold font-display text-4xl">
          Welcome back, <span className="text-secondary">{session?.user?.name || 'User'}</span>!
        </h1>
        <p className="mb-6 text-zinc-500">
          You are now signed in. Explore upcoming events and book your tickets.
        </p>
        <div className="flex gap-4">
          <a
            href="/booking"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Browse Events
          </a>
          <a
            href="/my-booking"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            My Bookings
          </a>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
