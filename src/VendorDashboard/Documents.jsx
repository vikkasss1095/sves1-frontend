import { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, FileText, ExternalLink, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../utils/axios";

const DOC_TYPES = [
  { value: 'gst_certificate', label: 'GST Certificate' },
  { value: 'pan_card',        label: 'PAN Card' },
  { value: 'registration',    label: 'Registration Doc' },
  { value: 'other',           label: 'Other' },
];

const STATUS_BADGE = {
  pending:  'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
};

export default function VendorDocuments() {
  const [docs, setDocs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm]           = useState({ name: '', type: 'gst_certificate' });
  const [showForm, setShowForm]   = useState(false);
  const fileRef                   = useRef(null);

  const fetchDocs = async () => {
    try {
      const { data } = await api.get('/vendor/documents');
      setDocs(data.documents);
    } catch { toast.error('Failed to load documents'); }
    finally { setLoading(false); }
  };

  

  useEffect(() => { fetchDocs(); }, []);

  const upload = async e => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return toast.error('Select a file first');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', form.name || file.name);
    fd.append('type', form.type);

    setUploading(true);
    try {
      await api.post('/vendor/documents', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded');
      setShowForm(false);
      setForm({ name: '', type: 'gst_certificate' });
      fileRef.current.value = '';
      fetchDocs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.delete(`/vendor/documents/${id}`);
      toast.success('Deleted');
      setDocs(prev => prev.filter(d => d._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Upload and manage your business documents</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="card p-5 mb-5 border-brand-100 bg-brand-50/30">
          <h3 className="text-sm font-700 text-slate-800 mb-4">Upload New Document</h3>
          <form onSubmit={upload} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-600 text-slate-500 mb-1.5">Document Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. GST Certificate 2024"
                className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 mb-1.5">Document Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-slate-500 mb-1.5">Select File (PDF/Image)</label>
              <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png" className="input-field text-xs" />
            </div>
            <div className="sm:col-span-3 flex gap-3">
              <button type="submit" disabled={uploading} className="btn-primary">
                {uploading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Uploading...</>
                  : <><Upload className="w-4 h-4" /> Upload</>
                }
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Documents grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : docs.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No documents uploaded yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
            <Upload className="w-4 h-4" /> Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map(doc => (
            <div key={doc._id} className="card p-4 hover:shadow-card-hover transition-shadow group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-600 text-slate-800 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {DOC_TYPES.find(t => t.value === doc.type)?.label || doc.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={STATUS_BADGE[doc.status]}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={doc.url} target="_blank" rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-600 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => deleteDoc(doc._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {doc.adminRemarks && (
                <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-50">{doc.adminRemarks}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

