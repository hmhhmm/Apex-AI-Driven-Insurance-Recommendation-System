# APEX Insurance Platform - Complete Rebuild Implementation Plan

## Executive Summary
This document outlines the complete transformation of APEX from a platform to a company-owned insurance website with advanced AI-powered claims processing.

## ✅ COMPLETED (Phase 1)
1. Created TypeScript types for claims system (`/client/src/types/claims.ts`)
2. Created chat types (`/client/src/types/chat.ts`)
3. Extended API services with claims mock functions (`/client/src/services/api.ts`)
4. Created About Us page (`/client/src/pages/About.tsx`)
5. Created Contact page (`/client/src/pages/Contact.tsx`)

## 📋 REMAINING WORK

### PHASE 2: Core Pages & Navigation (Priority 1)
- [ ] **Update Navigation.tsx**
  - Change "APEX" logo to "APEX Insurance"
  - Navigation: Home | Products | Claims | AI Assistant | About | Contact
  - Remove "Browse Plans" → rename to "Products"
  
- [ ] **Create FAQ.tsx**
  - Common questions about DNA insurance
  - Pricing FAQ
  - Claims process FAQ
  - Privacy & security
  
- [ ] **Create Products.tsx** (rename from Purchase.tsx)
  - Showcase company's 5 insurance types
  - Remove "compare plans" language
  - Use "Our Plans" instead
  - Add "Ask AI Assistant" CTAs
  
- [ ] **Update Landing.tsx**
  - Remove competitor comparison section entirely
  - Change copy to company-specific (not platform)
  - "Your DNA. Your Shield. Your Future." → emphasize APEX as THE company
  - Remove "compare insurers" language
  - Add trust signals (BBB rating, customer count, etc.)

### PHASE 3: AI Assistant Page (Priority 1)
- [ ] **Create AIAssistant.tsx** (`/client/src/pages/AIAssistant.tsx`)
  ```
  Layout:
  ┌────────────────────────────────────────┐
  │ Navigation Bar                          │
  ├──────┬────────────────────┬────────────┤
  │ Chat │  Main Chat Area    │  Context   │
  │ Hist │                     │  Panel     │
  │      │  [Messages]         │            │
  │ • New│                     │  Your Info │
  │ • C1 │  [User msg]         │  Policy #  │
  │ • C2 │  [Bot response]     │  Claims    │
  │      │                     │  DNA Test  │
  │      │  [Input box]        │            │
  └──────┴────────────────────┴────────────┘
  ```
  
- [ ] **Create chat components:**
  - `/client/src/components/ai-assistant/ChatHistory.tsx` - Left sidebar
  - `/client/src/components/ai-assistant/ChatArea.tsx` - Main chat
  - `/client/src/components/ai-assistant/ContextPanel.tsx` - Right sidebar
  - `/client/src/components/ai-assistant/MessageBubble.tsx`
  
- [ ] **Update chatStore.ts**
  - Add conversation management
  - Add conversation history
  - Add context awareness

- [ ] **Delete ChatWidget**
  - Remove `/client/src/components/chatbot/ChatWidget.tsx`
  - Remove from App.tsx
  - Add "Ask AI" buttons throughout site linking to `/ai-assistant`

### PHASE 4: Advanced Claims System (Priority 2)
This is the most complex feature. Break into sub-phases:

#### 4A: Claims Components
- [ ] `/client/src/components/claims/FileUploadZone.tsx`
  - Drag & drop for photos/videos/PDFs
  - File preview thumbnails
  - Category tagging (document/photo/video)
  
- [ ] `/client/src/components/claims/OCRResultsCard.tsx`
  - Show extracted text from documents
  - Confidence scores
  - Verification status
  
- [ ] `/client/src/components/claims/DamageDetectionGrid.tsx`
  - Photo grid with bounding boxes
  - Part name labels
  - Severity indicators
  - Confidence scores
  
- [ ] `/client/src/components/claims/CarDiagramSelector.tsx`
  - Interactive car silhouette
  - Clickable parts
  - Highlight damaged areas
  
- [ ] `/client/src/components/claims/ComparisonSlider.tsx`
  - Before/after image comparison
  - Slider control
  - Damage overlay annotations
  
- [ ] `/client/src/components/claims/ClaimTimelineTracker.tsx`
  - Visual progress stepper
  - Status updates
  - Timestamps
  
- [ ] `/client/src/components/claims/RepairEstimateBreakdown.tsx`
  - Itemized parts list
  - Labor costs
  - Total calculation
  
- [ ] `/client/src/components/claims/AIProcessingStatus.tsx`
  - Real-time processing animation
  - Progress bars per step
  - OCR → Model Detection → Damage Assessment → Complete

#### 4B: Claims Page Rebuild
- [ ] **Completely rewrite `/client/src/pages/Claims.tsx`**
  
  **6-Step Flow:**
  
  **Step 1: Incident Details**
  - Date/time picker
  - Location input with map
  - Description textarea
  - Police report toggle
  
  **Step 2: Document Upload**
  - Car registration upload
  - Insurance policy upload
  - Police report upload (conditional)
  - Real-time file preview
  
  **Step 3: Photo/Video Upload**
  - Multiple photo upload
  - Video upload
  - Camera capture option (mobile)
  - Preview grid
  
  **Step 4: AI Processing**
  - Show live processing status
  - OCR verification display
  - Car model detection progress
  - Damage assessment progress
  - Mesh comparison progress
  
  **Step 5: Analysis Results**
  - Detected vehicle info
  - Damage report with images
  - Cost estimate breakdown
  - Annotated damage photos
  - Before/after comparison
  
  **Step 6: Review & Submit**
  - Summary of all data
  - User can add notes
  - Repair shop recommendations
  - Submit button
  - Confirmation screen

#### 4C: Claims Zustand Store
- [ ] **Create `/client/src/store/claimsStore.ts`**
  - Current claim state
  - Uploaded files
  - AI processing status
  - Analysis results
  - Submit claim function
  - Claim history

### PHASE 5: App.tsx & Routing (Priority 1)
- [ ] **Update App.tsx**
  ```tsx
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/products" element={<Products />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/ai-assistant" element={<AIAssistant />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
  </Routes>
  ```
  - Remove ChatWidget from layout
  - Add new routes

### PHASE 6: Branding Updates (Priority 2)
- [ ] **Update all copy to remove "platform" language**
  - Landing: Remove comparison tables
  - Dashboard: Keep DNA/onboarding features
  - All pages: "APEX Insurance Company" branding
  
- [ ] **Add company elements**
  - Footer with company info
  - Privacy policy link
  - Terms of service link
  - Social media links

---

## FILE STRUCTURE (Target State)

```
client/src/
├── pages/
│   ├── Landing.tsx ✅ (needs rebranding)
│   ├── Products.tsx (rename from Purchase.tsx)
│   ├── Dashboard.tsx ✅ (keep as is)
│   ├── Claims.tsx (COMPLETE REBUILD)
│   ├── AIAssistant.tsx (NEW)
│   ├── About.tsx ✅
│   ├── Contact.tsx ✅
│   └── FAQ.tsx (NEW)
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx (UPDATE)
│   │   └── Footer.tsx (NEW)
│   ├── ai-assistant/
│   │   ├── ChatHistory.tsx (NEW)
│   │   ├── ChatArea.tsx (NEW)
│   │   ├── ContextPanel.tsx (NEW)
│   │   └── MessageBubble.tsx (NEW)
│   ├── claims/
│   │   ├── FileUploadZone.tsx (NEW)
│   │   ├── OCRResultsCard.tsx (NEW)
│   │   ├── DamageDetectionGrid.tsx (NEW)
│   │   ├── CarDiagramSelector.tsx (NEW)
│   │   ├── ComparisonSlider.tsx (NEW)
│   │   ├── ClaimTimelineTracker.tsx (NEW)
│   │   ├── RepairEstimateBreakdown.tsx (NEW)
│   │   └── AIProcessingStatus.tsx (NEW)
│   └── chatbot/ (DELETE ENTIRE FOLDER)
├── store/
│   ├── authStore.ts ✅
│   ├── onboardingStore.ts ✅
│   ├── cartStore.ts ✅
│   ├── chatStore.ts (UPDATE for conversations)
│   └── claimsStore.ts (NEW)
├── types/
│   ├── claims.ts ✅
│   └── chat.ts ✅
└── services/
    └── api.ts ✅ (extended with claims functions)
```

---

## TESTING CHECKLIST

### Navigation
- [ ] All nav links work
- [ ] Active states show correctly
- [ ] Mobile menu works
- [ ] Account dropdown works
- [ ] Logo links to home

### AI Assistant
- [ ] Page loads without errors
- [ ] Can create new conversation
- [ ] Messages send/receive
- [ ] Chat history persists
- [ ] Context panel shows user data
- [ ] Can switch between conversations

### Claims System
- [ ] Step 1: Can enter incident details
- [ ] Step 2: Can upload documents
- [ ] Step 3: Can upload photos/videos
- [ ] Step 4: AI processing animates
- [ ] Step 5: Results display correctly
- [ ] Step 6: Can submit claim
- [ ] File upload drag & drop works
- [ ] OCR results display
- [ ] Damage detection shows
- [ ] Timeline tracker updates

### Branding
- [ ] No "platform" language remains
- [ ] All pages say "APEX Insurance Company"
- [ ] No competitor comparisons
- [ ] Company pages accessible
- [ ] Footer has company info

---

## PRIORITY ORDER

1. **Update Navigation** (30 min)
2. **Create FAQ page** (45 min)
3. **Rename Purchase → Products** (30 min)
4. **Create AI Assistant page** (2 hours)
5. **Delete ChatWidget** (15 min)
6. **Update Landing branding** (45 min)
7. **Create Claims components** (4 hours)
8. **Rebuild Claims page** (3 hours)
9. **Create Claims store** (1 hour)
10. **Update App.tsx routing** (30 min)
11. **Testing & fixes** (2 hours)

**Total estimated time: 15-18 hours**

---

## NOTES

- Keep dark mode theme throughout
- Maintain all existing DNA analysis features
- Use professional insurance industry UI patterns
- Show confidence scores for all AI predictions
- Make file uploads feel responsive and modern
- Use realistic mock data for all AI responses
- Timeline should feel real-time even though it's mocked
