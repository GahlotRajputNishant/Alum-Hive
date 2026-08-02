import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

export default function CommentsDrawer({ isOpen, onClose, reelId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && reelId) {
      const fetchComments = async () => {
        setFetching(true);
        try {
          const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels/${reelId}/comments`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setComments(data);
          }
        } catch (err) {
          console.error('Error fetching comments:', err);
        } finally {
          setFetching(false);
        }
      };

      fetchComments();
    }
  }, [isOpen, reelId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels/${reelId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data]);
        setNewComment('');
        if (onCommentAdded) onCommentAdded();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '65%',
      background: 'rgba(15, 23, 42, 0.96)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid var(--border-glass)',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ fontWeight: '700', fontSize: '1rem' }}>Comments ({comments.length})</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {fetching ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '20px' }}>Loading comments...</div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '40px' }}>
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map(c => {
            const commenter = c.commenter || {};
            return (
              <div key={c.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <img
                  src={commenter.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${commenter.username || 'user'}`}
                  alt={commenter.fullName || 'User'}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{commenter.fullName || 'Member'}</span>
                    {commenter.role && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        background: commenter.role === 'ALUMNI' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: commenter.role === 'ALUMNI' ? 'var(--accent-purple)' : 'var(--accent-blue)'
                      }}>
                        {commenter.role}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{c.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(3, 7, 18, 0.4)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          className="glass-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', fontSize: '0.875rem' }}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn-premium"
          style={{ padding: '10px 16px', borderRadius: '8px', flexShrink: 0 }}
          disabled={!newComment.trim() || loading}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
