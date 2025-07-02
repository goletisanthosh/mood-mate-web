
import React, { useState, useEffect } from 'react';
import { AIRecommendationService } from '../services/aiRecommendationService';

const AIInsights: React.FC = () => {
  const [improvements, setImprovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadImprovements();
  }, []);

  const loadImprovements = async () => {
    setLoading(true);
    try {
      const data = await AIRecommendationService.getAIImprovements();
      setImprovements(data);
    } catch (error) {
      console.error('Failed to load improvements:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    setAnalyzing(true);
    try {
      await AIRecommendationService.triggerImprovementAnalysis();
      // Reload improvements after analysis
      setTimeout(() => {
        loadImprovements();
      }, 2000);
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍽️';
      case 'music': return '🎵';
      case 'stay': return '🏨';
      default: return '💡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-800">Loading AI insights...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          🤖 AI Insights & Improvements
        </h3>
        <button
          onClick={triggerAnalysis}
          disabled={analyzing}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white rounded-lg transition-all duration-300 hover-lift disabled:cursor-not-allowed text-sm font-medium"
        >
          {analyzing ? '🔄 Analyzing...' : '🧠 Analyze Data'}
        </button>
      </div>

      {improvements.length === 0 ? (
        <div className="text-center text-gray-700 py-8">
          <div className="text-4xl mb-2">🤖</div>
          <p className="mb-4">No AI insights available yet.</p>
          <p className="text-sm text-gray-600">Click "Analyze Data" to generate intelligent improvement suggestions based on user patterns.</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
          <div className="space-y-4">
            {improvements.map((improvement, index) => (
              <div
                key={improvement.id || index}
                className="bg-white/10 rounded-lg p-4 border border-white/20 hover-lift transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getTypeIcon(improvement.improvement_type)}</span>
                    <span className="text-gray-800 font-medium capitalize">
                      {improvement.improvement_type} Improvement
                    </span>
                  </div>
                  {improvement.data_analysis?.priority && (
                    <span className={`text-xs px-2 py-1 rounded-full bg-white/20 ${getPriorityColor(improvement.data_analysis.priority)}`}>
                      {improvement.data_analysis.priority} priority
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                  {improvement.suggestion}
                </p>
                
                {improvement.data_analysis?.reasoning && (
                  <div className="text-gray-600 text-xs bg-white/5 rounded p-2 border-l-2 border-purple-400">
                    <strong>AI Reasoning:</strong> {improvement.data_analysis.reasoning}
                  </div>
                )}
                
                {(improvement.data_analysis?.targetMood || improvement.data_analysis?.targetWeather) && (
                  <div className="flex gap-2 mt-2">
                    {improvement.data_analysis.targetMood && (
                      <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
                        Mood: {improvement.data_analysis.targetMood}
                      </span>
                    )}
                    {improvement.data_analysis.targetWeather && (
                      <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full">
                        Weather: {improvement.data_analysis.targetWeather}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
