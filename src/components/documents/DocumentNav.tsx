'use client';

import { FC, useState, useRef, useEffect } from 'react';
import WorkspaceLogoBtn from '../workspace/WorkspaceLogoBtn';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SaveIcon, SquarePen } from 'lucide-react';
import Text from '../global/typography/Text';

type Props = {
  workspaceLogoUrl: string;
  workspaceName: string;
  originalDocumentTitle: string;
  isUpdatingTitle: boolean;
  onUpdateTitle: (title: string) => Promise<void>;
  onUpdateDocument: () => void;
  isUpdatingDocument: boolean;
};

const DocumentNav: FC<Props> = ({
  workspaceLogoUrl,
  workspaceName,
  originalDocumentTitle,
  isUpdatingTitle,
  onUpdateTitle,
  onUpdateDocument,
  isUpdatingDocument,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(originalDocumentTitle);
  const titleContainerRef = useRef<HTMLDivElement | null>(null);
  const inputTitleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        titleContainerRef.current &&
        !titleContainerRef.current.contains(e.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditing && inputTitleRef.current) {
      inputTitleRef.current.focus();
    }
  }, [isEditing]);

  const handleUpdateTitle = async () => {
    await onUpdateTitle(documentTitle);
    setIsEditing(false);
  };

  return (
    <nav className='flex items-center justify-between w-full border-b-purple-50/20 border-b pb-2'>
      <WorkspaceLogoBtn
        logoUrl={workspaceLogoUrl}
        name={workspaceName}
        isButton
      />
      <div
        ref={titleContainerRef}
        className='flex w-fit items-center justify-center gap-2'
        onClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <Input
            type='text'
            value={documentTitle}
            ref={inputTitleRef}
            placeholder='Enter title'
            onChange={e => setDocumentTitle(e.target.value)}
            disabled={isUpdatingTitle}
          />
        ) : (
          <Text className='cursor-pointer'>{documentTitle}</Text>
        )}

        <Button
          variant='ghost'
          size='icon'
          onClick={handleUpdateTitle}
          isLoading={isUpdatingTitle}
          disabled={documentTitle === originalDocumentTitle}
        >
          <SquarePen size={20} />
        </Button>
      </div>

      <Button
        className='flex items-center gap-2'
        isLoading={isUpdatingDocument}
        onClick={onUpdateDocument}
      >
        <SaveIcon size={20} />
        Save
      </Button>
    </nav>
  );
};

export default DocumentNav;
