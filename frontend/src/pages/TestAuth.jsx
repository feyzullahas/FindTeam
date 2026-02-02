import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TestAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 TestAuth page loaded");
    console.log("🔍 Current URL:", window.location.href);
    console.log("🔍 URL params:", window.location.search);
    console.log("🔍 Hash:", window.location.hash);
    
    // Check localStorage
    console.log("🔑 Token in localStorage:", localStorage.getItem('access_token')?.substring(0, 20) + "...");
    console.log("👤 User in localStorage:", localStorage.getItem('user'));
    
    // Check if we have auth params
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    const tokenParam = params.get("token");
    
    console.log("👤 User param:", userParam ? "EXISTS" : "MISSING");
    console.log("🔑 Token param:", tokenParam ? "EXISTS" : "MISSING");
    
    if (userParam && tokenParam) {
      console.log("✅ Auth params found, redirecting to AuthSuccess");
      setTimeout(() => {
        navigate('/auth-success' + window.location.search);
      }, 2000);
    } else {
      console.log("❌ No auth params, showing test page");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Auth Test Page</h1>
        <p className="text-gray-600 mb-4">Check console for detailed logs</p>
        
        <div className="bg-gray-100 p-4 rounded-lg text-left">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p className="text-sm">URL: {window.location.href}</p>
          <p className="text-sm">Params: {window.location.search}</p>
          <p className="text-sm">Token: {localStorage.getItem('access_token') ? 'EXISTS' : 'MISSING'}</p>
          <p className="text-sm">User: {localStorage.getItem('user') ? 'EXISTS' : 'MISSING'}</p>
        </div>
        
        <div className="mt-6 space-y-2">
          <a
            href="http://localhost:8000/auth/google/login"
            className="btn btn-primary w-full"
          >
            Test Google Login
          </a>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestAuth;
