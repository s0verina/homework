import * as React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { SearchParams } from '../../App';

interface SearchFormProps {
  onFormSubmit: (values: SearchParams) => void;
}

const StyledForm = styled('form')({
  width: '400px',
  margin: '40px auto',
});

export const SearchForm: React.FC<SearchFormProps> = ({ onFormSubmit }) => {
  const [values, setValues] = React.useState<SearchParams>({
    owner: '',
    repoName: ''
  });
  const onUpdate = <Key extends keyof SearchParams>(name: Key, value: SearchParams[Key]) =>
    setValues((form) => ({ ...form, [name]: value }));

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
        <TextField
          name="repo-name"
          label="Repository name"
          id="repo-name"
          size="small"
          fullWidth
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate('repoName', e.target.value)}
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
