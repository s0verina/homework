import * as React from 'react';
import useSWR from 'swr';
import {
  CircularProgress,
  Box,
  List,
  Pagination,
  Popover
} from '@mui/material';
import { StyledBox } from '../StyledBox';
import { Grid } from '../Grid';
import { Comment as CommentItem } from '../Comment';
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
        {data && data.map((comment: Comment) => (
          <CommentItem
            key={comment.id}
            body={comment.body}
            onClick={(event: React.MouseEvent) => {
              const text = window.getSelection()?.toString() || '';
              if (text) {
                setSelectedText(window.getSelection()?.toString() || '');
                setTarget(event.target as HTMLParagraphElement);
              }
            }}
          />
        ))}
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
        <Box sx={{ p: 1 }}><Grid text={selectedText} url={url} /></Box>
      </Popover>
    </>
  );
}
