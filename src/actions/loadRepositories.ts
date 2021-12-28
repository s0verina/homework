import { GITHUB_API_URL, fetcher } from '../api';

interface LoadReposProps {
  owner: string;
}

export async function loadRepositories<T> ({ owner }: LoadReposProps) {
  const url = `${GITHUB_API_URL}users/${owner}/repos`;

  return fetcher<T>(url).catch(() => []);
}
