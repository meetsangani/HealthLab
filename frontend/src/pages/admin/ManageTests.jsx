import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ManageTests() {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTest, setEditTest] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', turnaround: '', description: '' });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTests(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editTest ? 'PUT' : 'POST';
    const url = editTest ? `/api/admin/tests/${editTest._id}` : '/api/admin/tests';
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setShowModal(false);
      setEditTest(null);
      setForm({ name: '', price: '', turnaround: '', description: '' });
      fetchTests();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    await fetch(`/api/admin/tests/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTests();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Tests</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => { setShowModal(true); setEditTest(null); setForm({ name: '', price: '', turnaround: '', description: '' }); }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Test
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turnaround</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tests.map(test => (
              <tr key={test._id}>
                <td className="px-6 py-4">{test.name}</td>
                <td className="px-6 py-4">₹{test.price}</td>
                <td className="px-6 py-4">{test.turnaround}</td>
                <td className="px-6 py-4">{test.description}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 mr-2" onClick={() => { setEditTest(test); setForm(test); setShowModal(true); }}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600" onClick={() => handleDelete(test._id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow w-full max-w-md" onSubmit={handleSave}>
            <h2 className="text-xl font-bold mb-4">{editTest ? 'Edit Test' : 'Add Test'}</h2>
            <input className="mb-2 w-full border p-2 rounded" placeholder="Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="mb-2 w-full border p-2 rounded" placeholder="Price" type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <input className="mb-2 w-full border p-2 rounded" placeholder="Turnaround" required value={form.turnaround} onChange={e => setForm(f => ({ ...f, turnaround: e.target.value }))} />
            <textarea className="mb-2 w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editTest ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
