import React, { useState, useEffect } from 'react';
import { Clock, FileText, GitCompare, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAnalysisHistory } from '../services/api';

const HistoryView = () => {
  const [history, setHistory] = useState({ analyses: [], comparisons: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analyses');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getAnalysisHistory();
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getSimilarityColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Analysis History
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          View your previous note analyses and comparisons (private to your session)
        </p>
        {history.session_info && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Session Active • {history.session_info.total_analyses} analyses • {history.session_info.total_comparisons} comparisons
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('analyses')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
            activeTab === 'analyses'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Analyses ({history.analyses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('comparisons')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
            activeTab === 'comparisons'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <GitCompare className="h-4 w-4" />
          <span>Comparisons ({history.comparisons.length})</span>
        </button>
      </div>

      {/* Analyses Tab */}
      {activeTab === 'analyses' && (
        <div className="space-y-4">
          {history.analyses.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No analyses found</p>
            </div>
          ) : (
            history.analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(analysis.difficulty)}`}>
                        {analysis.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                        {analysis.bloom_level}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(analysis.created_at)}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {analysis.summary}
                    </p>
                    {analysis.tags && analysis.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {analysis.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedItem(analysis)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Comparisons Tab */}
      {activeTab === 'comparisons' && (
        <div className="space-y-4">
          {history.comparisons.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comparisons found</p>
            </div>
          ) : (
            history.comparisons.map((comparison) => (
              <div key={comparison.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColor(comparison.similarity_score)}`}>
                        {comparison.similarity_score}% Similar
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(comparison.created_at)}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comparison.comparison_summary}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(comparison)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedItem.summary ? 'Analysis Details' : 'Comparison Details'}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedItem.summary ? (
                // Analysis details
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Summary</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedItem.summary}</p>
                  </div>
                  
                  {selectedItem.key_points && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Points</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {selectedItem.key_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Difficulty</h4>
                      <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedItem.difficulty)}`}>
                        {selectedItem.difficulty}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bloom's Level</h4>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {selectedItem.bloom_level}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Comparison details
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-lg text-lg font-bold ${getSimilarityColor(selectedItem.similarity_score)}`}>
                      {selectedItem.similarity_score}% Similarity
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comparison Summary</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedItem.comparison_summary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;