'use client';

import ImageEditor from '../../../../components/design/ImageEditor';

export default function DesignPage() {
  return (
    <ImageEditor>
      <ImageEditor.Canvas />
      <ImageEditor.Toolbar />
    </ImageEditor>
  );
}
