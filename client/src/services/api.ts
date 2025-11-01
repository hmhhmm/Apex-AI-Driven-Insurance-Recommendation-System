// Pure client-side API - Triple AI agents run in browser (no server)
import { runTripleAIAnalysis } from './agents/tripleAI'
import type { UserProfile } from './agents/cognitiveAgent'
import type { DNAData } from './agents/dnaAgent'
import type { 
  Claim, 
  ClaimFormData, 
  UploadedFile, 
  OCRResult, 
  DetectedVehicle, 
  DamageArea,
  AIProcessingStatus,
  RepairShop
} from '../types/claims'

export async function analyzeProfile(userProfile: UserProfile, dnaData: DNAData) {
  // Run triple AI agents in parallel (DNA + Cognitive + Quantum)
  const results = await runTripleAIAnalysis(userProfile, dnaData)
  return results
}

export type { UserProfile, DNAData }

// ==================== CLAIMS API ====================

// Simulated delay for realistic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Upload file (simulated)
export const uploadFile = async (file: File, category: 'document' | 'photo' | 'video'): Promise<UploadedFile> => {
  await delay(1000)
  
  return {
    id: `file-${Date.now()}-${Math.random()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    uploadedAt: new Date(),
    category,
  }
}

// OCR Processing
export const processOCR = async (fileId: string, documentType: 'registration' | 'policy' | 'police_report'): Promise<OCRResult> => {
  await delay(2000)
  
  const mockData: Record<string, Record<string, string>> = {
    registration: {
      'Vehicle Make': 'Toyota',
      'Vehicle Model': 'Camry',
      'Year': '2022',
      'VIN': '1HGBH41JXMN109186',
      'License Plate': 'ABC-1234',
      'Owner Name': 'John Doe',
    },
    policy: {
      'Policy Number': 'POL-28374-2024',
      'Policy Holder': 'John Doe',
      'Coverage Type': 'Comprehensive',
      'Deductible': '$500',
      'Premium': '$1,200/year',
      'Effective Date': '2024-01-01',
    },
    police_report: {
      'Report Number': 'PR-2024-10834',
      'Date Filed': '2024-10-28',
      'Officer Name': 'Officer Smith',
      'Incident Type': 'Traffic Collision',
      'Location': '123 Main St, San Francisco, CA',
    },
  }
  
  return {
    documentType,
    extractedData: mockData[documentType] || {},
    confidence: 0.92 + Math.random() * 0.07,
    verified: true,
    timestamp: new Date(),
  }
}

// Car Model Detection (DenseNet)
export const detectCarModel = async (photoIds: string[]): Promise<DetectedVehicle> => {
  await delay(3000)
  
  const cars = [
    { make: 'Toyota', model: 'Camry', year: 2022 },
    { make: 'Honda', model: 'Accord', year: 2023 },
    { make: 'Ford', model: 'F-150', year: 2021 },
    { make: 'Tesla', model: 'Model 3', year: 2024 },
  ]
  
  const selected = cars[Math.floor(Math.random() * cars.length)]
  
  return {
    ...selected,
    confidence: 0.92 + Math.random() * 0.07,
    vin: '1HGBH41JXMN109186',
    licensePlate: 'ABC-1234',
  }
}

// Damage Assessment (ResNet)
export const assessDamage = async (photoIds: string[]): Promise<DamageArea[]> => {
  await delay(4000)
  
  const damageParts: DamageArea[] = [
    {
      partName: 'Front Bumper',
      severity: 'severe',
      repairType: 'replacement',
      confidence: 0.95,
      estimatedCost: { min: 800, max: 1200 },
      boundingBox: { x: 150, y: 200, width: 300, height: 150 },
    },
    {
      partName: 'Hood',
      severity: 'moderate',
      repairType: 'repair',
      confidence: 0.89,
      estimatedCost: { min: 600, max: 900 },
      boundingBox: { x: 200, y: 100, width: 250, height: 200 },
    },
    {
      partName: 'Right Headlight',
      severity: 'severe',
      repairType: 'replacement',
      confidence: 0.97,
      estimatedCost: { min: 400, max: 650 },
      boundingBox: { x: 450, y: 180, width: 100, height: 80 },
    },
    {
      partName: 'Right Fender',
      severity: 'minor',
      repairType: 'buffing',
      confidence: 0.84,
      estimatedCost: { min: 200, max: 350 },
      boundingBox: { x: 500, y: 200, width: 150, height: 200 },
    },
  ]
  
  return damageParts
}

// Create new claim
export const createClaim = async (formData: ClaimFormData): Promise<Claim> => {
  await delay(500)
  
  return {
    id: `CLM-${Date.now()}`,
    userId: 'user-123',
    policyNumber: 'POL-28374-2024',
    status: 'draft',
    ...formData,
    documents: [],
    photos: [],
    videos: [],
    ocrResults: [],
    damageAssessment: [],
    estimatedCost: { min: 0, max: 0 },
    deductible: 500,
    estimatedPayout: { min: 0, max: 0 },
    timeline: [{
      id: '1',
      type: 'submitted',
      title: 'Claim Created',
      description: 'Claim has been created and is ready for documentation',
      timestamp: new Date(),
      actor: 'System',
    }],
    adjusterNotes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Submit claim for processing
export const submitClaim = async (claimId: string): Promise<Claim> => {
  await delay(1000)
  
  // Mock response - in real app, this would update backend
  return {
    id: claimId,
    userId: 'user-123',
    policyNumber: 'POL-28374-2024',
    status: 'submitted',
  } as Claim
}

// Get claim status
export const getClaimStatus = async (claimId: string): Promise<Claim> => {
  await delay(500)
  
  // Mock claim data
  return {
    id: claimId,
    userId: 'user-123',
    policyNumber: 'POL-28374-2024',
    status: 'under_review',
  } as Claim
}

// Get AI processing status
export const getAIProcessingStatus = async (claimId: string): Promise<AIProcessingStatus> => {
  await delay(500)
  
  return {
    step: 'damage_assessment',
    progress: 75,
    status: 'processing',
    message: 'Analyzing damage from uploaded photos',
    details: [
      'Processed 4 of 6 images',
      'Detected 3 damaged areas',
      'Calculating repair costs',
    ],
  }
}

// Get repair shop recommendations
export const getRepairShops = async (lat: number, lng: number): Promise<RepairShop[]> => {
  await delay(1000)
  
  return [
    {
      id: 'shop-1',
      name: 'APEX Certified Auto Body',
      address: '123 Main St, San Francisco, CA 94102',
      phone: '(415) 555-0100',
      rating: 4.8,
      reviewCount: 324,
      distance: 1.2,
      specialties: ['Collision Repair', 'Paint & Body', 'Frame Straightening'],
      estimatedWaitTime: '2-3 days',
      isPreferred: true,
    },
    {
      id: 'shop-2',
      name: 'Premium Collision Center',
      address: '456 Oak Ave, San Francisco, CA 94103',
      phone: '(415) 555-0200',
      rating: 4.6,
      reviewCount: 198,
      distance: 2.5,
      specialties: ['Collision Repair', 'Dent Removal', 'Insurance Claims'],
      estimatedWaitTime: '3-5 days',
      isPreferred: true,
    },
    {
      id: 'shop-3',
      name: 'QuickFix Auto Repair',
      address: '789 Pine St, San Francisco, CA 94104',
      phone: '(415) 555-0300',
      rating: 4.3,
      reviewCount: 156,
      distance: 3.8,
      specialties: ['Quick Repairs', 'Paint Touch-up', 'Minor Collision'],
      estimatedWaitTime: '1-2 days',
      isPreferred: false,
    },
  ]
}

