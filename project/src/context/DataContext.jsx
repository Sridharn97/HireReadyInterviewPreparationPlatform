import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const API_BASE_URL = 'https://hirereadyinterviewpreparationplatform.onrender.com/api';

export const DataProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [materialsRes, quizzesRes, usersRes, quizResultsRes, interviewsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/materials`),
          fetch(`${API_BASE_URL}/quizzes`),
          fetch(`${API_BASE_URL}/auth/users`),
          fetch(`${API_BASE_URL}/quizResults`),
          fetch(`${API_BASE_URL}/interviews`)
        ]);

        if (!materialsRes.ok || !quizzesRes.ok || !usersRes.ok || !quizResultsRes.ok || !interviewsRes.ok) {
          throw new Error('Failed to fetch some data');
        }

        const materialsData = await materialsRes.json();
        const quizzesData = await quizzesRes.json();
        const usersData = await usersRes.json();
        const quizResultsData = await quizResultsRes.json();
        const interviewsData = await interviewsRes.json();

        setMaterials(materialsData);
        setQuizzes(quizzesData);
        setUsers(usersData);
        setQuizResults(quizResultsData);
        setInterviews(interviewsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Materials CRUD
  const addMaterial = async (material) => {
    try {
      const res = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });
      if (!res.ok) throw new Error('Failed to add material');
      const newMaterial = await res.json();
      setMaterials([...materials, newMaterial]);
      return newMaterial;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMaterial = async (updatedMaterial) => {
    try {
      const res = await fetch(`${API_BASE_URL}/materials/${updatedMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMaterial)
      });
      if (!res.ok) throw new Error('Failed to update material');
      const data = await res.json();
      setMaterials(materials.map(m => (m.id === data.id ? data : m)));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/materials/${materialId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete material');
      setMaterials(materials.filter(m => m.id !== materialId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getMaterial = (materialId) => {
    return materials.find(material => material.id === materialId);
  };

  // Quizzes CRUD
  const addQuiz = async (quiz) => {
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      });
      if (!res.ok) throw new Error('Failed to add quiz');
      const newQuiz = await res.json();
      setQuizzes([...quizzes, newQuiz]);
      return newQuiz;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateQuiz = async (updatedQuiz) => {
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/${updatedQuiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuiz)
      });
      if (!res.ok) throw new Error('Failed to update quiz');
      const data = await res.json();
      setQuizzes(quizzes.map(q => (q.id === data.id ? data : q)));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete quiz');
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getQuiz = (quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const addQuizResult = async (result) => {
    try {
      const res = await fetch(`${API_BASE_URL}/quizResults`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      if (!res.ok) throw new Error('Failed to add quiz result');
      const newResult = await res.json();
      setQuizResults([...quizResults, newResult]);
      return newResult;
    } catch (err) {
      setError(err.message);
      throw err;
    }
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
  const addInterview = async (interview) => {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interview)
      });
      if (!res.ok) throw new Error('Failed to add interview');
      const newInterview = await res.json();
      setInterviews([...interviews, newInterview]);
      return newInterview;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateInterview = async (updatedInterview) => {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${updatedInterview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInterview)
      });
      if (!res.ok) throw new Error('Failed to update interview');
      const data = await res.json();
      setInterviews(interviews.map(i => (i.id === data.id ? data : i)));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteInterview = async (interviewId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${interviewId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete interview');
      setInterviews(interviews.filter(i => i.id !== interviewId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
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
    error,
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