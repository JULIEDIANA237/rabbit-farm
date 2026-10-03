import { gql } from '@apollo/client';

export const CREATE_RABBIT = gql`
  mutation CreateRabbit($input: CreateRabbitInput!) {
    createRabbit(input: $input) {
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
        id
        rabbitId
        url
        filename
        mimeType
        isPrimary
        createdAt
      }
    }
  }
`;

export const UPDATE_RABBIT = gql`
  mutation UpdateRabbit($input: UpdateRabbitInput!) {
    updateRabbit(input: $input) {
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
        id
        rabbitId
        url
        filename
        mimeType
        isPrimary
        createdAt
      }
    }
  }
`;