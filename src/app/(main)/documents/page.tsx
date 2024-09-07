'use client';

import DeleteModal from '@/components/documents/DeleteModal';
import AddButton from '@/components/global/AddButton';
import Spinner from '@/components/global/Spinner';
import Heading from '@/components/global/typography/Heading';
import { refetchDocuments } from '@/helpers/document/helpers';
import { useDocuments } from '@/helpers/document/query-helpers';
import { dateConverter } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Documents = () => {
  const { user } = useUser();
  const workspaceId = user?.publicMetadata.currentWorkspaceId as string;
  const router = useRouter();

  const {
    documents,
    isGettingDocuments,
    deleteDocument,
    isDeletingDocument,
    createDocument,
    isCreatingDocument,
  } = useDocuments(workspaceId);

  const onCreateDocument = () => {
    createDocument(undefined, {
      onSuccess: document => {
        router.push(`/documents/${document.id}`);
      },
    });
  };

  const onDeleteDocument = (documentId: string) => {
    deleteDocument(documentId, {
      onSuccess: async () => {
        await refetchDocuments(workspaceId);
        toast.success('Document deleted successfully');
      },
    });
  };

  if (isGettingDocuments) {
    return <Spinner size={50} fullScreen />;
  }

  return (
    <div className='p-16 flex flex-col justify-content items-center min-h-screen w-full md:max-w-4xl mx-auto'>
      <div className='flex w-full justify-between items-center mb-10'>
        <Heading>All Documents</Heading>
        <AddButton
          label='Add document'
          onClick={onCreateDocument}
          isLoading={isCreatingDocument}
        />
      </div>
      <ul className='flex flex-col gap-4 items-center w-full'>
        {documents.length ? (
          documents.map(({ id, title, updatedAt }) => (
            <li
              key={id}
              className='flex items-center justify-between gap-4 rounded-lg p-5 bg-purple-950 bg-opacity-20 shadow-lg hover:bg-opacity-30 transition duration-300 w-full'
            >
              <Link
                href={`/documents/${id}`}
                className='flex flex-1 items-center gap-4'
              >
                <div className='hidden rounded-md bg-purple-700 p-2 sm:block'>
                  <Image
                    src='/icons/document.svg'
                    alt='document'
                    priority
                    width={40}
                    height={40}
                  />
                </div>
                <div className='space-y-1'>
                  <p className='line-clamp-1 text-lg text-purple-100'>
                    {title}
                  </p>
                  <p className='text-sm font-light text-primary-foreground'>
                    Updated about {dateConverter(updatedAt.toISOString())}
                  </p>
                </div>
              </Link>
              <DeleteModal
                isLoading={isDeletingDocument}
                onDeleteDocument={() => onDeleteDocument(id)}
              />
            </li>
          ))
        ) : (
          <div className='pt-20'>
            <Image
              src='/icons/empty-result.svg'
              alt='document'
              priority
              width={260}
              height={260}
            />
            <Heading className='text-center mt-8'>No documents found</Heading>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Documents;
