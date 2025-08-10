'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { useImageEditor } from './context';

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    canvas,
    setCanvas,
    activeTool,
    brushSize,
    brushColor,
    fillColor,
    strokeColor,
    strokeWidth
  } = useImageEditor();

  // Update drawing mode when tool changes
  useEffect(() => {
    if (!canvas) return;

    // Store the active tool and properties on the canvas for event handlers
    (canvas as any).activeTool = activeTool;
    (canvas as any).fillColor = fillColor;
    (canvas as any).strokeColor = strokeColor;
    (canvas as any).strokeWidth = strokeWidth;

    if (activeTool === 'brush') {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        (canvas.freeDrawingBrush as any).globalCompositeOperation = 'source-over';
      }
    } else if (activeTool === 'eraser') {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = brushSize;
        // Set eraser mode by using destination-out composite operation
        (canvas.freeDrawingBrush as any).globalCompositeOperation = 'destination-out';
      }
    } else {
      canvas.isDrawingMode = false;
      // Reset composite operation
      if (canvas.freeDrawingBrush) {
        (canvas.freeDrawingBrush as any).globalCompositeOperation = 'source-over';
      }
    }
  }, [canvas, activeTool, brushSize, brushColor]);

  const setupCanvasEvents = useCallback((canvas: fabric.Canvas) => {

    // Handle mouse events for shape creation
    let isDown = false;
    let origX = 0;
    let origY = 0;
    let shape: fabric.Object | null = null;

    const onMouseDown = (o: any) => {
      // Get current tool from the canvas data or use a closure
      const currentTool = (canvas as any).activeTool || activeTool;
      if (currentTool === 'select' || currentTool === 'brush' || currentTool === 'eraser') return;

      isDown = true;
      const pointer = canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;

      if (currentTool === 'rectangle') {
        shape = new fabric.Rect({
          left: origX,
          top: origY,
          width: 0,
          height: 0,
          fill: (canvas as any).fillColor || fillColor,
          stroke: (canvas as any).strokeColor || strokeColor,
          strokeWidth: (canvas as any).strokeWidth || strokeWidth,
          selectable: false,
        });
      } else if (currentTool === 'circle') {
        shape = new fabric.Circle({
          left: origX,
          top: origY,
          radius: 0,
          fill: (canvas as any).fillColor || fillColor,
          stroke: (canvas as any).strokeColor || strokeColor,
          strokeWidth: (canvas as any).strokeWidth || strokeWidth,
          selectable: false,
        });
      }

      if (shape) {
        canvas.add(shape);
      }
    };

    const onMouseMove = (o: any) => {
      if (!isDown || !shape) return;

      const pointer = canvas.getPointer(o.e);
      const currentTool = (canvas as any).activeTool || activeTool;

      if (currentTool === 'rectangle') {
        const rect = shape as fabric.Rect;
        rect.set({
          width: Math.abs(pointer.x - origX),
          height: Math.abs(pointer.y - origY),
        });
        if (pointer.x < origX) {
          rect.set({ left: pointer.x });
        }
        if (pointer.y < origY) {
          rect.set({ top: pointer.y });
        }
      } else if (currentTool === 'circle') {
        const circle = shape as fabric.Circle;
        const radius = Math.sqrt(Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)) / 2;
        circle.set({ radius });
      }

      canvas.renderAll();
    };

    const onMouseUp = () => {
      if (shape) {
        shape.set({ selectable: true });
        shape = null;
      }
      isDown = false;
    };

    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);

    return () => {
      canvas.off('mouse:down', onMouseDown);
      canvas.off('mouse:move', onMouseMove);
      canvas.off('mouse:up', onMouseUp);
    };
  }, []);

  // Initialize canvas only once
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: 'transparent',
      });

      setCanvas(canvas);

      // Clean up on unmount
      return () => {
        canvas.dispose();
      };
    }
  }, [width, height, setCanvas]);

  // Setup events once when canvas is created
  useEffect(() => {
    if (canvas) {
      const cleanup = setupCanvasEvents(canvas);
      return cleanup;
    }
  }, [canvas, setupCanvasEvents]);

  return (
    <div className="relative">
      {/* Glassy background with grid pattern */}
      <div
        className="absolute inset-0 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
        style={{
          width,
          height,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 rounded-lg"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Canvas;
