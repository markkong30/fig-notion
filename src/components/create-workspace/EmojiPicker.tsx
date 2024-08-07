'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import EmojiPickerComp, { EmojiStyle, Theme } from 'emoji-picker-react';

type Props = {
  onSelectEmoji: (emoji: string) => void;
  children: ReactNode;
};
const EmojiPicker: FC<Props> = ({ children, onSelectEmoji }) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!emojiPickerRef.current?.contains(target)) {
        setOpenEmojiPicker(false);
      }
    };

    if (openEmojiPicker) {
      document.addEventListener('click', handleClick);
    } else {
      document.removeEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [openEmojiPicker]);

  return (
    <div ref={emojiPickerRef}>
      <button onClick={() => setOpenEmojiPicker(true)}>{children}</button>
      {openEmojiPicker && (
        <div className='absolute z-10'>
          <EmojiPickerComp
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.DARK}
            autoFocusSearch
            onEmojiClick={e => {
              onSelectEmoji(e.emoji);
              setOpenEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
