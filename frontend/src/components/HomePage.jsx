import React from 'react';
import { 
  Brain, 
  FileText, 
  Image, 
  Upload, 
  Lightbulb, 
  Target, 
  BookOpen, 
  HelpCircle, 
  GitCompare, 
  Download,
  Zap,
  Eye,
  ArrowRight
} from 'lucide-react';

const HomePage = ({ onGetStarted }) => {
  const features = [
    {
      icon: FileText,
      title: "Multi-Input Analysis",
      description: "Analyze text directly, upload PDF/TXT files, or extract text from images using OCR",
      color: "bg-blue-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent summaries, key points, difficulty levels, and Bloom's taxonomy classification",
      color: "bg-purple-500"
    },
    {
      icon: Target,
      title: "Difficulty Assessment",
      description: "Automatically categorize content as Easy, Medium, or Hard based on complexity",
      color: "bg-green-500"
    },
    {
      icon: BookOpen,
      title: "Bloom's Taxonomy",
      description: "Classify content by cognitive levels: Remember, Understand, Apply, Analyze, Evaluate, Create",
      color: "bg-indigo-500"
    },
    {
      icon: Eye,
      title: "Interactive Mind Maps",
      description: "Visualize topic relationships and concepts with beautiful, interactive mind maps",
      color: "bg-pink-500"
    },
    {
      icon: HelpCircle,
      title: "Auto-Generated Quizzes",
      description: "Test your understanding with automatically generated multiple-choice questions",
      color: "bg-orange-500"
    },
    {
      icon: GitCompare,
      title: "Note Comparison",
      description: "Compare two notes to find similarities, differences, and semantic relationships",
      color: "bg-teal-500"
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Export your analysis results as professional PDF reports for sharing or archiving",
      color: "bg-red-500"
    }
  ];

  const inputMethods = [
    {
      icon: FileText,
      title: "Text Input",
      description: "Type or paste your notes directly"
    },
    {
      icon: Upload,
      title: "File Upload",
      description: "Upload PDF or TXT files"
    },
    {
      icon: Image,
      title: "Image OCR",
      description: "Extract text from images automatically"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Smart Note
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Analyzer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your notes into actionable insights with AI-powered analysis, interactive mind maps, and intelligent quizzes
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Input Methods */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Multiple Ways to Input Your Notes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {inputMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Powerful AI-Driven Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Unlock the full potential of your notes with our comprehensive analysis tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className={`${feature.color} p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Input", description: "Add your notes via text, file upload, or image" },
              { step: "2", title: "Analyze", description: "AI processes and extracts key insights" },
              { step: "3", title: "Explore", description: "View summaries, mind maps, and quizzes" },
              { step: "4", title: "Export", description: "Download results as PDF or share online" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Notes?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students and professionals who are already using Smart Note Analyzer
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
          >
            <Lightbulb className="h-5 w-5" />
            <span>Start Analyzing Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;