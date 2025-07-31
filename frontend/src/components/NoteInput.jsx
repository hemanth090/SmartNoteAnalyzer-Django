import React, { useState } from 'react';
import { Upload, Type, FileText, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeText, analyzeFile } from '../services/api';

const NoteInput = ({ onAnalysisStart, onAnalysisComplete, loading }) => {
  const [inputMethod, setInputMethod] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    onAnalysisStart();
    try {
      const result = await analyzeText(textInput);
      onAnalysisComplete(result);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      onAnalysisComplete(null);
    }
  };

  const handleFileAnalysis = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to analyze');
      return;
    }

    onAnalysisStart();
    try {
      const result = await analyzeFile(selectedFile);
      onAnalysisComplete(result);
      toast.success('File analysis completed successfully!');
    } catch (error) {
      // Handle specific error messages from backend
      if (error.response?.data?.error?.includes('OCR functionality is not available')) {
        toast.error('OCR service is temporarily unavailable. Please try again later or upload PDF/TXT files.');
      } else if (error.response?.data?.error?.includes('Unsupported file type')) {
        toast.error('Unsupported file format. Please upload PDF, TXT, or image files.');
      } else {
        toast.error('File analysis failed. Please try again.');
      }
      onAnalysisComplete(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // Check file type based on input method
      let allowedTypes = [];
      if (inputMethod === 'file') {
        allowedTypes = ['text/plain', 'application/pdf'];
      } else if (inputMethod === 'image') {
        allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff'];
      }

      if (!allowedTypes.includes(file.type)) {
        const expectedFormats = inputMethod === 'file' ? 'PDF or TXT' : 'image';
        toast.error(`Unsupported file type. Please upload ${expectedFormats} files only.`);
        return;
      }

      setSelectedFile(file);
    }
  };

  const inputMethods = [
    { id: 'text', label: 'Text Input', icon: Type },
    { id: 'file', label: 'File Upload (PDF, TXT)', icon: FileText },
    { id: 'image', label: 'Image OCR', icon: Image },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Analyze Your Notes
      </h2>

      {/* Input Method Selector */}
      <div className="flex space-x-2 mb-6">
        {inputMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => setInputMethod(method.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${inputMethod === method.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{method.label}</span>
            </button>
          );
        })}
      </div>

      {/* Text Input */}
      {inputMethod === 'text' && (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your notes here or type directly..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={handleTextAnalysis}
            disabled={loading || !textInput.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Type className="h-5 w-5" />
                <span>Analyze Text</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* File Upload */}
      {(inputMethod === 'file' || inputMethod === 'image') && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {inputMethod === 'image' 
                ? 'Upload an image file for OCR text extraction'
                : 'Upload a PDF or TXT file for analysis'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              {inputMethod === 'image'
                ? 'Supported formats: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF (Max size: 10MB)'
                : 'Supported formats: PDF, TXT (Max size: 10MB)'
              }
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept={inputMethod === 'image' 
                ? 'image/*' 
                : '.pdf,.txt'
              }
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>

          {selectedFile && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <button
            onClick={handleFileAnalysis}
            disabled={loading || !selectedFile}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                <span>Analyze File</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteInput;