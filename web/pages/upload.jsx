import React, { useState } from 'react';
import { Image, Transformation } from 'cloudinary-react';
import { useUpload } from '../lib/use-upload';

const Upload = () => {
  const [image, setImage] = useState(null);
  const { openWidget } = useUpload(publicId => {
    setImage(publicId);
  });

  return (
    <div>
      <button type="button" onClick={openWidget}>
        Upload
      </button>
      <div>
        {image && (
          <Image publicId={image}>
            <Transformation width="400" crop="scale" />
          </Image>
        )}
      </div>
    </div>
  );
};

export default Upload;
