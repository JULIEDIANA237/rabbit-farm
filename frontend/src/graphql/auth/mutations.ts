import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      userId
      email
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      userId
      email
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      userId
      email
      firstName
      lastName
      role
      farm {
        id
        name
        location
        description
        inbreedingPolicy
      }
    }
  }
`;

export interface Me {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  farm: {
    id: string;
    name: string;
    location?: string | null;
    description?: string | null;
    inbreedingPolicy: 'WARN' | 'BLOCK';
  };
}

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;
