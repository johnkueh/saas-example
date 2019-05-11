import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Forms = ({ forms }) => {
  if (forms.length === 0) return <div data-testid="forms-blank">No forms added yet...</div>;

  return (
    <div className="border-top my-3">
      {forms.map(({ id, name }) => (
        <div className="border-bottom py-2" key={id}>
          <Link href={`/form?id=${id}`}>
            <a href={`/form?id=${id}`} key={id}>
              {name}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Forms;

Forms.propTypes = {
  forms: PropTypes.arrayOf(PropTypes.object)
};

Forms.defaultProps = {
  forms: []
};
