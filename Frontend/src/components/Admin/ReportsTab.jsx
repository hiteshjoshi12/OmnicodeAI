import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FileText, Download, Loader2, User as UserIcon } from 'lucide-react';

export default function ReportsTab() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch a quick list of users to populate the table
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('omnicode_token');
        // Re-using your existing users endpoint to get the list
        const response = await axios.get(`${apiUrl}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || response.data); 
      } catch (error) {
        console.error("Failed to load users for reports", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to convert JSON array to CSV and trigger download
  const downloadCSV = (reportData) => {
    const { userInfo, financialSummary, transactionHistory } = reportData;

    // Create CSV Headers
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "REPORT TYPE,User Financial & Usage Report\n";
    csvContent += `Name,${userInfo.name}\n`;
    csvContent += `Email,${userInfo.email}\n`;
    csvContent += `Current Plan,${userInfo.currentPlan}\n`;
    csvContent += `Available Credits,${userInfo.availableCredits}\n`;
    csvContent += `Total Lifetime Spent,₹${financialSummary.totalSpent}\n\n`;

    // Add Transaction History Table
    csvContent += "--- TRANSACTION HISTORY ---\n";
    csvContent += "Date,Amount (INR),Plan Purchased,Credits Added,Status,Payment ID\n";

    transactionHistory.forEach(row => {
      const date = new Date(row.date).toLocaleDateString();
      csvContent += `${date},${row.amount},${row.planPurchased},${row.creditsAdded},${row.status},${row.paymentId}\n`;
    });

    // Create a hidden link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${userInfo.name.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = async (userId) => {
    setGeneratingId(userId);
    try {
      const token = localStorage.getItem('omnicode_token');
      // Hit our new endpoint
      const response = await axios.get(`${apiUrl}/api/admin/reports/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Trigger the CSV Download
      downloadCSV(response.data);

    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Failed to generate user report. Please try again.");
    } finally {
      setGeneratingId(null);
    }
  };

  if (loadingUsers) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>;
  }

  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <FileText className="text-indigo-500" size={20} />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">User-Wise Reports</h2>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-6 font-medium">
            Generate and download comprehensive financial and usage reports for individual users.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.fullName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {user.credits?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleGenerateReport(user._id)}
                        disabled={generatingId === user._id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {generatingId === user._id ? (
                          <><Loader2 size={14} className="animate-spin" /> Generating...</>
                        ) : (
                          <><Download size={14} /> Export CSV</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500 font-medium">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}