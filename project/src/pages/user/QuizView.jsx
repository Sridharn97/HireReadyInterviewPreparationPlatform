import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import QuizQuestion from '../../components/user/QuizQuestion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './QuizView.css';

const QuizView = () => {
  const { quizId } = useParams();
  const { user } = useAuth();
  const { getQuiz, addQuizResult, getQuizResultByUserAndQuiz } = useData();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [existingResult, setExistingResult] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (quizId) {
      const foundQuiz = getQuiz(quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeRemaining(foundQuiz.timeLimit * 60); // Convert minutes to seconds
        
        // Check if user already took this quiz
        const result = getQuizResultByUserAndQuiz(user.id, quizId);
        if (result) {
          setExistingResult(result);
        }
      } else {
        navigate('/quizzes');
      }
    }
  }, [quizId, getQuiz, navigate, user.id, getQuizResultByUserAndQuiz]);
  
  // Timer countdown
  useEffect(() => {
    if (!quiz || quizSubmitted || existingResult) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quiz, quizSubmitted, existingResult]);
  
  if (!quiz) {
    return (
      <div className="quiz-view-page">
        <div className="quiz-not-found">
          <h2>Quiz Not Found</h2>
          <p>The quiz you're looking for doesn't exist or has been removed.</p>
          <Link to="/quizzes" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Quizzes</span>
          </Link>
        </div>
      </div>
    );
  }
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleSelectOption = (questionIndex, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: optionId
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;
    
    // Calculate score
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      const selectedOptionId = selectedOptions[index];
      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++;
        }
      }
    });
    
    const score = (correctAnswers / quiz.questions.length) * 100;
    
    const result = {
      id: Date.now().toString(),
      userId: user.id,
      quizId: quiz.id,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      selectedAnswers: selectedOptions,
      completedAt: new Date().toISOString(),
      timeSpent: (quiz.timeLimit * 60) - timeRemaining // in seconds
    };
    
    addQuizResult(result);
    setQuizResult(result);
    setQuizSubmitted(true);
  };
  
  // If user already completed this quiz, show results
  if (existingResult) {
    return (
      <div className="quiz-view-page">
        <div className="quiz-header">
          <Link to="/quizzes" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Quizzes</span>
          </Link>
          
          <div className={`quiz-category category-${quiz.category}`}>
            {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
          </div>
        </div>
        
        <div className="quiz-content-container">
          <h1 className="quiz-title">{quiz.title}</h1>
          <p className="quiz-description">{quiz.description}</p>
          
          <div className="quiz-result-summary">
            <div className="result-header">
              <h2>Quiz Already Completed</h2>
              <p>You've already taken this quiz. Here are your results:</p>
            </div>
            
            <div className="result-score-container">
              <div 
                className={`result-score-circle ${
                  existingResult.score >= 70 ? 'high-score' : 
                  existingResult.score >= 40 ? 'medium-score' : 'low-score'
                }`}
              >
                <span className="result-score-value">
                  {Math.round(existingResult.score)}%
                </span>
              </div>
              
              <div className="result-stats">
                <div className="result-stat-item">
                  <span className="result-stat-label">Correct Answers:</span>
                  <span className="result-stat-value">
                    {existingResult.correctAnswers} / {existingResult.totalQuestions}
                  </span>
                </div>
                <div className="result-stat-item">
                  <span className="result-stat-label">Completed On:</span>
                  <span className="result-stat-value">
                    {new Date(existingResult.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="result-actions">
              <Link to="/quizzes">
                <Button variant="primary">
                  Return to Quizzes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If quiz is submitted, show results
  if (quizSubmitted && quizResult) {
    return (
      <div className="quiz-view-page">
        <div className="quiz-header">
          <Link to="/quizzes" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Quizzes</span>
          </Link>
          
          <div className={`quiz-category category-${quiz.category}`}>
            {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
          </div>
        </div>
        
        <div className="quiz-content-container">
          <h1 className="quiz-title">{quiz.title}</h1>
          <p className="quiz-description">{quiz.description}</p>
          
          <div className="quiz-result-summary">
            <div className="result-header">
              <h2>Quiz Results</h2>
              <p>Here's how you did on this quiz:</p>
            </div>
            
            <div className="result-score-container">
              <div 
                className={`result-score-circle ${
                  quizResult.score >= 70 ? 'high-score' : 
                  quizResult.score >= 40 ? 'medium-score' : 'low-score'
                }`}
              >
                <span className="result-score-value">
                  {Math.round(quizResult.score)}%
                </span>
              </div>
              
              <div className="result-stats">
                <div className="result-stat-item">
                  <span className="result-stat-label">Correct Answers:</span>
                  <span className="result-stat-value">
                    {quizResult.correctAnswers} / {quizResult.totalQuestions}
                  </span>
                </div>
                <div className="result-stat-item">
                  <span className="result-stat-label">Time Spent:</span>
                  <span className="result-stat-value">
                    {Math.floor(quizResult.timeSpent / 60)}m {quizResult.timeSpent % 60}s
                  </span>
                </div>
              </div>
            </div>
            
            <h3 className="review-heading">Review Your Answers</h3>
            
            {quiz.questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedOption={selectedOptions[index]}
                setSelectedOption={() => {}}
                showResults={true}
              />
            ))}
            
            <div className="result-actions">
              <Link to="/quizzes">
                <Button variant="primary">
                  Return to Quizzes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz taking UI
  return (
    <div className="quiz-view-page">
      <div className="quiz-header">
        <Link to="/quizzes" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Quizzes</span>
        </Link>
        
        <div className="quiz-timer">
          <Clock size={16} />
          <span className={timeRemaining < 60 ? 'time-warning' : ''}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      
      <div className="quiz-content-container">
        <h1 className="quiz-title">{quiz.title}</h1>
        <p className="quiz-description">{quiz.description}</p>
        
        <div className="quiz-progress">
          <div className="quiz-progress-text">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-bar-fill"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="quiz-question-container">
          <QuizQuestion
            question={quiz.questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            selectedOption={selectedOptions[currentQuestionIndex]}
            setSelectedOption={(optionId) => handleSelectOption(currentQuestionIndex, optionId)}
            showResults={false}
          />
        </div>
        
        <div className="quiz-navigation">
          <Button 
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button 
              variant="primary"
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="accent"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </Button>
          )}
        </div>
        
        <div className="quiz-questions-overview">
          <div className="questions-overview-header">Questions Overview</div>
          <div className="questions-overview-grid">
            {quiz.questions.map((_, index) => {
              const isAnswered = selectedOptions[index] !== undefined;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  className={`question-number-button ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="questions-overview-legend">
            <div className="legend-item">
              <div className="legend-color current"></div>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <div className="legend-color answered"></div>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <div className="legend-color unanswered"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
        
        <div className="quiz-submit-container">
          {Object.keys(selectedOptions).length < quiz.questions.length ? (
            <div className="quiz-warning">
              <AlertTriangle size={16} />
              <span>You haven't answered all questions yet</span>
            </div>
          ) : (
            <div className="quiz-success">
              <CheckCircle size={16} />
              <span>All questions answered!</span>
            </div>
          )}
          
          <Button 
            variant="accent"
            size="large"
            fullWidth
            onClick={handleSubmitQuiz}
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;