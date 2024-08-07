import { KeyboardEvent } from 'react';

export const onEnterOrSpace = (event: KeyboardEvent, callback: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    callback();
  }
};
