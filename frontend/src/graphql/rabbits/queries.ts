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
      originalCode
      sex
      status
      purpose
      breedName
      currentCageId
      currentCageCode
      exitDate
      exitCause
      photos {
        ${RABBIT_PHOTO_FIELDS}
      }
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
