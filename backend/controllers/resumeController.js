import axios from 'axios';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

/**
 * @desc    AI Resume Enhancer using Groq Llama 3
 * @route   POST /api/resume/enhance
 * @access  Private (Candidate only)
 */
export const enhanceResumeContent = async (req, res) => {
  try {
    const { type, content, context } = req.body;
    
    // Check for API Key
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI Engine (Groq) not configured.' });
    }

    let prompt = "";

    // Specific prompts for each resume section
    if (type === 'summary') {
      prompt = `Act as a professional resume writer. Write a 2-3 line result-driven professional summary for a ${context?.name || 'Candidate'} who is a ${context?.skills || 'Professional'}. Focus on high-impact results and key technologies. Mention specific tools and methodologies. Keep it under 60 words.`;
    } else if (type === 'experience') {
      prompt = `Act as an expert career coach. Professionalize the following job description for a ${content.role} at ${content.company}. 
      Original description: ${content.description}
      Generate 4 high-impact, ATS-friendly bullet points in a professional tone. Start each bullet with a strong action verb. Return ONLY the bullet points separated by new lines.`;
    } else if (type === 'project') {
      prompt = `Professionalize the project description for a project named "${content.title}" using technologies: ${content.technologies}.
      Generate 3 high-impact bullet points. Return ONLY the bullet points separated by new lines.`;
    } else if (type === 'architect') {
      prompt = `You are a world-class career consultant and resume architect.
      Based on this raw data: ${JSON.stringify(content)}
      Your task is to REWRITE and COMPLETE this entire resume to be top-tier, ATS-friendly, and highly professional.
      Instructions:
      1. Rewrite the professionalSummary to be high-impact.
      2. Rewrite every experience entry to have 4 high-impact bullet points with action verbs.
      3. Rewrite every project entry to have 3 technical bullet points.
      4. Ensure the skills are properly formatted and professional.
      
      Return ONLY a valid JSON object in this format: 
      {
        "professionalSummary": "...",
        "experience": [{"company": "...", "role": "...", "duration": "...", "description": "bullet points separated by \\n"}],
        "projects": [{"title": "...", "technologies": "...", "date": "...", "description": "bullet points separated by \\n"}],
        "skills": "skill1, skill2, ..."
      }`;
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a professional resume architect and career coach. You only return the requested text without any conversation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const enhancedContent = response.data.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      data: enhancedContent
    });
  } catch (error) {
    console.error('Groq AI enhancement error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'AI enhancement failed. Technical details: ' + (error.response?.data?.error?.message || error.message)
    });
  }
};

// @desc    Update and Save resume details to user profile
// @route   POST /api/resume/save
// @access  Private (Candidate only)
export const saveResume = async (req, res) => {
  try {
    const { name, phone, location, linkedin, github, professionalSummary, education, experience, skills, projects } = req.body;
    
    // Find user and update profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update basic user info
    user.name = name;
    user.phone = phone;

    // Update profile
    user.profile = {
      ...user.profile,
      location,
      linkedin,
      github,
      professionalSummary,
      education,
      experience,
      projects,
      skills: skills.split(',').map(s => s.trim())
    };

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Resume profile updated successfully!',
      data: user
    });
  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume data.'
    });
  }
};
