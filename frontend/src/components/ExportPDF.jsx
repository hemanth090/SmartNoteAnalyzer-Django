import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const ExportPDF = ({ result }) => {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addWrappedText = (text, x, y, maxWidth, fontSize = 12) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Smart Note Analysis Report', margin, yPosition);
      yPosition += 15;

      // Date
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 20;

      // Difficulty and Bloom's Level
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Analysis Overview', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Difficulty Level: ${result.difficulty || 'N/A'}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Bloom's Taxonomy Level: ${result.bloom_level || 'N/A'}`, margin, yPosition);
      yPosition += 15;

      // Tags
      if (result.tags && result.tags.length > 0) {
        doc.text(`Tags: ${result.tags.join(', ')}`, margin, yPosition);
        yPosition += 15;
      }

      // Summary
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Summary', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      yPosition = addWrappedText(
        result.summary || 'No summary available',
        margin,
        yPosition,
        pageWidth - 2 * margin
      );
      yPosition += 10;

      // Key Points
      if (result.key_points && result.key_points.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Key Points', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        result.key_points.forEach((point, index) => {
          const bulletPoint = `${index + 1}. ${point}`;
          yPosition = addWrappedText(
            bulletPoint,
            margin,
            yPosition,
            pageWidth - 2 * margin
          );
          yPosition += 5;

          // Add new page if needed
          if (yPosition > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPosition = margin;
          }
        });
        yPosition += 10;
      }

      // Quiz Questions
      if (result.quiz_questions && result.quiz_questions.length > 0) {
        // Add new page for quiz if needed
        if (yPosition > doc.internal.pageSize.height - 100) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Quiz Questions', margin, yPosition);
        yPosition += 10;

        result.quiz_questions.forEach((question, index) => {
          // Question
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          yPosition = addWrappedText(
            `Q${index + 1}: ${question.question}`,
            margin,
            yPosition,
            pageWidth - 2 * margin
          );
          yPosition += 5;

          // Options
          doc.setFont(undefined, 'normal');
          if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option, optionIndex) => {
              const optionLetter = String.fromCharCode(65 + optionIndex);
              const isCorrect = optionLetter === question.correct_answer;
              const optionText = `${optionLetter}) ${option}${isCorrect ? ' ✓' : ''}`;
              
              yPosition = addWrappedText(
                optionText,
                margin + 10,
                yPosition,
                pageWidth - 2 * margin - 10
              );
              yPosition += 3;
            });
          }
          yPosition += 8;

          // Add new page if needed
          if (yPosition > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPosition = margin;
          }
        });
      }

      // Topic Graph (simplified text representation)
      if (result.topic_graph && result.topic_graph.length > 0) {
        // Add new page if needed
        if (yPosition > doc.internal.pageSize.height - 100) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Topic Structure', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        result.topic_graph.forEach((topic) => {
          yPosition = addWrappedText(
            `• ${topic.label || topic.id}`,
            margin,
            yPosition,
            pageWidth - 2 * margin,
            12
          );
          
          if (topic.children && Array.isArray(topic.children)) {
            topic.children.forEach((child) => {
              yPosition = addWrappedText(
                `  - ${child}`,
                margin + 10,
                yPosition,
                pageWidth - 2 * margin - 10,
                10
              );
            });
          }
          yPosition += 5;
        });
      }

      // Save the PDF
      doc.save('note-analysis-report.pdf');
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
    >
      <Download className="h-4 w-4" />
      <span>Export as PDF</span>
    </button>
  );
};

export default ExportPDF;