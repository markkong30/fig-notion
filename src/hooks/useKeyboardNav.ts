import { KeyboardEvent, RefObject, useState } from 'react';

export const useKeyBoardNav = () => {
  const [isKeyboardActivated, setIsKeyboardActivated] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number>(0);

  const handleKeyboard = (
    e: KeyboardEvent<HTMLElement>,
    refs: Array<HTMLElement> | RefObject<HTMLElement>[],
    index: number,
  ) => {
    setIsKeyboardActivated(true);

    let nextIndex;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();

        nextIndex = (index + 1) % refs.length;
        setFocusIndex(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();

        nextIndex = (index + refs.length - 1) % refs.length;
        setFocusIndex(nextIndex);
        break;
      case 'Home':
        e.preventDefault();

        setFocusIndex(0);
        break;
      case 'End':
        e.preventDefault();

        setFocusIndex(refs.length - 1);
        break;
    }
  };

  return { focusIndex, handleKeyboard, isKeyboardActivated };
};
