import { gql } from '@apollo/client';

const RABBIT_PHOTO_FIELDS = `
  id
  rabbitId
  url
  filename
  mimeType
  isPrimary
  createdAt
`;

const RABBIT_FIELDS = `
  id
  code
  sex
  status
  birthDate
  color
  weight
  observations
  breedId
  crossBreedId
  fatherId
  motherId
  birthLitterId

  photos {
    ${RABBIT_PHOTO_FIELDS}
  }
`;

export const GET_RABBITS_PAGINATED = gql`
  query RabbitsPaginated($input: RabbitsPaginationInput) {
    rabbitsPaginated(input: $input) {
      items {
        id
        code
        sex
        status
        birthDate
        color
        weight
        observations
        breedId
        crossBreedId
        fatherId
        motherId

        photos {
          id
          url
          isPrimary
        }
      }

      total
      page
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_RABBIT = gql`
  query Rabbit($id: ID!) {
    rabbit(id: $id) {
      id
      code
      sex
      status
      breedId
      crossBreedId
      fatherId
      motherId
      birthDate
      birthLitterId
      color
      weight
      observations
      createdAt
      updatedAt

      identifications {
        id
        type
        value
      }
    }
  }
`;

export const GET_RABBIT_OPTIONS = gql`
  query RabbitOptions {
    rabbits {
      id
      code
      sex
    }
  }
`;

