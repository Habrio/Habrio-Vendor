// src/pages/VendorProfile.jsx
import { useEffect, useState } from 'react';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorProfile() {
  const [profile, setProfile] = useState(null);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetch(`${backend}/profile/me`, { headers: { Authorization: token } })
      .then(r => r.json())
      .then(d => setProfile(d.data));
  }, []);

  if (!profile) return <div className="screen-content"><p>Loading...</p></div>;
  return (
    <div className="screen-content">
      <h2 className="title mb-lg">My Profile</h2>
      <p><b>Name:</b> {profile.name}</p>
      <p><b>Phone:</b> {profile.phone}</p>
      <p><b>City:</b> {profile.city}</p>
      <p><b>Society:</b> {profile.society}</p>
    </div>
  );
}