'use client';

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
  FC,
} from 'react';
import debounce from 'lodash/debounce';
import { MediaInterface } from './types';

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1536,
};

const MediaStore = createContext<MediaInterface>({
  isMobile: false,
  isTablet: false,
  isNative: false,
  isDesktop: false,
  isWide: false,
  width: 0,
});

export const useMedia = (): MediaInterface =>
  useContext<MediaInterface>(MediaStore);

interface MediaProps {
  children: ReactNode;
}

const { Provider } = MediaStore;

export const MediaProvider: FC<MediaProps> = ({ children }: MediaProps) => {
  const [width, setWidth] = useState<number>(0);

  const handleWindowWidthChange = useCallback(
    debounce(() => {
      setWidth(window.innerWidth);
    }, 100),
    [],
  );

  useEffect(() => {
    handleWindowWidthChange();
    window.addEventListener('resize', handleWindowWidthChange);

    return () => {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  }, []);

  const media = {
    width,
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isNative: width < breakpoints.tablet,
    isDesktop: width >= breakpoints.tablet && width < breakpoints.desktop,
    isWide: width >= breakpoints.desktop,
  };

  return <Provider value={media}>{children}</Provider>;
};
