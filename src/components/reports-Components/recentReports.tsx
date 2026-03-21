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
  }, [refreshTrigger]); 

  const handleDownload = async (report: any) => {
    if (report.status !== 'completed') return;

    setDownloading(report.id);
    try {
      const blob = await analyticsApi.downloadReport(report.id);
      
      
      if (blob.size < 100) {
        throw new Error("File appears to be empty or invalid.");
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
      alert('Could not download the file. The server might have deleted the temporary report or is experiencing an issue.');
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

  if (loading) return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center">
      <Loader2 className="animate-spin text-slate-400 mb-2" size={24} />
      <p className="text-sm text-slate-500">Loading reports...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
      <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <History size={18} className="text-slate-400" />
          <h2 className="font-semibold text-slate-800 text-base md:text-lg">Recently Generated</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">No reports generated yet.</p>
          </div>
        ) : (
          reports.slice(0, 10).map((report) => ( // Show last 10
            <div key={report.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                  report.file_format?.toLowerCase() === 'pdf' ? 'bg-red-50' : 
                  ['excel', 'xlsx', 'csv'].includes(report.file_format?.toLowerCase()) ? 'bg-emerald-50' : 'bg-slate-100'
                }`}>
                  {renderFileIcon(report.file_format)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 text-sm md:text-base truncate">
                    {report.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-md border ${
                      report.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      report.status === 'failed' ? 'text-red-600 bg-red-50 border-red-100' :
                      'text-amber-600 bg-amber-50 border-amber-100'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(report.created_at).toLocaleDateString()} • {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {report.status === 'completed' && (
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={downloading === report.id}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-all text-xs disabled:opacity-50"
                  >
                    {downloading === report.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}
                {report.status === 'processing' && <Loader2 size={16} className="animate-spin text-amber-500" />}
                {report.status === 'failed' && <AlertCircle size={16} className="text-red-500" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReports;