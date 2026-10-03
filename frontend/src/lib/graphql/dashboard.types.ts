export interface DashboardTask {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: string;
  status: string;
  assignedToId?: string | null;
  rabbitId?: string | null;
  sourceType?: string | null;
  sourceId?: string | null;
  completedAt?: string | null;
}

export interface DashboardBreedingAction {
  id: string;
  femaleId: string;
  femaleCode: string;
  breedingDate: string;

  palpationStartDate?: string | null;
  palpationEndDate?: string | null;

  nestDate?: string | null;

  expectedBirthStartDate?: string | null;
  expectedBirthEndDate?: string | null;
}

export interface DashboardBirth {
  id: string;
  breedingId: string;
  femaleId: string;
  femaleCode: string;

  birthDate: string;

  liveBorn: number;
  stillBorn: number;
  totalBorn: number;
}

export interface DashboardWeaning {
  id: string;
  litterId: string;
  plannedDate: string;
  quantity: number;
  averageWeight?: number | null;
}

export interface DashboardStockAlert {
  id: string;
  name: string;
  unit: string;

  currentStock: number;
  minimumStock?: number | null;
}

export interface Dashboard {
  date: string;

  // Population
  totalRabbits: number;
  activeRabbits: number;
  breedingMales: number;
  breedingFemales: number;
  youngRabbits: number;

  // Actions
  overdueTasks: number;
  tasksToday: number;
  urgentTasks: number;

  femalesToPalpate: number;
  nestsToInstall: number;
  expectedBirths: number;
  recentBirths: number;
  plannedWeanings: number;
  lowStockItems: number;

  // Technical indicators
  birthsThisMonth: number;
  kitsBornThisMonth: number;

  averageLitterSize?: number | null;
  breedingSuccessRate?: number | null;

  // Finance
  monthlyExpenses: number;

  // Details
  urgentTaskList: DashboardTask[];

  palpationList: DashboardBreedingAction[];

  nestInstallationList: DashboardBreedingAction[];

  expectedBirthList: DashboardBirth[];

  recentBirthList: DashboardBirth[];

  weaningList: DashboardWeaning[];

  lowStockList: DashboardStockAlert[];
}

export interface DashboardQueryData {
  dashboard: Dashboard;
}