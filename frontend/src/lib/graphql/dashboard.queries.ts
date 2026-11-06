import { gql } from '@apollo/client';

export const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboard {
      date

      totalRabbits
      activeRabbits
      breedingMales
      breedingFemales
      youngRabbits

      overdueTasks
      tasksToday
      urgentTasks

      femalesToPalpate
      nestsToInstall
      expectedBirths
      recentBirths
      plannedWeanings
      lowStockItems
      healthActions

      totalCages
      occupiedCages

      birthsThisMonth
      kitsBornThisMonth
      averageLitterSize
      breedingSuccessRate

      monthlyExpenses
      monthlyRevenue

      urgentTaskList {
        id
        title
        description
        dueDate
        priority
        status
        assignedToId
        rabbitId
        sourceType
        sourceId
        completedAt
      }

      palpationList {
        id
        femaleId
        femaleCode
        breedingDate
        palpationStartDate
        palpationEndDate
        nestDate
        expectedBirthStartDate
        expectedBirthEndDate
      }

      nestInstallationList {
        id
        femaleId
        femaleCode
        breedingDate
        palpationStartDate
        palpationEndDate
        nestDate
        expectedBirthStartDate
        expectedBirthEndDate
      }

      expectedBirthList {
        id
        femaleId
        femaleCode
        breedingDate
        expectedBirthStartDate
        expectedBirthEndDate
      }

      recentBirthList {
        id
        breedingId
        femaleId
        femaleCode
        birthDate
        liveBorn
        stillBorn
        totalBorn
      }

      weaningList {
        id
        litterId
        litterCode
        plannedDate
        quantity
        averageWeight
      }

      lowStockList {
        id
        name
        unit
        currentStock
        minimumStock
        autonomyDays
      }

      healthActionList {
        id
        rabbitId
        rabbitCode
        type
        dueDate
        label
        overdue
      }
    }
  }
`;