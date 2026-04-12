'use client';

import { Trans, useT } from 'next-i18next/client';

export const HeroTitle = () => {
  const { t } = useT('common');
  return (
    <h2 className="font-bold text-6xl">
      <Trans
        i18nKey="hero.title"
        t={t}
        namespace="common"
        components={{
          span: <span className="block text-secondary" />,
        }}
      />
    </h2>
  );
};

export const HeroCta = () => {
  const { t } = useT('common');
  return (
    <span>
      <Trans
        i18nKey="hero.cta"
        t={t}
        namespace="common"
        components={{
          strong: <strong />,
        }}
      />
    </span>
  );
};
