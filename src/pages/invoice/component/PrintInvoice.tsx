import { useSelector } from "react-redux";
import { selectInvoiceForm } from "@/slice/InvoiceFormSlice";
import { PrintDropdown } from "../common/PrintDropDown";
import { useParams } from "react-router-dom";
import { useGetInvoiceByIdQuery } from "@/api/InvoiceApi";

export default function PrintInvoice() {
  const { invoiceId } = useParams();
  const id = Number(invoiceId);

  // ✅ Load invoice by ID from API
  const { data: existingInvoice, isLoading } = useGetInvoiceByIdQuery(id, {
    skip: !id,
  });

  // ✅ Get local invoice (e.g. new form that hasn’t been saved yet)
  const invoiceForm = useSelector(selectInvoiceForm);

  // ✅ Decide which data to pass:
  // Use API invoice if available, otherwise fallback to local form
  const invoiceData = existingInvoice || invoiceForm;

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading invoice data...</p>;
  }

  return (
    <div className="flex justify-end mb-4">
      <PrintDropdown invoiceData={invoiceData} />
    </div>
  );
}
