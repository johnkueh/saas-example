import React from 'react';
import PropTypes from 'prop-types';
import Logo from './logo';
import { useUpload } from '../lib/use-upload';

const Logos = ({ logos, onUpload, onDelete }) => {
  const { openWidget } = useUpload();
  return (
    <div>
      <button
        className="px-0 btn btn-link"
        type="button"
        onClick={() => {
          openWidget({
            onUpload
          });
        }}
      >
        Upload logos
      </button>
      <div className="d-flex flex-wrap">
        {logos.map(({ assetId }) => (
          <Logo
            key={assetId}
            assetId={assetId}
            width="300"
            height="225"
            onDelete={() => onDelete(assetId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Logos;

Logos.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.object),
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

Logos.defaultProps = {
  logos: []
};
