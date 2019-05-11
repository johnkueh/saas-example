import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { withRouter } from 'next/router';
import Logos from './logos';

const FormLogos = ({
  router: {
    query: { id }
  }
}) => {
  const updateForm = useMutation(UPDATE_FORM);
  const deleteLogo = useMutation(DELETE_LOGO);
  const {
    data: { form = {} }
  } = useQuery(FORM, { variables: { id } });

  if (!form.id) return null;

  return (
    <Logos
      logos={form.logos}
      onUpload={async publicId => {
        await updateForm({
          variables: {
            input: {
              id,
              logos: [publicId]
            }
          }
        });
      }}
      onDelete={async assetId => {
        await deleteLogo({
          variables: { assetId },
          refetchQueries: [
            {
              query: FORM,
              variables: { id }
            }
          ]
        });
      }}
    />
  );
};

export const FORM = gql`
  query($id: String!) {
    form(id: $id) {
      id
      logos {
        assetId
      }
    }
  }
`;

export const UPDATE_FORM = gql`
  mutation($input: UpdateFormInput!) {
    updateForm(input: $input) {
      id
      name
      logos {
        assetId
      }
    }
  }
`;

export const DELETE_LOGO = gql`
  mutation($assetId: String!) {
    deleteLogo(assetId: $assetId) {
      id
      assetId
    }
  }
`;

export default withRouter(FormLogos);

FormLogos.propTypes = {
  router: PropTypes.objectOf(PropTypes.any).isRequired
};
