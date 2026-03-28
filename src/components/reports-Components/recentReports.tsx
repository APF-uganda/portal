import React, { useEffect, useState, useCallback, useRef } from 'react';
import { History, FileText, Download, Loader2, AlertCircle, FileSpreadsheet, File, Trash2, X } from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';

interface RecentReportsProps {
  refreshTrigger?: number;
}

const RecentReports: React.FC<RecentReportsProps> = ({ refreshTrigger }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<{id: string, title: string} | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchReports = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await analyticsApi.getGeneratedReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(true);
    const startPolling = () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      const isProcessing = reports.some(r => r.status === 'processing');
      const intervalTime = isProcessing ? 3000 : 20000;
      pollInterval.current = setInterval(() => fetchReports(), intervalTime);
    };
    startPolling();
    return () => { if (pollInterval.current) clearInterval(pollInterval.current); };
  }, [refreshTrigger, reports.some(r => r.status === 'processing'), fetchReports]);

  const handleDownload = async (report: any) => {
    if (report.status !== 'completed') return;
    setDownloading(report.id);
    try {
      const blob = await analyticsApi.downloadReport(report.id);
      const extension = report.file_format?.toLowerCase() || 'pdf';
      const filename = `${report.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
    }
  };

  const executeDelete = async () => {
    if (!reportToDelete) return;
    const reportId = reportToDelete.id;
    setDeleting(reportId);
    setReportToDelete(null);
    try {
      await analyticsApi.deleteReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const renderFileIcon = (format: string) => {
    const lowerFormat = format?.toLowerCase();
    if (lowerFormat === 'pdf') return <FileText size={18} className="text-red-500" />;
    if (['excel', 'xlsx', 'csv'].includes(lowerFormat)) return <FileSpreadsheet size={18} className="text-emerald-600" />;
    return <File size={18} className="text-slate-400" />;
  };

  if (loading && reports.length === 0) return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center">
      <Loader2 className="animate-spin text-slate-400 mb-2" size={24} />
      <p className="text-sm text-slate-500 font-medium">Updating reports...</p>
    </div>
  );

  return (
    <>
      {/*delete */}
      {reportToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <button onClick={() => setReportToDelete(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Delete Report?</h3>
            <p className="text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-semibold text-slate-700">"{reportToDelete.title}"</span>? This will permanently remove the file from the server.
            </p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setReportToDelete(null)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
        <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <History size={18} className="text-slate-400" />
            <h2 className="font-bold text-slate-800 text-base md:text-lg">Recent Reports</h2>
          </div>
          {reports.some(r => r.status === 'processing') && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">
              <Loader2 size={10} className="animate-spin" />
              GENERATING...
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-50">
          {reports.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No recent activity found.</div>
          ) : (
            reports.slice(0, 10).map((report) => (
              <div key={report.id} className="p-4 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${report.status === 'failed' ? 'bg-red-50' : 'bg-slate-50'}`}>
                    {renderFileIcon(report.file_format)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm md:text-base truncate">{report.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        report.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                        report.status === 'failed' ? 'text-red-600 bg-red-50 border-red-100' : 'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>{report.status}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(report.created_at).toLocaleDateString()} • {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {report.status === 'completed' && (
                    <button onClick={() => handleDownload(report)} disabled={downloading === report.id || deleting === report.id} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 text-slate-700 font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-all text-xs shadow-sm">
                      {downloading === report.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  )}
                  {report.status !== 'processing' && (
                    <button onClick={() => setReportToDelete({id: report.id, title: report.title})} disabled={deleting === report.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      {deleting === report.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  )}
                  {report.status === 'failed' && (
                    <div className="group relative">
                      <AlertCircle size={20} className="text-red-500 cursor-help" />
                      <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 z-50 pointer-events-none">
                        <p className="font-bold border-b border-slate-700 pb-1 mb-1">Error Log</p>
                        {report.error_message || "System error during generation."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RecentReports;