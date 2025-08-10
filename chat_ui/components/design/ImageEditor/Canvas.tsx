'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import * as fabric from 'fabric';
import { useImageEditor } from './context';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const {
    canvas,
    setCanvas,
    activeTool,
    brushSize,
    brushColor,
    fillColor,
    strokeColor,
    strokeWidth,
    zoom,
    setZoom,
    panX,
    setPanX,
    panY,
    setPanY
  } = useImageEditor();

  // Handle window resize to make canvas fullscreen
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle wheel events for zooming
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      setZoom(newZoom);

      if (canvas) {
        canvas.setZoom(newZoom);
        canvas.renderAll();
      }
    } else {
      // Pan
      setPanX(panX - e.deltaX);
      setPanY(panY - e.deltaY);

      if (canvas) {
        canvas.relativePan(new fabric.Point(-e.deltaX, -e.deltaY));
      }
    }
  }, [canvas, zoom, setZoom, panX, setPanX, panY, setPanY]);

  // Handle panning with space + drag or hand tool
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (activeTool === 'hand' || e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [activeTool]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;

      setPanX(panX + deltaX);
      setPanY(panY + deltaY);

      if (canvas) {
        canvas.relativePan(new fabric.Point(deltaX, deltaY));
      }

      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, canvas, panX, setPanX, panY, setPanY]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key for temporary hand tool
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        document.body.style.cursor = 'grab';
      }

      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(1);
        if (canvas) {
          canvas.setZoom(1);
          canvas.renderAll();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas, setZoom]);

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
  }, [canvas, activeTool, brushSize, brushColor, fillColor, strokeColor, strokeWidth]);

  const setupCanvasEvents = useCallback((canvas: fabric.Canvas) => {
    // Handle mouse events for shape creation
    let isDown = false;
    let origX = 0;
    let origY = 0;
    let shape: fabric.Object | null = null;

    const onMouseDown = (o: any) => {
      // Get current tool from the canvas data or use a closure
      const currentTool = (canvas as any).activeTool || activeTool;
      if (currentTool === 'select' || currentTool === 'brush' || currentTool === 'eraser' || currentTool === 'hand') return;

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
  }, [activeTool, fillColor, strokeColor, strokeWidth]);

  // Initialize canvas when dimensions are available
  useEffect(() => {
    if (canvasRef.current && dimensions.width > 0 && dimensions.height > 0) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: 'transparent',
      });

      // Enable viewport transform for panning and zooming
      fabricCanvas.selection = true;

      setCanvas(fabricCanvas);

      // Clean up on unmount
      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [dimensions, setCanvas]);

  // Setup events once when canvas is created
  useEffect(() => {
    if (canvas) {
      const cleanup = setupCanvasEvents(canvas);
      return cleanup;
    }
  }, [canvas, setupCanvasEvents]);

  // Add event listeners for mouse and wheel events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="w-[calc(100vh-250px)] overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        cursor: activeTool === 'hand' ? 'grab' : isPanning ? 'grabbing' : 'default'
      }}
    >
      {/* Infinite grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${panX}px ${panY}px`,
          transform: `scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-10"
        style={{
          display: 'block',
          width: dimensions.width,
          height: dimensions.height
        }}
      />

      {/* Zoom indicator */}
      <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

export default Canvas;
