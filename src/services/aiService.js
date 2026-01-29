import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Initialize LLM service with API endpoint
 */
const llmClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Explain medical report using AI/LLM
 */
export const explainMedicalReport = async (reportData) => {
  try {
    const response = await llmClient.post('/ai/explain-report', {
      reportText: reportData.text || reportData,
      context: reportData.context || 'medical-report',
      tone: 'patient-friendly'
    });
    
    return {
      explanation: response.data.explanation,
      summary: response.data.summary,
      keyFindings: response.data.keyFindings,
      recommendations: response.data.recommendations,
      warnings: response.data.warnings || []
    };
  } catch (error) {
    console.error('AI explanation error:', error);
    throw error;
  }
};

/**
 * Generate health recommendations based on report
 */
export const generateHealthRecommendations = async (healthData, reportData) => {
  try {
    const response = await llmClient.post('/ai/generate-recommendations', {
      healthData,
      reportData,
      age: healthData.age,
      chronicConditions: healthData.chronicConditions || [],
      allergies: healthData.allergies || [],
      medications: healthData.medications || []
    });
    
    return {
      lifestyle: response.data.lifestyle || [],
      diet: response.data.diet || [],
      exercise: response.data.exercise || [],
      medications: response.data.medications || [],
      followUp: response.data.followUp || null
    };
  } catch (error) {
    console.error('Recommendations generation error:', error);
    throw error;
  }
};

/**
 * Analyze health data for anomalies
 */
export const analyzeHealthAnomaly = async (currentData, historicalData) => {
  try {
    const response = await llmClient.post('/ai/analyze-anomaly', {
      current: currentData,
      historical: historicalData
    });
    
    return {
      anomalies: response.data.anomalies || [],
      riskLevel: response.data.riskLevel || 'normal',
      alerts: response.data.alerts || [],
      suggestions: response.data.suggestions || []
    };
  } catch (error) {
    console.error('Anomaly analysis error:', error);
    return {
      anomalies: [],
      riskLevel: 'unknown',
      alerts: [],
      suggestions: ['Please consult with your healthcare provider']
    };
  }
};

/**
 * Get emergency summary from medical data
 */
export const getEmergencySummary = async (patientData) => {
  try {
    const response = await llmClient.post('/ai/emergency-summary', {
      name: patientData.name,
      age: patientData.age,
      bloodGroup: patientData.bloodGroup,
      allergies: patientData.allergies || [],
      chronicConditions: patientData.chronicConditions || [],
      currentMedications: patientData.medications || [],
      lastReport: patientData.lastReport,
      vitals: patientData.vitals || {}
    });
    
    return {
      summary: response.data.summary,
      criticalInfo: response.data.criticalInfo || [],
      emergencyContacts: response.data.emergencyContacts || [],
      immediateActions: response.data.immediateActions || []
    };
  } catch (error) {
    console.error('Emergency summary error:', error);
    return {
      summary: `Patient: ${patientData.name}, Blood Group: ${patientData.bloodGroup}, Allergies: ${patientData.allergies?.join(', ')}`,
      criticalInfo: patientData.allergies || [],
      emergencyContacts: [],
      immediateActions: []
    };
  }
};

/**
 * Chat with medical AI assistant
 */
export const chatWithAI = async (message, context = {}) => {
  try {
    const response = await llmClient.post('/ai/chat', {
      message,
      context,
      type: 'medical-assistant'
    });
    
    return response.data.response;
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
};

export default llmClient;
