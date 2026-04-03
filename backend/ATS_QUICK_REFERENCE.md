# ATS Resume Analyzer - Quick Reference

## 🚀 Quick Start

```bash
# Start server
cd backend
npm start

# Test the feature
node test-ats.js
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ats/analyze-text` | Analyze resume text |
| POST | `/api/ats/analyze` | Upload PDF for analysis |
| GET | `/api/ats/report/:applicationId` | Get report for application |
| GET | `/api/ats/my-reports` | Get all user reports |
| POST | `/api/ats/reanalyze/:applicationId` | Reanalyze application |

## 📥 Request Body Examples

### Analyze Text (Job-Based)
```json
{
  "resumeText": "Your full resume text...",
  "jobDescription": "Job description text..."
}
```

### Analyze Text (General)
```json
{
  "resumeText": "Your full resume text..."
}
```

## 📤 Response Format

```json
{
  "mode": "job-based",
  "atsScore": 85,
  "keywordAnalysis": {
    "matchedKeywords": ["javascript", "react", "node.js"],
    "missingKeywords": ["kubernetes", "docker"]
  },
  "sectionAnalysis": {
    "hasSkills": true,
    "hasEducation": true,
    "hasExperience": true,
    "hasProjects": false
  },
  "issues": [
    "Missing Projects section"
  ],
  "suggestions": [
    "Add a Projects section to showcase practical work"
  ]
}
```

## 🎯 Score Interpretation

| Score | Category | Meaning |
|-------|----------|---------|
| 80-100 | Excellent | Strong candidate, ATS-friendly |
| 60-79 | Good | Qualified, minor improvements needed |
| 40-59 | Fair | Some concerns, improvements recommended |
| 0-39 | Needs Improvement | Significant issues detected |

## 🔑 Key Features

✅ **Two Modes**: Job-based & General analysis
✅ **Keyword Matching**: 40+ technical keywords
✅ **Section Detection**: Skills, Education, Experience, Projects
✅ **Action Verbs**: 55+ verbs detected
✅ **Metrics**: Numbers, percentages, achievements
✅ **PDF Support**: Upload and analyze PDFs
✅ **Suggestions**: Actionable improvement tips

## 📊 Scoring Weights

### Job-Based Mode
- Keyword Match: 40%
- Sections: 20%
- Action Words: 15%
- Measurable Results: 15%
- Formatting: 10%

### General Mode
- Sections: 30%
- Action Words: 20%
- Measurable Results: 20%
- Formatting: 15%
- Skill Strength: 15%

## 🛠️ Tech Stack

- **PDF Parsing**: pdf-parse
- **Text Analysis**: Custom regex patterns
- **Storage**: MongoDB (ATSReport model)
- **File Upload**: Multer (5MB max, PDF only)
- **Authentication**: JWT

## 📁 File Structure

```
backend/
├── utils/
│   └── atsAnalyzer.js           # Core analysis engine
├── models/
│   └── ATSReport.js             # Database schema
├── controllers/
│   └── atsController.js         # API logic
├── routes/
│   └── atsRoutes.js            # API routes
├── uploads/
│   └── temp/                   # Temporary PDF storage
├── test-ats.js                 # Test script
├── ATS_API_DOCS.md            # API documentation
└── ATS_USAGE_EXAMPLES.md      # Code examples
```

## 🔐 Authentication

All endpoints require JWT token:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## ⚡ Quick Test

```bash
# Terminal test
curl -X POST http://localhost:5000/api/ats/analyze-text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"Software Engineer with React and Node.js experience"}'
```

## 🎨 Frontend Integration

```javascript
// Quick analysis function
const analyzeResume = async (text, jobDesc = null) => {
  const res = await fetch('/api/ats/analyze-text', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      resumeText: text,
      jobDescription: jobDesc 
    })
  });
  return await res.json();
};
```

## 📖 Documentation

- **Full API Docs**: `backend/ATS_API_DOCS.md`
- **Usage Examples**: `backend/ATS_USAGE_EXAMPLES.md`
- **Implementation Summary**: Session files/ATS_IMPLEMENTATION_SUMMARY.md

## ✅ Status

**Implementation**: ✅ Complete
**Testing**: ✅ Passing
**Documentation**: ✅ Complete
**Server**: ✅ Running
**Production Ready**: ✅ Yes

---

**Need Help?** Check the full documentation in ATS_API_DOCS.md or ATS_USAGE_EXAMPLES.md
