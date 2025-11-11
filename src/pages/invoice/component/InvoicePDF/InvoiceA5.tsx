import type { Invoice } from "@/schema-types/invoice-schema";
import { formatDate } from "@/utility/utility";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ✅ Register Regular + Bold Unicode font
Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 9,
    padding: 16,
    backgroundColor: "#fff",
    color: "#111",
    lineHeight: 1.3,
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
    fontSize: 8,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    marginBottom: 6,
    gap: 8,
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
    flex: 1,
  },
  companyName: {
    fontFamily: "NotoSans",
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 8,
  },
  invoiceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.6,
    borderColor: "#000",
    paddingVertical: 2,
    marginBottom: 6,
  },
  billTo: {
    marginBottom: 6,
  },
  billToTitle: {
    fontFamily: "NotoSans",
    fontWeight: "bold",
    fontSize: 9.5,
    marginBottom: 8,
  },
  bold: { fontFamily: "NotoSans", fontWeight: "bold" },
  table: {
    width: "100%",
    borderWidth: 0.6,
    borderColor: "#000",
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderBottomWidth: 0.6,
    borderColor: "#000",
    fontFamily: "NotoSans",
    fontWeight: "bold",
    paddingVertical: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderColor: "#ddd",
    paddingVertical: 1.5,
  },
  cell: {
    paddingHorizontal: 3,
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
  },
  leftFooter: {
    flex: 1,
  },
  rightBox: {
    width: 160,
    borderWidth: 0.6,
    borderColor: "#ccc",
    borderRadius: 3,
  },
  rightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.4,
    borderColor: "#ddd",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderColor: "#000",
    paddingHorizontal: 4,
    paddingVertical: 3,
    fontFamily: "NotoSans",
    fontWeight: "bold",
  },
  sectionHeader: {
    fontFamily: "NotoSans",
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 9,
  },
  textSm: {
    fontSize: 8,
  },
});

interface InvoiceItem {
  id: number;
  description?: string;
  hsn_code?: string;
  quantity?: number;
  price?: number;
  item_tax_per?: number;
  item_tax_amount?: number;
  amount?: number;
  item?: { id: number; item_name?: string };
}

interface InvoiceCustomer {
  customer_name?: string;
  customer_address?: string;
  customer_mobile?: string;
}

interface InvoiceWithRelations extends Invoice {
  customer?: InvoiceCustomer;
  Items?: InvoiceItem[];
  company_logo?: string;
  company_name?: string;
  company_address?: string;
  company_phone?: string;
}

export const InvoiceA5 = ({ invoice }: { invoice: InvoiceWithRelations }) => {
  const items = invoice?.Items || [];

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.bold}>TAX INVOICE</Text>
          <Text style={styles.tag}>ORIGINAL FOR RECIPIENT</Text>
        </View>

        {/* Company Info */}
        <View style={styles.companyHeader}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>JSE</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {invoice.company_name || "JSE Dyeing Works"}
            </Text>
            <Text>
              {invoice.company_address || "1/723 Mugambigai Nagar, Tamil Nadu"}
            </Text>
            <Text>Mobile: {invoice.company_phone || "7904867104"}</Text>
          </View>
        </View>

        {/* Invoice Info */}
        <View style={styles.invoiceInfoRow}>
          <Text>
            <Text style={styles.bold}>Inv No:</Text>{" "}
            {invoice.invoice_number || "—"}
          </Text>
          <Text>
            <Text style={styles.bold}>Date:</Text>{" "}
            {formatDate(invoice.invoice_date)}
          </Text>
          <Text>
            <Text style={styles.bold}>Due:</Text> {formatDate(invoice.due_date)}
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
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { width: "45%" }]}>ITEMS</Text>
            <Text style={[styles.cell, { width: "15%", textAlign: "center" }]}>
              QTY
            </Text>
            <Text style={[styles.cell, { width: "20%", textAlign: "center" }]}>
              RATE
            </Text>
            <Text style={[styles.cell, { width: "20%", textAlign: "right" }]}>
              AMOUNT
            </Text>
          </View>

          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.cell, { width: "45%", textAlign: "left" }]}>
                {item.item?.item_name || "—"}
                {item.description && (
                  <Text style={styles.textSm}>
                    {"\n"} {item.description}
                  </Text>
                )}
              </Text>
              <Text
                style={[styles.cell, { width: "15%", textAlign: "center" }]}
              >
                {item.quantity}
              </Text>
              <Text
                style={[styles.cell, { width: "20%", textAlign: "center" }]}
              >
                ₹{Number(item.price ?? 0).toFixed(2)}
              </Text>
              <Text style={[styles.cell, { width: "20%", textAlign: "right" }]}>
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
                borderTopWidth: 0.6,
                borderColor: "#000",
              },
            ]}
          >
            <Text style={[styles.cell, { width: "45%", fontWeight: "bold" }]}>
              SUBTOTAL
            </Text>
            <Text
              style={[
                styles.cell,
                { width: "15%", textAlign: "center", fontWeight: "bold" },
              ]}
            >
              {invoice.invoice_total_quantity || 0}
            </Text>
            <Text style={[styles.cell, { width: "20%" }]}></Text>
            <Text
              style={[
                styles.cell,
                { width: "20%", textAlign: "right", fontWeight: "bold" },
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
            <Text>IFSC: ICICI0004924</Text>
            <Text>Acc No: 123456543</Text>
            <Text>Bank: Tirupur</Text>

            <Text style={[styles.sectionHeader, { marginTop: 4 }]}>
              TERMS & CONDITIONS
            </Text>
            <Text style={styles.textSm}>
              1. Goods once sold cannot be returned.{"\n"}2. All disputes
              subject to Tirupur jurisdiction.
            </Text>
          </View>

          {/* Right */}
          <View style={styles.rightBox}>
            <View style={styles.rightRow}>
              <Text>Taxable</Text>
              <Text>₹{invoice.invoice_taxable_value ?? "0.00"}</Text>
            </View>
            <View style={styles.rightRow}>
              <Text>CGST</Text>
              <Text>₹{invoice.invoice_cgst ?? "0.00"}</Text>
            </View>
            <View style={styles.rightRow}>
              <Text>SGST</Text>
              <Text>₹{invoice.invoice_sgst ?? "0.00"}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Total</Text>
              <Text>₹{invoice.invoice_total ?? "0.00"}</Text>
            </View>
            <View style={styles.rightRow}>
              <Text>Received</Text>
              <Text>₹{invoice.amount_received ?? "0.00"}</Text>
            </View>
            <View style={{ padding: 4 }}>
              <Text style={styles.bold}>In Words:</Text>
              <Text style={styles.textSm}>Two Hundred Twenty Rupees Only</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
