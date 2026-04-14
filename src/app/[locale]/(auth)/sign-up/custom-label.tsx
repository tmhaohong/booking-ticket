'use client';

import { Trans, useT } from 'next-i18next/client';
import Link from '@/components/link';

const CustomLabel = () => {
  const { t } = useT('sign-up');

  return (
    <span>
      <Trans
        i18nKey="termsAndPrivacy"
        t={t}
        components={{
          tos: <Link href="/termOfService" />,
          privacy: <Link href="/privacy" />,
        }}
      />
    </span>
  );
};

export default CustomLabel;
