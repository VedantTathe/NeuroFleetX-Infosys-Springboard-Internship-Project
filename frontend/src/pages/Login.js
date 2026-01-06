import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async () => {
    setError(""); 
    
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    const success = await login(form.email, form.password);
    
    if (success) {
      nav("/fleet"); 
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
      <div className="auth-box" style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>NeuroFleetX</h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Sign in to manage your fleet</p>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#34495e' }}>Email Address</label>
          <input
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '16px' }}
            placeholder="admin@neurofleet.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#34495e' }}>Password</label>
          <input
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '16px' }}
            placeholder="••••••••"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button 
          onClick={submit}
          style={{ width: '100%', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Login
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#7f8c8d' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
        </div>

      </div>
    </div>
  );
}