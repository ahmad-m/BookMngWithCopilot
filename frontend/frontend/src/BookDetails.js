import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Loader bar styles
const loaderBarWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '120px',
  position: 'relative',
  zIndex: 2
};

const loaderBarStyle = {
  width: '180px',
  height: '8px',
  background: '#e0e0e0',
  borderRadius: '4px',
  overflow: 'hidden',
  marginBottom: '12px',
  position: 'relative'
};

const loaderBarInnerStyle = {
  height: '100%',
  width: '0%',
  background: 'linear-gradient(90deg, #1976d2 40%, #64b5f6 100%)',
  borderRadius: '4px',
  transition: 'width 0.5s linear'
};

// Enhanced card style for details
const cardStyle = {
  maxWidth: 480,
  margin: '0 auto',
  background: 'linear-gradient(-35deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '18px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  padding: '32px 28px',
  position: 'relative',
  transition: 'box-shadow 0.3s',
};

const iconStyle = {
//  fontSize: '2.5rem',
//  color: '#1976d2',
//  marginBottom: '12px',
  display: 'inline-block',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 500,
  color: '#22223b',
  marginBottom: '8px',
  marginLeft: '-4px',
  letterSpacing: '0.5px',
};

const subtitleStyle = {
  fontSize: '1.1rem',
  color: '#4a4e69',
  marginBottom: '16px',
  fontWeight: 500,
};

const descStyle = {
  fontSize: '1.05rem',
  color: '#22223b',
  marginBottom: '18px',
  lineHeight: 1.6,
  background: 'none',
  borderRadius: 0,
  padding: 0,
  boxShadow: 'none'
};

const publishedStyle = {
  fontSize: '0.98rem',
  color: '#6c757d',
  marginBottom: '0',
  fontStyle: 'italic',
};

const BookDetails = ({ id: propId, refreshKey }) => {
  const params = useParams();
  const id = propId || params.id;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setShowDetails(false);
    setProgress(0);

    let progressInterval;
    axios.get(`http://localhost:8080/api/books/${id}`)
      .then(response => {
        setBook(response.data);
        let elapsed = 0;
        const duration = 500; // 0.5s
        progressInterval = setInterval(() => {
          elapsed += 50;
          setProgress(Math.min(100, (elapsed / duration) * 100));
          if (elapsed >= duration) {
            clearInterval(progressInterval);
            setShowDetails(true);
            setLoading(false);
          }
        }, 50);
      })
      .catch(() => {
        setError('Failed to fetch book details');
        setLoading(false);
      });

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [id, refreshKey]);

  if (!id) return null;

  if (loading || !showDetails) {
    return (
      <div style={loaderBarWrapper}>
        <div style={loaderBarStyle}>
          <div
            style={{
              ...loaderBarInnerStyle,
              width: `${progress}%`
            }}
          />
        </div>
        <div style={{ color: '#1976d2', fontWeight: 500, fontSize: '1.1em' }}>Processing...</div>
      </div>
    );
  }
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div style={cardStyle}>

      <div style={titleStyle}><span style={iconStyle} role="img" aria-label="Book">📚</span>{book.title}</div>
      <div style={subtitleStyle}>By {book.author}</div>
      <div style={descStyle}>{book.description || <span style={{color:'#aaa'}}>No description provided.</span>}</div>
      <div style={publishedStyle}>Published: {book.publishedDate || 'N/A'}</div>
    </div>
  );
};

export default BookDetails;

