import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Plus } from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '' });

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', { 
        room_number: newRoom.room_number, 
        capacity: parseInt(newRoom.capacity) 
      });
      setShowAddForm(false);
      setNewRoom({ room_number: '', capacity: '' });
      fetchRooms();
    } catch (err) {
      alert('Error creating room: ' + err.response?.data?.detail);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Room Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage hostel rooms and capacities.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> Add Room
        </Button>
      </div>

      {showAddForm && (
        <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
          <h3 style={{ marginTop: 0 }}>Create New Room</h3>
          <form onSubmit={handleCreateRoom} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <Input 
              label="Room Number" 
              value={newRoom.room_number} 
              onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })} 
              required 
              style={{ flex: 1 }}
            />
            <Input 
              label="Capacity" 
              type="number" 
              min="1"
              value={newRoom.capacity} 
              onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} 
              required 
              style={{ flex: 1 }}
            />
            <Button type="submit" variant="primary" style={{ marginBottom: '1rem' }}>Create</Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)} style={{ marginBottom: '1rem' }}>Cancel</Button>
          </form>
        </GlassCard>
      )}

      <GlassCard title="All Rooms">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Number</th>
                  <th>Capacity</th>
                  <th>Current Occupancy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>#{room.id}</td>
                    <td style={{ fontWeight: '600' }}>{room.room_number}</td>
                    <td>{room.capacity} beds</td>
                    <td>{room.current_occupancy} students</td>
                    <td>
                      {room.current_occupancy >= room.capacity 
                        ? <Badge variant="danger">Full</Badge>
                        : <Badge variant="success">Available</Badge>
                      }
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No rooms found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Rooms;
