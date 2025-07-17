import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import { type UserOptions } from "jspdf-autotable";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type TableSection = {
  title: string;
  columns: string[];
  rows: (string | number | null)[][];
};

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}
type ExportActionsProps = {
  sections: TableSection[]; // Multiple sections (Inward, Outward, Totals)
  fileName?: string; // Optional file name
};

export default function ExportActions({
  sections,
  fileName = "report",
}: ExportActionsProps) {
  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Report", 14, 15);

    let startY = 20;

    sections.forEach((section, index) => {
      if (index > 0) startY = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.text(section.title, 14, startY);

        autoTable(doc, {
          startY: startY + 5,
          head: [section.columns],
          body: section.rows,
          theme: "striped",
          styles: { fontSize: 10 },
        });
    });

    doc.save(`${fileName}.pdf`);
  }

  function exportExcel() {
    const wb = XLSX.utils.book_new();

    sections.forEach((section) => {
      const sheetData = [section.columns, ...section.rows];
      const sheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, sheet, section.title);
    });

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  }

  return (
    <div className={cn("flex gap-2 justify-end mr-2")}>
      <Button
        className={cn("bg-blue-600 text-white hover:bg-blue-700")}
        onClick={exportPDF}
      >
        Download PDF
      </Button>
      <Button
        className={cn("bg-green-600 text-white hover:bg-green-700")}
        onClick={exportExcel}
      >
        Download Excel
      </Button>
    </div>
  );
}
