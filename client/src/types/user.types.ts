export interface UserProfile {
  // Personal
  userId: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  occupation: string;
  annualIncome: number;
  
  // Lifestyle
  lifestyle: "Active" | "Moderate" | "Sedentary";
  exerciseFrequency: "Regularly" | "Occasionally" | "Rarely" | "Never";
  exerciseTypes: string[];
  smokingStatus: "Never" | "Former" | "Current";
  alcoholConsumption: "None" | "Light" | "Moderate" | "Heavy";
  
  // Health
  familyHistory: {
    cardiovascular: boolean;
    diabetes: boolean;
    cancer: boolean;
    alzheimers: boolean;
  };
  existingConditions: string[];
  currentMedications: string[];
  
  // Insurance Preferences
  selectedInsuranceTypes: Array<"Health" | "Auto" | "Life" | "Travel" | "Sports">;
  budget: "Low" | "Medium" | "High";
  
  // Additional
  hasDependents: boolean;
  numberOfDependents: number;
  maritalStatus: string;
  drivingExperience: number;
  accidentHistory: number;
  travelFrequency: "None" | "Occasional" | "Frequent";
}

export interface RiskProfile {
  overallRiskScore: number;
  riskCategory: "Low" | "Medium" | "High";
  dnaRisk: number;
  lifestyleRisk: number;
  ageRisk: number;
  familyHistoryRisk: number;
}
