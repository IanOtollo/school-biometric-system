import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as faceapi from 'face-api.js';

// Initialize Supabase client
// Replace with your Supabase credentials
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
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #00ff88;
          --primary-dark: #00cc6a;
          --secondary: #0088ff;
          --dark: #0a0e1a;
          --darker: #050810;
          --light: #e0e7ff;
          --danger: #ff3366;
          --warning: #ffaa00;
          --success: #00ff88;
        }

        body {
          font-family: 'IBM Plex Sans', sans-serif;
          background: var(--darker);
          color: var(--light);
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%);
          position: relative;
        }

        .app-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 136, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
        }

        .header {
          padding: 2rem 3rem;
          background: rgba(10, 14, 26, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 255, 136, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.8rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.8rem 1.8rem;
          border: none;
          border-radius: 8px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: var(--darker);
          box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0, 255, 136, 0.5);
        }

        .btn-secondary {
          background: transparent;
          color: var(--light);
          border: 2px solid rgba(0, 255, 136, 0.3);
        }

        .btn-secondary:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
        }

        .btn-danger {
          background: linear-gradient(135deg, var(--danger) 0%, #cc0044 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(255, 51, 102, 0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(255, 51, 102, 0.5);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 8, 16, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(0, 255, 136, 0.1);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 1.5rem;
          font-size: 1.1rem;
          color: var(--primary);
          font-family: 'Orbitron', sans-serif;
        }

        .status-indicator {
          position: fixed;
          top: 100px;
          right: 30px;
          padding: 1rem 1.5rem;
          background: rgba(10, 14, 26, 0.9);
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 136, 0.2);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          z-index: 99;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .home-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 200px);
          text-align: center;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -2px;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: rgba(224, 231, 255, 0.7);
          margin-bottom: 3rem;
          max-width: 600px;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1000px;
          margin-top: 2rem;
        }

        .action-card {
          background: rgba(26, 31, 53, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transform: scaleX(0);
          transition: transform 0.3s;
        }

        .action-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.2);
        }

        .action-card:hover::before {
          transform: scaleX(1);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--primary);
        }

        .card-description {
          color: rgba(224, 231, 255, 0.7);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .header {
            padding: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .action-cards {
            grid-template-columns: 1fr;
          }

          .main-content {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="content">
        <header className="header">
          <div className="header-content">
            <div className="logo">🔐 SecureEntry</div>
            <nav className="nav-buttons">
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentView('home')}
              >
                Home
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCurrentView('dashboard')}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </header>

        {modelsLoaded && (
          <div className="status-indicator">
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
      <h1 className="hero-title">Biometric Access Control</h1>
      <p className="hero-subtitle">
        Secure, fast, and efficient facial recognition system for school entry management
      </p>
      
      <div className="action-cards">
        <div className="action-card" onClick={() => setCurrentView('register')}>
          <div className="card-icon">👤</div>
          <h3 className="card-title">Register New User</h3>
          <p className="card-description">
            Enroll students, lecturers, and staff members into the system
          </p>
        </div>
        
        <div className="action-card" onClick={() => setCurrentView('verify')}>
          <div className="card-icon">🔍</div>
          <h3 className="card-title">Verify Access</h3>
          <p className="card-description">
            Scan face for instant verification and entry authorization
          </p>
        </div>
        
        <div className="action-card" onClick={() => setCurrentView('dashboard')}>
          <div className="card-icon">📊</div>
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
        
        // Draw on canvas
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
      
      // Log the registration
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
      <style>{`
        .register-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }

        .page-subtitle {
          color: rgba(224, 231, 255, 0.6);
          margin-bottom: 2.5rem;
        }

        .register-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .camera-section {
          background: rgba(26, 31, 53, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .camera-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: var(--darker);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
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

        .form-section {
          background: rgba(26, 31, 53, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--light);
          font-weight: 500;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.9rem 1.2rem;
          background: rgba(10, 14, 26, 0.8);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 8px;
          color: var(--light);
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
        }

        .message {
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .message.success {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid var(--success);
          color: var(--success);
        }

        .message.error {
          background: rgba(255, 51, 102, 0.1);
          border: 1px solid var(--danger);
          color: var(--danger);
        }

        .message.info {
          background: rgba(0, 136, 255, 0.1);
          border: 1px solid var(--secondary);
          color: var(--secondary);
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .button-group .btn {
          flex: 1;
        }

        @media (max-width: 768px) {
          .register-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="register-container">
        <h1 className="page-title">Register New User</h1>
        <p className="page-subtitle">Enroll a new member into the biometric system</p>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' && '✓'}
            {message.type === 'error' && '✗'}
            {message.type === 'info' && 'ℹ'}
            {message.text}
          </div>
        )}

        <div className="register-grid">
          <div className="camera-section">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Face Capture</h3>
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
              {isCapturing ? 'Capturing...' : capturedDescriptor ? 'Recapture Face' : 'Capture Face'}
            </button>
          </div>

          <div className="form-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>User Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">ID Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
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
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="button-group">
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentView('home')}>
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

      // Fetch all registered users
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

      // Compare with registered faces
      const threshold = 0.6; // Lower is more strict
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
        // Log successful access
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
        // Log denied access
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
      <style>{`
        .verify-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .verify-camera {
          background: rgba(26, 31, 53, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .camera-view {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: var(--darker);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 2rem;
          border: 2px solid rgba(0, 255, 136, 0.3);
        }

        .verification-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .result-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes scaleIn {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        .result-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .result-role {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-bottom: 0.5rem;
        }

        .result-confidence {
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: rgba(10, 14, 26, 0.8);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 8px;
          color: var(--light);
          cursor: pointer;
          transition: all 0.3s;
        }

        .mode-toggle:hover {
          border-color: var(--primary);
          background: rgba(0, 255, 136, 0.1);
        }

        .mode-toggle input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .scanning-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 0.8rem 1.2rem;
          background: rgba(0, 255, 136, 0.9);
          color: var(--darker);
          border-radius: 8px;
          font-weight: 600;
          animation: pulse 1.5s infinite;
          z-index: 5;
        }
      `}</style>

      <div className="verify-container">
        <h1 className="page-title">Access Verification</h1>
        <p className="page-subtitle">Scan face for instant entry authorization</p>

        <div className="verify-camera">
          <div className="camera-view">
            <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
            
            {isVerifying && (
              <div className="scanning-indicator">
                🔍 Scanning...
              </div>
            )}

            {verificationResult && (
              <div className="verification-overlay">
                {verificationResult.success ? (
                  <>
                    <div className="result-icon">✅</div>
                    <div className="result-name" style={{ color: 'var(--success)' }}>
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
                    <div className="result-icon">❌</div>
                    <div className="result-name" style={{ color: 'var(--danger)' }}>
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
              {isVerifying ? 'Verifying...' : 'Verify Face'}
            </button>

            <label className="mode-toggle">
              <input
                type="checkbox"
                checked={continuousMode}
                onChange={(e) => setContinuousMode(e.target.checked)}
              />
              <span>Continuous Mode</span>
            </label>

            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentView('home')}
            >
              Back to Home
            </button>
          </div>
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
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('registered_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Calculate stats
      const studentCount = usersData?.filter(u => u.role === 'student').length || 0;
      const lecturerCount = usersData?.filter(u => u.role === 'lecturer').length || 0;
      const staffCount = usersData?.filter(u => u.role === 'staff').length || 0;

      setStats({
        total: usersData?.length || 0,
        students: studentCount,
        lecturers: lecturerCount,
        staff: staffCount
      });

      // Fetch access logs
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
      <style>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: rgba(26, 31, 53, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: rgba(224, 231, 255, 0.7);
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(0, 255, 136, 0.1);
        }

        .tab {
          padding: 1rem 2rem;
          background: transparent;
          border: none;
          color: rgba(224, 231, 255, 0.6);
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .tab.active {
          color: var(--primary);
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .data-table {
          background: rgba(26, 31, 53, 0.6);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          background: rgba(0, 255, 136, 0.1);
          padding: 1.2rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }

        .table td {
          padding: 1.2rem 1.5rem;
          border-top: 1px solid rgba(0, 255, 136, 0.05);
          color: var(--light);
        }

        .table tr:hover {
          background: rgba(0, 255, 136, 0.05);
        }

        .role-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-badge.student {
          background: rgba(0, 136, 255, 0.2);
          color: var(--secondary);
        }

        .role-badge.lecturer {
          background: rgba(255, 170, 0, 0.2);
          color: var(--warning);
        }

        .role-badge.staff {
          background: rgba(138, 43, 226, 0.2);
          color: #b47fff;
        }

        .action-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .action-badge.granted {
          background: rgba(0, 255, 136, 0.2);
          color: var(--success);
        }

        .action-badge.denied {
          background: rgba(255, 51, 102, 0.2);
          color: var(--danger);
        }

        .action-badge.registered {
          background: rgba(0, 136, 255, 0.2);
          color: var(--secondary);
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(224, 231, 255, 0.5);
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="dashboard-container">
        <h1 className="page-title">System Dashboard</h1>
        <p className="page-subtitle">Monitor and manage your biometric access system</p>

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
                    <div className="empty-state-icon">👥</div>
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
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.email || '-'}</td>
                          <td>{new Date(user.registered_at).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-danger btn-small"
                              onClick={() => deleteUser(user.id_number)}
                            >
                              Delete
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
                    <div className="empty-state-icon">📋</div>
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
                              <span className={`role-badge ${log.role}`}>
                                {log.role}
                              </span>
                            ) : '-'}
                          </td>
                          <td>
                            <span className={`action-badge ${
                              log.action === 'access_granted' ? 'granted' : 
                              log.action === 'access_denied' ? 'denied' : 'registered'
                            }`}>
                              {log.action.replace('_', ' ')}
                            </span>
                          </td>
                          <td>{log.confidence ? `${log.confidence}%` : '-'}</td>
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
    </div>
  );
};

export default BiometricAccessSystem;
