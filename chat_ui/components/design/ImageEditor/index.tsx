'use client';

import { ImageEditorProvider } from './context';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import { ReactNode } from 'react';

interface ImageEditorProps {
  children: ReactNode;
}

const ImageEditor = ({ children }: ImageEditorProps) => {
  return <ImageEditorProvider>{children}</ImageEditorProvider>;
};

ImageEditor.Canvas = Canvas;
ImageEditor.Toolbar = Toolbar;

export default ImageEditor;
