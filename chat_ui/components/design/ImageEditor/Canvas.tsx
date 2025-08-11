'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import * as fabric from 'fabric';
import { useImageEditor } from './context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getToolCursor, KEYBOARD_SHORTCUTS } from './cursors';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [selectionRect, setSelectionRect] = useState<fabric.Rect | null>(null);

  const {
    canvas,
    setCanvas,
    activeTool,
    setActiveTool,
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
    setPanY,
    boardSize
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

  // Handle wheel events for zooming and panning
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!canvas) return;

    if (e.ctrlKey || e.metaKey) {
      // Zoom towards the mouse pointer
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.01, Math.min(100, canvas.getZoom() * delta));
      const point = new fabric.Point(e.offsetX, e.offsetY);
      canvas.zoomToPoint(point, newZoom);
    } else {
      // Pan with the wheel
      const delta = new fabric.Point(-e.deltaX, -e.deltaY);
      canvas.relativePan(delta);
    }

    // Sync state with canvas viewport
    const vpt = canvas.viewportTransform;
    if (vpt) {
      setZoom(vpt[0]);
      setPanX(vpt[4]);
      setPanY(vpt[5]);
    }
    canvas.renderAll();
  }, [canvas, setZoom, setPanX, setPanY]);

  // Handle panning with space + drag or hand tool
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (activeTool === 'hand' || e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [activeTool]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning && canvas) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;

      canvas.relativePan(new fabric.Point(deltaX, deltaY));
      
      // Sync state with canvas viewport
      const vpt = canvas.viewportTransform;
      if (vpt) {
        setPanX(vpt[4]);
        setPanY(vpt[5]);
      }

      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, canvas, setPanX, setPanY]);

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

      // Tool shortcuts (Ctrl + Key)
      if ((e.ctrlKey || e.metaKey) && KEYBOARD_SHORTCUTS[e.code]) {
        e.preventDefault();
        const tool = KEYBOARD_SHORTCUTS[e.code];
        setActiveTool(tool);
        return;
      }

      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        if (canvas) {
          // Reset zoom to 100% and center the view
          const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
          canvas.zoomToPoint(center, 1);
          const vpt = canvas.viewportTransform;
          if (vpt) {
            setZoom(vpt[0]);
            setPanX(vpt[4]);
            setPanY(vpt[5]);
          }
          canvas.renderAll();
        }
      }

      // Zoom In (Ctrl/Cmd + Plus/Equal)
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        if (canvas) {
          const newZoom = Math.min(100, canvas.getZoom() * 1.25);
          const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
          canvas.zoomToPoint(center, newZoom);
          const vpt = canvas.viewportTransform;
          if (vpt) {
            setZoom(vpt[0]);
            setPanX(vpt[4]);
            setPanY(vpt[5]);
          }
          canvas.renderAll();
        }
      }

      // Zoom Out (Ctrl/Cmd + Minus)
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        if (canvas) {
          const newZoom = Math.max(0.01, canvas.getZoom() * 0.8);
          const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
          canvas.zoomToPoint(center, newZoom);
          const vpt = canvas.viewportTransform;
          if (vpt) {
            setZoom(vpt[0]);
            setPanX(vpt[4]);
            setPanY(vpt[5]);
          }
          canvas.renderAll();
        }
      }

      // Fit to Screen (Ctrl/Cmd + 1)
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        if (canvas) {
          // This can be customized to fit objects, for now, it resets to 100%
          const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
          canvas.zoomToPoint(center, 1);
          const vpt = canvas.viewportTransform;
          if (vpt) {
            setZoom(vpt[0]);
            setPanX(vpt[4]);
            setPanY(vpt[5]);
          }
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
    } else if (activeTool === 'selection') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'crosshair';
    }
    else if (activeTool === 'eraser') {
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

      if (currentTool === 'selection') {
        canvas.selection = false;
        const rect = new fabric.Rect({
          left: origX,
          top: origY,
          width: 0,
          height: 0,
          fill: 'rgba(0,0,0,0.3)',
          stroke: 'black',
          strokeDashArray: [5, 5],
          selectable: true,
        });
        setSelectionRect(rect);
        canvas.add(rect);
        return; // Prevent creating other shapes
      }

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
      if (!isDown) return;

      const pointer = canvas.getPointer(o.e);
      const currentTool = (canvas as any).activeTool || activeTool;

      if (currentTool === 'selection' && selectionRect) {
        const rect = selectionRect;
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
      } else if (currentTool === 'rectangle' && shape) {
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
      isDown = false;
      const currentTool = (canvas as any).activeTool || activeTool;

      if (currentTool === 'selection' && selectionRect) {
        cropToSelection(selectionRect);
        canvas.remove(selectionRect);
        setSelectionRect(null);
        canvas.selection = true; // Re-enable selection
      }

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
  }, [activeTool, fillColor, strokeColor, strokeWidth, selectionRect]);

  const cropToSelection = (rect: fabric.Rect) => {
    if (!canvas || !rect.width || !rect.height) return;

    const cropped = new Image();
    cropped.src = canvas.toDataURL({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      multiplier: 1,
    });

    cropped.onload = () => {
      canvas.clear();
      const image = new fabric.FabricImage(cropped);
      canvas.setWidth(rect.width || 0);
      canvas.setHeight(rect.height || 0);
      canvas.add(image);
      canvas.renderAll();
    };
  };

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

  // Update canvas cursor when tool changes
  useEffect(() => {
    if (canvas) {
      const cursor = getToolCursor(activeTool, isPanning);

      // Override Fabric.js cursor settings
      canvas.defaultCursor = cursor;
      canvas.hoverCursor = cursor;
      canvas.moveCursor = cursor;
      canvas.freeDrawingCursor = cursor;

      // Also set cursor on the canvas element directly
      const canvasElement = canvas.getElement();
      if (canvasElement) {
        canvasElement.style.cursor = cursor;
      }

      // Set cursor on container as well
      if (containerRef.current) {
        containerRef.current.style.cursor = cursor;
      }

      canvas.renderAll();
    }
  }, [canvas, activeTool, isPanning]);

  // Create board rectangle when boardSize is set
  useEffect(() => {
    if (canvas && boardSize) {
      // Convert board size to pixels
      const UNIT_TO_PX: Record<string, number> = {
        px: 1,
        cm: 37.8, // 1 cm ≈ 37.8 pixels at 96 DPI
        in: 96,   // 1 inch = 96 pixels at 96 DPI
        ft: 1152  // 1 foot = 12 inches = 1152 pixels at 96 DPI
      };

      const boardWidthPx = boardSize.width * UNIT_TO_PX[boardSize.unit];
      const boardHeightPx = boardSize.height * UNIT_TO_PX[boardSize.unit];

      // Clear existing board if any
      const existingBoard = canvas.getObjects().find(obj => (obj as any).isBoard);
      if (existingBoard) {
        canvas.remove(existingBoard);
      }

      // Create board rectangle centered on canvas
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      const boardRect = new fabric.Rect({
        left: centerX - boardWidthPx / 2,
        top: centerY - boardHeightPx / 2,
        width: boardWidthPx,
        height: boardHeightPx,
        fill: 'white',
        stroke: '#e5e7eb',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      // Mark as board for identification
      (boardRect as any).isBoard = true;

      // Add board to canvas (send to back)
      canvas.add(boardRect);
      // Move board to the back (index 0)
      canvas.moveObjectTo(boardRect, 0);
      canvas.renderAll();
    }
  }, [canvas, boardSize, dimensions]);

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

  const getCursor = () => {
    return getToolCursor(activeTool, isPanning);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        cursor: getCursor()
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
          backgroundSize: `20px 20px`,
          backgroundPosition: `${panX}px ${panY}px`,
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

      {/* Zoom indicator with interactive slider */}
      <div className="fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <button className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm hover:bg-black/60 transition-colors cursor-pointer">
              {Math.round(zoom * 100)}%
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black/80 backdrop-blur-md border-white/20" side="top">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Zoom Level</label>
                <span className="text-sm text-white/70">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="text-xs text-white/50 text-center">
                <p>Ctrl + 0: Reset • Ctrl + +: Zoom In • Ctrl + -: Zoom Out</p>
              </div>
              <Slider
                value={[zoom * 100]}
                onValueChange={(value) => {
                  const newZoom = value[0] / 100;
                  setZoom(newZoom);
                  if (canvas) {
                    canvas.setZoom(newZoom);
                    canvas.renderAll();
                  }
                }}
                max={10000}
                min={1}
                step={1}
                className="flex-1"
              />
              {/* Zoom Presets */}
              <div className="space-y-3">
                <div className="flex gap-1 flex-wrap justify-center">
                  {[25, 50, 75, 100, 125, 150, 200, 400, 800, 1600].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => {
                        const newZoom = percent / 100;
                        setZoom(newZoom);
                        if (canvas) {
                          canvas.setZoom(newZoom);
                          canvas.renderAll();
                        }
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        Math.round(zoom * 100) === percent
                          ? 'bg-white/30 text-white font-medium'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>

                {/* Range Labels */}
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>1%</span>
                  <span className="text-white/70">Professional Zoom Range</span>
                  <span>10000%</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Canvas;
