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
    fontSize: 9,
    padding: 10,
    width: 220, // ~80mm thermal width
    lineHeight: 1.3,
    backgroundColor: "#fff",
  },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  bold: { fontWeight: "bold" },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  small: {
    fontSize: 8,
  },
  compactText: {
    fontSize: 8.5,
    lineHeight: 1.1,
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

// === Component ===
export const InvoiceThermal = ({
  invoice,
}: {
  invoice: InvoiceWithRelations;
}) => {
  const items = invoice?.Items || [];

  return (
    <Document>
      <Page
        size={{ width: 220, height: 9999 }}
        style={styles.page}
        wrap={false}
      >
        {/* HEADER */}
        <View style={[styles.center, { marginBottom: 6 }]}>
          <Text style={styles.bold}>TAX INVOICE</Text>
          <Text>JSE Dyeing Works</Text>
          <Text>1/723 Mugambigai Nagar, Tamil Nadu</Text>
          <Text>Phone: 7904867104</Text>
        </View>

        <View style={styles.divider} />

        {/* INVOICE INFO */}
        <View style={{ marginBottom: 3 }}>
          <Text>Invoice No: {invoice.invoice_number || "—"}</Text>
          <Text>Invoice Date: {formatDate(invoice.invoice_date)}</Text>
          <Text>Bill To: {invoice.customer?.customer_name || "—"}</Text>
          <Text>Mobile: {invoice.customer?.customer_mobile || "—"}</Text>
          <Text>Address: {invoice.customer?.customer_address || "—"}</Text>
        </View>

        <View style={styles.divider} />

        {/* === ITEMS HEADER === */}
        {/* === ITEMS HEADER === */}
        <View style={{ marginBottom: 2 }}>
          <Text style={[styles.bold]}>SN ITEMS</Text>
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>Qty</Text>
            <Text style={{ width: 40, textAlign: "right" }}>Rate</Text>
            <Text style={{ width: 35, textAlign: "right" }}>Disc</Text>
            <Text style={{ width: 45, textAlign: "right" }}>Amt</Text>
          </View>

          <View
            style={[
              styles.row,
              {
                marginTop: 2,
                borderBottomWidth: 0.8,
                borderColor: "#000",
                paddingBottom: 2,
              },
            ]}
          >
            <Text style={{ flex: 1 }}>Item Code</Text>
            <Text style={[styles.right, { width: 40 }]}>Tax</Text>
          </View>
        </View>

        {/* === ITEMS LIST === */}
        {items.map((item, i) => (
          <View key={i} style={{ marginVertical: 2 }}>
            {/* Item Name */}
            <Text>
              {i + 1}. {item.item?.item_name || "—"}
            </Text>

            {/* Qty, Rate, Disc, Amt */}
            <View style={styles.row}>
              <Text style={{ flex: 1 }}>
                {Number(item.quantity ?? 0).toFixed(1)}{" "}
                {item.item?.item_code ? "BOX" : ""}
              </Text>
              <Text style={{ width: 40, textAlign: "right" }}>
                {Number(item.price ?? 0).toFixed(2)}
              </Text>
              <Text style={{ width: 35, textAlign: "right" }}>
                {item.discount ?? 0}
              </Text>
              <Text style={{ width: 45, textAlign: "right" }}>
                {Number(item.amount ?? 0).toFixed(0)}
              </Text>
            </View>

            {/* Item Code + Tax */}
            <View style={styles.row}>
              <Text style={styles.small}>
                {item.item?.item_code || item.hsn_code || "—"}
              </Text>
              <Text style={[styles.small, { textAlign: "right" }]}>
                {Number(item.item_tax_per ?? 0).toFixed(2)}%
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        {/* TOTALS */}
        <View style={styles.row}>
          <Text>Sub Total</Text>
          <Text>₹{invoice.invoice_total ?? "0.00"}</Text>
        </View>

        <View style={styles.divider} />

        {/* SUMMARY */}
        <View style={styles.row}>
          <Text>Taxable Amount</Text>
          <Text>₹{invoice.invoice_subtotal ?? "0.00"}</Text>
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
                    <View style={[styles.row]}>
                      <Text>IGST @{rate}%</Text>
                      <Text>₹{values.IGST.toFixed(2)}</Text>
                    </View>
                  ) : (
                    <>
                      <View style={[styles.row]}>
                        <Text>CGST @{rate}%</Text>
                        <Text>₹{values.CGST.toFixed(2)}</Text>
                      </View>
                      <View style={[styles.row]}>
                        <Text>SGST @{rate}%</Text>
                        <Text>₹{values.SGST.toFixed(2)}</Text>
                      </View>
                    </>
                  )}
                </View>
              );
            });
        })()}
        <View style={[styles.row, styles.bold]}>
          <Text>Total Amount</Text>
          <Text>₹{invoice.invoice_total ?? "0.00"}</Text>
        </View>
        <View style={styles.row}>
          <Text>Paid Amount</Text>
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
          <Text style={styles.bold}>Terms and Conditions</Text>
          <Text style={styles.small}>
            1. Goods once sold will not be taken back or exchanged.
          </Text>
          <Text style={styles.small}>
            2. All disputes are subject to Tirupur jurisdiction only.
          </Text>
        </View>

        <View style={[styles.center, { marginTop: 4 }]}>
          <Text>Thank you for your purchase</Text>
        </View>
      </Page>
    </Document>
  );
};
