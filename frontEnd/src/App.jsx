import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Sidebar from './components/dashboards/Sidebar';
import StudentDashboard from './components/dashboards/StudentDashboard';
import AlumniDashboard from './components/dashboards/AlumniDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import JobsBoard from './components/dashboards/JobsBoard';
import EventsSection from './components/dashboards/EventsSection';
import PhotosGallery from './components/dashboards/PhotosGallery';
import ProfilePage from './components/ProfilePage';
import ReelsFeed from './components/reels/ReelsFeed';
import Toast from './components/common/Toast';

export default function App() {
  const [showLanding, setShowLanding] = useState(!localStorage.getItem('token'));
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: 'info' });
  };

  // Fetch Dashboard statistics based on role
  const fetchStats = async (authToken) => {
    if (!authToken) return;
    setLoadingStats(true);
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats(token);
    }
  }, [token]);

  const handleLoginSuccess = (data) => {
    setToken(data.token);
    const userProfile = {
      userId: data.userId,
      username: data.username,
      role: data.role,
      fullName: data.fullName
    };
    setUser(userProfile);
    setShowLanding(false);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${data.fullName}!`, 'success');
  };

  const handleRegisterSuccess = (data) => {
    setToken(data.token);
    const userProfile = {
      userId: data.userId,
      username: data.username,
      role: data.role,
      fullName: data.fullName
    };
    setUser(userProfile);
    setShowLanding(false);
    setActiveTab('dashboard');
    showToast(`Account created successfully! Welcome to Alumni Hive.`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setStats({});
    setActiveTab('dashboard');
    setShowLanding(true);
    showToast('Logged out successfully', 'info');
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(prev => ({
      ...prev,
      fullName: updatedUser.fullName,
      profilePicture: updatedUser.profilePicture
    }));
    fetchStats(token);
  };

  // If user clicks landing page CTAs or is non-authenticated
  if (showLanding && (!token || !user)) {
    if (isRegistering) {
      return (
        <>
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            switchToLogin={() => setIsRegistering(false)}
            onBackToHome={() => setShowLanding(true)}
          />
          <Toast type={toast.type} message={toast.message} onClose={clearToast} />
        </>
      );
    }

    return (
      <>
        <HomePage
          onNavigateToLogin={() => {
            setIsRegistering(false);
            setShowLanding(false);
          }}
          onNavigateToRegister={() => {
            setIsRegistering(true);
            setShowLanding(false);
          }}
        />
        <Toast type={toast.type} message={toast.message} onClose={clearToast} />
      </>
    );
  }

  // If visiting auth screens directly
  if (!token || !user) {
    return isRegistering ? (
      <>
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          switchToLogin={() => setIsRegistering(false)}
          onBackToHome={() => setShowLanding(true)}
        />
        <Toast type={toast.type} message={toast.message} onClose={clearToast} />
      </>
    ) : (
      <>
        <Login
          onLoginSuccess={handleLoginSuccess}
          switchToRegister={() => setIsRegistering(true)}
          onBackToHome={() => setShowLanding(true)}
        />
        <Toast type={toast.type} message={toast.message} onClose={clearToast} />
      </>
    );
  }

  // Render tab contents based on active tab and role
  const renderTabContent = () => {
    if (loadingStats) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          color: 'var(--text-secondary)'
        }}>
          Loading dashboard metrics...
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'STUDENT') {
          return <StudentDashboard stats={stats} setStats={setStats} showToast={showToast} />;
        }
        if (user.role === 'ALUMNI') {
          return (
            <AlumniDashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stats={stats}
              setStats={setStats}
              showToast={showToast}
            />
          );
        }
        if (user.role === 'ADMIN') {
          return (
            <AdminDashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stats={stats}
              setStats={setStats}
              showToast={showToast}
            />
          );
        }
        return <div style={{ color: 'var(--text-secondary)' }}>Unknown Role Dashboard</div>;

      case 'jobs':
        return <JobsBoard showToast={showToast} />;

      case 'reels':
        return <ReelsFeed currentUser={user} showToast={showToast} />;

      case 'events':
        return <EventsSection user={user} showToast={showToast} />;

      case 'photos':
        return <PhotosGallery user={user} showToast={showToast} />;

      case 'profile':
        return <ProfilePage user={user} onProfileUpdated={handleProfileUpdated} showToast={showToast} />;

      case 'post-job':
      case 'post-reel':
        if (user.role === 'ALUMNI') {
          return (
            <AlumniDashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stats={stats}
              setStats={setStats}
              showToast={showToast}
            />
          );
        }
        return <div style={{ color: '#ef4444' }}>Unauthorized Panel</div>;

      case 'users':
        if (user.role === 'ADMIN') {
          return (
            <AdminDashboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stats={stats}
              setStats={setStats}
              showToast={showToast}
            />
          );
        }
        return <div style={{ color: '#ef4444' }}>Unauthorized Panel</div>;

      default:
        return <div style={{ color: 'var(--text-secondary)' }}>Page Not Found</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {renderTabContent()}
      </main>

      {/* Global Toast */}
      <Toast type={toast.type} message={toast.message} onClose={clearToast} />
    </div>
  );
}
