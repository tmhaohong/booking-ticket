'use client'

import Link from 'next/link';
import { Trans, useT } from 'next-i18next/client'

const CustomLabel = () => {
  const { t } = useT('sign-up');

  return (
    <span>
      <Trans
        i18nKey="termsAndPrivacy"
        t={t}
        components={{
          tos: (
            <Link
              href="/termOfService"
              className="font-semibold text-blue-500 hover:underline"
            />
          ),
          privacy: (
            <Link
              href="/privacy"
              className="font-semibold text-blue-500 hover:underline"
            />
          ),
        }}
      />
    </span>
  );
};

export default CustomLabel;
