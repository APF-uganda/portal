import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Plus, Trash2, UserPlus, CheckCircle, XCircle, Loader2,
  Mail, MailX, RefreshCw, Upload, Download, FileSpreadsheet,
  ClipboardList, Info,
} from 'lucide-react';
import Sidebar from '../../components/common/adminSideNav';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { API_V1_BASE_URL } from '../../config/api';
import { getAuth } from '../../utils/authStorage';

interface MemberEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  icpau_registration_number: string;
  _error?: string;
}

interface RegistrationResult {
  id: number;
  email: string;
  full_name: string;
  temp_password: string;
  email_sent: boolean;
}

interface FailedEntry {
  email: string;
  reason: string;
}

const emptyEntry = (): MemberEntry => ({
  id: crypto.randomUUID(),
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  icpau_registration_number: '',
});

const authHeaders = () => {
  const auth = getAuth();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth?.access_token ?? ''}`,
  };
};

const TEMPLATE_HEADERS = ['first_name', 'last_name', 'email', 'phone_number', 'icpau_registration_number'];

const ICPAU_REGEX = /^F\d{3}\/\d{2}$/;

const validateRow = (m: MemberEntry, allEmails?: string[]): string => {
  if (!m.first_name.trim()) return 'First name is required';
  if (!m.last_name.trim()) return 'Last name is required';
  if (!m.email.trim()) return 'Email is required';
  if (!m.email.includes('@')) return 'Email must contain @';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) return 'Invalid email format';
  if (allEmails && allEmails.filter(e => e === m.email.trim().toLowerCase()).length > 1)
    return 'Duplicate email in list';
  if (!m.phone_number.trim()) return 'Phone number is required';
  if (!m.icpau_registration_number.trim()) return 'ICPAU cert. number is required';
  if (!ICPAU_REGEX.test(m.icpau_registration_number.trim()))
    return 'ICPAU format must be in format F123/45';
  return '';
};

const BulkRegisterMembers = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');

  // Manual tab state
  const [members, setMembers] = useState<MemberEntry[]>([emptyEntry()]);

  // Upload tab state
  const [parsedMembers, setParsedMembers] = useState<MemberEntry[]>([]);
  const [parseError, setParseError] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shared result state
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<RegistrationResult[]>([]);
  const [failed, setFailed] = useState<FailedEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [regenState, setRegenState] = useState<Record<number, 'idle' | 'loading' | 'done' | 'error'>>({});

  // ── Manual tab helpers ──────────────────────────────────────────────────────
  const updateMember = (id: string, field: keyof MemberEntry, value: string) =>
    setMembers(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, [field]: value } : m);
      const allEmails = updated.map(m => m.email.trim().toLowerCase());
      return updated.map(m => ({ ...m, _error: validateRow(m, allEmails) }));
    });
  const addRow = () => setMembers(prev => [...prev, emptyEntry()]);
  const removeRow = (id: string) => {
    if (members.length === 1) return;
    setMembers(prev => {
      const updated = prev.filter(m => m.id !== id);
      const allEmails = updated.map(m => m.email.trim().toLowerCase());
      return updated.map(m => ({ ...m, _error: validateRow(m, allEmails) }));
    });
  };

  // ── Template download ───────────────────────────────────────────────────────
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      TEMPLATE_HEADERS,
      ['John', 'Doe', 'john.doe@example.com', '+256700000000', 'F123/45'],
    ]);
    ws['!cols'] = TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, 'member_registration_template.xlsx');
  };

  // ── Parse helpers ───────────────────────────────────────────────────────────
  const parseRows = (rows: string[][]): MemberEntry[] => {
    if (!rows.length) return [];
    const firstRow = rows[0].map(h => h.toLowerCase().trim().replace(/\s+/g, '_'));
    const hasHeader = TEMPLATE_HEADERS.some(h => firstRow.includes(h));
    const dataRows = hasHeader ? rows.slice(1) : rows;
    const headerRow = hasHeader ? firstRow : TEMPLATE_HEADERS;

    const idx = (key: string) => headerRow.indexOf(key);

    const entries = dataRows
      .filter(r => r.some(c => c.trim()))
      .map(r => {
        const get = (key: string) => (idx(key) >= 0 ? (r[idx(key)] ?? '').trim() : '');
        return {
          id: crypto.randomUUID(),
          first_name: get('first_name'),
          last_name: get('last_name'),
          email: get('email'),
          phone_number: get('phone_number'),
          icpau_registration_number: get('icpau_registration_number'),
          _error: '',
        } as MemberEntry;
      });

    const allEmails = entries.map(e => e.email.trim().toLowerCase());
    entries.forEach(e => { e._error = validateRow(e, allEmails); });
    return entries;
  };

  const handleFileUpload = (file: File) => {
    setParseError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        const parsed = parseRows(rows);
        if (!parsed.length) { setParseError('No data found in the file.'); return; }
        setParsedMembers(parsed);
        setPasteText('');
      } catch {
        setParseError('Could not read the file. Make sure it is a valid .xlsx or .csv file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePaste = (text: string) => {
    setPasteText(text);
    if (!text.trim()) { setParsedMembers([]); return; }
    const rows = text.trim().split('\n').map(r => r.split('\t'));
    const parsed = parseRows(rows);
    setParsedMembers(parsed);
    setParseError('');
    setFileName('');
  };

  const updateParsedMember = (id: string, field: keyof MemberEntry, value: string) => {
    setParsedMembers(prev => {
      const updated = prev.map(m => m.id !== id ? m : { ...m, [field]: value });
      const allEmails = updated.map(m => m.email.trim().toLowerCase());
      return updated.map(m => ({ ...m, _error: validateRow(m, allEmails) }));
    });
  };

  const removeParsedRow = (id: string) =>
    setParsedMembers(prev => prev.filter(m => m.id !== id));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (source: MemberEntry[]) => {
    setGlobalError('');
    const allEmails = source.map(m => m.email.trim().toLowerCase());
    const hasErrors = source.some(m => validateRow(m, allEmails));
    if (hasErrors) { setGlobalError('Please fix all validation errors before submitting.'); return; }
    if (!source.length) { setGlobalError('No members to register.'); return; }

    const auth = getAuth();
    if (!auth?.access_token) { setGlobalError('Authentication required. Please log in again.'); return; }

    setLoading(true);
    try {
      const payload = {
        members: source.map(({ first_name, last_name, email, phone_number, icpau_registration_number }) => ({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phone_number.trim(),
          icpau_registration_number: icpau_registration_number.trim(),
        })),
      };

      const res = await fetch(`${API_V1_BASE_URL}/admin-management/members/bulk-register/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMsg = 'Registration failed. Please check your input.';
        if (data?.detail) errorMsg = data.detail;
        else if (data?.members) {
          const me = data.members;
          if (typeof me === 'string') errorMsg = me;
          else if (Array.isArray(me)) {
            const first = me[0];
            if (typeof first === 'string') errorMsg = first;
            else if (first && typeof first === 'object')
              errorMsg = Object.entries(first).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join('; ');
          }
        }
        setGlobalError(errorMsg);
        return;
      }

      setCreated(data.created || []);
      setFailed(data.failed || []);
      setRegenState({});
      setSubmitted(true);
      setMembers([emptyEntry()]);
      setParsedMembers([]);
      setPasteText('');
      setFileName('');
    } catch {
      setGlobalError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (memberId: number) => {
    setRegenState(prev => ({ ...prev, [memberId]: 'loading' }));
    try {
      const res = await fetch(
        `${API_V1_BASE_URL}/admin-management/members/${memberId}/reset-password/`,
        { method: 'POST', headers: authHeaders() }
      );
      const data = await res.json();
      if (!res.ok) { setRegenState(prev => ({ ...prev, [memberId]: 'error' })); return; }
      setCreated(prev => prev.map(c =>
        c.id === memberId ? { ...c, temp_password: data.temp_password, email_sent: data.email_sent } : c
      ));
      setRegenState(prev => ({ ...prev, [memberId]: 'done' }));
      setTimeout(() => setRegenState(prev => ({ ...prev, [memberId]: 'idle' })), 3000);
    } catch {
      setRegenState(prev => ({ ...prev, [memberId]: 'error' }));
    }
  };

  const handleReset = () => {
    setSubmitted(false); setCreated([]); setFailed([]);
    setGlobalError(''); setRegenState({});
    setMembers([emptyEntry()]); setParsedMembers([]);
    setPasteText(''); setFileName('');
  };

  // ── Shared input style ──────────────────────────────────────────────────────
  const inputCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 w-full';

  // ── Results table ───────────────────────────────────────────────────────────
  const ResultsView = () => (
    <div className="space-y-6">
      {created.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-gray-800">
              {created.length} member{created.length > 1 ? 's' : ''} registered successfully
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Welcome emails with login credentials have been sent to each member. Use "Regenerate" to resend if an email failed.
          </p>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Temporary Password</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {created.map(c => {
                  const rState = regenState[c.id] ?? 'idle';
                  return (
                    <tr key={c.id}>
                      <td className="py-2.5 pr-4 font-medium text-gray-700 whitespace-nowrap">{c.full_name}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{c.email}</td>
                      <td className="py-2.5 pr-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs  text-purple-700">{c.temp_password}</code>
                      </td>
                      <td className="py-2.5 pr-4">
                        {c.email_sent
                          ? <span className="flex items-center gap-1 text-green-600 text-xs whitespace-nowrap"><Mail className="w-3.5 h-3.5" /> Sent</span>
                          : <span className="flex items-center gap-1 text-orange-500 text-xs whitespace-nowrap"><MailX className="w-3.5 h-3.5" /> Failed</span>}
                      </td>
                      <td className="py-2.5">
                        <button onClick={() => handleRegenerate(c.id)} disabled={rState === 'loading'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap
                            ${rState === 'done' ? 'bg-green-100 text-green-700 cursor-default'
                              : rState === 'error' ? 'bg-red-100 text-red-600 cursor-default'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'} disabled:opacity-60`}>
                          {rState === 'loading' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                            : rState === 'done' ? <><CheckCircle className="w-3.5 h-3.5" /> Sent</>
                            : rState === 'error' ? <><XCircle className="w-3.5 h-3.5" /> Failed</>
                            : <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {created.map(c => {
              const rState = regenState[c.id] ?? 'idle';
              return (
                <div key={c.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm">{c.full_name}</span>
                    {c.email_sent
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><Mail className="w-3.5 h-3.5" /> Sent</span>
                      : <span className="flex items-center gap-1 text-orange-500 text-xs"><MailX className="w-3.5 h-3.5" /> Failed</span>}
                  </div>
                  <p className="text-xs text-gray-500">{c.email}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Password:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs  text-purple-700">{c.temp_password}</code>
                  </div>
                  <button onClick={() => handleRegenerate(c.id)} disabled={rState === 'loading'}
                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors
                      ${rState === 'done' ? 'bg-green-100 text-green-700 cursor-default'
                        : rState === 'error' ? 'bg-red-100 text-red-600 cursor-default'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'} disabled:opacity-60`}>
                    {rState === 'loading' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                      : rState === 'done' ? <><CheckCircle className="w-3.5 h-3.5" /> Sent</>
                      : rState === 'error' ? <><XCircle className="w-3.5 h-3.5" /> Failed</>
                      : <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {failed.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-gray-800">{failed.length} registration{failed.length > 1 ? 's' : ''} failed</h2>
          </div>
          <div className="space-y-2">
            {failed.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-sm">
                <span className="text-gray-700 font-medium sm:min-w-[200px]">{f.email}</span>
                <span className="text-red-600">{f.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleReset} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
        <UserPlus className="w-4 h-4" /> Register more members
      </button>
    </div>
  );

  // ── Preview table (upload tab) ──────────────────────────────────────────────
  const fieldErrCls = (m: MemberEntry, field: string) => {
    const allEmails = parsedMembers.map(p => p.email.trim().toLowerCase());
    const empty = (v: string) => !v.trim();
    const isDupEmail = allEmails.filter(e => e === m.email.trim().toLowerCase()).length > 1;
    const invalid: Record<string, boolean> = {
      first_name: empty(m.first_name),
      last_name: empty(m.last_name),
      email: empty(m.email) || !m.email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim()) || isDupEmail,
      phone_number: empty(m.phone_number),
      icpau_registration_number: empty(m.icpau_registration_number) || !ICPAU_REGEX.test(m.icpau_registration_number.trim()),
    };
    return invalid[field]
      ? 'border-red-400 focus:ring-red-300 bg-red-50'
      : 'border-gray-200 focus:ring-purple-300';
  };

  const PreviewTable = () => {
    const errorRows = parsedMembers.filter(m => m._error);
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">{parsedMembers.length} row{parsedMembers.length !== 1 ? 's' : ''} parsed</p>
          {errorRows.length > 0 && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {errorRows.length} row{errorRows.length > 1 ? 's have' : ' has'} errors
            </span>
          )}
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide bg-gray-50 border-b">
                <th className="px-3 py-2 w-8 min-w-[2rem]">#</th>
                <th className="px-3 py-2">First Name *</th>
                <th className="px-3 py-2">Last Name *</th>
                <th className="px-3 py-2">Email *</th>
                <th className="px-3 py-2">Phone *</th>
                <th className="px-3 py-2">ICPAU Cert. No. *</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parsedMembers.map((m, i) => (
                <tr key={m.id}>
                  <td className="px-3 py-2 text-gray-400 text-xs whitespace-nowrap w-8 min-w-[2rem]">{i + 1}</td>
                  <td className="px-3 py-1.5">
                    <input className={`${inputCls} ${fieldErrCls(m, 'first_name')}`} value={m.first_name} onChange={e => updateParsedMember(m.id, 'first_name', e.target.value)} />
                  </td>
                  <td className="px-3 py-1.5">
                    <input className={`${inputCls} ${fieldErrCls(m, 'last_name')}`} value={m.last_name} onChange={e => updateParsedMember(m.id, 'last_name', e.target.value)} />
                  </td>
                  <td className="px-3 py-1.5">
                    <input className={`${inputCls} ${fieldErrCls(m, 'email')}`} type="email" value={m.email} onChange={e => updateParsedMember(m.id, 'email', e.target.value)} />
                  </td>
                  <td className="px-3 py-1.5">
                    <input className={`${inputCls} ${fieldErrCls(m, 'phone_number')}`} value={m.phone_number} onChange={e => updateParsedMember(m.id, 'phone_number', e.target.value)} />
                  </td>
                  <td className="px-3 py-1.5">
                    <input className={`${inputCls} ${fieldErrCls(m, 'icpau_registration_number')}`} value={m.icpau_registration_number} onChange={e => updateParsedMember(m.id, 'icpau_registration_number', e.target.value)} placeholder="e.g. F123/45" />
                  </td>
                  <td className="px-3 py-1.5">
                    <button onClick={() => removeParsedRow(m.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove row">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Error summary below table */}
        {errorRows.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg space-y-1">
            {errorRows.map((m, i) => {
              const rowNum = parsedMembers.indexOf(m) + 1;
              return (
                <p key={i} className="text-xs text-red-600 flex items-start gap-2">
                  <span className="font-semibold whitespace-nowrap">Row {rowNum}:</span>
                  <span>{m._error}</span>
                </p>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} isMobileOpen={isMobileOpen} onMobileToggle={() => setIsMobileOpen(o => !o)} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header title="Register a Member" onMobileMenuToggle={() => setIsMobileOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-6 h-6 text-purple-700" />
              <h1 className="text-2xl font-bold text-gray-800">Register a Member</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Register members individually or in bulk. Each member receives a welcome email with a temporary password to log in and complete their profile.
            </p>

            {submitted ? <ResultsView /> : (
              <>
                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'manual' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <ClipboardList className="w-4 h-4" /> Manual Entry
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'upload' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Bulk Upload
                  </button>
                </div>

                {globalError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{globalError}</div>
                )}

                {/* ── Manual Entry Tab ── */}
                {activeTab === 'manual' && (() => {
                  const allEmails = members.map(m => m.email.trim().toLowerCase());
                  const base = 'rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 w-full border';
                  const mCls = (m: MemberEntry, field: string) => {
                    const bad: Record<string, boolean> = {
                      first_name: !m.first_name.trim(),
                      last_name: !m.last_name.trim(),
                      email: !m.email.trim() || !m.email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim()) || allEmails.filter(e => e === m.email.trim().toLowerCase()).length > 1,
                      phone_number: !m.phone_number.trim(),
                      icpau_registration_number: !m.icpau_registration_number.trim() || !ICPAU_REGEX.test(m.icpau_registration_number.trim()),
                    };
                    return bad[field] ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-purple-300';
                  };
                  return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                      <div className="hidden md:grid grid-cols-12 gap-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                        <div className="col-span-2">First Name *</div>
                        <div className="col-span-2">Last Name *</div>
                        <div className="col-span-3">Email *</div>
                        <div className="col-span-2">Phone *</div>
                        <div className="col-span-2">ICPAU Cert. No. *</div>
                        <div className="col-span-1"></div>
                      </div>
                      <div className="space-y-3 md:space-y-2">
                        {members.map((m) => (
                          <div key={m.id} className={`relative border rounded-xl p-4 md:p-0 md:border-0 md:rounded-none md:grid md:grid-cols-12 md:gap-3 md:items-start ${m._error ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                            <button onClick={() => removeRow(m.id)} disabled={members.length === 1} className="absolute top-3 right-3 md:hidden text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors" title="Remove">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-2 md:contents">
                              <div className="md:contents">
                                <label className="block md:hidden text-xs text-gray-400 mb-0.5">First Name *</label>
                                <input className={`col-span-1 md:col-span-2 ${base} ${mCls(m, 'first_name')}`} placeholder="First name" value={m.first_name} onChange={e => updateMember(m.id, 'first_name', e.target.value)} />
                              </div>
                              <div className="md:contents">
                                <label className="block md:hidden text-xs text-gray-400 mb-0.5">Last Name *</label>
                                <input className={`col-span-1 md:col-span-2 ${base} ${mCls(m, 'last_name')}`} placeholder="Last name" value={m.last_name} onChange={e => updateMember(m.id, 'last_name', e.target.value)} />
                              </div>
                              <div className="col-span-2 md:contents">
                                <label className="block md:hidden text-xs text-gray-400 mb-0.5">Email *</label>
                                <input className={`md:col-span-3 ${base} ${mCls(m, 'email')}`} placeholder="email@example.com" type="email" value={m.email} onChange={e => updateMember(m.id, 'email', e.target.value)} />
                              </div>
                              <div className="md:contents">
                                <label className="block md:hidden text-xs text-gray-400 mb-0.5">Phone *</label>
                                <input className={`md:col-span-2 ${base} ${mCls(m, 'phone_number')}`} placeholder="+256..." value={m.phone_number} onChange={e => updateMember(m.id, 'phone_number', e.target.value)} />
                              </div>
                              <div className="md:contents">
                                <label className="block md:hidden text-xs text-gray-400 mb-0.5">ICPAU Cert. No. *</label>
                                <input className={`md:col-span-2 ${base} ${mCls(m, 'icpau_registration_number')}`} placeholder="e.g. F123/45" value={m.icpau_registration_number} onChange={e => updateMember(m.id, 'icpau_registration_number', e.target.value)} />
                              </div>
                            </div>
                            <button onClick={() => removeRow(m.id)} disabled={members.length === 1} className="hidden md:flex col-span-1 justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors mt-2" title="Remove row">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {m._error && (
                              <p className="col-span-12 text-xs text-red-500 mt-1.5 md:px-1">{m._error}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                        <button onClick={addRow} className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-sm font-medium transition-colors">
                          <Plus className="w-4 h-4" /> Add another member
                        </button>
                        <button onClick={() => handleSubmit(members)} disabled={loading || members.some(m => m._error)} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : <><UserPlus className="w-4 h-4" /> Register {members.length} Member{members.length > 1 ? 's' : ''}</>}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* ── Bulk Upload Tab ── */}
                {activeTab === 'upload' && (
                  <div className="space-y-5">
                    {/* Instructions */}
                    <div className="border-l-4 border-[#4B1D91] bg-transparent rounded-lg pl-5 pr-4 py-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-black shrink-0" />
                        <span className="text-sm font-semibold text-black">How bulk registration works</span>
                      </div>
                      <ol className="space-y-2 text-sm text-black list-decimal list-inside">
                        <li>Download the Excel template below — it has the correct column headers already set up.</li>
                        <li>Fill in your members' details: first name, last name, email (required), and phone number (optional).</li>
                        <li>Save the file and upload it here, or copy the rows from Excel and paste them in the text area.</li>
                        <li>Review the preview table — you can edit or remove any row before submitting.</li>
                        <li>Click "Register Members". Each member will be created and sent a welcome email with a temporary password.</li>
                        <li>Members must log in and change their password on first sign-in.</li>
                      </ol>
                      <div className="mt-3 text-sm text-[#4B1D91] text-extrabold">
                        Supported formats: <strong>.xlsx</strong>, <strong>.csv</strong>, or paste tab-separated data directly from Excel.
                        ICPAU cert. number format: <strong>F123/45</strong>.
                        Duplicate emails are automatically skipped.
                      </div>
                    </div>

                    {/* Download template */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <p className="text-sm font-medium text-gray-700 mb-3">Step 1 — Download the template</p>
                      <button onClick={downloadTemplate} className="flex items-center gap-2 border border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                        <Download className="w-4 h-4" /> Download Excel Template (.xlsx)
                      </button>
                      <p className="text-xs text-gray-400 mt-2">The template includes a sample row to show the expected format.</p>
                    </div>

                    {/* Upload / Paste */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <p className="text-sm font-medium text-gray-700 mb-4">Step 2 — Upload your file or paste data</p>

                      {/* Drop zone */}
                      <div
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f); }}
                      >
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          {fileName ? <span className="text-purple-700 font-medium">{fileName}</span> : <>Drag & drop your file here, or <span className="text-purple-700 font-medium underline">browse</span></>}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Accepts .xlsx and .csv</p>
                        <input ref={fileInputRef} type="file" accept=".xlsx,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                      </div>

                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400">or paste from Excel</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      <textarea
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                        rows={5}
                        placeholder={"Paste tab-separated data here (copied from Excel).\nExample:\nfirst_name\tlast_name\temail\tphone_number\ticpau_registration_number\nJohn\tDoe\tjohn@example.com\t+256700000000\tF123/45"}
                        value={pasteText}
                        onChange={e => handlePaste(e.target.value)}
                      />

                      {parseError && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5"><XCircle className="w-4 h-4" />{parseError}</p>
                      )}
                    </div>

                    {/* Preview — always shown once rows exist, or add manually */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">Step 3 — Review and submit</p>
                        <button
                          onClick={() => setParsedMembers(prev => [...prev, emptyEntry()])}
                          className="flex items-center gap-1.5 text-purple-700 hover:text-purple-900 text-sm font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Add row
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        Rows appear here after uploading or pasting. You can also add rows manually, edit any cell, or remove rows before registering.
                      </p>
                      {parsedMembers.length > 0 ? (
                        <>
                          <PreviewTable />
                          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => handleSubmit(parsedMembers)}
                              disabled={loading || parsedMembers.some(m => m._error)}
                              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                            >
                              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : <><UserPlus className="w-4 h-4" /> Register {parsedMembers.length} Member{parsedMembers.length !== 1 ? 's' : ''}</>}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                          No rows yet — upload a file, paste data above, or click "Add row" to start manually.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BulkRegisterMembers;
