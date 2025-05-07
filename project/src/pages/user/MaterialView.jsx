import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import './MaterialView.css';

const MaterialView = () => {
  const { materialId } = useParams();
  const { getMaterial } = useData();
  const [material, setMaterial] = useState(null);
  
  useEffect(() => {
    if (materialId) {
      const foundMaterial = getMaterial(materialId);
      if (foundMaterial) {
        setMaterial(foundMaterial);
      }
    }
  }, [materialId, getMaterial]);
  
  if (!material) {
    return (
      <div className="material-view-page">
        <div className="material-not-found">
          <h2>Material Not Found</h2>
          <p>The learning material you're looking for doesn't exist or has been removed.</p>
          <Link to="/materials" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Materials</span>
          </Link>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Simple function to convert markdown-like syntax to HTML
  const formatContent = (content) => {
    let formattedContent = content;
    
    // Headers
    formattedContent = formattedContent.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    formattedContent = formattedContent.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    formattedContent = formattedContent.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Bold and Italic
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    formattedContent = formattedContent.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    formattedContent = formattedContent.replace(/<\/li>\n<li>/g, '</li><li>');
    formattedContent = formattedContent.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
    
    // Paragraphs
    formattedContent = formattedContent.replace(/^(?!<[ohl])(.*$)/gm, '<p>$1</p>');
    formattedContent = formattedContent.replace(/<\/p>\n<p>/g, '</p><p>');
    
    return formattedContent;
  };
  
  return (
    <div className="material-view-page">
      <div className="material-header">
        <Link to="/materials" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Materials</span>
        </Link>
        
        <div className={`material-category category-${material.category}`}>
          {material.category.charAt(0).toUpperCase() + material.category.slice(1)}
        </div>
      </div>
      
      <div className="material-content-container">
        <h1 className="material-title">{material.title}</h1>
        
        <div className="material-meta">
          <div className="material-meta-item">
            <Clock size={16} />
            <span>Updated {formatDate(material.updatedAt)}</span>
          </div>
          <div className="material-meta-item">
            <FileText size={16} />
            <span>Learning Material</span>
          </div>
        </div>
        
        <div className="material-description">
          {material.description}
        </div>
        
        <div 
          className="material-content"
          dangerouslySetInnerHTML={{ __html: formatContent(material.content) }}
        />
      </div>
    </div>
  );
};

export default MaterialView;