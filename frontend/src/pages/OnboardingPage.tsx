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
      await axios.put(`adminportal.up.railway.app/tenants/${id}/pipeline?state=${!currentState}`);
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

    if (!validate()) return;

    try {
      await axios.post('adminportal.up.railway.app/tenants/', form);
      setForm({ name: '', email: '', timezone: '' });
      setMessage('Tenant created successfully!');
      fetchTenants();
    } catch (err) {
      setMessage('Failed to create tenant.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Customer Onboarding</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}

        <input name="timezone" placeholder="Timezone" value={form.timezone} onChange={handleChange} />
        {errors.timezone && <span style={{ color: 'red' }}>{errors.timezone}</span>}

        <button type="submit">Create Tenant</button>
      </form>

      {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}

      <h3>All Tenants</h3>
      <table border={1} cellPadding={8}>
        <thead>
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
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>{t.timezone}</td>
              <td>
                {role === "admin" ? (
                  <button onClick={() => togglePipeline(t.id, t.pipeline_running)}>
                    {t.pipeline_running ? 'Stop' : 'Start'}
                  </button>
                ) : (
                  <span>{t.pipeline_running ? 'Running' : 'Stopped'}</span>
                )}
              </td>
              <td>{t.last_sync_time?.slice(0, 16).replace("T", " ")}</td>
              <td>{t.last_error}</td>
              <td style={{ color: t.health_status === "green" ? "green" : t.health_status === "yellow" ? "orange" : "red" }}>
                {t.health_status?.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnboardingPage;
