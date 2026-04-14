import Link from 'next/link';
import { getT } from 'next-i18next/server';
import SignOutButton from '@/components/sign-out-button';
import { getSession } from '@/helpers/session';
import { WelcomeText } from './welcome-text';

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const { t } = await getT('common', { lng: locale });
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-lg">
        <WelcomeText name={session?.user?.name || 'User'} />
        <p className="mb-6 text-zinc-500">{t('home.subtitle')}</p>
        <div className="flex gap-4">
          <Link
            href={`/${locale}/booking`}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            {t('home.browse')}
          </Link>
          <Link
            href={`/${locale}/my-booking`}
            className="rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {t('home.myBookings')}
          </Link>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
