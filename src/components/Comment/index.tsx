import * as React from 'react';
import { ListItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';

type CommentProps = {
  body: string;
  onClick: (event: React.MouseEvent) => void;
};

export const Comment: React.FC<CommentProps> = ({ body, onClick }) => (
  <ListItem
    sx={{
      display: 'block',
      paddingLeft: '0',
      paddingRight: '0',
      borderBottom: '1px solid',
      borderColor: 'secondary.main',
      overflow: 'hidden',
      '& img': {
        maxWidth: '100%'
      },
      '& blockquote': {
        borderLeft: '2px solid',
        borderColor: 'secondary.main',
        margin: 0,
        paddingLeft: '16px'
      },
      '& code': {
        padding: '.25em',
        backgroundColor: 'rgba(175, 184, 193, 0.2)'
      }
    }}
    onMouseUp={onClick}
  >
    <ReactMarkdown>
      {body}
    </ReactMarkdown>
  </ListItem>
);
