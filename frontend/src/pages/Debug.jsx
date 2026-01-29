import React, { useEffect, useState } from 'react';

function Debug() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    setDebugInfo({
      user: user ? JSON.parse(user) : null,
      token: token ? `${token.substring(0, 20)}...` : null,
      tokenLength: token ? token.length : 0
    });
  }, []);

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Backend connection successful:', data);
      
      setDebugInfo(prev => ({
        ...prev,
        backendTest: {
          status: response.status,
          data: data,
          success: true
        }
      }));
    } catch (error) {
      console.error('Backend connection error:', error);
      setDebugInfo(prev => ({
        ...prev,
        backendTest: {
          error: error.message,
          success: false
        }
      }));
    }
  };

  const testAPI = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Testing API with token:', token ? 'exists' : 'missing');
      
      const response = await fetch('http://localhost:8000/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('API Response:', response.status, data);
      
      setDebugInfo(prev => ({
        ...prev,
        apiTest: {
          status: response.status,
          data: data,
          success: response.ok
        }
      }));
    } catch (error) {
      console.error('API Test Error:', error);
      setDebugInfo(prev => ({
        ...prev,
        apiTest: {
          error: error.message,
          success: false
        }
      }));
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Debug Information</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>LocalStorage:</h3>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Backend Connection
        </button>

        <button 
          onClick={testAPI}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Authenticated API
        </button>

        <button 
          onClick={clearStorage}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Storage & Reload
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>First click "Test Backend Connection" - should be green ✅</li>
          <li>Then click "Test Authenticated API" - check for token errors</li>
          <li>Check browser console (F12) for detailed errors</li>
          <li>If no token, logout and login again</li>
        </ol>
      </div>
    </div>
  );
}

export default Debug;
