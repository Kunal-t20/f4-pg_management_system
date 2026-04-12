import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from './StudentDashboard';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import api from '../../api/axios';

const StudentOverview = () => {
  const { studentProfile } = useContext(StudentContext);
  const { user } = useAuth();
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    if (studentProfile && studentProfile.room_id) {
      api.get('/rooms')
         .then(res => {
           const room = res.data.find(r => r.id === studentProfile.room_id);
           setRoomData(room);
         })
         .catch(err => console.error(err));
    }
  }, [studentProfile]);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Welcome, {user.email}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here is your current profile overview.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <GlassCard title="Profile Information">
          <div style={{ display: 'grid', gap: '1rem', color: 'var(--text-main)' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Student ID:</span> #{studentProfile.id}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>User ID:</span> {studentProfile.user_id}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Phone Number:</span> {studentProfile.phone}</div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Verification Status: </span> 
              <Badge variant="success">Verified</Badge>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Room Assignment">
          {studentProfile.room_id && roomData ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                Room {roomData.room_number}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <Badge variant="success">Assigned</Badge>
              </div>
              <div><span style={{ color: 'var(--text-muted)' }}>Room ID:</span> #{roomData.id}</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Badge variant="warning">Not Assigned</Badge>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                You have not been assigned to a room yet. Please check back later or contact administration.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default StudentOverview;
