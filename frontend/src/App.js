import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NoteInput from './components/NoteInput';
import ResultCard from './components/ResultCard';
import ComparisonView from './components/ComparisonView';
import HistoryView from './components/HistoryView';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setAnalysisResult(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className={activeTab === 'home' ? '' : 'container mx-auto px-4 py-8'}>
          {activeTab === 'home' && (
            <HomePage onGetStarted={() => setActiveTab('analyze')} />
          )}
          
          {activeTab === 'analyze' && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <NoteInput 
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisComplete={handleAnalysisComplete}
                    loading={loading}
                  />
                </div>
                
                <div className="space-y-6">
                  {loading && (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                  )}
                  
                  {analysisResult && !loading && (
                    <ResultCard result={analysisResult} />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'compare' && (
            <ComparisonView />
          )}
          
          {activeTab === 'history' && (
            <HistoryView />
          )}
        </main>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#111827',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;