import * as React from 'react';
import useSWR from 'swr';
import {
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemButton,
  Pagination
} from '@mui/material';
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

const StyledBox = styled('div')({
  width: '400px',
  margin: '40px auto',
});

const ISSUES_LIMIT = 10;

export const SearchResult: React.FC<SearchResultProps> = ({ owner, repoName, issuesCount }) => {
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const { data, error } = useSWR<Issue[]>(
    `${GITHUB_API_URL}repos/${owner}/${repoName}/issues?per_page=${ISSUES_LIMIT}&page=${pageIndex}`,
    fetcher
  );
  const handleChange = React.useCallback((_: React.ChangeEvent<unknown>, value: number) => {
    setPageIndex(value);
  }, []);

  if (!error && !data) {
    return (
      <StyledBox>
        <Box sx={{ display: 'flex', alignItem: 'center' }}>
          <CircularProgress />
        </Box>
      </StyledBox>
    );
  }

  if (error?.message) {
    return <StyledBox>{error.message.message}</StyledBox>;
  }

  if (!data?.length) {
    return <StyledBox>There are no issues for selected repo</StyledBox>
  }

  return (
    <StyledBox>
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
        {issuesCount > ISSUES_LIMIT && (
          <Pagination
            count={Math.ceil(issuesCount / 10)}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        )}
      </List>
    </StyledBox>
  );
}
