import * as React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { RepoAutocomplete } from '../RepoAutocomplete';
import { SearchParams } from '../../App';

type SearchFormProps = {
  onFormSubmit: (values: SearchParams) => void;
}

const StyledForm = styled('form')({
  width: '400px',
  margin: '40px auto',
});

export const SearchForm: React.FC<SearchFormProps> = ({ onFormSubmit }) => {
  const [values, setValues] = React.useState<SearchParams>({
    owner: '',
    repoName: '',
    issuesCount: 0
  });
  const onUpdate = <Key extends keyof SearchParams>(name: Key, value: SearchParams[Key]) =>
    setValues((form) => ({ ...form, [name]: value }));
  const onSelectChanged = React.useCallback((value: string, issuesCount: number) => {
    onUpdate('repoName', value);
    onUpdate('issuesCount', issuesCount);
  }, []);
  const onSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(values);
  }, [values]);

  return (
    <StyledForm className="search-form" onSubmit={onSubmit}>
      <Box sx={{ mb: 2 }}>
        <TextField
          name="repo-owner"
          label="Repository owner"
          id="repo-owner"
          size="small"
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('owner', e.target.value)}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <RepoAutocomplete
          owner={values.owner}
          onChange={onSelectChanged}
        />
      </Box>
      <Button
        disabled={!values.owner || !values.repoName}
        type="submit"
        variant="contained"
        onClick={onSubmit}
        disableElevation
      >
        Get last issues
      </Button>
    </StyledForm>
  );
}
