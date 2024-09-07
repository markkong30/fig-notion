import { FC } from 'react';
import { Canvas as CanvasType } from '@/lib/queries.type';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import omit from 'lodash/omit';

type Props = {
  initialCanvasData: ExcalidrawInitialDataState;
  setCanvasElements: (elements: readonly ExcalidrawElement[]) => void;
  setCanvasState: (state: CanvasType['appState']) => void;
};

const Canvas: FC<Props> = ({
  initialCanvasData,
  setCanvasElements,
  setCanvasState,
}) => {
  return (
    <div className='h-full'>
      <Excalidraw
        theme='dark'
        initialData={{
          elements: initialCanvasData.elements,
          appState: omit(initialCanvasData.appState, 'collaborators'),
        }}
        onChange={(excalidrawElements, appState) => {
          setCanvasElements(excalidrawElements);
          setCanvasState(appState);
        }}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
            toggleTheme: false,
          },
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.ToolbarHint />
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.MenuItemHelp />
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
};

export default Canvas;
