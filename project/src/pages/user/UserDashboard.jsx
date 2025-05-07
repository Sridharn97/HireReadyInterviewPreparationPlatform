import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import MaterialCard from '../../components/user/MaterialCard';
import QuizCard from '../../components/user/QuizCard';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const { materials, quizzes, quizResults } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filter quiz results for current user
  const userQuizResults = quizResults.filter(result => result.userId === user.id);
  const completedQuizIds = userQuizResults.map(result => result.quizId);
  
  // Calculate stats
  const totalMaterials = materials.length;
  const totalQuizzes = quizzes.length;
  const completedQuizzes = userQuizResults.length;
  
  // Recent materials and quizzes
  const recentMaterials = [...materials]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);
  
  const pendingQuizzes = quizzes
    .filter(quiz => !completedQuizIds.includes(quiz.id))
    .slice(0, 3);
  
  return (
    <div className="user-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Welcome back, {user.name}!</h1>
          <p>Continue your learning journey with our latest materials and quizzes.</p>
        </div>
        <div className="welcome-image">
          <BookMarked size={48} />
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon materials-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{totalMaterials}</h3>
                <p className="stat-label">Learning Materials</p>
              </div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon quizzes-icon">
                <HelpCircle size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{totalQuizzes}</h3>
                <p className="stat-label">Available Quizzes</p>
              </div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon completed-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{completedQuizzes}</h3>
                <p className="stat-label">Completed Quizzes</p>
              </div>
            </Card>
          </div>
          
          <div className="section-title-row">
            <h2 className="section-title">Recent Materials</h2>
            <Link to="/materials" className="section-link">View All</Link>
          </div>
          
          <div className="materials-grid">
            {recentMaterials.length > 0 ? (
              recentMaterials.map(material => (
                <MaterialCard key={material.id} material={material} />
              ))
            ) : (
              <div className="empty-state">
                <p>No learning materials available yet</p>
              </div>
            )}
          </div>
          
          <div className="section-title-row">
            <h2 className="section-title">Quizzes to Take</h2>
            <Link to="/quizzes" className="section-link">View All</Link>
          </div>
          
          <div className="quizzes-grid">
            {pendingQuizzes.length > 0 ? (
              pendingQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            ) : (
              <div className="empty-state">
                <p>No pending quizzes available</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'materials' && (
        <div className="dashboard-section">
          <h2 className="page-title">Learning Materials</h2>
          
          {materials.length > 0 ? (
            <div className="materials-grid materials-grid-full">
              {materials.map(material => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No learning materials available yet</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'quizzes' && (
        <div className="dashboard-section">
          <h2 className="page-title">Available Quizzes</h2>
          
          {quizzes.length > 0 ? (
            <>
              <div className="section-title-row">
                <h3 className="section-subtitle">Pending Quizzes</h3>
              </div>
              
              <div className="quizzes-grid quizzes-grid-full">
                {pendingQuizzes.length > 0 ? (
                  quizzes
                    .filter(quiz => !completedQuizIds.includes(quiz.id))
                    .map(quiz => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))
                ) : (
                  <div className="empty-state">
                    <p>You've completed all available quizzes!</p>
                  </div>
                )}
              </div>
              
              {completedQuizzes > 0 && (
                <>
                  <div className="section-title-row">
                    <h3 className="section-subtitle">Completed Quizzes</h3>
                  </div>
                  
                  <div className="quizzes-grid quizzes-grid-full">
                    {quizzes
                      .filter(quiz => completedQuizIds.includes(quiz.id))
                      .map(quiz => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                      ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No quizzes available yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;