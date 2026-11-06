import { gql } from '@apollo/client';

export const ADD_RABBIT_PHOTO = gql`
  mutation AddRabbitPhoto(
    $rabbitId: ID!
    $url: String!
    $isPrimary: Boolean
  ) {
    addRabbitPhoto(
      rabbitId: $rabbitId
      url: $url
      isPrimary: $isPrimary
    ) {
      id
      url
      isPrimary
      createdAt
    }
  }
`;

export const SET_PRIMARY_RABBIT_PHOTO = gql`
  mutation SetPrimaryRabbitPhoto(
    $rabbitId: ID!
    $photoId: ID!
  ) {
    setPrimaryRabbitPhoto(
      rabbitId: $rabbitId
      photoId: $photoId
    ) {
      id
      url
      isPrimary
      createdAt
    }
  }
`;

export const DELETE_RABBIT_PHOTO = gql`
  mutation DeleteRabbitPhoto(
    $rabbitId: ID!
    $photoId: ID!
  ) {
    deleteRabbitPhoto(
      rabbitId: $rabbitId
      photoId: $photoId
    ) {
      id
    }
  }
`;