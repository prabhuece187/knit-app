"use client";

import { useState } from "react";
import { PDFViewer, type DocumentProps } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { InvoiceA4, InvoiceA5, InvoiceThermal } from "../component/InvoicePDF";

import type { FullInvoiceFormValues } from "@/schema-types/invoice-schema";
import { InvoiceA4Html } from "../component/InvoiceHtml/InvoiceA4Html";
import { InvoiceThermalHtml } from "../component/InvoiceHtml/InvoiceThermalHtml";
import { InvoiceA5Html } from "../component/InvoiceHtml/InvoiceA5Html";
import { InvoiceThermal58 } from "../component/InvoicePDF/InvoiceThermal58";
import { InvoiceThermal58Html } from "../component/InvoiceHtml/InviceThermal58Html";

interface PrintDropdownProps {
  invoiceData: FullInvoiceFormValues;
}

export function PrintDropdown({ invoiceData }: PrintDropdownProps) {
  const [selected, setSelected] = useState<
    "a4" | "a5" | "thermal" | "thermal58"
  >("a4");

  const [showPDF, setShowPDF] = useState(false);

  // 🧾 Render the PDF document
  const renderPDFDocument = (): React.ReactElement<DocumentProps> => {
    switch (selected) {
      case "a4":
        return <InvoiceA4 invoice={invoiceData} />;
      case "a5":
        return <InvoiceA5 invoice={invoiceData} />;
      case "thermal":
        return <InvoiceThermal invoice={invoiceData} />;
      case "thermal58":
        return <InvoiceThermal58 invoice={invoiceData} />;
      default:
        return <InvoiceA4 invoice={invoiceData} />;
    }
  };

  // 🌐 Render the HTML version inline
  const renderHTMLPreview = () => {
    switch (selected) {
      case "a4":
        return <InvoiceA4Html invoice={invoiceData} />;
      case "thermal":
        return <InvoiceThermalHtml invoice={invoiceData} />;
      case "thermal58":
        return <InvoiceThermal58Html invoice={invoiceData} />;
      case "a5":
        return <InvoiceA5Html invoice={invoiceData} />;
      default:
        return <InvoiceA4Html invoice={invoiceData} />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Dropdown Button */}
      <div className="flex items-center gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">🖨️ Print</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => setSelected("a4")}>
              A4 Print
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelected("a5")}>
              A5 Print
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelected("thermal")}>
              Thermal Print (3 inch)
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelected("thermal58")}>
              Thermal Print (2 inch)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Optional clear button */}
        {selected && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelected("a4");
              setShowPDF(false);
            }}
          >
            ✖ Clear
          </Button>
        )}
      </div>

      {/* 🌐 Inline Preview (below button) */}
      {selected && !showPDF && (
        <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white p-4">
          <div className="mb-3 flex justify-between items-center">
            <h2 className="text-md font-semibold">
              Invoice Preview ({selected.toUpperCase()})
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPDF(true)}>
                Open PDF Viewer
              </Button>
              <Button
                className="bg-violet-600 text-white hover:bg-violet-700"
                onClick={() => window.print()}
              >
                🖨️ Print
              </Button>
            </div>
          </div>

          {/* Actual HTML invoice preview */}
          <div id="invoice-preview">{renderHTMLPreview()}</div>
        </div>
      )}

      {/* 🧾 PDF Viewer Mode (optional, still modal-like) */}
      {showPDF && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-2 flex justify-between items-center shadow">
            <h2 className="text-lg font-semibold">PDF Viewer</h2>
            <Button variant="outline" onClick={() => setShowPDF(false)}>
              ✖ Close PDF
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PDFViewer width="100%" height="100%">
              {renderPDFDocument()}
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}
