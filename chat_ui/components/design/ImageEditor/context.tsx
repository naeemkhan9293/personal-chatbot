'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import * as fabric from 'fabric';

export type Tool = 'select' | 'rectangle' | 'circle' | 'text' | 'brush' | 'eraser' | 'image' | 'hand' | 'selection';

export type Unit = 'px' | 'cm' | 'in' | 'ft';

export interface BoardSize {
  width: number;
  height: number;
  unit: Unit;
}

// Define the shape of the context state
interface ImageEditorContextType {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  // Canvas viewport state
  zoom: number;
  setZoom: (zoom: number) => void;
  panX: number;
  setPanX: (x: number) => void;
  panY: number;
  setPanY: (y: number) => void;
  // Toolbar position
  toolbarPosition: { x: number; y: number };
  setToolbarPosition: (position: { x: number; y: number }) => void;
  // Board size state
  boardSize: BoardSize | null;
  setBoardSize: (size: BoardSize | null) => void;
  showBoardSizeModal: boolean;
  setShowBoardSizeModal: (show: boolean) => void;
  // Helper function to show board size modal
  showBoardSizeSettings: () => void;
}

// Create the context with a default value
const ImageEditorContext = createContext<ImageEditorContextType | null>(null);

// Create a provider component
interface ImageEditorProviderProps {
  children: ReactNode;
}

export const ImageEditorProvider = ({ children }: ImageEditorProviderProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#ff0000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas viewport state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Toolbar position
  const [toolbarPosition, setToolbarPosition] = useState({ x: 500, y: 60 });

  // Board size state
  const [boardSize, setBoardSize] = useState<BoardSize | null>(null);
  const [showBoardSizeModal, setShowBoardSizeModal] = useState(true); // Show modal by default when no board size is set

  // Custom setBoardSize that also handles modal visibility
  const handleSetBoardSize = (size: BoardSize | null) => {
    setBoardSize(size);
    if (size) {
      setShowBoardSizeModal(false); // Hide modal when board size is set
    }
  };

  // Helper function to show board size settings
  const showBoardSizeSettings = () => {
    setShowBoardSizeModal(true);
  };

  return (
    <ImageEditorContext.Provider value={{
      canvas,
      setCanvas,
      activeTool,
      setActiveTool,
      brushSize,
      setBrushSize,
      brushColor,
      setBrushColor,
      fillColor,
      setFillColor,
      strokeColor,
      setStrokeColor,
      strokeWidth,
      setStrokeWidth,
      isDrawing,
      setIsDrawing,
      zoom,
      setZoom,
      panX,
      setPanX,
      panY,
      setPanY,
      toolbarPosition,
      setToolbarPosition,
      boardSize,
      setBoardSize: handleSetBoardSize,
      showBoardSizeModal,
      setShowBoardSizeModal,
      showBoardSizeSettings
    }}>
      {children}
    </ImageEditorContext.Provider>
  );
};

// Create a custom hook to use the context
export const useImageEditor = () => {
  const context = useContext(ImageEditorContext);
  if (!context) {
    throw new Error('useImageEditor must be used within an ImageEditorProvider');
  }
  return context;
};
