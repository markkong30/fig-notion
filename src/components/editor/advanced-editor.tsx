'use client';

import React, { useState } from 'react';
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from 'novel';
import { ImageResizer, handleCommandNavigation } from 'novel/extensions';
import { defaultExtensions } from './extensions';
import { NodeSelector } from './selectors/node-selector';
import { LinkSelector } from './selectors/link-selector';
import { ColorSelector } from './selectors/color-selector';

import { TextButtons } from './selectors/text-buttons';
import { slashCommand, suggestionItems } from './slash-command';
import { handleImageDrop, handleImagePaste } from 'novel/plugins';
import { uploadFn } from './image-upload';
import { Separator } from '../ui/separator';

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}
const Editor = ({ initialValue, onChange }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = suggestionItems.map(item => {
    if (item.title === 'Add') {
      return {
        ...item,
        // TBD Add image feature
        //@ts-expect-error - ignore
        command: async ({ editor, range }) => {
          setIsLoading(true);

          editor.chain().focus().deleteRange(range).run();

          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertContent({
                    type: 'image',
                    attrs: {
                      src: 'https://ucarecdn.com/229ea38e-3a54-473f-9a9c-11b3bfe2e364/-/preview/800x800/',
                      alt: null,
                      title: null,
                      width: 257,
                      height: 257,
                    },
                  })
                  .run(),
              );
            }, 2000);
          });

          setIsLoading(false);
        },
      };
    }
    return item;
  });

  return (
    <>
      <EditorRoot>
        <EditorContent
          className='border px-8 py-4 rounded-xl overflow-scroll'
          {...(initialValue && { initialContent: initialValue })}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onCreate={({ editor }) => onChange(editor.getJSON())}
          onUpdate={({ editor }) => {
            onChange(editor.getJSON());
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
            <EditorCommandEmpty className='px-2 text-muted-foreground'>
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestions.map(item => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={val => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: 'top',
            }}
            className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
          >
            <Separator orientation='vertical' />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation='vertical' />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation='vertical' />
            <TextButtons />
            <Separator orientation='vertical' />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </>
  );
};

export default Editor;
