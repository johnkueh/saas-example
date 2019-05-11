import React from 'react';

const UpdateUser = props => (
  <form>
    <label htmlFor="email">
      Email
      <input
        name="email"
        className="form-control mb-3"
        type="email"
        placeholder="hello@example.com"
      />
    </label>
    <label htmlFor="firstName">
      First name
      <input name="firstName" className="form-control mb-3" type="text" placeholder="John" />
    </label>
    <label htmlFor="lastName">
      Last name
      <input name="lastName" className="form-control mb-3" type="text" placeholder="Doe" />
    </label>
    <div className="mt-4">
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </div>
  </form>
);

export default UpdateUser;
