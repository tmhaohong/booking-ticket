'use client';

import { Trans, useT } from 'next-i18next/client';

export const WelcomeText = ({ name }: { name: string }) => {
  const { t } = useT('common');

  return (
    <h1 className="mb-4 font-bold font-display text-4xl">
      <Trans
        i18nKey="home.welcome"
        t={t}
        namespace="common"
        values={{ name }}
        components={{
          span: <span className="text-secondary" />,
        }}
      />
    </h1>
  );
};
