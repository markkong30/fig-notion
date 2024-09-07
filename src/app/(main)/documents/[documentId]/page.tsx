'use client';

import Canvas from '@/components/diagram/Canvas';
import DocumentNav from '@/components/documents/DocumentNav';
import Editor from '@/components/editor/advanced-editor';
import Spinner from '@/components/global/Spinner';
import { useDocument } from '@/helpers/document/query-helpers';
import { useGetWorkspace } from '@/helpers/workspace/query-helpers';
import { Canvas as CanvasType } from '@/lib/queries.type';
import { useUser } from '@clerk/nextjs';
import { JSONContent } from 'novel';
import { useState } from 'react';

type Props = {
  params: {
    documentId: string;
  };
};

const Document = ({ params }: Props) => {
  const { documentId } = params;
  const { user } = useUser();
  const workspaceId = user?.publicMetadata.currentWorkspaceId as string;

  const [editorState, setEditorState] = useState<JSONContent | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasType['elements']>(
    [],
  );
  const [canvasState, setCanvasState] = useState<CanvasType['appState']>();
  // console.log(canvasElements);
  // console.log(editorState);

  const { workspace, isGettingWorkspace } = useGetWorkspace(workspaceId);
  const {
    document,
    isGettingDocument,
    updateDocumentTitle,
    isUpdatingDocumentTitle,
    savedEditorValue,
    updateDocument,
    isUpdatingDocument,
    initialCanvasData,
  } = useDocument(documentId);

  const onUpdateDocumentTitle = async (title: string) => {
    await updateDocumentTitle({ documentId, title });
  };

  const onUpdateDocument = async () => {
    console.log(editorState);
    const state = JSON.parse(
      JSON.stringify({
        documentId,
        editorState,
        canvasState: { elements: canvasElements, appState: canvasState },
      }),
    );
    await updateDocument(state);
  };

  if (isGettingWorkspace || isGettingDocument) {
    return <Spinner size={50} fullScreen />;
  }

  if (!workspace || !document) {
    return <div>Document not found</div>;
  }

  return (
    <main className='flex flex-col px-6 py-4 h-full'>
      <DocumentNav
        workspaceLogoUrl={workspace.logoUrl}
        workspaceName={workspace.name}
        originalDocumentTitle={document.title}
        onUpdateTitle={onUpdateDocumentTitle}
        isUpdatingTitle={isUpdatingDocumentTitle}
        onUpdateDocument={onUpdateDocument}
        isUpdatingDocument={isUpdatingDocument}
      />
      <div className='grid grid-cols-1 lg:grid-cols-2 h-full max-h-[95%] p-4 gap-4'>
        <Editor onChange={setEditorState} initialValue={savedEditorValue} />
        <Canvas
          initialCanvasData={initialCanvasData}
          setCanvasElements={setCanvasElements}
          setCanvasState={setCanvasState}
        />
        {/* <Canvas initialCanvasData={initialCanvasData} /> */}
      </div>
    </main>
  );
};

export default Document;
