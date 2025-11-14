import type { Invoice } from "@/schema-types/invoice-schema";
import { amountInWords, formatDate } from "@/utility/utility";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ✅ Register a Unicode Font that supports ₹
Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
    }, // regular
    {
      src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
      fontWeight: "bold",
    }, // bold
  ],
});

// ✅ Shared column widths to match HTML
const COLUMN_WIDTHS = {
  item: "40%",
  qty: "15%",
  rate: "15%",
  tax: "15%",
  amount: "15%",
};

// ✅ Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 10,
    padding: 20,
    backgroundColor: "#fff",
    color: "#111",
    lineHeight: 1.4,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 9,
  },
  companySection: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#000",
    paddingVertical: 6,
    marginBottom: 8,
  },
  logoBox: {
    width: 50,
    height: 50,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 1.5, // same as fontSize for vertical alignment
    fontFamily: "NotoSans", // ensure font is applied
  },
  companyInfo: {
    marginLeft: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  invoiceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingBottom: 2,
    marginBottom: 6,
    fontSize: 9.5,
  },
  bold: { fontWeight: "bold" },
  billTo: { marginBottom: 6 },
  billToTitle: { fontWeight: "bold", fontSize: 10.5, marginBottom: 3 },
  table: {
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderBottomWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
    paddingVertical: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cell: {
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  textSm: {
    fontSize: 8.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 8,
  },
  leftFooter: {
    flex: 1,
  },
  sectionHeader: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  rightBox: {
    width: 250,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  rightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderColor: "#ccc",
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontWeight: "bold",
  },
});

// ✅ Types
interface InvoiceItem {
  id: number;
  description?: string;
  item?: { id: number; item_name?: string };
  quantity?: number;
  price?: number;
  item_tax_per?: number;
  item_tax_amount?: number;
  amount?: number;
}

interface InvoiceCustomer {
  customer_name?: string;
  customer_address?: string;
  customer_mobile?: string;
}

export interface InvoiceTax {
  id: number;
  user_id: number;
  invoice_id: number;
  tax_type: "CGST" | "SGST" | "IGST";
  tax_rate: number;
  tax_amount: number;
}

interface InvoiceWithRelations extends Invoice {
  customer?: InvoiceCustomer;
  Items?: InvoiceItem[];
  InvoiceTaxes?: InvoiceTax[];
}

// ✅ Component
export const InvoiceA4 = ({ invoice }: { invoice: InvoiceWithRelations }) => {
  const items = invoice?.Items || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.bold}>TAX INVOICE</Text>
          <Text style={styles.tag}>ORIGINAL FOR RECIPIENT</Text>
        </View>

        {/* Company Section */}
        <View style={styles.companySection}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>JSE</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>JSE Dyeing Works</Text>
            <Text>1/723 Mugambigai Nagar, Tamil Nadu</Text>
            <Text>Mobile: 7904867104</Text>
          </View>
        </View>

        {/* Invoice Info */}
        <View style={styles.invoiceInfoRow}>
          <Text>
            <Text style={styles.bold}>Invoice No:</Text>{" "}
            {invoice.invoice_number || "—"}
          </Text>
          <Text>
            <Text style={styles.bold}>Invoice Date:</Text>{" "}
            {formatDate(invoice.invoice_date)}
          </Text>
          <Text>
            <Text style={styles.bold}>Due Date:</Text>{" "}
            {formatDate(invoice.due_date)}
          </Text>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.billToTitle}>BILL TO</Text>
          <Text style={styles.bold}>
            {invoice.customer?.customer_name || "—"}
          </Text>
          <Text>{invoice.customer?.customer_address || "—"}</Text>
          <Text>Mobile: {invoice.customer?.customer_mobile || "—"}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.item }]}>
              ITEMS
            </Text>
            <Text
              style={[
                styles.cell,
                { width: COLUMN_WIDTHS.qty, textAlign: "center" },
              ]}
            >
              QTY.
            </Text>
            <Text
              style={[
                styles.cell,
                { width: COLUMN_WIDTHS.rate, textAlign: "center" },
              ]}
            >
              RATE
            </Text>
            <Text
              style={[
                styles.cell,
                { width: COLUMN_WIDTHS.tax, textAlign: "center" },
              ]}
            >
              TAX
            </Text>
            <Text
              style={[
                styles.cell,
                { width: COLUMN_WIDTHS.amount, textAlign: "right" },
              ]}
            >
              AMOUNT
            </Text>
          </View>

          {/* Rows */}
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text
                style={[
                  styles.cell,
                  { width: COLUMN_WIDTHS.item, textAlign: "left" },
                ]}
              >
                {item.item?.item_name || "—"}
                {item.description && (
                  <Text style={styles.textSm}>
                    {"\n"}
                    {item.description}
                  </Text>
                )}
              </Text>
              <Text
                style={[
                  styles.cell,
                  { width: COLUMN_WIDTHS.qty, textAlign: "center" },
                ]}
              >
                {item.quantity}
              </Text>
              <Text
                style={[
                  styles.cell,
                  { width: COLUMN_WIDTHS.rate, textAlign: "center" },
                ]}
              >
                ₹{Number(item.price ?? 0).toFixed(2)}
              </Text>
              <View
                style={[
                  styles.cell,
                  { width: COLUMN_WIDTHS.tax, alignItems: "center" },
                ]}
              >
                <Text>₹{Number(item.item_tax_amount ?? 0).toFixed(2)}</Text>
                <Text>({Number(item.item_tax_per ?? 0).toFixed(2)}%)</Text>
              </View>
              <Text
                style={[
                  styles.cell,
                  { width: COLUMN_WIDTHS.amount, textAlign: "right" },
                ]}
              >
                ₹{Number(item.amount ?? 0).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Subtotal */}
          <View
            style={[
              styles.tableRow,
              {
                backgroundColor: "#f3f3f3",
                borderTopWidth: 1,
                borderColor: "#000",
              },
            ]}
          >
            <Text
              style={[
                styles.cell,
                { width: COLUMN_WIDTHS.item, fontWeight: "bold" },
              ]}
            >
              SUBTOTAL
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  width: COLUMN_WIDTHS.qty,
                  textAlign: "center",
                  fontWeight: "bold",
                },
              ]}
            >
              {invoice.invoice_total_quantity || 0}
            </Text>
            <Text style={[styles.cell, { width: COLUMN_WIDTHS.rate }]}></Text>
            <Text
              style={[
                styles.cell,
                {
                  width: COLUMN_WIDTHS.tax,
                  textAlign: "center",
                  fontWeight: "bold",
                },
              ]}
            >
              ₹{invoice.invoice_taxable_value ?? "0.00"}
            </Text>
            <Text
              style={[
                styles.cell,
                {
                  width: COLUMN_WIDTHS.amount,
                  textAlign: "right",
                  fontWeight: "bold",
                },
              ]}
            >
              ₹{invoice.invoice_total ?? "0.00"}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Left */}
          <View style={styles.leftFooter}>
            <Text style={styles.sectionHeader}>BANK DETAILS</Text>
            <Text>Name: Prabhu</Text>
            <Text>IFSC Code: ICICI0004924</Text>
            <Text>Account No: 123456543</Text>
            <Text>Bank: Tirupur</Text>

            <Text style={[styles.sectionHeader, { marginTop: 6 }]}>
              TERMS AND CONDITIONS
            </Text>
            <Text style={styles.textSm}>
              1. Goods once sold will not be taken back or exchanged.{"\n"}
              2. All disputes are subject to Tirupur jurisdiction only.
            </Text>
          </View>

          {/* Right */}
          <View style={styles.rightBox}>
            <View style={styles.rightRow}>
              <Text>Taxable Amount</Text>
              <Text>₹{invoice.invoice_taxable_value ?? "0.00"}</Text>
            </View>
            {/* ✅ Dynamic Tax Breakdown */}
            {(() => {
              const taxes = invoice.InvoiceTaxes || [];

              // Group all tax types (SGST, CGST, IGST) by rate
              const grouped = taxes.reduce((acc, t) => {
                const rate = Number(t.tax_rate) || 0;
                if (!acc[rate]) acc[rate] = { CGST: 0, SGST: 0, IGST: 0 };
                acc[rate][t.tax_type as "CGST" | "SGST" | "IGST"] =
                  Number(t.tax_amount) || 0;
                return acc;
              }, {} as Record<number, { CGST: number; SGST: number; IGST: number }>);

              return Object.entries(grouped)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([rate, values]) => {
                  const isIGST = values.IGST > 0;
                  return (
                    <View key={String(rate)}>
                      {isIGST ? (
                        <View style={styles.rightRow}>
                          <Text>IGST @{rate}%</Text>
                          <Text>₹{values.IGST.toFixed(2)}</Text>
                        </View>
                      ) : (
                        <>
                          <View style={styles.rightRow}>
                            <Text>CGST @{rate}%</Text>
                            <Text>₹{values.CGST.toFixed(2)}</Text>
                          </View>
                          <View style={styles.rightRow}>
                            <Text>SGST @{rate}%</Text>
                            <Text>₹{values.SGST.toFixed(2)}</Text>
                          </View>
                        </>
                      )}
                    </View>
                  );
                });
            })()}
            <View style={styles.totalRow}>
              <Text>Total Amount</Text>
              <Text>₹{invoice.invoice_total ?? "0.00"}</Text>
            </View>
            <View style={styles.rightRow}>
              <Text>Received Amount</Text>
              <Text>₹{invoice.amount_received ?? "0.00"}</Text>
            </View>
            <View style={{ padding: 6 }}>
              <Text style={styles.bold}>Total Amount (in words)</Text>
              <Text style={styles.textSm}>
                {amountInWords(Number(invoice.invoice_total ?? 0))}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
