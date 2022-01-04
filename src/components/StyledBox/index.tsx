import { styled } from '@mui/system';
import { breakpoints } from '../../breakpoints';

export const StyledBox = styled('div')({
  width: '400px',
  margin: '40px auto',

  [`@media (max-width: ${breakpoints.sm})`]: {
    width: '100%',
    padding: '0 20px',
  }
});
