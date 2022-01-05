import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { TextField, Autocomplete, CircularProgress, Box } from '@mui/material';
import { loadRepositories } from '../../actions/loadRepositories';

const DEBOUNCE_DELAY = 300;

type RepoAutocompleteProps = {
  owner: string;
  onChange: (value: string, issuesCount: number) => void;
}

type Option = {
  label: string;
  value: string;
  issuesCount: number;
}

type Repository = {
  name: string;
  open_issues_count: number;
}

export const RepoAutocomplete: React.FC<RepoAutocompleteProps> = ({ owner, onChange }) => {
  const [selectedOption, setSelectedOptions] = React.useState<Option | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [error, setError] = React.useState<string>();
  const onSelect = React.useCallback((_, newValue: Option) => {
    setSelectedOptions(newValue);
    onChange(newValue.value, newValue.issuesCount);
  }, [onChange]);
  const debounceLoadOwnerRepos = useDebouncedCallback(async () => {
    if (owner) {
      setIsLoading(true);
      setError('');

      try {
        const repos = await loadRepositories<Option[]>({ owner });
        const newOptions = repos.map((repo: Repository) => ({
          label: repo.name,
          value: repo.name,
          issuesCount: repo.open_issues_count
        }));
        setOptions(newOptions);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err?.message?.message as string);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, DEBOUNCE_DELAY);

  React.useEffect(() => {
    setSelectedOptions(null);
    onChange('', 0);
    debounceLoadOwnerRepos();
  }, [owner]);

  return (
    <>
      <Autocomplete
          id="repo-name"
          size="small"
          options={options}
          loading={isLoading}
          disabled={!owner || isLoading}
          value={selectedOption}
          onChange={onSelect}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label="Repository name"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? <CircularProgress color="secondary" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        {Boolean(error) && <Box sx={{ marginTop: 2, marginBottom: 1, color: 'error.main'}}>{error}</Box>}
      </>
  );
}
