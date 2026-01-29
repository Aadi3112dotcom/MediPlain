import { useState, useEffect } from "react";
import Modal from "./Modal";
import { explainMedicalReport, generateHealthRecommendations } from "../services/aiService";
import toast from 'react-hot-toast';
import "./ExplainReport.css";

export default function ExplainReport({ extractedText, healthData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default insights and recommendations
  const defaultInsights = [
    {
      category: "Blood Sugar",
      status: "good",
      icon: "✓",
      description: "Normal range - No immediate concerns. Keep your current healthy habits!"
    },
    {
      category: "Hemoglobin",
      status: "warning",
      icon: "⚠️",
      description: "Slightly low. This may cause occasional tiredness. Consider iron-rich foods."
    },
    {
      category: "Cholesterol",
      status: "info",
      icon: "ℹ️",
      description: "Within normal range. Continue regular exercise for optimal health."
    }
  ];

  const defaultRecommendations = [
    "Increase water intake to stay hydrated",
    "Include more leafy greens in your diet for iron",
    "Exercise for at least 30 minutes daily",
    "Get regular sleep (7-8 hours per night)",
    "Reduce sodium intake",
    "Schedule follow-up with doctor in 3 months"
  ];

  useEffect(() => {
    setInsights(defaultInsights);
    setRecommendations(defaultRecommendations);
  }, []);

  const handleExplainReport = async () => {
    if (!extractedText) {
      toast.error('Please upload a report first');
      return;
    }

    setLoading(true);
    try {
      // Get AI explanation
      const explanation = await explainMedicalReport({
        text: extractedText
      });

      // Parse insights from explanation
      const parsedInsights = explanation.keyFindings?.map((finding, idx) => ({
        category: finding.split(':')[0] || 'Finding',
        status: finding.includes('abnormal') || finding.includes('high') ? 'warning' : 'good',
        icon: finding.includes('abnormal') ? '⚠️' : '✓',
        description: finding
      })) || defaultInsights;

      setInsights(parsedInsights);

      // Get recommendations
      const recs = await generateHealthRecommendations(healthData || {}, extractedText);
      const recommendationsList = [
        ...recs.lifestyle || [],
        ...recs.diet || [],
        ...recs.exercise || [],
        ...recs.medications || []
      ];

      setRecommendations(recommendationsList.length > 0 ? recommendationsList : defaultRecommendations);
      toast.success('Report analyzed successfully!');
    } catch (error) {
      console.error('Error explaining report:', error);
      toast.error('Failed to analyze report. Using default insights.');
      setInsights(defaultInsights);
      setRecommendations(defaultRecommendations);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card explain-card">
        <div className="card-header">
          <span className="card-icon">🤖</span>
          <h3>AI Health Insights</h3>
        </div>

        <div className="insights-container">
          {insights.map((insight, idx) => (
            <div key={idx} className={`insight-item ${insight.status}`}>
              <span className="insight-icon">{insight.icon}</span>
              <div className="insight-content">
                <strong>{insight.category}:</strong>
                <p>{insight.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="empathetic-message">
          <span className="heart-emoji">💙</span>
          <p>Don't worry — these results are manageable and common. Consult your doctor for personalized advice.</p>
        </div>

        {extractedText && (
          <div className="extracted-info">
            <p className="extracted-label">📄 Found extracted medical data</p>
          </div>
        )}

        <button className="detail-btn" onClick={() => setIsModalOpen(true)}>
          View Detailed Report & Recommendations
        </button>

        <button 
          className="analyze-btn" 
          onClick={handleExplainReport}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '🔍 AI Analyze Report'}
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="📊 Detailed Health Report"
      >
        <div className="modal-content-detailed">
          <h3>Health Analysis Summary</h3>
          <p>Based on your recent medical reports and health data, here's a comprehensive analysis:</p>

          <h4>Current Health Metrics</h4>
          <ul>
            {insights.map((insight, idx) => (
              <li key={idx}>
                <strong>{insight.category}:</strong> {insight.description}
              </li>
            ))}
          </ul>

          <h4>Personalized Recommendations</h4>
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>

          <h4>When to Seek Medical Help</h4>
          <ul>
            <li>If you experience unexplained fatigue lasting more than 2 weeks</li>
            <li>If you develop unusual symptoms or allergic reactions</li>
            <li>If blood tests show significant changes from baseline</li>
            <li>If prescribed medications cause adverse effects</li>
          </ul>

          {extractedText && (
            <div className="extracted-text-section">
              <h4>📄 Extracted Medical Text</h4>
              <div className="extracted-text-display">
                {extractedText.substring(0, 500)}...
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button className="modal-btn modal-btn-primary" onClick={() => setIsModalOpen(false)}>
              Got It
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
