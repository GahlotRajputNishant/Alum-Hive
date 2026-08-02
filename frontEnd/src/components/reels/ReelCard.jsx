import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Volume2, VolumeX, Music, Trash2 } from 'lucide-react';
import CommentsDrawer from './CommentsDrawer';

export default function ReelCard({ reel, isActive, onDeleteSuccess, currentUserId, currentUserRole }) {
  const videoRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(reel.commentsCount || 0);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const lastTap = useRef(0);

  const canDelete = currentUserRole === 'ADMIN' || (reel.creator && reel.creator.id === currentUserId);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels/${reel.id}/liked`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (err) {
        console.error('Error checking like status:', err);
      }
    };
    if (reel.id) {
      checkLikeStatus();
    }
  }, [reel.id]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Auto-play prevented by browser policy.");
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const handleToggleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels/${reel.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleVideoClick = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      if (!liked) {
        handleToggleLike();
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    } else {
      setIsMuted(prev => !prev);
    }
    lastTap.current = now;
  };

  const handleDeleteReel = async () => {
    if (window.confirm("Are you sure you want to delete this reel?")) {
      try {
        const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels/${reel.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          if (onDeleteSuccess) onDeleteSuccess(reel.id);
        }
      } catch (err) {
        console.error('Error deleting reel:', err);
      }
    }
  };

  return (
    <div className="reel-card">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="reel-video"
        loop
        muted={isMuted}
        onClick={handleVideoClick}
        playsInline
      />

      <div className={`double-tap-heart ${showHeartAnim ? 'animate' : ''}`}>
        <Heart fill="currentColor" size={80} />
      </div>

      <div
        onClick={() => setIsMuted(prev => !prev)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.5)',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          color: '#ffffff',
          zIndex: 15
        }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </div>

      <div className="reel-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={handleToggleLike}
            className="reel-action-btn"
            style={{ color: liked ? '#ef4444' : '#ffffff' }}
          >
            <Heart fill={liked ? '#ef4444' : 'none'} size={24} />
          </button>
          <span className="reel-action-label">{likesCount}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="reel-action-btn"
          >
            <MessageCircle size={24} />
          </button>
          <span className="reel-action-label">{commentsCount}</span>
        </div>

        {canDelete && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={handleDeleteReel}
              className="reel-action-btn"
              style={{ background: 'rgba(239, 68, 68, 0.25)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              <Trash2 size={24} style={{ color: '#ef4444' }} />
            </button>
            <span className="reel-action-label" style={{ color: '#ef4444' }}>Delete</span>
          </div>
        )}
      </div>

      <div className="reel-overlay">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <img
            src={reel.creator?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${reel.creator ? reel.creator.username : 'hive'}`}
            alt={reel.creator ? reel.creator.fullName : 'Hive Creator'}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
              {reel.creator ? reel.creator.fullName : 'Alumni'}
            </h4>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'rgba(139, 92, 246, 0.3)',
              color: 'var(--accent-purple)'
            }}>
              {reel.creator ? reel.creator.role : 'ALUMNI'}
            </span>
          </div>
        </div>

        <p style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          marginBottom: '12px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {reel.caption || "Sharing experiences from the tech world."}
        </p>

        <div className="music-marquee">
          <Music size={14} style={{ color: '#ffffff', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: '#ffffff' }}>Original Audio • Tech Series</span>
        </div>
      </div>

      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        reelId={reel.id}
        onCommentAdded={() => setCommentsCount(prev => prev + 1)}
      />
    </div>
  );
}
