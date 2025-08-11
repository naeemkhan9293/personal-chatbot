'use client';

import { ImageEditorProvider } from './context';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import BoardSizeModal from './BoardSizeModal';
import { ReactNode } from 'react';

interface ImageEditorProps {
  children: ReactNode;
}

const ImageEditor = ({ children }: ImageEditorProps) => {
  return (
    <ImageEditorProvider>
      {children}
      <BoardSizeModal />
    </ImageEditorProvider>
  );
};

ImageEditor.Canvas = Canvas;
ImageEditor.Toolbar = Toolbar;

export default ImageEditor;
