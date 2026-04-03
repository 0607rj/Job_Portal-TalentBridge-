# ATS Resume Analyzer - Usage Examples

## Quick Start

The ATS (Applicant Tracking System) Resume Analyzer is now integrated into TalentBridge. Here's how to use it:

---

## Example 1: Analyze Resume Text (General Mode)

```javascript
// Frontend: Analyze a resume without a job description
const analyzeResume = async (resumeText) => {
  try {
    const response = await fetch('http://localhost:5000/api/ats/analyze-text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeText })
    });

    const result = await response.json();
    
    console.log('ATS Score:', result.atsScore);
    console.log('Mode:', result.mode); // "general"
    console.log('Suggestions:', result.suggestions);
    
    return result;
  } catch (error) {
    console.error('Error analyzing resume:', error);
  }
};
```

---

## Example 2: Analyze Resume with Job Description (Job-Based Mode)

```javascript
// Frontend: Analyze resume against a specific job
const analyzeForJob = async (resumeText, jobDescription) => {
  try {
    const response = await fetch('http://localhost:5000/api/ats/analyze-text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resumeText,
        jobDescription
      })
    });

    const result = await response.json();
    
    console.log('ATS Score:', result.atsScore);
    console.log('Mode:', result.mode); // "job-based"
    console.log('Matched Keywords:', result.keywordAnalysis.matchedKeywords);
    console.log('Missing Keywords:', result.keywordAnalysis.missingKeywords);
    
    return result;
  } catch (error) {
    console.error('Error analyzing resume:', error);
  }
};
```

---

## Example 3: Upload and Analyze PDF Resume

```javascript
// Frontend: Upload PDF file for analysis
const uploadAndAnalyze = async (file, jobDescription = null) => {
  const formData = new FormData();
  formData.append('resumeFile', file);
  
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  try {
    const response = await fetch('http://localhost:5000/api/ats/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading resume:', error);
  }
};

// Usage in React component
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    const result = await uploadAndAnalyze(file);
    console.log('Analysis Result:', result);
  }
};
```

---

## Example 4: Get ATS Report for Application

```javascript
// Fetch existing ATS report for an application
const getApplicationReport = async (applicationId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/ats/report/${applicationId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log('ATS Report:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching report:', error);
  }
};
```

---

## Example 5: Display ATS Score in UI (React Component)

```jsx
import React, { useState } from 'react';

const ATSScoreDisplay = ({ atsScore, suggestions }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">ATS Analysis</h3>
      
      <div className="flex items-center mb-4">
        <div className="text-4xl font-bold mr-4">
          <span className={getScoreColor(atsScore)}>{atsScore}</span>
          <span className="text-gray-400">/100</span>
        </div>
        <div>
          <p className={`text-lg font-semibold ${getScoreColor(atsScore)}`}>
            {getScoreLabel(atsScore)}
          </p>
          <p className="text-sm text-gray-600">ATS Compatibility Score</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className={`h-2.5 rounded-full ${
            atsScore >= 80 ? 'bg-green-600' :
            atsScore >= 60 ? 'bg-blue-600' :
            atsScore >= 40 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${atsScore}%` }}
        ></div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Suggestions for Improvement:</h4>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-700">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSScoreDisplay;
```

---

## Example 6: Resume Analyzer Page (Complete React Component)

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/ats/analyze-text',
        {
          resumeText,
          jobDescription: jobDescription || null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ATS Resume Analyzer</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Resume Text (Required)
        </label>
        <textarea
          className="w-full border rounded p-3 h-64"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Job Description (Optional - for job-based analysis)
        </label>
        <textarea
          className="w-full border rounded p-3 h-32"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here for job-based analysis..."
        />
      </div>

      <button
        onClick={analyzeResume}
        disabled={!resumeText || loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {result && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-blue-600">
                {result.atsScore}
              </div>
              <div>
                <p className="text-lg font-semibold">ATS Score</p>
                <p className="text-sm text-gray-600">
                  Mode: {result.mode === 'job-based' ? 'Job-Based' : 'General'}
                </p>
              </div>
            </div>
          </div>

          {result.mode === 'job-based' && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Keyword Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Matched ({result.keywordAnalysis.matchedKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.keywordAnalysis.matchedKeywords.map((kw, i) => (
                      <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">
                    ✗ Missing ({result.keywordAnalysis.missingKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.keywordAnalysis.missingKeywords.slice(0, 10).map((kw, i) => (
                      <span key={i} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Section Analysis</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(result.sectionAnalysis).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? '✓' : '✗'}
                  </span>
                  <span className="capitalize">{key.replace('has', '')}</span>
                </div>
              ))}
            </div>
          </div>

          {result.issues.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-red-600">Issues Found</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Suggestions</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
```

---

## cURL Examples

### Analyze resume text
```bash
curl -X POST http://localhost:5000/api/ats/analyze-text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "John Doe\nSoftware Engineer...",
    "jobDescription": "We are looking for..."
  }'
```

### Upload PDF for analysis
```bash
curl -X POST http://localhost:5000/api/ats/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resumeFile=@resume.pdf" \
  -F "jobDescription=We are looking for a Senior Developer..."
```

### Get report for application
```bash
curl -X GET http://localhost:5000/api/ats/report/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Integration Tips

1. **For Candidate Dashboard**: Add an "Analyze My Resume" button that fetches the user's resume and analyzes it
2. **For Application Flow**: Automatically analyze resume when candidate applies for a job
3. **For Recruiter Dashboard**: Display ATS scores on application cards for quick screening
4. **Real-time Feedback**: Show ATS score as users type/upload their resume

---

## Best Practices

- Cache analysis results to avoid redundant API calls
- Show loading states during analysis
- Provide clear visual feedback for scores (colors, progress bars)
- Display suggestions prominently to help candidates improve
- For recruiters, sort applications by ATS score

---

**Note**: The server must be running on `http://localhost:5000` for these examples to work.
