import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [showAssign, setShowAssign] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const fetchData = async () => {
    try {
      const [stuRes, rmRes] = await Promise.all([
        api.get('/students'),
        api.get('/rooms')
      ]);
      setStudents(stuRes.data);
      setRooms(rmRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) return alert('Select a room');
    
    try {
      await api.post('/assign-room', {
        student_id: selectedStudentId,
        room_id: parseInt(selectedRoomId)
      });
      alert('Room assigned successfully');
      setShowAssign(false);
      fetchData(); // Refresh to show new room
    } catch (err) {
      alert('Error assigning room: ' + (err.response?.data?.detail || err.message));
    }
  };

  const openAssignModal = (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedRoomId('');
    setShowAssign(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student? This will also remove their user account, payments, and complaints, and create a vacancy in their room.")) {
      return;
    }
    
    try {
      await api.delete(`/students/${studentId}`);
      alert("Student deleted successfully.");
      fetchData();
    } catch (err) {
      alert("Error deleting student: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Student Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>View students and allocate rooms.</p>
      </div>

      <GlassCard title="Registered Students">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>User ID</th>
                  <th>Phone Number</th>
                  <th>Current Room ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td>#{stu.id}</td>
                    <td>{stu.user_id}</td>
                    <td>{stu.phone}</td>
                    <td>{stu.room_id || <span style={{ color: 'var(--warning)' }}>Unassigned</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button 
                          variant="secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => openAssignModal(stu.id)}
                        >
                          {stu.room_id ? 'Change Room' : 'Assign Room'}
                        </Button>
                        <Button 
                          variant="danger" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'var(--danger)', color: '#fff', border: 'none' }}
                          onClick={() => handleDelete(stu.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No students found. A user must complete registration and user creation.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {showAssign && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
        }}>
          <GlassCard style={{ width: '400px' }} title={`Assign Room for Student #${selectedStudentId}`}>
            <form onSubmit={handleAssignSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Room</label>
                <select 
                  className="ui-input" 
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">-- Choose a room --</option>
                  {rooms.filter(r => r.current_occupancy < r.capacity).map(r => (
                    <option key={r.id} value={r.id}>Room {r.room_number} (Avail: {r.capacity - r.current_occupancy})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setShowAssign(false)}>Cancel</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>Confirm</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Students;
