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

// ✅ Font (Unicode-safe, supports ₹)
Font.register({
  family: "NotoSans",
  src: "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
});

// === Styles ===
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 8,
    padding: 8,
    width: 200, // ~58mm thermal width
    lineHeight: 1.25,
    backgroundColor: "#fff",
  },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  bold: { fontWeight: "bold" },
  divider: {
    borderBottomWidth: 0.8,
    borderColor: "#000",
    marginVertical: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  small: {
    fontSize: 7,
  },
});

// === Types ===
interface InvoiceItem {
  id: number;
  description?: string;
  hsn_code?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  item_tax_per?: number;
  item_tax_amount?: number;
  amount?: number;
  item?: {
    item_name?: string;
    item_code?: string;
  };
}

interface InvoiceCustomer {
  customer_name?: string;
  customer_address?: string;
  customer_mobile?: string;
}

interface InvoiceWithRelations extends Invoice {
  customer?: InvoiceCustomer;
  Items?: InvoiceItem[];
  // ✅ Goods related fields
  design_name?: string;
  color?: string;
  lot_no?: string;
  dia?: string;
  gauge?: string;
  remarks?: string;
  goods_description?: string;
}

// === Component ===
export const InvoiceThermal58 = ({
  invoice,
}: {
  invoice: InvoiceWithRelations;
}) => {
  const items = invoice?.Items || [];

  return (
    <Document>
      <Page
        size={{ width: 200, height: 9999 }}
        style={styles.page}
        wrap={false}
      >
        {/* HEADER */}
        <View style={[styles.center, { marginBottom: 5 }]}>
          <Text style={[styles.bold, { fontSize: 9 }]}>TAX INVOICE</Text>
          <Text style={{ fontSize: 8.5 }}>JSE Dyeing Works</Text>
          <Text style={styles.small}>1/723 Mugambigai Nagar, Tamil Nadu</Text>
          <Text style={styles.small}>Phone: 7904867104</Text>
        </View>

        <View style={styles.divider} />

        {/* INVOICE INFO */}
        <View style={{ marginBottom: 2 }}>
          <Text>Invoice No: {invoice.invoice_number || "—"}</Text>
          <Text>Date: {formatDate(invoice.invoice_date)}</Text>
          <Text>Due: {formatDate(invoice.due_date)}</Text>
        </View>

        {/* CUSTOMER */}
        <View style={styles.divider} />
        <View>
          <Text style={styles.bold}>Bill To:</Text>
          <Text>{invoice.customer?.customer_name || "—"}</Text>
          <Text>{invoice.customer?.customer_address || "—"}</Text>
          <Text>Mob: {invoice.customer?.customer_mobile || "—"}</Text>
        </View>

        {/* GOODS DETAILS */}
        {(invoice.design_name ||
          invoice.color ||
          invoice.lot_no ||
          invoice.dia ||
          invoice.gauge ||
          invoice.remarks ||
          invoice.goods_description) && (
          <>
            <View style={styles.divider} />
            <View>
              <Text style={styles.bold}>Goods Details:</Text>
              {invoice.design_name && (
                <Text>Design: {invoice.design_name}</Text>
              )}
              {invoice.color && <Text>Color: {invoice.color}</Text>}
              {invoice.lot_no && <Text>Lot No: {invoice.lot_no}</Text>}
              {invoice.dia && <Text>Dia: {invoice.dia}</Text>}
              {invoice.gauge && <Text>Gauge: {invoice.gauge}</Text>}
              {invoice.remarks && <Text>Remarks: {invoice.remarks}</Text>}
              {invoice.goods_description && (
                <Text>{invoice.goods_description}</Text>
              )}
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* ITEMS HEADER */}
        <View style={styles.row}>
          <Text style={[styles.bold, { flex: 1 }]}>Item</Text>
          <Text style={[styles.bold, { width: 35, textAlign: "right" }]}>
            Amt
          </Text>
        </View>
        <View style={[styles.divider, { marginVertical: 1 }]} />

        {/* ITEMS LIST */}
        {items.map((item, i) => (
          <View key={i} style={{ marginBottom: 2 }}>
            <Text>
              {i + 1}. {item.item?.item_name || "—"}
            </Text>
            <View style={styles.row}>
              <Text style={styles.small}>
                {item.quantity} × ₹{Number(item.price ?? 0).toFixed(2)} = ₹
                {Number(item.amount ?? 0).toFixed(2)}
              </Text>
              <Text style={[styles.small, styles.right]}>
                {item.item_tax_per ?? 0}%
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        {/* TOTALS */}
        <View style={styles.row}>
          <Text>Taxable</Text>
          <Text>₹{invoice.invoice_taxable_value ?? "0.00"}</Text>
        </View>
        <View style={styles.row}>
          <Text>CGST</Text>
          <Text>₹{invoice.invoice_cgst ?? "0.00"}</Text>
        </View>
        <View style={styles.row}>
          <Text>SGST</Text>
          <Text>₹{invoice.invoice_sgst ?? "0.00"}</Text>
        </View>
        <View style={[styles.row, styles.bold]}>
          <Text>Total</Text>
          <Text>₹{invoice.invoice_total ?? "0.00"}</Text>
        </View>
        <View style={styles.row}>
          <Text>Received</Text>
          <Text>₹{invoice.amount_received ?? "0.00"}</Text>
        </View>
        <View style={styles.row}>
          <Text>Balance</Text>
          <Text>
            ₹
            {(
              (Number(invoice.invoice_total) || 0) -
              (Number(invoice.amount_received) || 0)
            ).toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* TERMS */}
        <View>
          <Text style={styles.bold}>Terms & Conditions</Text>
          <Text style={styles.small}>
            1. Goods once sold will not be taken back or exchanged.
          </Text>
          <Text style={styles.small}>
            2. All disputes are subject to Tirupur jurisdiction only.
          </Text>
        </View>

        <View style={[styles.center, { marginTop: 4 }]}>
          <Text style={{ fontSize: 8 }}>Thank you! Visit Again.</Text>
        </View>
      </Page>
    </Document>
  );
};
