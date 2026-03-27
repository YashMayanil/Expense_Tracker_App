import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, Circle, Search, Filter, X } from 'lucide-react';
import { getAllExpenses, addExpense, updateExpense, removeExpense, markDoneUndone } from '../utils/api';
import toast from 'react-hot-toast';
import './Expenses.css';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other'];

const emptyForm = { description: '', amount: '', category: 'Food' };

const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterDone, setFilterDone] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchExpenses(); }, [filterCat, filterDone]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCat) params.category = filterCat;
      if (filterDone) params.done = filterDone;
      const res = await getAllExpenses(params);
      setExpenses(res.data.expense || []);
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setShowModal(true); };
  const openEdit = (exp) => {
    setForm({ description: exp.description, amount: exp.amount, category: exp.category });
    setEditItem(exp);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateExpense(editItem._id, { ...form, amount: Number(form.amount) });
        toast.success('Expense updated!');
      } else {
        await addExpense({ ...form, amount: Number(form.amount) });
        toast.success('Expense added!');
      }
      closeModal();
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeExpense(id);
      toast.success('Expense removed');
      setDeleteId(null);
      fetchExpenses();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleDone = async (exp) => {
    try {
      await markDoneUndone(exp._id, { done: !exp.done });
      toast.success(`Marked as ${!exp.done ? 'done' : 'undone'}`);
      fetchExpenses();
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-sub">{filtered.length} items · Total {formatINR(totalFiltered)}</p>
        </div>
        <button className="add-btn" onClick={openAdd}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="clear-search" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>

        <div className="filter-chips">
          <Filter size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <button
            className={`chip ${filterCat === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCat('all')}
          >All</button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${filterCat === cat ? 'active' : ''}`}
              onClick={() => setFilterCat(filterCat === cat ? 'all' : cat)}
            >{cat}</button>
          ))}
        </div>

        <div className="status-filter">
          <select value={filterDone} onChange={e => setFilterDone(e.target.value)}>
            <option value="">All Status</option>
            <option value="undone">Pending Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="table-loading"><span className="spinner-lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-expenses">
          <div className="empty-icon">💸</div>
          <h3>No expenses found</h3>
          <p>{expenses.length === 0 ? 'Add your first expense to get started.' : 'Try adjusting your filters.'}</p>
          {expenses.length === 0 && (
            <button className="add-btn" onClick={openAdd}><Plus size={16} /> Add Expense</button>
          )}
        </div>
      ) : (
        <div className="expenses-table-wrap">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp, i) => (
                <tr key={exp._id} className={`${exp.done ? 'row-done' : ''}`} style={{ animationDelay: `${i * 0.03}s` }}>
                  <td>
                    <button
                      className={`status-btn ${exp.done ? 'status-done' : 'status-pending'}`}
                      onClick={() => handleToggleDone(exp)}
                      title={exp.done ? 'Mark as pending' : 'Mark as done'}
                    >
                      {exp.done ? <CheckCircle size={17} /> : <Circle size={17} />}
                    </button>
                  </td>
                  <td>
                    <span className={`desc-text ${exp.done ? 'line-through' : ''}`}>{exp.description}</span>
                  </td>
                  <td>
                    <span className="cat-chip">{exp.category}</span>
                  </td>
                  <td>
                    <span className="amount-cell">{formatINR(exp.amount)}</span>
                  </td>
                  <td>
                    <span className="date-cell">
                      {new Date(exp.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => openEdit(exp)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="action-btn del-btn" onClick={() => setDeleteId(exp._id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Edit Expense' : 'Add Expense'}</h3>
              <button className="modal-close" onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Coffee at Starbucks"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                  autoFocus
                />
              </div>
              <div className="field">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <span className="spinner" /> : (editItem ? 'Update' : 'Add Expense')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Expense</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}><X size={18} /></button>
            </div>
            <p className="delete-confirm-text">Are you sure? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
