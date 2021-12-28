import * as React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Box, CircularProgress } from '@mui/material';
import { fetchGifs } from '../../actions/fetchGifs';

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

export const Grid: React.FC<GridProps> = ({ text }) => {
  const [status, setStatus] = React.useState<Status>(Status.LOADED);
  const isLoading = status === Status.LOADING;
  const offset = React.useRef<number>();
  const [items, setItems] = React.useState<Image[]>([]);
  const itemCount = items.length > 0 ? items.length + 1 : items.length;
  const loadMoreItems = async function() {
    const newItems = await fetchGifs(text, offset?.current + 1);
    offset.current = newItems.pagination.offset;
    setItems(items.concat(newItems.data));
  };

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
                  <div key={image.id} className="image" style={updatedStyle}>
                    <img style={{ height: '100%', objectFit: 'cover' }} alt={image.title} src={src} />
                  </div>
                );
              }}
            </List>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
}
