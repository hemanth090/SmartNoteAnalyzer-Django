import React, { useState } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { compareNotes } from '../services/api';

const ComparisonView = () => {
  const [note1, setNote1] = useState('');
  const [note2, setNote2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!note1.trim() || !note2.trim()) {
      toast.error('Please enter both notes to compare');
      return;
    }

    setLoading(true);
    try {
      const result = await compareNotes(note1, note2);
      setComparison(result);
      toast.success('Comparison completed successfully!');
    } catch (error) {
      toast.error('Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSimilarityBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Compare Notes
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare two notes to find similarities and differences using AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Note 1 Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Note 1
          </h3>
          <textarea
            value={note1}
            onChange={(e) => setNote1(e.target.value)}
            placeholder="Enter your first note here..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Note 2 Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Note 2
          </h3>
          <textarea
            value={note2}
            onChange={(e) => setNote2(e.target.value)}
            placeholder="Enter your second note here..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Compare Button */}
      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={loading || !note1.trim() || !note2.trim()}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <GitCompare className="h-5 w-5" />
              <span>Compare Notes</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Comparison Results
          </h3>

          {/* Similarity Score */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`text-center p-6 rounded-xl ${getSimilarityBg(comparison.similarity_score)}`}>
                <div className={`text-4xl font-bold mb-2 ${getSimilarityColor(comparison.similarity_score)}`}>
                  {comparison.similarity_score}%
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Similarity Score
                </p>
              </div>
            </div>

            {/* Similarity Indicator */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  comparison.similarity_score >= 80 ? 'bg-green-500' :
                  comparison.similarity_score >= 60 ? 'bg-yellow-500' :
                  comparison.similarity_score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${comparison.similarity_score}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Very Different</span>
              <span>Somewhat Similar</span>
              <span>Very Similar</span>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Summary
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {comparison.comparison_summary}
            </p>
          </div>

          {/* Visual Comparison */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Note 1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {note1.substring(0, 100)}...
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <ArrowRight className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {comparison.similarity_score}% Match
                </span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-green-600 dark:text-green-400 font-semibold mb-2">
                Note 2
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {note2.substring(0, 100)}...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;