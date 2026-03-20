import React, { useEffect, useState } from 'react';
import { History, FileText, Download, Loader2, AlertCircle, FileSpreadsheet, File } from 'lucide-react';
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
   
    const interval = setInterval(fetchReports, 15000);
    return () => clearInterval(interval);
  }, [refreshTrigger, refreshTrigger]); 

  const handleDownload = async (report: any) => {
    if (report.status !== 'completed') {
      return;
    }

    setDownloading(report.id);
    try {
      const blob = await analyticsApi.downloadReport(report.id);
      
      // Get filename from report or use default
      const extension = report.file_format?.toLowerCase() || 'pdf';
      const filename = `${report.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;

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

  // Helper to render the specific file icon based on format
  const renderFileIcon = (format: string) => {
    const lowerFormat = format?.toLowerCase();
    if (lowerFormat === 'pdf') {
      return <FileText size={18} className="text-red-500" />;
    }
    if (['excel', 'xlsx', 'csv', 'xls'].includes(lowerFormat)) {
      return <FileSpreadsheet size={18} className="text-emerald-600" />;
    }
    return <File size={18} className="text-slate-400" />;
  };

  if (loading) return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center">
      <Loader2 className="animate-spin text-[#5E2590] mb-2" size={24} />
      <p className="text-sm text-slate-500 font-sans">Loading your reports...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden font-sans">
      <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2 text-[#5E2590]">
          <History size={18} strokeWidth={2.5} />
          <h2 className="font-bold text-slate-800 text-base md:text-lg tracking-tight">Recently Generated</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm font-medium">No reports generated yet.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Dynamic Icon Container */}
                <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${
                  report.file_format?.toLowerCase() === 'pdf' ? 'bg-red-50' : 
                  ['excel', 'xlsx', 'csv'].includes(report.file_format?.toLowerCase()) ? 'bg-emerald-50' : 'bg-slate-100'
                }`}>
                  {renderFileIcon(report.file_format)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 text-sm md:text-base truncate tracking-tight">
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                      report.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      report.status === 'failed' ? 'text-red-600 bg-red-50 border-red-100' :
                      'text-amber-600 bg-amber-50 border-amber-100'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(report.created_at).toLocaleDateString()} • {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {report.status === 'processing' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Processing</span>
                  </div>
                ) : report.status === 'failed' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg" title="Generation failed">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Error</span>
                  </div>
                ) : report.status === 'completed' ? (
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={downloading === report.id}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all text-xs uppercase tracking-widest active:scale-95 disabled:opacity-50"
                  >
                    {downloading === report.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Download size={14} />
                        <span className="hidden sm:inline">Download</span>
                      </>
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