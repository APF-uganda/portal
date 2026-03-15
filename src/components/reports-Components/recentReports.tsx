import React, { useEffect, useState } from 'react';
import { History, FileText, Download, Trash2, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';

interface RecentReportsProps {
  refreshTrigger?: number;
}

const RecentReports: React.FC<RecentReportsProps> = ({ refreshTrigger }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const data = await analyticsApi.getGeneratedReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Auto-refresh every 15 seconds to check for "processing" -> "completed" status
    const interval = setInterval(fetchReports, 15000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const handleDownload = async (report: any) => {
    if (report.status !== 'completed' || !report.download_url) {
      return;
    }

    setDownloading(report.id);
    try {
      const blob = await analyticsApi.downloadReport(report.id);
      
      // Get filename from report or use default
      const filename = `${report.title.replace(/[^a-z0-9]/gi, '_')}.${report.file_format}`;

      // Create blob URL and trigger download
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
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center">
      <Loader2 className="animate-spin text-[#5E2590] mb-2" size={24} />
      <p className="text-sm text-slate-500">Loading your reports...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#5E2590]">
          <History size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
          <h2 className="font-bold text-slate-800 text-base md:text-lg">Recently Generated</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {reports.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <p className="text-slate-400 text-sm">No reports generated yet.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="p-3 md:p-4 hover:bg-slate-50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className={`p-2 md:p-2.5 rounded-lg flex-shrink-0 ${report.file_format === 'pdf' ? 'bg-indigo-50 text-[#5E2590]' : 'bg-emerald-50 text-emerald-600'}`}>
                  {report.file_format === 'pdf' ? <FileText size={16} className="md:w-[18px] md:h-[18px]" /> : <FileSpreadsheet size={16} className="md:w-[18px] md:h-[18px]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-700 text-sm md:text-base truncate">{report.title}</p>
                  <p className="text-[10px] md:text-[11px] text-slate-400 mt-0.5">
                    {report.status.toUpperCase()} • {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {report.status === 'processing' ? (
                  <Loader2 size={14} className="md:w-4 md:h-4 animate-spin text-amber-500 mr-1 md:mr-2" />
                ) : report.status === 'failed' ? (
                  <div className="flex items-center gap-1 md:gap-2">
                    <AlertCircle size={14} className="md:w-4 md:h-4 text-red-500" />
                    <span className="text-xs text-red-500 hidden sm:inline">Failed</span>
                  </div>
                ) : report.status === 'completed' && report.download_url ? (
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={downloading === report.id}
                    className="p-1.5 md:p-2 text-slate-400 hover:text-[#5E2590] hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download report"
                  >
                    {downloading === report.id ? (
                      <Loader2 size={14} className="md:w-4 md:h-4 animate-spin" />
                    ) : (
                      <Download size={14} className="md:w-4 md:h-4" />
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReports;