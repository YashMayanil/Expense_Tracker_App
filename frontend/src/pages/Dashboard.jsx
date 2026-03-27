import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CheckCircle, BarChart2, ArrowRight } from 'lucide-react';
import { getAllExpenses } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other'];
const COLORS = ['#c8f564', '#7c6ef5', '#ffb547', '#ff5c5c', '#4ade80', '#38bdf8'];

const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await getAllExpenses({ category: 'all' });
      setExpenses(res.data.expense || []);
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const pendingExpenses = expenses.filter(e => !e.done);
  const doneExpenses = expenses.filter(e => e.done);
  const pendingAmount = pendingExpenses.reduce((s, e) => s + e.amount, 0);

  // Category breakdown for pie
  const categoryData = CATEGORIES.map((cat, i) => {
    const total = expenses.filter(e => e.category.toLowerCase() === cat.toLowerCase())
      .reduce((s, e) => s + e.amount, 0);
    return { name: cat, value: total, color: COLORS[i] };
  }).filter(d => d.value > 0);

  // Monthly trend (last 6 months)
  const monthlyData = (() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      const total = expenses.filter(e => {
        const ed = new Date(e.createdAt);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      }).reduce((s, e) => s + e.amount, 0);
      months.push({ month: label, amount: total });
    }
    return months;
  })();

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    { label: 'Total Spent', value: formatINR(totalSpent), icon: DollarSign, color: 'primary', sub: `${expenses.length} expenses` },
    { label: 'Pending', value: formatINR(pendingAmount), icon: TrendingDown, color: 'danger', sub: `${pendingExpenses.length} items` },
    { label: 'Cleared', value: formatINR(doneExpenses.reduce((s, e) => s + e.amount, 0)), icon: CheckCircle, color: 'success', sub: `${doneExpenses.length} items` },
    { label: 'Avg / Expense', value: expenses.length ? formatINR(Math.round(totalSpent / expenses.length)) : '₹0', icon: TrendingUp, color: 'accent', sub: 'per transaction' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return <div className="page-loading"><span className="spinner-lg" /></div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {user?.fullname?.split(' ')[0]} 👋</h1>
          <p className="page-sub">Here's your financial overview</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card stat-${s.color}`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="stat-icon"><s.icon size={18} /></div>
            <div className="stat-body">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-sub">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-card chart-main">
          <div className="chart-header">
            <div>
              <h3>Spending Trend</h3>
              <p>Last 6 months</p>
            </div>
            <BarChart2 size={18} className="chart-icon" />
          </div>
          <div className="chart-body">
            {expenses.length === 0 ? (
              <div className="empty-chart">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c8f564" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c8f564" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#8888a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8888a8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '10px', color: '#f0f0f8', fontSize: 13 }}
                    formatter={v => [formatINR(v), 'Spent']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#c8f564" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#c8f564', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart-card chart-pie">
          <div className="chart-header">
            <div>
              <h3>By Category</h3>
              <p>Breakdown</p>
            </div>
          </div>
          <div className="chart-body">
            {categoryData.length === 0 ? (
              <div className="empty-chart">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '10px', color: '#f0f0f8', fontSize: 13 }}
                    formatter={v => [formatINR(v)]}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#8888a8' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="recent-card">
        <div className="recent-header">
          <h3>Recent Expenses</h3>
          <button className="view-all-btn" onClick={() => navigate('/expenses')}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses yet. <button onClick={() => navigate('/expenses')}>Add your first one →</button></p>
          </div>
        ) : (
          <div className="recent-list">
            {recentExpenses.map((exp, i) => (
              <div key={exp._id} className="recent-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="recent-cat-badge">{exp.category.charAt(0).toUpperCase()}</div>
                <div className="recent-info">
                  <span className="recent-desc">{exp.description}</span>
                  <span className="recent-cat">{exp.category}</span>
                </div>
                <div className="recent-right">
                  <span className="recent-amount">{formatINR(exp.amount)}</span>
                  <span className={`recent-badge ${exp.done ? 'badge-done' : 'badge-pending'}`}>
                    {exp.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
