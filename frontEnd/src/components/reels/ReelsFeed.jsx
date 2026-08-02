import React, { useState, useEffect, useRef } from 'react';
import ReelCard from './ReelCard';
import SkeletonLoader from '../common/SkeletonLoader';

export default function ReelsFeed({ currentUser, showToast }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const containerRef = useRef(null);

  const fetchReels = async () => {
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReels(data);
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    if (reels.length === 0) return;

    const observerOptions = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'));
          setActiveReelIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        const children = containerRef.current.children;
        for (let i = 0; i < children.length; i++) {
          observer.observe(children[i]);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [reels]);

  const handleDeleteSuccess = (deletedId) => {
    setReels(prev => prev.filter(r => r.id !== deletedId));
    if (showToast) showToast('Reel deleted', 'info');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      width: '100%'
    }}>
      {loading ? (
        <SkeletonLoader count={1} type="card" />
      ) : reels.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No reels posted yet. Alumni can post reels from their dashboard!
        </div>
      ) : (
        <div ref={containerRef} className="reels-container">
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              data-index={index}
              style={{ width: '100%', height: '100%', flexShrink: 0 }}
            >
              <ReelCard
                reel={reel}
                isActive={index === activeReelIndex}
                onDeleteSuccess={handleDeleteSuccess}
                currentUserId={currentUser.userId}
                currentUserRole={currentUser.role}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
