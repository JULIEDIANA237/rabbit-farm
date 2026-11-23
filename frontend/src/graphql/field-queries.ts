import { gql } from '@apollo/client';

/** Requêtes des écrans du terrain, partagées avec le préchargement hors ligne. */

export const FARM_STRUCTURE = gql`
  query FarmStructure {
    sections { id name type description cageCount }
    cages { id code type capacity rabbitCount status sectionId }
  }
`;

export const TASKS_QUERY = gql`
  query Tasks($status: TaskStatus, $openOnly: Boolean) {
    tasks(status: $status, openOnly: $openOnly) {
      id
      title
      description
      dueDate
      priority
      status
      rabbitId
      rabbitCode
      sourceType
      sourceId
      automationKey
      completedAt
    }
  }
`;

export const OPEN_TASKS_QUERY = gql`
  query HeaderTasks {
    tasks(openOnly: true) {
      id
      dueDate
    }
  }
`;
