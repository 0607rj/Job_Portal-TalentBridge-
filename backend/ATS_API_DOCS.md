# ATS Resume Analyzer API Documentation

## Overview

The ATS (Applicant Tracking System) Resume Analyzer is a feature integrated into TalentBridge that analyzes candidate resumes and generates detailed reports with scoring, keyword analysis, and actionable suggestions.

## Features

- **Two Analysis Modes**:
  - **Job-Based Analysis**: Analyzes resume against a specific job description
  - **General Analysis**: Evaluates resume quality independently

- **Comprehensive Scoring**: Evaluates resumes on multiple criteria:
  - Keyword matching (job-based mode)
  - Section completeness (Skills, Education, Experience, Projects)
  - Action verb usage
  - Measurable achievements
  - Formatting quality

- **Actionable Insights**: Provides specific suggestions for improvement

## API Endpoints

### 1. Analyze Resume (Text-based)

```http
POST /api/ats/analyze-text
```

Analyze resume text directly without file upload.

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "resumeText": "string (required) - Full text of the resume",
  "jobDescription": "string (optional) - Job description for job-based analysis"
}
```

**Response**: 
```json
{
  "mode": "job-based" | "general",
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
    "Missing Projects section",
    "Limited use of action verbs"
  ],
  "suggestions": [
    "Consider adding a 'Projects' section to showcase practical work",
    "Use more action verbs (developed, built, implemented, designed)"
  ]
}
```

**Example**:
```javascript
const response = await fetch('/api/ats/analyze-text', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resumeText: "John Doe\nSoftware Engineer\n...",
    jobDescription: "Senior Developer position..."
  })
});

const result = await response.json();
console.log('ATS Score:', result.atsScore);
```

---

### 2. Analyze Resume (File Upload)

```http
POST /api/ats/analyze
```

Analyze resume from uploaded PDF file.

**Authentication**: Required (Bearer Token)

**Request**: Form-Data
- `resumeFile`: PDF file (optional, max 5MB)
- `resumeText`: string (optional) - Resume text if file not provided
- `jobDescription`: string (optional) - Job description
- `applicationId`: string (optional) - Analyze specific application
- `jobId`: string (optional) - Use job details for job-based analysis

**Response**: Same as analyze-text endpoint

**Example with Postman/cURL**:
```bash
curl -X POST http://localhost:5000/api/ats/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resumeFile=@/path/to/resume.pdf" \
  -F "jobDescription=Senior Developer position requiring..."
```

---

### 3. Get ATS Report for Application

```http
GET /api/ats/report/:applicationId
```

Retrieve the most recent ATS report for a specific application.

**Authentication**: Required (Candidate or Recruiter of the application)

**Parameters**:
- `applicationId` (URL parameter) - Application ID

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "report_id",
    "application": "application_id",
    "candidate": { "name": "John Doe", "email": "john@example.com" },
    "job": { "title": "Senior Developer", "company": "Tech Corp" },
    "mode": "job-based",
    "atsScore": 85,
    "keywordAnalysis": { ... },
    "sectionAnalysis": { ... },
    "issues": [ ... ],
    "suggestions": [ ... ],
    "createdAt": "2026-04-03T10:00:00.000Z"
  }
}
```

---

### 4. Get My ATS Reports

```http
GET /api/ats/my-reports
```

Get all ATS reports for the currently authenticated user.

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "report_id",
      "mode": "job-based",
      "atsScore": 85,
      "job": { "title": "Senior Developer", "company": "Tech Corp" },
      "application": { "status": "Applied" },
      "createdAt": "2026-04-03T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### 5. Reanalyze Application

```http
POST /api/ats/reanalyze/:applicationId
```

Rerun ATS analysis for an existing application (useful after resume updates).

**Authentication**: Required (Candidate or Recruiter)

**Parameters**:
- `applicationId` (URL parameter) - Application ID

**Response**: Same as analyze-text endpoint

---

## Scoring Logic

### Job-Based Analysis (with Job Description)

Total: 100 points

1. **Keyword Match** (40 points): Percentage of job keywords found in resume
2. **Sections** (20 points): Presence of Skills, Education, Experience, Projects
3. **Action Words** (15 points): Usage of action verbs (developed, built, etc.)
4. **Measurable Results** (15 points): Numbers, percentages, metrics
5. **Formatting** (10 points): Readability, bullet points, length

### General Analysis (without Job Description)

Total: 100 points

1. **Sections** (30 points): Presence of key sections
2. **Action Words** (20 points): Usage of action verbs
3. **Measurable Results** (20 points): Quantifiable achievements
4. **Formatting** (15 points): Readability and structure
5. **Skill Strength** (15 points): Number and diversity of skills

---

## Score Categories

- **80-100**: Excellent - Strong candidate, resume is ATS-friendly
- **60-79**: Good - Qualified candidate with minor improvements needed
- **40-59**: Fair - Some concerns, several improvements recommended
- **0-39**: Needs Improvement - Significant issues detected

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Resume text or file is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to analyze this application"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Application not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to analyze resume",
  "error": "Detailed error message"
}
```

---

## Integration with Applications

When analyzing an application (using `applicationId`), the ATS report is automatically linked to the application and updates the `aiMatchData` field:

```javascript
application.aiMatchData = {
  matchScore: 85,
  matchingSkills: ["javascript", "react", "node.js"],
  missingSkills: ["kubernetes"],
  recommendation: "Strong Match",
  analysisReason: "ATS Score: 85/100. Consider adding..."
}
```

This allows recruiters to see ATS scores directly in the application view.

---

## Best Practices

1. **For Candidates**: 
   - Use the analyze-text endpoint to check your resume before applying
   - Iterate based on suggestions to improve your score
   - Aim for 70+ score for better chances

2. **For Recruiters**: 
   - Automatic ATS analysis runs when candidates apply
   - Use reanalyze endpoint if candidate updates their resume
   - Filter applications by ATS score for efficient screening

3. **Rate Limiting**: 
   - ATS endpoints are not heavily rate-limited
   - Avoid excessive reanalysis calls (cache results)

---

## Future Enhancements

- [ ] Real-time analysis as user types
- [ ] Industry-specific keyword databases
- [ ] Resume template suggestions
- [ ] Batch analysis for multiple resumes
- [ ] AI-powered resume improvement suggestions
- [ ] Integration with LinkedIn profiles
- [ ] Resume format conversion

---

## Support

For issues or questions about the ATS feature:
- Create an issue in the repository
- Contact: support@talentbridgepro.com

---

**Last Updated**: April 3, 2026
