import { UploadCtxProvider } from '@uploadcare/react-uploader';
import { KeyboardEvent } from 'react';

export const onEnterOrSpace = (event: KeyboardEvent, callback: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    callback();
  }
};

export const openImageUploader = () => {
  if (typeof window === 'undefined') return;

  const uploaderCtx = document.querySelector(
    'uc-upload-ctx-provider',
  ) as InstanceType<UploadCtxProvider> | null;

  const api = uploaderCtx?.getAPI();

  api?.initFlow();
};
