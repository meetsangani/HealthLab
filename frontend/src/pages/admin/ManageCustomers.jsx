import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const ManageCustomers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (token) {
      apiFetch('/users', { token })
        .then(setUsers)
        .catch(() => setUsers([]));
    }
  }, [token]);

  return (
    <div>
      <h2>Manage Customers</h2>
      {/* Render users */}
      {users.map(u => (
        <div key={u._id}>{u.name} - {u.email}</div>
      ))}
    </div>
  );
};

export default ManageCustomers;
