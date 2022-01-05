import * as React from 'react';
import { Box, Button, Modal, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { addComment } from '../../actions/addComment';

type SendCommentModalProps = {
  text: string;
  url: string;
  selectedImage: string;
  onModalClose: () => void;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M0.5 0.499023L23.5 23.499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23.5 0.499023L0.5 23.499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const StylesQuote = styled('blockquote')({
  marginLeft: 0,
  marginBottom: 8,
  borderLeft: '1px solid',
  borderColor: 'secondary.main',
  paddingLeft: 4
});

function formatText(text: string, selectedImage: string) {
  return`> ${text}\r\n\r\n![''](${selectedImage})\r\n`;
}

export const SendCommentModal: React.FC<SendCommentModalProps> = ({
  text,
  url,
  selectedImage,
  onModalClose
}) => {
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const sendComment = React.useCallback(async () => {
    const bodyText = formatText(text, selectedImage);
    setError('');
    setIsSending(true);
    try {
      await addComment({ body: bodyText, url });
      onModalClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err?.message as string);
      }
    } finally {
      setIsSending(false);
    }
  }, [selectedImage]);

  React.useEffect(() => () => setError(''), []);

  return (
    <Modal
      open={Boolean(selectedImage)}
      onClose={onModalClose}
    >
      <Box sx={{
        width: '400px',
        backgroundColor: '#fff',
        margin: '0 auto',
        position: 'relative',
        transform: 'translatey(-50%)',
        top: '50%',
        p: 4
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          '& svg': { width: '0.75em;' }
        }}>
          <IconButton aria-label="Close modal" onClick={onModalClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <StylesQuote>{text}</StylesQuote>
        <Box sx={{ lineHeight: 0, marginBottom: 1, }}>
          <img alt="" src={selectedImage} />
        </Box>
        {Boolean(error) && (
          <Box sx={{ marginBottom: 1, color: 'error.main', fontSize: '0.875em' }}>{error}</Box>
        )}
        <Button
          disabled={isSending}
          onClick={sendComment}
          variant="contained"
          disableElevation
        >
          {isSending ? <CircularProgress color="secondary" size={24} /> : "Send" }
        </Button>
      </Box>
    </Modal>
  );
}
