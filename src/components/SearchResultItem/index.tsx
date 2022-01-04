import * as React from 'react';
import {
  Box,
  ListItem,
  ListItemButton,
} from '@mui/material';
import { IssueLabel, Label } from '../IssueLabel';
import { PRIcon } from '../PRIcon';

type SearchResultItemProps = {
  title: string;
  number: number;
  isSelected: boolean;
  onIssueClick: () => void;
  isPullRequest: boolean;
  labels: Label[];
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  title,
  number,
  isSelected,
  isPullRequest,
  onIssueClick,
  labels
}) => {
  return (
    <ListItem
      sx={{
        paddingLeft: '0',
        paddingRight: '0',
        border: '1px solid',
        borderColor: isSelected ? 'secondary.main': 'transparent'
      }}>
      <ListItemButton
        sx={{ display: 'block', paddingLeft: 1, paddingRight: 1 }}
        onClick={onIssueClick}
      >
        {`#${number} ${title}`}
        {Boolean(isPullRequest) && <PRIcon />}
        {Boolean(labels.length) && (
          <Box sx={{ display: 'flex' }}>{labels.map((label: Label) =>
            <IssueLabel key={label.name} color={label.color} name={label.name} />
          )}
          </Box>
        )}
      </ListItemButton>
    </ListItem>
  );
}
