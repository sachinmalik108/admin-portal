import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tenant {
  
    id: number;
    name: string;
    email: string;
    timezone: string;
    pipeline_running: boolean;
  
  
}

const OnboardingPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', timezone: '' });
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const fetchTenants = async () => {
    const res = await axios.get('http://localhost:8000/tenants/');
    setTenants(res.data);
  };

  useEffect(() => {
    fetchTenants();
  }, []);
  const togglePipeline = async (id: number, currentState: boolean) => {
    try {
      await axios.put(`http://localhost:8000/tenants/${id}/pipeline?state=${!currentState}`);
      fetchTenants(); // Refresh list
    } catch (err) {
      console.error("Pipeline toggle failed:", err);
    }
  };
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/tenants/', form);
    setForm({ name: '', email: '', timezone: '' });
    fetchTenants();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Customer Onboarding</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="timezone" placeholder="Timezone" value={form.timezone} onChange={handleChange} required />
        <button type="submit">Create Tenant</button>
      </form>

      <h3>All Tenants</h3>
      <table border={1} cellPadding={8}>
      <thead>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Timezone</th>
    <th>Pipeline</th>
  </tr>
</thead>

<tbody>
  {tenants.map(t => (
    <tr key={t.id}>
      <td>{t.name}</td>
      <td>{t.email}</td>
      <td>{t.timezone}</td>
      <td>
        <button onClick={() => togglePipeline(t.id, t.pipeline_running)}>
          {t.pipeline_running ? 'Stop' : 'Start'}
        </button>
      </td>
    </tr>
  ))}
</tbody>


      </table>
    </div>
  );
};




export default OnboardingPage;
