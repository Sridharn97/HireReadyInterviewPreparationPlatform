import React from 'react';
import './QuizQuestion.css';

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  selectedOption, 
  setSelectedOption,
  showResults = false,
}) => {
  const handleOptionSelect = (optionId) => {
    if (!showResults) {
      setSelectedOption(optionId);
    }
  };

  const getOptionClass = (option) => {
    if (!showResults) {
      return selectedOption === option.id ? 'selected' : '';
    }
    
    if (option.isCorrect) {
      return 'correct';
    } else if (selectedOption === option.id && !option.isCorrect) {
      return 'incorrect';
    }
    
    return '';
  };

  return (
    <div className="quiz-question">
      <h3 className="question-number">Question {questionNumber}</h3>
      <p className="question-text">{question.text}</p>
      
      <div className="options-list">
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`option ${getOptionClass(option)}`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="option-selector">
              {selectedOption === option.id ? (
                <div className="option-selector-inner"></div>
              ) : null}
            </div>
            <span className="option-text">{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;