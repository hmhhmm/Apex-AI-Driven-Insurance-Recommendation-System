# ⚡ Quick Start - APEX Recommendation System

## 🚀 Start in 3 Steps

### Step 1: Replace Old Purchase Page
```bash
cd "/Users/lauhiapmeng/Downloads/Tech Trove/client/src/pages"

# Backup old file
mv Purchase.tsx Purchase_OLD.tsx

# Use new file
mv PurchaseNew.tsx Purchase.tsx
```

### Step 2: Verify Server Running
```bash
# Should already be running at:
http://localhost:5174
```

### Step 3: Test the System
```bash
# Open in browser:
http://localhost:5174/onboarding/avatar-selection

# Complete questionnaire with ANY data
# Click "Next" → See recommendations!
```

---

## 🎯 Quick Demo (2 minutes)

### Test User A - Young Athlete
```
Age: 25
Occupation: Athlete
Lifestyle: Active  
Exercise: Regularly
Smoking: Never
Insurance Types: Health, Sports
```
**Expected:** Sports plans, athletic DNA strengths, 85%+ match

### Test User B - Executive  
```
Age: 45
Occupation: Manager
Lifestyle: Sedentary
Exercise: Rarely  
Smoking: Former
Insurance Types: Health, Life
```
**Expected:** Health plans, cardiac risks, 80%+ match

---

## 📁 Files Created (Copy/Paste Locations)

### If you need to recreate any file:

**Data Files:**
- `client/src/data/masterDNA.ts`
- `client/src/data/insurancePlans.ts`

**Service Files:**
- `client/src/services/dnaInterpretation.ts`
- `client/src/services/riskScoring.ts`
- `client/src/services/planMatching.ts`

**Component Files:**
- `client/src/components/recommendations/RecommendationHeader.tsx`
- `client/src/components/recommendations/RecommendationCard.tsx`
- `client/src/components/recommendations/PlanDetails.tsx`
- `client/src/components/recommendations/LoadingState.tsx`

**Main Page:**
- `client/src/pages/PurchaseNew.tsx` (or `Purchase.tsx`)

---

## ⚠️ Troubleshooting

### "Cannot find module" errors
```bash
# Restart TypeScript server in VS Code
Cmd + Shift + P
→ "TypeScript: Restart TS Server"
```

### "No recommendations found"
- Ensure insurance types selected in questionnaire
- Check console for errors
- Verify onboarding data exists

### Page won't load
- Check if dev server running (port 5174)
- Verify routing points to correct component
- Clear browser cache

---

## 📖 Full Documentation

- **System Overview:** `DYNAMIC_RECOMMENDATION_SYSTEM.md`
- **Test Guide:** `TESTING_GUIDE.md`  
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Verification Checklist

- [ ] Dev server running
- [ ] No TypeScript errors
- [ ] Questionnaire page works
- [ ] Can navigate to /purchase
- [ ] Recommendations display
- [ ] Cards show match %
- [ ] DNA highlights visible
- [ ] Can save/select plans
- [ ] Modal opens for details
- [ ] Mobile responsive

---

**Status:** ✅ Ready to Demo  
**Time to Test:** 2 minutes  
**Time to Demo:** 5-6 minutes
