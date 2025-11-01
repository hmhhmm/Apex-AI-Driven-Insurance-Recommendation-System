// Claims Type Definitions

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  category: 'document' | 'photo' | 'video'
}

export interface OCRResult {
  documentType: 'registration' | 'policy' | 'police_report'
  extractedData: {
    [key: string]: string
  }
  confidence: number
  verified: boolean
  timestamp: Date
}

export interface DamageArea {
  partName: string
  severity: 'minor' | 'moderate' | 'severe'
  repairType: 'buffing' | 'repair' | 'replacement'
  confidence: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  estimatedCost: {
    min: number
    max: number
  }
}

export interface DetectedVehicle {
  make: string
  model: string
  year: number
  confidence: number
  vin?: string
  licensePlate?: string
}

export interface ClaimTimelineEvent {
  id: string
  type: 'submitted' | 'processing' | 'reviewed' | 'approved' | 'denied' | 'paid'
  title: string
  description: string
  timestamp: Date
  actor: string
  metadata?: Record<string, any>
}

export interface AdjusterNote {
  id: string
  authorName: string
  authorRole: 'adjuster' | 'supervisor' | 'system'
  content: string
  timestamp: Date
  isInternal: boolean
}

export interface RepairEstimate {
  parts: Array<{
    name: string
    quantity: number
    unitCost: number
    totalCost: number
  }>
  labor: Array<{
    description: string
    hours: number
    rate: number
    totalCost: number
  }>
  subtotal: number
  tax: number
  total: number
}

export interface ClaimLocation {
  lat: number
  lng: number
  address: string
  city: string
  state: string
  zipCode: string
}

export type ClaimStatus = 
  | 'draft'
  | 'submitted'
  | 'ocr_processing'
  | 'model_detection'
  | 'damage_assessment'
  | 'under_review'
  | 'approved'
  | 'denied'
  | 'paid'

export interface Claim {
  id: string
  userId: string
  policyNumber: string
  status: ClaimStatus
  
  // Incident Details
  incidentDate: Date
  incidentTime: string
  location: ClaimLocation
  description: string
  policeReportFiled: boolean
  policeReportNumber?: string
  
  // Uploaded Files
  documents: UploadedFile[]
  photos: UploadedFile[]
  videos: UploadedFile[]
  
  // AI Analysis Results
  ocrResults: OCRResult[]
  detectedVehicle?: DetectedVehicle
  damageAssessment: DamageArea[]
  
  // Cost Estimation
  estimatedCost: {
    min: number
    max: number
  }
  approvedAmount?: number
  deductible: number
  estimatedPayout: {
    min: number
    max: number
  }
  
  // Tracking
  timeline: ClaimTimelineEvent[]
  adjusterNotes: AdjusterNote[]
  repairEstimate?: RepairEstimate
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
  reviewedAt?: Date
  approvedAt?: Date
}

export interface AIProcessingStatus {
  step: 'ocr' | 'model_detection' | 'damage_assessment' | 'mesh_comparison' | 'complete'
  progress: number
  status: 'pending' | 'processing' | 'complete' | 'error'
  message: string
  details?: string[]
  error?: string
}

export interface DamageVisualization {
  originalImage: string
  annotatedImage: string
  detectedAreas: DamageArea[]
  confidenceThreshold: number
}

// Form data for claim creation
export interface ClaimFormData {
  incidentDate: Date
  incidentTime: string
  location: ClaimLocation
  description: string
  policeReportFiled: boolean
  policeReportNumber?: string
}

// Repair shop recommendation
export interface RepairShop {
  id: string
  name: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  distance: number
  specialties: string[]
  estimatedWaitTime: string
  isPreferred: boolean
}
