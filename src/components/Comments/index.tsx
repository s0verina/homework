import * as React from 'react';
import useSWR from 'swr';
import {
  CircularProgress,
  Box,
  List,
  ListItem,
  Pagination,
  Popover
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { StyledBox } from '../StyledBox';
import { Grid } from '../Grid';
import { fetcher } from '../../api';

type Comment = {
  body: string;
  id: number;
}

type CommentsProps = {
  url: string;
  commentsCount: number;
};

const COMMETS_LIMIT = 10;

export const Comments: React.FC<CommentsProps> = ({ url, commentsCount }) => {
  const [pageIndex, setPageIndex] = React.useState<number>(1);
  const [selectedText, setSelectedText] = React.useState<string>('');
  const [target, setTarget] = React.useState<HTMLParagraphElement | null>(null);
  const closePopover = () => {
    setTarget(null);
    setSelectedText('');
  };
  const { data, error } = useSWR<Comment[]>(
    `${url}?per_page=${COMMETS_LIMIT}&page=${pageIndex}`,
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
    return <Box sx={{ pt: 2 }}>{error.message.message}</Box>;
  }

  if (!data?.length) {
    return <Box sx={{ pt: 2 }}>There are no comments for selected issue</Box>
  }

  return (
    <>
      <List>
        {data && data.map((comment: Comment) => {
          return (
            <ListItem
              key={comment.id}
              sx={{
                display: 'block',
                paddingLeft: '0',
                paddingRight: '0',
                borderBottom: '1px solid black',
                overflow: 'hidden',
                '& img': {
                  maxWidth: '100%'
                },
                '& blockquote': {
                  borderLeft: '2px solid',
                  margin: 0,
                  paddingLeft: '16px'
                },
                '& code': {
                  padding: '.25em',
                  backgroundColor: 'rgba(175, 184, 193, 0.2)'
                }
              }}
              onClick={(event: React.MouseEvent<HTMLParagraphElement>) => {
                const text = window.getSelection()?.toString() || '';
                if (text) {
                  setSelectedText(window.getSelection()?.toString() || '');
                  setTarget(event.target as HTMLParagraphElement);
                }
              }}
            >
              <ReactMarkdown>
                {comment.body}
              </ReactMarkdown>
            </ListItem>
          );
        })}
      </List>
      {commentsCount > COMMETS_LIMIT && (
        <Pagination
          count={Math.ceil(commentsCount / 10)}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        />
      )}
      <Popover
        open={Boolean(target)}
        anchorEl={target}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 1 }}><Grid text={selectedText} /></Box>
      </Popover>
    </>
  );
}
