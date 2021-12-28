import * as React from 'react';
import useSWR from 'swr';
import { CircularProgress, Box, List, ListItem, ListItemButton } from '@mui/material';
import { styled } from '@mui/system';
import { IssueLabel, Label } from '../IssueLabel';
import { PRIcon } from '../PRIcon';
import { GITHUB_API_URL, fetcher } from '../../api';
import { SearchParams } from '../../App';

type SearchResultProps = SearchParams;

type Issue = {
  title: string;
  number: number;
  comments: number;
  comments_url: string;
  labels: Label[];
  pull_request: unknown;
}

const StyledColumn = styled('div')({
  width: '400px',
  margin: '40px auto',
});

const ErrorMessage = styled('div')({
  width: '400px',
  margin: '40px auto',
});


export const SearchResult: React.FC<SearchResultProps> = ({ owner, repoName, issuesCount }) => {
  const { data, error } = useSWR<Issue[]>(
    `${GITHUB_API_URL}repos/${owner}/${repoName}/issues`,
    fetcher
  );

  if (!error && !data) {
    return <Box sx={{ display: 'flex' }}><CircularProgress /></Box>;
  }

  if (error?.message) {
    return <ErrorMessage>{error.message.message}</ErrorMessage>;
  }

  if (!data?.length) {
    return <ErrorMessage>There are no issues for selected repo</ErrorMessage>
  }

  return (
    <StyledColumn>
      <List>
        {data && data.map((issue: Issue) => {
          return (
            <ListItem key={issue.number} sx={{ paddingLeft: '0', paddingRight: '0' }}>
              <ListItemButton sx={{ display: 'block', paddingLeft: 1, paddingRight: 1 }}>
                {`#${issue.number} ${issue.title}`}
                {Boolean(issue.pull_request) && <PRIcon />}
                {Boolean(issue.labels.length) && (
                  <Box sx={{ display: 'flex' }}>{issue.labels.map((label: Label) =>
                    <IssueLabel key={label.name} color={label.color} name={label.name} />
                  )}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </StyledColumn>
  );
}
