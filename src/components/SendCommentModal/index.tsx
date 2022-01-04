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
  marginLeft: '0',
  borderLeft: '1px solid',
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
  const sendComment = React.useCallback(async () => {
    const bodyText = formatText(text, selectedImage);
    setIsSending(true);
    await addComment({ body: bodyText, url });
    setIsSending(false);
    onModalClose();
  }, [selectedImage]);

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
        <Box>
          <img alt="" src={selectedImage} />
        </Box>

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
