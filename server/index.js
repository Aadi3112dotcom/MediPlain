import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============== AI/LLM Routes ==============

/**
 * Explain medical report using AI/LLM
 * POST /api/ai/explain-report
 */
app.post('/api/ai/explain-report', async (req, res) => {
  try {
    const { reportText, context, tone } = req.body;

    if (!reportText) {
      return res.status(400).json({ error: 'Report text is required' });
    }

    // Simulate AI response (replace with actual LLM API call)
    // Example: Using OpenAI API or medical-tuned LLM
    const explanation = {
      explanation: `This medical report contains the following key observations: ${reportText.substring(0, 200)}...`,
      summary: 'Patient health status appears to be within acceptable ranges. No critical findings detected.',
      keyFindings: [
        'Blood sugar level: Normal - Well controlled',
        'Hemoglobin: Slightly low - Consider dietary supplements',
        'Cholesterol: Within normal range - Continue healthy lifestyle'
      ],
      recommendations: [
        'Maintain current exercise routine',
        'Increase intake of iron-rich foods',
        'Follow up with physician in 3 months'
      ],
      warnings: []
    };

    res.json(explanation);
  } catch (error) {
    console.error('Error explaining report:', error);
    res.status(500).json({ error: 'Failed to explain report' });
  }
});

/**
 * Generate health recommendations
 * POST /api/ai/generate-recommendations
 */
app.post('/api/ai/generate-recommendations', async (req, res) => {
  try {
    const { healthData, reportData, age, chronicConditions, allergies, medications } = req.body;

    const recommendations = {
      lifestyle: [
        'Walk 30 minutes daily',
        'Maintain consistent sleep schedule',
        'Manage stress through meditation'
      ],
      diet: [
        'Increase fiber intake',
        'Reduce processed foods',
        'Drink at least 8 glasses of water daily'
      ],
      exercise: [
        'Cardio: 30 minutes, 3-4 times per week',
        'Strength training: 2-3 times per week',
        'Flexibility exercises: Daily stretching'
      ],
      medications: medications || ['Continue current medications as prescribed'],
      followUp: {
        type: 'Doctor Consultation',
        timeframe: '3 months',
        notes: 'Routine check-up recommended'
      }
    };

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

/**
 * Analyze health anomalies
 * POST /api/ai/analyze-anomaly
 */
app.post('/api/ai/analyze-anomaly', async (req, res) => {
  try {
    const { current, historical } = req.body;

    const analysis = {
      anomalies: [],
      riskLevel: 'normal',
      alerts: [],
      suggestions: ['Monitor health metrics regularly']
    };

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing anomaly:', error);
    res.status(500).json({ error: 'Failed to analyze anomaly' });
  }
});

/**
 * Get emergency summary
 * POST /api/ai/emergency-summary
 */
app.post('/api/ai/emergency-summary', async (req, res) => {
  try {
    const { name, age, bloodGroup, allergies, chronicConditions, currentMedications, lastReport } = req.body;

    const summary = {
      summary: `EMERGENCY SUMMARY - Patient: ${name}, Age: ${age}, Blood Group: ${bloodGroup}`,
      criticalInfo: [
        `Blood Group: ${bloodGroup}`,
        `Allergies: ${allergies?.join(', ') || 'None documented'}`,
        `Chronic Conditions: ${chronicConditions?.join(', ') || 'None'}`,
        `Current Medications: ${currentMedications?.join(', ') || 'None'}`
      ],
      emergencyContacts: [],
      immediateActions: [
        'Check allergy status',
        'Review medication interactions',
        'Contact emergency services if severe'
      ]
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating emergency summary:', error);
    res.status(500).json({ error: 'Failed to generate emergency summary' });
  }
});

/**
 * Chat with medical AI assistant
 * POST /api/ai/chat
 */
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context, type } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = `I understand you asked about: "${message}". For specific medical advice, please consult with a healthcare professional.`;

    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// ============== Root Route ==============

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to MediPlain API', 
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      explainReport: 'POST /api/ai/explain-report',
      recommendations: 'POST /api/ai/generate-recommendations',
      anomalyAnalysis: 'POST /api/ai/analyze-anomaly',
      emergencySummary: 'POST /api/ai/emergency-summary',
      chat: 'POST /api/ai/chat'
    }
  });
});

// ============== Health Check ==============

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediPlain API is running' });
});

// ============== Error Handling ==============

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏥 MediPlain API Server running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
