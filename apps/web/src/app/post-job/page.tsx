import { redirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PostJobRedirectPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => { nextParams.append(key, item); });
    } else if (value) {
      nextParams.set(key, value);
    }
  }

  const query = nextParams.toString();
  redirect(query ? `/jobs/new?${query}` : '/jobs/new');
}
