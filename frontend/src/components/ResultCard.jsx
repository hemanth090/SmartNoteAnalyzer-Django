import React, { useState } from 'react';
import {
    FileText,
    List,
    Award,
    Brain,
    Tag,
    HelpCircle,
    Share2,
    Download,
    BookOpen,
    Target,
    CheckCircle
} from 'lucide-react';
import GraphMap from './GraphMap';
import QuizCard from './QuizCard';
import ExportPDF from './ExportPDF';

const ResultCard = ({ result }) => {
    const [activeSection, setActiveSection] = useState('summary');

    if (!result) return null;

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getBloomColor = (level) => {
        const colors = {
            'remember': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'understand': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            'apply': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'analyze': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
            'evaluate': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            'create': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[level?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    const sections = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'keypoints', label: 'Key Points', icon: List },
        { id: 'learning', label: 'Learning', icon: BookOpen },
        { id: 'mindmap', label: 'Mind Map', icon: Share2 },
        { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden fade-in">
            {/* Header with badges */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
                <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(result.difficulty)}`}>
                        <Award className="h-4 w-4 inline mr-1" />
                        {result.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBloomColor(result.bloom_level)}`}>
                        <Brain className="h-4 w-4 inline mr-1" />
                        {result.bloom_level}
                    </span>
                    {result.tags && result.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                            <Tag className="h-3 w-3 inline mr-1" />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-1 p-1">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeSection === section.id
                                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{section.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeSection === 'summary' && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Comprehensive Summary</h4>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <div className="p-6">
                                <div className="max-w-none">
                                    {result.summary && (() => {
                                        // Split summary into sentences and group them into paragraphs
                                        const sentences = result.summary.split(/(?<=[.!?])\s+/).filter(s => s.trim());
                                        const paragraphs = [];
                                        
                                        // Group sentences into paragraphs (4-5 sentences each for better readability)
                                        for (let i = 0; i < sentences.length; i += 4) {
                                            paragraphs.push(sentences.slice(i, i + 4).join(' '));
                                        }
                                        
                                        return paragraphs.map((paragraph, index) => (
                                            <p key={index} className="text-gray-800 dark:text-gray-200 leading-7 mb-5 text-base font-normal text-left">
                                                {paragraph}
                                            </p>
                                        ));
                                    })()}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        <span>
                                            {result.summary ? `${result.summary.split(' ').length} words • ${result.summary.split(/[.!?]/).length - 1} sentences` : 'Summary statistics unavailable'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        <span>
                                            {result.summary ? `~${Math.ceil(result.summary.split(' ').length / 200)} min read` : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'keypoints' && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Comprehensive Key Points</h4>
                        <div className="space-y-4">
                            {result.key_points && result.key_points.map((point, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-primary-500">
                                    <div className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-700 dark:text-gray-300 leading-7 text-left">
                                                {point}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                                <List className="h-4 w-4 mr-2" />
                                <span>
                                    {result.key_points ? `${result.key_points.length} comprehensive key points identified` : 'Key points unavailable'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'learning' && (
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Details</h4>

                        {/* Learning Objectives */}
                        {result.learning_objectives && result.learning_objectives.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <h5 className="flex items-center text-md font-medium text-blue-800 dark:text-blue-200 mb-3">
                                    <Target className="h-4 w-4 mr-2" />
                                    Learning Objectives
                                </h5>
                                <ul className="space-y-2">
                                    {result.learning_objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-blue-700 dark:text-blue-300">
                                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Prerequisites */}
                        {result.prerequisites && result.prerequisites.length > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                <h5 className="flex items-center text-md font-medium text-orange-800 dark:text-orange-200 mb-3">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Prerequisites
                                </h5>
                                <ul className="space-y-2">
                                    {result.prerequisites.map((prereq, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-orange-700 dark:text-orange-300">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span className="text-sm">{prereq}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Applications */}
                        {result.applications && result.applications.length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <h5 className="flex items-center text-md font-medium text-green-800 dark:text-green-200 mb-3">
                                    <Award className="h-4 w-4 mr-2" />
                                    Real-World Applications
                                </h5>
                                <ul className="space-y-2">
                                    {result.applications.map((application, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-green-700 dark:text-green-300">
                                            <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span className="text-sm">{application}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'mindmap' && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Mind Map</h4>
                        <div className="h-96 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <GraphMap data={result.topic_graph} />
                        </div>
                    </div>
                )}

                {activeSection === 'quiz' && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz Questions</h4>
                        <QuizCard questions={result.quiz_questions} />
                    </div>
                )}
            </div>

            {/* Export Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <ExportPDF result={result} />
            </div>
        </div>
    );
};

export default ResultCard;