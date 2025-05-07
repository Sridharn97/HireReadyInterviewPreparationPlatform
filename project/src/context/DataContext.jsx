import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial sample data
import { sampleMaterials, sampleQuizzes, sampleUsers, sampleInterviews } from '../utils/sampleData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize data from localStorage or use sample data
    const storedMaterials = localStorage.getItem('materials');
    const storedQuizzes = localStorage.getItem('quizzes');
    const storedUsers = localStorage.getItem('users');
    const storedQuizResults = localStorage.getItem('quizResults');
    const storedInterviews = localStorage.getItem('interviews');
    
    setMaterials(storedMaterials ? JSON.parse(storedMaterials) : sampleMaterials);
    setQuizzes(storedQuizzes ? JSON.parse(storedQuizzes) : sampleQuizzes);
    setUsers(storedUsers ? JSON.parse(storedUsers) : sampleUsers);
    setQuizResults(storedQuizResults ? JSON.parse(storedQuizResults) : []);
    setInterviews(storedInterviews ? JSON.parse(storedInterviews) : sampleInterviews);
    
    setLoading(false);
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('materials', JSON.stringify(materials));
      localStorage.setItem('quizzes', JSON.stringify(quizzes));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
      localStorage.setItem('interviews', JSON.stringify(interviews));
    }
  }, [materials, quizzes, users, quizResults, interviews, loading]);
  
  // Materials CRUD
  const addMaterial = (material) => {
    setMaterials([...materials, material]);
    return material;
  };
  
  const updateMaterial = (updatedMaterial) => {
    setMaterials(materials.map(material => 
      material.id === updatedMaterial.id ? updatedMaterial : material
    ));
    return updatedMaterial;
  };
  
  const deleteMaterial = (materialId) => {
    setMaterials(materials.filter(material => material.id !== materialId));
  };
  
  const getMaterial = (materialId) => {
    return materials.find(material => material.id === materialId);
  };
  
  // Quizzes CRUD
  const addQuiz = (quiz) => {
    setQuizzes([...quizzes, quiz]);
    return quiz;
  };
  
  const updateQuiz = (updatedQuiz) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    ));
    return updatedQuiz;
  };
  
  const deleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
  };
  
  const getQuiz = (quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };
  
  // Quiz Results
  const addQuizResult = (result) => {
    setQuizResults([...quizResults, result]);
    return result;
  };
  
  const getUserQuizResults = (userId) => {
    return quizResults.filter(result => result.userId === userId);
  };
  
  const getQuizResultByUserAndQuiz = (userId, quizId) => {
    return quizResults.find(result => 
      result.userId === userId && result.quizId === quizId
    );
  };

  // Interview Experiences CRUD
  const addInterview = (interview) => {
    setInterviews([...interviews, interview]);
    return interview;
  };

  const updateInterview = (updatedInterview) => {
    setInterviews(interviews.map(interview =>
      interview.id === updatedInterview.id ? updatedInterview : interview
    ));
    return updatedInterview;
  };

  const deleteInterview = (interviewId) => {
    setInterviews(interviews.filter(interview => interview.id !== interviewId));
  };

  const getInterview = (interviewId) => {
    return interviews.find(interview => interview.id === interviewId);
  };

  const getUserInterviews = (userId) => {
    return interviews.filter(interview => interview.userId === userId);
  };
  
  const value = {
    materials,
    quizzes,
    users,
    setUsers,
    quizResults,
    interviews,
    loading,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterial,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    getQuiz,
    addQuizResult,
    getUserQuizResults,
    getQuizResultByUserAndQuiz,
    addInterview,
    updateInterview,
    deleteInterview,
    getInterview,
    getUserInterviews
  };
  
  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
};