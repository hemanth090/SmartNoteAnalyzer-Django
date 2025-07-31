import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const QuizCard = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">❓</div>
        <p>No quiz questions available</p>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (showResults) {
    const score = calculateScore();
    const total = questions.length;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Quiz Results
          </h3>
          <div className={`text-4xl font-bold mb-4 ${getScoreColor(score, total)}`}>
            {score}/{total}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            You got {score} out of {total} questions correct!
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correct_answer;
            
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      {question.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        Your answer: <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {userAnswer || 'Not answered'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-gray-600 dark:text-gray-400">
                          Correct answer: <span className="text-green-600 dark:text-green-400">
                            {question.correct_answer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={resetQuiz}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Counter */}
      <div className="text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options && question.options.map((option, optionIndex) => {
            const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
            const isSelected = selectedAnswers[currentQuestion] === optionLetter;
            
            return (
              <button
                key={optionIndex}
                onClick={() => handleAnswerSelect(currentQuestion, optionLetter)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {optionLetter}
                  </span>
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion]}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;