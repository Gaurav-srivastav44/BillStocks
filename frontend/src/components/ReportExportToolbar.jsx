import { useState } from "react";
import toast from "react-hot-toast";
import { FileDown, FileSpreadsheet, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { downloadReportAsPdf } from "../utils/exportPdf";
import { downloadExcelWorkbook } from "../utils/exportExcel";

const btnClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400";

/**
 * Premium export actions for report pages — PDF (html2pdf) + Excel (xlsx).
 * Pass a ref attached to the same DOM the user sees (tables + optional in-ref header).
 */
export default function ReportExportToolbar({
  pdfTargetRef,
  pdfFileSlug,
  reportTitle,
  reportSubtitle,
  getExcelSheets,
  disabled = false,
  className = "",
}) {
  const { user } = useAuth();
  const company = user?.firmName || "BillStocks";
  const [busy, setBusy] = useState(null);

  const summaryRows = [
    { Field: "Company", Value: company },
    { Field: "Report", Value: reportTitle },
    { Field: "Subtitle", Value: reportSubtitle || "—" },
    { Field: "Generated", Value: new Date().toLocaleString() },
  ];

  const handlePdf = async () => {
    if (!pdfTargetRef?.current) {
      toast.error("Nothing to export yet.");
      return;
    }
    setBusy("pdf");
    const tid = toast.loading("Generating PDF…");
    try {
      await downloadReportAsPdf(pdfTargetRef.current, pdfFileSlug);
      toast.success("PDF downloaded · Report exported successfully", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF", { id: tid });
    } finally {
      setBusy(null);
    }
  };

  const handleExcel = () => {
    setBusy("xlsx");
    const tid = toast.loading("Generating Excel…");
    try {
      const dataSheets = typeof getExcelSheets === "function" ? getExcelSheets() : [];
      const sheets = [{ sheetName: "Summary", rows: summaryRows }, ...(dataSheets || [])];
      downloadExcelWorkbook(sheets, `${pdfFileSlug}.xlsx`);
      toast.success("Excel downloaded · Report exported successfully", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel", { id: tid });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label="Export report"
    >
      <button
        type="button"
        onClick={handlePdf}
        disabled={disabled || busy}
        className={`${btnClass} bg-slate-900 text-white hover:bg-slate-800`}
      >
        {busy === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Export PDF
      </button>
      <button
        type="button"
        onClick={handleExcel}
        disabled={disabled || busy}
        className={`${btnClass} bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500`}
      >
        {busy === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
        Export Excel
      </button>
    </div>
  );
}
