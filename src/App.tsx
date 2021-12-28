import * as React from 'react';
import { SearchForm } from './components/SearchForm';
import { SearchResult } from './components/SearchResult';

export type SearchParams = {
  owner: string;
  repoName: string;
}

export function App() {
  const [values, setValues] = React.useState<SearchParams>({
    owner: '',
    repoName: ''
  });
  const onFormSubmit = React.useCallback((values: SearchParams) => {
    setValues(values);
  }, []);

  return (
    <main>
      <SearchForm onFormSubmit={onFormSubmit} />
      {values.owner && values.repoName && (
        <SearchResult owner={values.owner} repoName={values.repoName} />
      )}
    </main>
  );
}
