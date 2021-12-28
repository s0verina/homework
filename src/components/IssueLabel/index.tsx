import { styled } from '@mui/system';

export type Label = {
  color: string;
  name: string;
}

const StyledLabel = styled('div')({
  marginRight: 4,
  marginLeft: 4,
  padding: 8,
  borderRadius: '2em',
  fontSize: '0.85em',
  lineHeight: 1,
  color: '#fff'
});

export const IssueLabel: React.FC<Label> = ({ color, name }) => (
  <StyledLabel style={{ backgroundColor: `#${color}` }}>{name}</StyledLabel>
)
