import { useState, useEffect } from 'react';
import { User, Mail, Shield, BarChart2, TrendingDown, CheckCircle, Receipt, LogOut } from 'lucide-react';
import { getAllExpenses, logoutUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Profile.css';

const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllExpenses({ category: 'all' })
      .then(res => setExpenses(res.data.expense || []))
      .catch(() => setExpenses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('See you later! 👋');
    navigate('/login');
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const pendingCount = expenses.filter(e => !e.done).length;
  const doneCount = expenses.filter(e => e.done).length;

  // Top category
  const catMap = {};
  expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

  const initials = user?.fullname
    ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const memberSince = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-sub">Your account and statistics</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-main-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-avatar-ring" />
          </div>
          <div className="profile-identity">
            <h2 className="profile-name">{user?.fullname}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-badge">
              <Shield size={12} /> Active Member
            </span>
          </div>

          <div className="profile-meta">
            <div className="meta-item">
              <User size={14} />
              <span>Member since {memberSince}</span>
            </div>
            <div className="meta-item">
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
          </div>

          <button className="profile-logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="profile-stats-col">
          <div className="profile-stats-grid">
            {[
              { label: 'Total Spent', value: formatINR(totalSpent), icon: BarChart2, color: 'primary' },
              { label: 'Transactions', value: expenses.length, icon: Receipt, color: 'accent' },
              { label: 'Pending', value: pendingCount, icon: TrendingDown, color: 'danger' },
              { label: 'Cleared', value: doneCount, icon: CheckCircle, color: 'success' },
            ].map((s, i) => (
              <div key={i} className={`pstat-card pstat-${s.color}`}>
                <div className="pstat-icon"><s.icon size={16} /></div>
                <span className="pstat-value">{loading ? '—' : s.value}</span>
                <span className="pstat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {topCat && !loading && (
            <div className="top-category-card">
              <div className="top-cat-header">
                <span className="top-cat-label">Top Spending Category</span>
              </div>
              <div className="top-cat-body">
                <div className="top-cat-name">{topCat[0]}</div>
                <div className="top-cat-amount">{formatINR(topCat[1])}</div>
              </div>
              <div className="top-cat-bar-wrap">
                <div
                  className="top-cat-bar"
                  style={{ width: `${Math.min(100, (topCat[1] / totalSpent) * 100).toFixed(0)}%` }}
                />
              </div>
              <span className="top-cat-pct">
                {totalSpent > 0 ? ((topCat[1] / totalSpent) * 100).toFixed(0) : 0}% of total spending
              </span>
            </div>
          )}

          <div className="account-details-card">
            <h3>Account Details</h3>
            <div className="account-row">
              <span className="account-key">Full Name</span>
              <span className="account-val">{user?.fullname}</span>
            </div>
            <div className="account-row">
              <span className="account-key">Email</span>
              <span className="account-val">{user?.email}</span>
            </div>
            <div className="account-row">
              <span className="account-key">User ID</span>
              <span className="account-val account-id">{user?._id}</span>
            </div>
            <div className="account-row">
              <span className="account-key">Status</span>
              <span className="account-val"><span className="status-dot" /> Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
