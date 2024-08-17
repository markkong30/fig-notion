import { useEffect, useRef, useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

type Props = {
  onUpload: (url: string) => void;
  onRemove: () => void;
  setIsRendered?: () => void;
};

const ImageUploader = ({ onUpload, onRemove, setIsRendered }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // uploadcare lib hydration bug (ctxName)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (wrapperRef?.current && setIsRendered) {
      setIsRendered();
    }
  }, [wrapperRef?.current]);

  if (!isClient) {
    return null;
  }

  return (
    <div className='absolute inset-0' ref={wrapperRef}>
      <FileUploaderRegular
        ctxName='image-uploader'
        pubkey={process.env.NEXT_PUBLIC_UPLOAD_CARE_API_KEY}
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList='local, url, camera, dropbox, gdrive'
        classNameUploader='upload-care-config uc-dark'
        onFileUrlChanged={file => onUpload(file.cdnUrl)}
        onFileRemoved={onRemove}
      />
    </div>
  );
};

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;
