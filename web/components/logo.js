import React from 'react';
import { PropTypes } from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

const Logo = ({ width, height, assetId, onDelete }) => (
  <div className="logo mr-2 mb-2">
    <Image width={width} height={height} publicId={assetId}>
      <Transformation width={width * 2} height={height * 2} crop="fill" />
    </Image>
    <button onClick={onDelete} type="button">
      Delete
    </button>
    <style jsx>
      {`
        .logo {
          position: relative;
        }
        .logo:hover button {
          opacity: 1;
          transition: all 0.3s ease;
        }
        button {
          opacity: 0;
          top: 5px;
          right: 5px;
          font-size: 10px;
          background: white;
          position: absolute;
          transition: all 0.3s ease;
        }
      `}
    </style>
  </div>
);

export default Logo;

Logo.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  assetId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};
