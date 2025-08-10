'use client';

import { useImageEditor, Tool } from './context';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Brush,
  Eraser,
  Image,
  Download,
  Upload,
  Trash2,
  Copy,
  Layers,
  Hand,
  Move
} from 'lucide-react';
import React, { useRef, useState } from 'react';

const Toolbar = () => {
  const {
    canvas,
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
    toolbarPosition,
    setToolbarPosition
  } = useImageEditor();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 size={18} />, label: 'Select' },
    { id: 'hand', icon: <Hand size={18} />, label: 'Hand' },
    { id: 'rectangle', icon: <Square size={18} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={18} />, label: 'Circle' },
    { id: 'text', icon: <Type size={18} />, label: 'Text' },
    { id: 'brush', icon: <Brush size={18} />, label: 'Brush' },
    { id: 'eraser', icon: <Eraser size={18} />, label: 'Eraser' },
    { id: 'image', icon: <Image size={18} />, label: 'Image' },
  ];

  const handleToolSelect = (tool: Tool) => {
    setActiveTool(tool);

    if (tool === 'text' && canvas) {
      const text = new fabric.IText('Click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: fillColor,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        fabric.FabricImage.fromURL(imgUrl).then((img: any) => {
          img.set({
            left: 50,
            top: 50,
            scaleX: 0.5,
            scaleY: 0.5,
          });
          canvas.add(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });
      const link = document.createElement('a');
      link.download = 'design.png';
      link.href = dataURL;
      link.click();
    }
  };

  const handleClear = () => {
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
    }
  };

  const handleCopy = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // Simple duplication by creating a new object with same properties
        const objData = activeObject.toObject();
        const cloned = new (activeObject.constructor as any)(objData);
        cloned.set({
          left: (activeObject.left || 0) + 10,
          top: (activeObject.top || 0) + 10,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      }
    }
  };

  const deleteSelected = () => {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };

  // Handle toolbar dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - toolbarPosition.x,
        y: e.clientY - toolbarPosition.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setToolbarPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <TooltipProvider>
      <div
        className="fixed z-50 flex flex-wrap items-center gap-2 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg cursor-move select-none"
        style={{
          left: toolbarPosition.x,
          top: toolbarPosition.y,
          maxWidth: '90vw'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="drag-handle flex items-center justify-center w-6 h-6 text-white/50 hover:text-white/80 cursor-grab active:cursor-grabbing">
              <Move size={14} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Drag to move toolbar</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-8 bg-white/20" />

        {/* Tool Selection */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1" onMouseDown={(e) => e.stopPropagation()}>
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === tool.id}
                  onPressedChange={() => handleToolSelect(tool.id)}
                  className="h-10 w-10 data-[state=on]:bg-white/20 data-[state=on]:text-white hover:bg-white/10"
                  aria-label={tool.label}
                >
                  {tool.icon}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

      <Separator orientation="vertical" className="h-8 bg-white/20" />

      {/* Color Controls */}
      <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-16 p-1 bg-white/5 border-white/20 hover:bg-white/10"
                >
                  <div
                    className="w-full h-full rounded border border-white/30"
                    style={{ backgroundColor: fillColor }}
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fill Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-64 bg-black/80 backdrop-blur-md border-white/20">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Fill Color</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-full h-10 rounded border-0"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-16 p-1 bg-white/5 border-white/20 hover:bg-white/10"
                >
                  <div
                    className="w-full h-full rounded border-2"
                    style={{ borderColor: strokeColor, backgroundColor: 'transparent' }}
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stroke Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-64 bg-black/80 backdrop-blur-md border-white/20">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Stroke Color</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-full h-10 rounded border-0"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-8 bg-white/20" />

      {/* Size Controls */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <>
          <div className="flex items-center gap-2 min-w-[120px]" onMouseDown={(e) => e.stopPropagation()}>
            <Brush size={16} className="text-white/70" />
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              max={50}
              min={1}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-white/70 w-6">{brushSize}</span>
          </div>

          {activeTool === 'brush' && (
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-16 p-1 bg-white/5 border-white/20 hover:bg-white/10"
                    >
                      <div
                        className="w-full h-full rounded border border-white/30"
                        style={{ backgroundColor: brushColor }}
                      />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Brush Color</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-64 bg-black/80 backdrop-blur-md border-white/20">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Brush Color</label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-full h-10 rounded border-0"
                  />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </>
      )}

      {(activeTool === 'rectangle' || activeTool === 'circle') && (
        <div className="flex items-center gap-2 min-w-[120px]" onMouseDown={(e) => e.stopPropagation()}>
          <div className="w-4 h-0.5 bg-white/70 rounded" />
          <Slider
            value={[strokeWidth]}
            onValueChange={(value) => setStrokeWidth(value[0])}
            max={20}
            min={0}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-white/70 w-6">{strokeWidth}</span>
        </div>
      )}

      <Separator orientation="vertical" className="h-8 bg-white/20" />

      {/* Action Buttons */}
      <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Upload size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload Image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Download size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download Design</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Copy size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate Selected</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelected}
              className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Trash2 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Selected</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-10 w-10 p-0 hover:bg-white/10 text-red-400 hover:text-red-300"
            >
              <Layers size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear Canvas</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default Toolbar;
