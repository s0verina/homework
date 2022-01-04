import * as React from 'react';
import {
  FixedSizeList as List,
  ListChildComponentProps,
  ListOnItemsRenderedProps
} from 'react-window';
import { Image } from '../Grid';

type GifListProps = {
  setSelectedImage: (src: string) => void;
  onItemsRendered: (props: ListOnItemsRenderedProps) => any;
  items: Image[];
  itemCount: number;
}

const GUTTER_SIZE = 4;
const LIST_HEIGHT = 150;
const LIST_WIDTH = 220;
const ITEM_WIDTH = 200;

export const GifList = React.forwardRef<unknown, GifListProps>(
  ({ onItemsRendered,
    setSelectedImage,
    items,
    itemCount }, ref) => {

  return (
    <List
      height={LIST_HEIGHT}
      itemCount={itemCount}
      itemSize={ITEM_WIDTH + GUTTER_SIZE}
      layout="horizontal"
      width={LIST_WIDTH}
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
  );
});
