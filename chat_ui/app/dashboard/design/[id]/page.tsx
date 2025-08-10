'use client';

import ImageEditor from '../../../../components/design/ImageEditor';

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Design Studio</h1>
          <p className="text-white/70">Create and edit your designs with our advanced image editor</p>
        </div>

        <ImageEditor>
          <ImageEditor.Toolbar />
          <div className="flex justify-center">
            <ImageEditor.Canvas width={1000} height={700} />
          </div>
        </ImageEditor>
      </div>
    </div>
  );
}
