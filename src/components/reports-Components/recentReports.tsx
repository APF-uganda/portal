import React, { useEffect, useState, useCallback, useRef } from 'react';
import { History, FileText, Download, Loader2, AlertCircle, FileSpreadsheet, File, Info } from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';

interface RecentReportsProps {
  refreshTrigger?: number;
}

const RecentReports: React.FC<RecentReportsProps> = ({ refreshTrigger }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
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

  // Smart Polling Logic
  useEffect(() => {
    fetchReports(true);

    const startPolling = () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      
      
      const isProcessing = reports.some(r => r.status === 'processing');
      const intervalTime = isProcessing ? 3000 : 20000;

      pollInterval.current = setInterval(() => {
        fetchReports();
      }, intervalTime);
    };

    startPolling();

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [refreshTrigger, reports.some(r => r.status === 'processing'), fetchReports]);

  const handleDownload = async (report: any) => {
    if (report.status !== 'completed') return;

    setDownloading(report.id);
    try {
      const blob = await analyticsApi.downloadReport(report.id);
      
      // Ghost file protection: If the server returned an error page as a file
      if (blob.size < 600) {
        const text = await blob.text();
        if (text.includes("<!DOCTYPE html>") || text.includes("Error")) {
          throw new Error("The report file is invalid or empty.");
        }
      }

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
      alert('File unavailable: The server may have encountered an error during generation or the file has expired.');
    } finally {
      setDownloading(null);
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
      <p className="text-sm text-slate-500 font-medium">Synchronizing reports...</p>
    </div>
  );

  return (
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
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">No recent activity found.</p>
          </div>
        ) : (
          reports.slice(0, 10).map((report) => (
            <div key={report.id} className="p-4 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  report.status === 'failed' ? 'bg-red-50' :
                  report.file_format?.toLowerCase() === 'pdf' ? 'bg-red-50/50' : 
                  'bg-emerald-50/50'
                }`}>
                  {renderFileIcon(report.file_format)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-sm md:text-base truncate">
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      report.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      report.status === 'failed' ? 'text-red-600 bg-red-50 border-red-100' :
                      'text-amber-600 bg-amber-50 border-amber-100'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(report.created_at).toLocaleDateString()} • {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {report.status === 'completed' && (
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={downloading === report.id}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 text-slate-700 font-bold rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-xs disabled:opacity-50 shadow-sm"
                  >
                    {downloading === report.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}
                
                {report.status === 'processing' && (
                  <div className="flex items-center gap-2 text-amber-500">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                )}

                {report.status === 'failed' && (
                  <div className="group relative">
                    <AlertCircle size={20} className="text-red-500 cursor-help" />
                    <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
  );
};

export default RecentReports;