import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer"
  });
  const [error, setError] = useState("");

  const submit = () => {
    setError("");
    
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    // Assuming register returns true on success, or we just fire and forget
    const success = register(form); 
    if(success !== false) {
        nav("/login"); // redirect to login page after successful registration
    } else {
        setError("Registration failed.");
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
      <div className="auth-box" style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>Create Account</h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Join NeuroFleetX today</p>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <input
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '16px', boxSizing: 'border-box' }}
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <input
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '16px', boxSizing: 'border-box' }}
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <input
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '16px', boxSizing: 'border-box' }}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#34495e' }}>I am a:</label>
          <select
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #bdc3c7', fontSize: '16px', backgroundColor: 'white' }}
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="Customer">Customer</option>
            <option value="Driver">Driver</option>
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button 
          onClick={submit}
          style={{ width: '100%', padding: '14px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Register
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#7f8c8d' }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#27ae60', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </div>

      </div>
    </div>
  );
}