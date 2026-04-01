import { useState } from 'react';
import { Plus, Trash2, UserPlus, CheckCircle, XCircle, Loader2, Mail, MailX, RefreshCw } from 'lucide-react';
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
});

const authHeaders = () => {
  const auth = getAuth();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth?.access_token ?? ''}`,
  };
};

const BulkRegisterMembers = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [members, setMembers] = useState<MemberEntry[]>([emptyEntry()]);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<RegistrationResult[]>([]);
  const [failed, setFailed] = useState<FailedEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState('');
  // Track per-row regenerate state: memberId -> 'idle' | 'loading' | 'done' | 'error'
  const [regenState, setRegenState] = useState<Record<number, 'idle' | 'loading' | 'done' | 'error'>>({});

  const updateMember = (id: string, field: keyof MemberEntry, value: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addRow = () => setMembers(prev => [...prev, emptyEntry()]);

  const removeRow = (id: string) => {
    if (members.length === 1) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = async () => {
    setGlobalError('');
    for (const m of members) {
      if (!m.first_name.trim() || !m.last_name.trim() || !m.email.trim()) {
        setGlobalError('Please fill in first name, last name, and email for all rows.');
        return;
      }
    }

    const auth = getAuth();
    if (!auth?.access_token) {
      setGlobalError('Authentication required. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        members: members.map(({ first_name, last_name, email, phone_number }) => ({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phone_number.trim(),
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
        if (data?.detail) {
          errorMsg = data.detail;
        } else if (data?.members) {
          const membersErr = data.members;
          if (typeof membersErr === 'string') errorMsg = membersErr;
          else if (Array.isArray(membersErr)) {
            const first = membersErr[0];
            if (typeof first === 'string') errorMsg = first;
            else if (first && typeof first === 'object') {
              errorMsg = Object.entries(first).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join('; ');
            }
          } else if (typeof membersErr === 'object' && membersErr.non_field_errors) {
            errorMsg = membersErr.non_field_errors[0];
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

      if (!res.ok) {
        setRegenState(prev => ({ ...prev, [memberId]: 'error' }));
        return;
      }

      // Update the row with the new password and email status
      setCreated(prev =>
        prev.map(c =>
          c.id === memberId
            ? { ...c, temp_password: data.temp_password, email_sent: data.email_sent }
            : c
        )
      );
      setRegenState(prev => ({ ...prev, [memberId]: 'done' }));

      // Reset back to idle after 3s so button is usable again
      setTimeout(() => setRegenState(prev => ({ ...prev, [memberId]: 'idle' })), 3000);
    } catch {
      setRegenState(prev => ({ ...prev, [memberId]: 'error' }));
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCreated([]);
    setFailed([]);
    setGlobalError('');
    setRegenState({});
    setMembers([emptyEntry()]);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        isMobileOpen={isMobileOpen}
        onMobileToggle={() => setIsMobileOpen(o => !o)}
      />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header title="Bulk Member Registration" onMobileMenuToggle={() => setIsMobileOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-6 h-6 text-purple-700" />
              <h1 className="text-2xl font-bold text-gray-800">Bulk Member Registration</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Register multiple members at once. Each member will receive a temporary password to log in and complete their profile.
            </p>

            {!submitted ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {globalError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {globalError}
                  </div>
                )}

                <div className="grid grid-cols-12 gap-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                  <div className="col-span-3">First Name *</div>
                  <div className="col-span-3">Last Name *</div>
                  <div className="col-span-3">Email *</div>
                  <div className="col-span-2">Phone</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="space-y-2">
                  {members.map((m) => (
                    <div key={m.id} className="grid grid-cols-12 gap-3 items-center">
                      <input
                        className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="First name"
                        value={m.first_name}
                        onChange={e => updateMember(m.id, 'first_name', e.target.value)}
                      />
                      <input
                        className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Last name"
                        value={m.last_name}
                        onChange={e => updateMember(m.id, 'last_name', e.target.value)}
                      />
                      <input
                        className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="email@example.com"
                        type="email"
                        value={m.email}
                        onChange={e => updateMember(m.id, 'email', e.target.value)}
                      />
                      <input
                        className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="+256..."
                        value={m.phone_number}
                        onChange={e => updateMember(m.id, 'phone_number', e.target.value)}
                      />
                      <button
                        onClick={() => removeRow(m.id)}
                        disabled={members.length === 1}
                        className="col-span-1 flex justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={addRow}
                    className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add another member
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                    ) : (
                      <><UserPlus className="w-4 h-4" /> Register {members.length} Member{members.length > 1 ? 's' : ''}</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {created.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h2 className="font-semibold text-gray-800">
                        {created.length} member{created.length > 1 ? 's' : ''} registered successfully
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
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
                                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-purple-700">
                                    {c.temp_password}
                                  </code>
                                </td>
                                <td className="py-2.5 pr-4">
                                  {c.email_sent ? (
                                    <span className="flex items-center gap-1 text-green-600 text-xs whitespace-nowrap">
                                      <Mail className="w-3.5 h-3.5" /> Sent
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-orange-500 text-xs whitespace-nowrap">
                                      <MailX className="w-3.5 h-3.5" /> Failed
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5">
                                  <button
                                    onClick={() => handleRegenerate(c.id)}
                                    disabled={rState === 'loading'}
                                    title="Regenerate temporary password and resend email"
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap
                                      ${rState === 'done'
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : rState === 'error'
                                        ? 'bg-red-100 text-red-600 cursor-default'
                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                      } disabled:opacity-60`}
                                  >
                                    {rState === 'loading' ? (
                                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                                    ) : rState === 'done' ? (
                                      <><CheckCircle className="w-3.5 h-3.5" /> Sent</>
                                    ) : rState === 'error' ? (
                                      <><XCircle className="w-3.5 h-3.5" /> Failed</>
                                    ) : (
                                      <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {created.some(c => !c.email_sent) && (
                      <p className="text-xs text-orange-500 mt-3">
                        Some emails failed to send. Use "Regenerate" to retry sending credentials.
                      </p>
                    )}
                    {created.every(c => c.email_sent) && (
                      <p className="text-xs text-gray-400 mt-3">
                        Welcome emails with login credentials have been sent to all registered members.
                      </p>
                    )}
                  </div>
                )}

                {failed.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h2 className="font-semibold text-gray-800">
                        {failed.length} registration{failed.length > 1 ? 's' : ''} failed
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {failed.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <span className="text-gray-700 font-medium min-w-[200px]">{f.email}</span>
                          <span className="text-red-600">{f.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Register more members
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default BulkRegisterMembers;
