import { redirect } from 'next/navigation';

/**
 * Redirects to the locale-specific `/home` route using the provided route parameters.
 *
 * @param params - A promise that resolves to an object containing the `locale` route parameter used to build the redirect destination (e.g., `{ locale: 'en' }`).
 */
export default async function RootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/home`);
}
