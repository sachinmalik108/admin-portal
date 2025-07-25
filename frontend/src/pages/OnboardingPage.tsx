import React, { useState, useEffect } from 'react';
import axios from 'axios';

const validTimezones = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
  "Europe/Berlin",
  "Africa/Nairobi",
  "Asia/Singapore",
  
];



interface Tenant {
  id: number;
  name: string;
  email: string;
  timezone: string;
  pipeline_running: boolean;
  last_sync_time?: string;
  last_error?: string;
  health_status?: string;
}

const OnboardingPage: React.FC<{ role: "admin" | "viewer" }> = ({ role }) => {
  const [form, setForm] = useState({ name: '', email: '', timezone: '' });
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(true);

 
  const fetchTenants = async () => {
    try {
      const res = await axios.get('https://adminportal.up.railway.app/tenants/');
      setTenants(res.data);
    } catch (err) {
      console.error("Fetch tenants failed", err);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);


  const togglePipeline = async (id: number, currentState: boolean) => {
    try {
      await axios.put(`https://adminportal.up.railway.app/tenants/${id}/pipeline?state=${!currentState}`);
      fetchTenants();
    } catch (err) {
      console.error("Pipeline toggle failed:", err);
    }
  };

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear field error
  };

  
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.name || form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!form.timezone) {
      newErrors.timezone = 'Timezone is required.';
    } else if (!validTimezones.includes(form.timezone)) {
      newErrors.timezone = 'Invalid timezone. Must match a known IANA timezone (e.g. Asia/Kolkata).';
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setShowMessage(true);

    if (!validate()) return;

    try {
      await axios.post('https://adminportal.up.railway.app/tenants/', form);
      setForm({ name: '', email: '', timezone: '' });
      setMessage('Tenant created successfully!');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      fetchTenants();
    } catch (err) {
      setMessage('Failed to create tenant.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center"
      data-bs-theme="dark"
      style={{
        padding: 0,
        background: 'linear-gradient(135deg, #232526 0%, #414345 40%, #6a82fb 70%, #00c6fb 100%)',
      }}
    >
      <div className="container py-5">
        <h2 className="mb-4 display-4 fw-bold text-info" style={{ fontFamily: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif', letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,198,251,0.2)' }}>Customer Onboarding</h2>
        <form onSubmit={handleSubmit} className="mb-5" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-control form-control-lg" />
            {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control form-control-lg" />
            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <input name="timezone" placeholder="Timezone" value={form.timezone} onChange={handleChange} className="form-control form-control-lg" />
            {errors.timezone && <div className="text-danger small mt-1">{errors.timezone}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100">Create Tenant</button>
        </form>
        {showMessage && message && (
          <p className={"fw-bold " + (message.includes('successfully') ? 'text-success' : 'text-danger')}>
            {message}
          </p>
        )}
        <h3 className="mb-3 display-6 fw-bold text-info" style={{ fontFamily: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif', letterSpacing: '0.5px', textShadow: '0 1px 4px rgba(0,198,251,0.15)' }}>
          All Tenants
        </h3>
        <div className="card shadow-lg rounded-4 p-4 mb-5" style={{ background: 'rgba(30, 34, 90, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered table-hover align-middle mb-0 rounded-3 overflow-hidden">
              <thead className="table-primary text-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Timezone</th>
                  <th>Pipeline</th>
                  <th>Last Sync</th>
                  <th>Last Error</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} className="tenant-row source-row">
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.timezone}</td>
                    <td>
                      {role === "admin" ? (
                        <button className={"btn btn-sm " + (t.pipeline_running ? "btn-danger" : "btn-success")} onClick={() => togglePipeline(t.id, t.pipeline_running)}>
                          {t.pipeline_running ? 'Stop' : 'Start'}
                        </button>
                      ) : (
                        <span>{t.pipeline_running ? 'Running' : 'Stopped'}</span>
                      )}
                    </td>
                    <td>{t.last_sync_time?.slice(0, 16).replace("T", " ")}</td>
                    <td>{t.last_error}</td>
                    <td>
                      <span className={
                        t.health_status === "green" ? "badge bg-success" :
                        t.health_status === "yellow" ? "badge bg-warning text-dark" :
                        "badge bg-danger"
                      }>
                        {t.health_status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
