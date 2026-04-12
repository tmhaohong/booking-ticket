import { getT } from 'next-i18next/server';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getSession } from '@/helpers/session';
import Beams from './beam';
import { HeroCta, HeroTitle } from './hero-text';

export const dynamic = 'force-dynamic';

const Layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const session = await getSession();

  if (session) {
    redirect(`/${locale}/home`);
  }

  const { t } = await getT('common', { lng: locale });

  return (
    <div className="relative flex h-screen items-center">
      <div className="absolute top-0 left-0 h-full w-full">
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      <div className="relative z-1 flex h-8/10 w-1/2 flex-col justify-end gap-4 p-10 font-display text-white">
        <HeroTitle />
        <p>
          {t('hero.subtitle', {
            defaultValue:
              "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
          })}
        </p>
        <HeroCta />
      </div>
      <div className="flex h-full w-1/2 flex-col items-center justify-center">{children}</div>
    </div>
  );
};

export default Layout;
