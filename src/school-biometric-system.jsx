import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as faceapi from 'face-api.js';
import { Shield, UserPlus, ScanFace, LayoutDashboard, Home, Users, CheckCircle, XCircle, AlertCircle, Trash2, Camera, User, Mail, Hash, Briefcase } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Main App Component
const BiometricAccessSystem = () => {
  const [currentView, setCurrentView] = useState('home');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --primary-light: #3b82f6;
          --secondary: #64748b;
          --success: #10b981;
          --danger: #ef4444;
          --warning: #f59e0b;
          --background: #f8fafc;
          --surface: #ffffff;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --border: #e2e8f0;
          --border-light: #f1f5f9;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--background);
          color: var(--text-primary);
          line-height: 1.5;
        }

        .app-container {
          min-height: 100vh;
          background: var(--background);
          display: flex;
          flex-direction: column;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .logo svg {
          color: var(--primary);
        }

        .nav-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--surface);
          color: var(--text-primary);
        }

        .btn:hover {
          background: var(--background);
          border-color: var(--primary);
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .btn-primary:hover {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
        }

        .btn-danger {
          background: var(--danger);
          color: white;
          border-color: var(--danger);
        }

        .btn-danger:hover {
          background: #dc2626;
          border-color: #dc2626;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn svg {
          width: 16px;
          height: 16px;
        }

        .main-content {
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
        }

        .footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 2rem;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .footer-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--border);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .status-badge {
          position: fixed;
          top: 5rem;
          right: 2rem;
          padding: 0.5rem 1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 99;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .home-view {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .action-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-card:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          background: var(--primary);
          color: white;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .card-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .content-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .card-header {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-label svg {
          width: 16px;
          height: 16px;
          color: var(--text-secondary);
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          color: var(--text-primary);
          background: var(--surface);
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .camera-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: #000;
          border-radius: 0.5rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .camera-container video,
        .camera-container canvas {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .camera-container canvas {
          position: absolute;
          top: 0;
          left: 0;
        }

        .alert {
          padding: 0.875rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .alert svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .alert-info {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .button-group .btn {
          flex: 1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .tabs {
          display: flex;
          gap: 0.25rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .data-table {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          background: var(--background);
          padding: 0.875rem 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table td {
          padding: 1rem;
          border-top: 1px solid var(--border-light);
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .table tr:hover {
          background: var(--background);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge-student {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge-lecturer {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-staff {
          background: #e9d5ff;
          color: #6b21a8;
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          color: var(--border);
        }

        .verification-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .result-icon {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
        }

        .result-name {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }

        .result-role {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.25rem;
        }

        .result-confidence {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .checkbox-label:hover {
          background: var(--background);
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }

          .main-content {
            padding: 1rem;
          }

          .action-cards {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }

          .nav-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="content">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <Shield size={24} />
              <span>Biometric Access System</span>
            </div>
            <nav className="nav-buttons">
              <button 
                className="btn" 
                onClick={() => setCurrentView('home')}
              >
                <Home size={16} />
                Home
              </button>
              <button 
                className="btn" 
                onClick={() => setCurrentView('dashboard')}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            </nav>
          </div>
        </header>

        {modelsLoaded && (
          <div className="status-badge">
            <div className="status-dot"></div>
            <span>System Ready</span>
          </div>
        )}

        <main className="main-content">
          {!modelsLoaded ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <div className="loading-text">Initializing Biometric System...</div>
            </div>
          ) : currentView === 'home' ? (
            <HomeView setCurrentView={setCurrentView} />
          ) : currentView === 'register' ? (
            <RegisterView setCurrentView={setCurrentView} />
          ) : currentView === 'verify' ? (
            <VerifyView setCurrentView={setCurrentView} />
          ) : currentView === 'dashboard' ? (
            <DashboardView setCurrentView={setCurrentView} />
          ) : null}
        </main>

        <footer className="footer">
          <div className="footer-content">
            © {new Date().getFullYear()} <a href="https://ianotollo.vercel.app" target="_blank" rel="noopener noreferrer" className="footer-link">Ian Otollo</a>. All rights reserved.
          </div>
        </footer>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Processing...</div>
        </div>
      )}
    </div>
  );
};

// Home View Component
const HomeView = ({ setCurrentView }) => {
  return (
    <div className="home-view">
      <div className="page-header">
        <h1 className="page-title">Biometric Access Control</h1>
        <p className="page-subtitle">
          Secure facial recognition system for institutional access management
        </p>
      </div>
      
      <div className="action-cards">
        <div className="action-card" onClick={() => setCurrentView('register')}>
          <div className="card-icon">
            <UserPlus size={24} />
          </div>
          <h3 className="card-title">Register New User</h3>
          <p className="card-description">
            Enroll students, lecturers, and staff members into the system
          </p>
        </div>
        
        <div className="action-card" onClick={() => setCurrentView('verify')}>
          <div className="card-icon">
            <ScanFace size={24} />
          </div>
          <h3 className="card-title">Verify Access</h3>
          <p className="card-description">
            Scan face for instant verification and entry authorization
          </p>
        </div>
        
        <div className="action-card" onClick={() => setCurrentView('dashboard')}>
          <div className="card-icon">
            <LayoutDashboard size={24} />
          </div>
          <h3 className="card-title">View Dashboard</h3>
          <p className="card-description">
            Monitor access logs and manage registered users
          </p>
        </div>
      </div>
    </div>
  );
};

// Register View Component
const RegisterView = ({ setCurrentView }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    role: 'student',
    email: ''
  });
  const [capturedDescriptor, setCapturedDescriptor] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Camera access denied' });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureFace = async () => {
    setIsCapturing(true);
    setMessage({ type: 'info', text: 'Analyzing face...' });

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        setCapturedDescriptor(Array.from(detections.descriptor));
        setMessage({ type: 'success', text: 'Face captured successfully!' });
        
        const canvas = canvasRef.current;
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      } else {
        setMessage({ type: 'error', text: 'No face detected. Please position your face clearly.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error capturing face' });
    }

    setIsCapturing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!capturedDescriptor) {
      setMessage({ type: 'error', text: 'Please capture your face first' });
      return;
    }

    if (!formData.name || !formData.idNumber) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    try {
      setMessage({ type: 'info', text: 'Registering user...' });

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name,
            id_number: formData.idNumber,
            role: formData.role,
            email: formData.email,
            face_descriptor: capturedDescriptor,
            registered_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Registration successful!' });
      
      await supabase.from('access_logs').insert([{
        user_id: formData.idNumber,
        name: formData.name,
        action: 'registered',
        timestamp: new Date().toISOString()
      }]);

      setTimeout(() => {
        setCurrentView('home');
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Registration failed' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Register New User</h1>
        <p className="page-subtitle">Enroll a new member into the biometric system</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' && <CheckCircle />}
          {message.type === 'error' && <XCircle />}
          {message.type === 'info' && <AlertCircle />}
          {message.text}
        </div>
      )}

      <div className="form-grid">
        <div className="content-card">
          <h3 className="card-header">Face Capture</h3>
          <div className="camera-container">
            <video ref={videoRef} autoPlay muted />
            <canvas ref={canvasRef} />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={captureFace}
            disabled={isCapturing}
            style={{ width: '100%' }}
          >
            <Camera size={16} />
            {isCapturing ? 'Capturing...' : capturedDescriptor ? 'Recapture Face' : 'Capture Face'}
          </button>
        </div>

        <div className="content-card">
          <h3 className="card-header">User Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Full Name *
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                ID Number *
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Briefcase size={16} />
                Role *
              </label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="staff">Support Staff</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="button-group">
              <button type="button" className="btn" onClick={() => setCurrentView('home')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Register User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Verify View Component
const VerifyView = ({ setCurrentView }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [continuousMode, setContinuousMode] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    let interval;
    if (continuousMode) {
      interval = setInterval(() => {
        verifyFace();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [continuousMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const verifyFace = async () => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setVerificationResult({
          success: false,
          message: 'No face detected',
          type: 'warning'
        });
        setIsVerifying(false);
        return;
      }

      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      const { data: users, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;

      if (!users || users.length === 0) {
        setVerificationResult({
          success: false,
          message: 'No registered users found',
          type: 'error'
        });
        setIsVerifying(false);
        return;
      }

      const threshold = 0.6;
      let bestMatch = null;
      let bestDistance = 1;

      for (const user of users) {
        if (user.face_descriptor) {
          const descriptor = new Float32Array(user.face_descriptor);
          const distance = faceapi.euclideanDistance(detections.descriptor, descriptor);
          
          if (distance < threshold && distance < bestDistance) {
            bestDistance = distance;
            bestMatch = user;
          }
        }
      }

      if (bestMatch) {
        await supabase.from('access_logs').insert([{
          user_id: bestMatch.id_number,
          name: bestMatch.name,
          role: bestMatch.role,
          action: 'access_granted',
          timestamp: new Date().toISOString(),
          confidence: (1 - bestDistance) * 100
        }]);

        setVerificationResult({
          success: true,
          user: bestMatch,
          confidence: ((1 - bestDistance) * 100).toFixed(1),
          type: 'success'
        });

        if (continuousMode) {
          setTimeout(() => setVerificationResult(null), 3000);
        }
      } else {
        await supabase.from('access_logs').insert([{
          user_id: 'unknown',
          name: 'Unknown Person',
          action: 'access_denied',
          timestamp: new Date().toISOString()
        }]);

        setVerificationResult({
          success: false,
          message: 'Face not recognized - Access Denied',
          type: 'error'
        });

        if (continuousMode) {
          setTimeout(() => setVerificationResult(null), 3000);
        }
      }

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Verification error',
        type: 'error'
      });
    }

    setIsVerifying(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Access Verification</h1>
        <p className="page-subtitle">Scan face for instant entry authorization</p>
      </div>

      <div className="content-card">
        <div className="camera-container">
          <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
          
          {verificationResult && (
            <div className="verification-overlay">
              {verificationResult.success ? (
                <>
                  <CheckCircle className="result-icon" color="#10b981" />
                  <div className="result-name">
                    {verificationResult.user.name}
                  </div>
                  <div className="result-role">
                    {verificationResult.user.role.toUpperCase()}
                  </div>
                  <div className="result-confidence">
                    Confidence: {verificationResult.confidence}%
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="result-icon" color="#ef4444" />
                  <div className="result-name">
                    Access Denied
                  </div>
                  <div className="result-role">
                    {verificationResult.message}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={verifyFace}
            disabled={isVerifying || continuousMode}
            style={{ flex: 1 }}
          >
            <ScanFace size={16} />
            {isVerifying ? 'Verifying...' : 'Verify Face'}
          </button>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={continuousMode}
              onChange={(e) => setContinuousMode(e.target.checked)}
            />
            <span>Continuous Mode</span>
          </label>

          <button 
            className="btn" 
            onClick={() => setCurrentView('home')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ setCurrentView }) => {
  const [users, setUsers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, students: 0, lecturers: 0, staff: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('registered_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      const studentCount = usersData?.filter(u => u.role === 'student').length || 0;
      const lecturerCount = usersData?.filter(u => u.role === 'lecturer').length || 0;
      const staffCount = usersData?.filter(u => u.role === 'staff').length || 0;

      setStats({
        total: usersData?.length || 0,
        students: studentCount,
        lecturers: lecturerCount,
        staff: staffCount
      });

      const { data: logsData, error: logsError } = await supabase
        .from('access_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      setAccessLogs(logsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (idNumber) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id_number', idNumber);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">System Dashboard</h1>
        <p className="page-subtitle">Monitor and manage your biometric access system</p>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.students}</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.lecturers}</div>
              <div className="stat-label">Lecturers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.staff}</div>
              <div className="stat-label">Support Staff</div>
            </div>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Registered Users
            </button>
            <button 
              className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Access Logs
            </button>
          </div>

          {activeTab === 'users' && (
            <div className="data-table">
              {users.length === 0 ? (
                <div className="empty-state">
                  <Users className="empty-icon" />
                  <p>No users registered yet</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID Number</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id_number}>
                        <td>{user.name}</td>
                        <td>{user.id_number}</td>
                        <td>
                          <span className={`badge badge-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.email || '-'}</td>
                        <td>{new Date(user.registered_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            className="btn btn-danger"
                            onClick={() => deleteUser(user.id_number)}
                            style={{ padding: '0.375rem 0.75rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="data-table">
              {accessLogs.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle className="empty-icon" />
                  <p>No access logs yet</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID Number</th>
                      <th>Role</th>
                      <th>Action</th>
                      <th>Confidence</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{log.name}</td>
                        <td>{log.user_id}</td>
                        <td>
                          {log.role ? (
                            <span className={`badge badge-${log.role}`}>
                              {log.role}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          <span className={`badge badge-${
                            log.action === 'access_granted' ? 'success' : 
                            log.action === 'access_denied' ? 'danger' : 'info'
                          }`}>
                            {log.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{log.confidence ? `${Math.round(log.confidence)}%` : '-'}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BiometricAccessSystem;