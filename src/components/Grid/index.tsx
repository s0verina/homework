import * as React from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import { Box, CircularProgress } from '@mui/material';
import { SendCommentModal } from '../SendCommentModal';
import { GifList } from '../GifList';
import { fetchGifs } from '../../actions/fetchGifs';

type GridProps = {
  text: string;
  url: string;
}

type ImagesVariants = 'fixed_width';
type ImagesInfo = {
  url: string;
};

export type Image = {
  id: string;
  images: Record<ImagesVariants, ImagesInfo>;
  title: string;
}

enum Status {
  LOADING = 'loading',
  LOADED = 'loaded'
}

export const Grid: React.FC<GridProps> = ({ text, url }) => {
  const [status, setStatus] = React.useState<Status>(Status.LOADED);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const isLoading = status === Status.LOADING;
  const offset = React.useRef<number>();
  const [items, setItems] = React.useState<Image[]>([]);
  const itemCount = items.length > 0 ? items.length + 1 : items.length;
  const loadMoreItems = React.useCallback(async function() {
    const newItems = await fetchGifs(text, offset?.current + 1);
    offset.current = newItems.pagination.offset;
    setItems(items.concat(newItems.data));
  }, [items, offset.current, fetchGifs]);
  const onModalClose = React.useCallback(() => setSelectedImage(''), []);

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
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '220px',
        height: '150px'
        }}
      >
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
              <GifList
                ref={ref}
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                setSelectedImage={setSelectedImage}
                items={items}
              />
            )}
          </InfiniteLoader>
        )}
      </Box>
      <SendCommentModal
        text={text}
        url={url}
        selectedImage={selectedImage}
        onModalClose={onModalClose}
      />
    </>
  );
}
