'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImageEditor, BoardSize, Unit } from './context';

// Unit conversion to pixels (approximate values for display purposes)
const UNIT_TO_PX: Record<Unit, number> = {
  px: 1,
  cm: 37.8, // 1 cm ≈ 37.8 pixels at 96 DPI
  in: 96,   // 1 inch = 96 pixels at 96 DPI
  ft: 1152  // 1 foot = 12 inches = 1152 pixels at 96 DPI
};

// Common preset sizes for different units
const PRESETS: Record<Unit, Array<{ name: string; width: number; height: number }>> = {
  px: [
    { name: 'Small Canvas', width: 800, height: 600 },
    { name: 'Medium Canvas', width: 1200, height: 900 },
    { name: 'Large Canvas', width: 1920, height: 1080 },
    { name: 'Square Small', width: 800, height: 800 },
    { name: 'Square Large', width: 1200, height: 1200 },
  ],
  cm: [
    { name: 'A4 Portrait', width: 21, height: 29.7 },
    { name: 'A4 Landscape', width: 29.7, height: 21 },
    { name: 'A3 Portrait', width: 29.7, height: 42 },
    { name: 'Letter Portrait', width: 21.6, height: 27.9 },
    { name: 'Square 20x20', width: 20, height: 20 },
  ],
  in: [
    { name: 'Letter Portrait', width: 8.5, height: 11 },
    { name: 'Letter Landscape', width: 11, height: 8.5 },
    { name: 'Legal Portrait', width: 8.5, height: 14 },
    { name: 'Tabloid', width: 11, height: 17 },
    { name: 'Square 8x8', width: 8, height: 8 },
  ],
  ft: [
    { name: 'Small Banner', width: 3, height: 2 },
    { name: 'Medium Banner', width: 6, height: 4 },
    { name: 'Large Banner', width: 10, height: 6 },
    { name: 'Billboard', width: 14, height: 8 },
    { name: 'Square 4x4', width: 4, height: 4 },
  ],
};

export default function BoardSizeModal() {
  const { showBoardSizeModal, setShowBoardSizeModal, setBoardSize } = useImageEditor();
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
  const [unit, setUnit] = useState<Unit>('px');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const handlePresetSelect = (presetName: string) => {
    const preset = PRESETS[unit].find(p => p.name === presetName);
    if (preset) {
      setWidth(preset.width.toString());
      setHeight(preset.height.toString());
      setSelectedPreset(presetName);
    }
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    setSelectedPreset(''); // Clear preset selection when unit changes
    // Reset to default values for the new unit
    const defaultPreset = PRESETS[newUnit][0];
    setWidth(defaultPreset.width.toString());
    setHeight(defaultPreset.height.toString());
  };

  const handleCreate = () => {
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    
    if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
      alert('Please enter valid positive numbers for width and height.');
      return;
    }

    const boardSize: BoardSize = {
      width: widthNum,
      height: heightNum,
      unit
    };

    setBoardSize(boardSize);
    setShowBoardSizeModal(false);
  };

  const convertedWidth = Math.round(parseFloat(width || '0') * UNIT_TO_PX[unit]);
  const convertedHeight = Math.round(parseFloat(height || '0') * UNIT_TO_PX[unit]);

  return (
    <Dialog open={showBoardSizeModal} onOpenChange={setShowBoardSizeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Board</DialogTitle>
          <DialogDescription className="text-white/70">
            Set the size for your new design board. Choose from presets or enter custom dimensions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Unit Selection */}
          <div className="space-y-2">
            <Label htmlFor="unit" className="text-white">Unit</Label>
            <Select value={unit} onValueChange={handleUnitChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">Pixels (px)</SelectItem>
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
                <SelectItem value="ft">Feet (ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preset Selection */}
          <div className="space-y-2">
            <Label className="text-white">Presets</Label>
            <Select value={selectedPreset} onValueChange={handlePresetSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a preset (optional)" />
              </SelectTrigger>
              <SelectContent>
                {PRESETS[unit].map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name} ({preset.width} × {preset.height} {unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-white">Width ({unit})</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  setSelectedPreset(''); // Clear preset when manually editing
                }}
                placeholder="Enter width"
                min="1"
                step="0.1"
                className="glass-card border-0 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-white">Height ({unit})</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setSelectedPreset(''); // Clear preset when manually editing
                }}
                placeholder="Enter height"
                min="1"
                step="0.1"
                className="glass-card border-0 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Preview Info */}
          {width && height && !isNaN(parseFloat(width)) && !isNaN(parseFloat(height)) && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-white/70">
                Canvas size: {width} × {height} {unit}
                {unit !== 'px' && (
                  <span className="block">
                    ≈ {convertedWidth} × {convertedHeight} pixels
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowBoardSizeModal(false)}
              className="glass-card border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Create Board
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
