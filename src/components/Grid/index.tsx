import * as React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Box, Button, CircularProgress, Modal, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { fetchGifs } from '../../actions/fetchGifs';
import { addComment } from '../../actions/addComment';

type GridProps = {
  text: string;
}

type ImagesVariants = 'fixed_width';
type ImagesInfo = {
  url: string;
};

type Image = {
  id: string;
  images: Record<ImagesVariants, ImagesInfo>;
  title: string;
}

const GUTTER_SIZE = 4;

enum Status {
  LOADING = 'loading',
  LOADED = 'loaded'
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

export const Grid: React.FC<GridProps> = ({ text, url }) => {
  const [status, setStatus] = React.useState<Status>(Status.LOADED);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const isLoading = status === Status.LOADING;
  const offset = React.useRef<number>();
  const [items, setItems] = React.useState<Image[]>([]);
  const itemCount = items.length > 0 ? items.length + 1 : items.length;
  const loadMoreItems = async function() {
    const newItems = await fetchGifs(text, offset?.current + 1);
    offset.current = newItems.pagination.offset;
    setItems(items.concat(newItems.data));
  };
  const onModalClose = () => {
    setSelectedImage('');
  }
  const sendComment = React.useCallback(async () => {
    const bodyText = `> ${text}\r\n\r\n!['text'](${selectedImage})\r\n`;
    await addComment({ body: bodyText, url });
    onModalClose();
  }, [selectedImage]);

  React.useEffect(() => {
    async function loadInitialItems() {
      setStatus(Status.LOADING);
      offset.current = 0;
      const newItems = await fetchGifs(text, offset.current);
      setItems(newItems.data);
      setStatus(Status.LOADED);
    }
    loadInitialItems();
  }, []);

  return (
    <Box>
      {isLoading && <CircularProgress />}
      {status === Status.LOADED && (
        <InfiniteLoader
          isItemLoaded={(index) => index < items.length}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          minimumBatchSize={15}
          threshold={10}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={150}
              itemCount={itemCount}
              itemSize={200 + GUTTER_SIZE}
              layout="horizontal"
              width={220}
              ref={ref}
              onItemsRendered={onItemsRendered}
            >
              {({ index, style }: ListChildComponentProps) => {
                const image: Image = items[index];
                const updatedStyle = {
                  ...style,
                  width: Number(style.width) - GUTTER_SIZE,
                  overflow: 'hidden'
                }
                if (!image) {
                  return null;
                }
                const src = image.images.fixed_width.url;

                return (
                  <div key={image.id} className="image" style={updatedStyle} onClick={() => {setSelectedImage(src)}}>
                    <img style={{ height: '100%', objectFit: 'cover' }} alt={image.title} src={src} />
                  </div>
                );
              }}
            </List>
          )}
        </InfiniteLoader>
      )}
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
            <img src={selectedImage} />
          </Box>

          <Button onClick={sendComment} variant="contained">Send</Button>
        </Box>
      </Modal>
    </Box>
  );
}
