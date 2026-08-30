import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const ReportsView: React.FC = () => {
  const { detections, incidents, roadSegments, prototypeConfig } = useUrbanData();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloadSuccess(reportName);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● MUNICIPAL AUDIT & COMPLIANCE
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Executive Reports & Work Order Exports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate formal pavement quality digests, department SLA reports, and maintenance expenditure logs.
          </p>
        </div>

        {downloadSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>Exported {downloadSuccess} to CSV/PDF</span>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 bg-white border-slate-200 space-y-4 flex flex-col justify-between rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Daily Road Hazard Intelligence Summary</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidated breakdown of all {detections.length} AI detections logged in the last 24 hours across
              Lucknow corridors.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">PDF / JSON Format</span>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleDownload('Daily Road Hazard Summary')}
            >
              <Download size={13} />
              Export
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 space-y-4 flex flex-col justify-between rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <FileSpreadsheet size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Public Works Dispatch Work Orders</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detailed repair backlog containing {incidents.length} active and resolved work orders with contractor
              cost estimates.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">CSV / Excel Spreadsheet</span>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleDownload('Public Works Work Orders')}
            >
              <Download size={13} />
              Export
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 space-y-4 flex flex-col justify-between rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Printer size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Pavement Quality Index (PQI) City Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Executive multi-zone pavement health audit for Lucknow Municipal Corporation & Transit Authority.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Executive Print PDF</span>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleDownload('PQI City Audit')}
            >
              <Download size={13} />
              Export
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
