'use client';

import { FC, useEffect, useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
type Props = {
  onUpload: (url: string) => void;
  onRemove: () => void;
};

const ImageUploader: FC<Props> = ({ onUpload, onRemove }) => {
  const [isClient, setIsClient] = useState(false);

  // uploadcare lib hydration bug (ctxName)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className='absolute inset-0'>
      <FileUploaderRegular
        ctxName='image-uploader'
        pubkey={process.env.NEXT_PUBLIC_UPLOAD_CARE_API_KEY}
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList='local, url, camera, dropbox, gdrive'
        classNameUploader='upload-care-config uc-dark'
        onFileUploadSuccess={file => onUpload(file.cdnUrl)}
        onFileRemoved={onRemove}
      />
    </div>
  );
};

export default ImageUploader;
