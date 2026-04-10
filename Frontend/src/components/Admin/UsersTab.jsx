import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  ShieldAlert, 
  Edit, 
  Trash2, 
  X,
  Shield
} from 'lucide-react';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('omnicode_token');
      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserError(error.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Logic
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- CRUD HANDLERS ---
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem('omnicode_token');
      // Replace with your actual PUT endpoint
      await axios.put(`${apiUrl}/api/admin/users/${editingUser._id}`, 
        { plan: editingUser.plan, credits: editingUser.credits },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state to instantly reflect changes
      setUsers(users.map(u => u._id === editingUser._id ? editingUser : u));
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user", error);
      alert(error.response?.data?.message || "Failed to update user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('omnicode_token');
      // Replace with your actual DELETE endpoint
      await axios.delete(`${apiUrl}/api/admin/users/${deletingUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setUsers(users.filter(u => u._id !== deletingUser._id));
      setDeletingUser(null);
    } catch (error) {
      console.error("Failed to delete user", error);
      alert(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div
      key="users"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="relative"
    >
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Users Table Logic */}
        {loadingUsers ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
            <p className="font-bold text-slate-600">Loading user database...</p>
          </div>
        ) : userError ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <ShieldAlert size={40} className="mb-4 text-red-400" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Access Denied</h3>
            <p className="font-medium text-slate-500 max-w-sm text-center">{userError}</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt={u.fullName} className="w-full h-full object-cover" />
                          ) : (
                            u.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.fullName}</p>
                          <p className="font-medium text-slate-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Role Badge */}
                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">
                          <Shield size={12} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600">
                          User
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        u.plan === 'Pro' ? 'bg-purple-100 text-purple-700' :
                        u.plan === 'Enterprise' ? 'bg-slate-900 text-white' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-700">{u.credits}</span>
                    </td>
                    <td className="p-4">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {/* Disable actions for admins */}
                      {u.role === 'admin' ? (
                        <span className="text-xs font-bold text-slate-400 italic">Protected</span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(u)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => setDeletingUser(u)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all outline-none focus:ring-2 focus:ring-red-500"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Edit User</h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 outline-none">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">User Name</label>
                  <input type="text" value={editingUser.fullName} disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Plan Tier</label>
                  <select 
                    value={editingUser.plan} 
                    onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Credits Balance</label>
                  <input 
                    type="number" 
                    value={editingUser.credits} 
                    onChange={(e) => setEditingUser({...editingUser, credits: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors disabled:opacity-70 flex items-center gap-2">
                    {actionLoading && <Loader2 size={16} className="animate-spin" />} Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete User?</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete <strong>{deletingUser.email}</strong>? This action cannot be undone and all their data will be lost.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingUser(null)} className="flex-1 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Delete Permanently'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}