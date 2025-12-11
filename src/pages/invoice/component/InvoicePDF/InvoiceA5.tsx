// components/InvoiceA5Pdf.tsx
"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ----------- FONT -----------
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

// ----------- UTIL -----------
const money = (v: number | string | null | undefined) => {
  const n = Number(v);
  return isNaN(n) ? "0.00" : n.toFixed(2);
};

const formatDate = (d?: string | null) => {
  if (!d) return "-";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-GB");
};

// ----------- TYPES -----------
type InvoiceItem = {
  id: number;
  item?: { item_name?: string };
  description?: string;
  hsn_code?: string;
  quantity?: number;
  unit?: string;
  price?: number;
  amount?: number;
  item_tax_per?: number;
  item_tax_amount?: number;
};

type InvoiceTax = {
  tax_type: string;
  tax_rate: number | string;
  tax_amount: number | string;
};

type InvoiceWithRelations = {
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  challan_number?: string;
  po_number?: string;
  eway_bill_number?: string;

  company_name?: string;
  company_address?: string;
  company_phone?: string;
  gstin?: string;
  pan?: string;

  customer?: {
    customer_name?: string;
    customer_address?: string;
    customer_mobile?: string;
    gstin?: string;
  };

  ship_to?: {
    customer_name?: string;
    customer_address?: string;
    customer_mobile?: string;
    gstin?: string;
  };

  Items?: InvoiceItem[];
  InvoiceTaxes?: InvoiceTax[];

  invoice_total?: number;
  invoice_total_quantity?: number;
  amount_received?: number;
};

// ----------- STYLES -----------
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 9,
    padding: 8,
    backgroundColor: "#fff",
  },

  borderBox: {
    borderWidth: 1,
    borderColor: "#444",
  },

  row: {
    flexDirection: "row",
  },

  center: {
    textAlign: "center",
  },

  // TOP TITLE
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  invoiceTitle: { fontSize: 12, fontWeight: "bold" },
  tag: {
    fontSize: 7,
    borderWidth: 1,
    borderColor: "#666",
    paddingHorizontal: 3,
    paddingVertical: 1,
    marginLeft: 4,
  },

  // HEADER GRID
  headerLeft: {
    width: "60%",
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  headerRight: {
    width: "40%",
  },

  companyName: { fontSize: 11, fontWeight: "bold" },

  metaRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  metaCell: {
    width: "33.33%",
    padding: 3,
    fontSize: 8,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },

  // BILL / SHIP
  billShipRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 6,
  },
  billBox: {
    width: "50%",
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  shipBox: {
    width: "50%",
    padding: 5,
  },

  // TABLE
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 4,
    marginTop: 6,
  },
  th: { fontSize: 8, fontWeight: "bold" },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.6,
    borderColor: "#ddd",
    paddingVertical: 3,
  },

  colSno: { width: "5%", textAlign: "center", fontSize: 8 },
  colItems: { width: "40%", paddingLeft: 3, fontSize: 8 },
  colHsn: { width: "10%", textAlign: "center", fontSize: 8 },
  colQty: { width: "10%", textAlign: "center", fontSize: 8 },
  colSgst: { width: "10%", textAlign: "right", paddingRight: 4, fontSize: 8 },
  colCgst: { width: "10%", textAlign: "right", paddingRight: 4, fontSize: 8 },
  colAmount: { width: "15%", textAlign: "right", paddingRight: 4, fontSize: 8 },

  // TOTALS
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 4,
    backgroundColor: "#fafafa",
  },
  totalLabel: {
    width: "65%",
    textAlign: "right",
    paddingRight: 6,
    fontSize: 9,
  },
  totalValue: {
    width: "35%",
    textAlign: "right",
    paddingRight: 6,
    fontSize: 9,
    fontWeight: "bold",
  },

  taxRow: {
    flexDirection: "row",
    paddingVertical: 2,
  },

  // BOTTOM ROW
  bottomRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  bankBox: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  qrBox: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
});

// ----------- COMPONENT -----------
export const InvoiceA5: React.FC<{ invoice: InvoiceWithRelations }> = ({
  invoice,
}) => {
  const items = invoice.Items || [];

  const totalQty =
    invoice.invoice_total_quantity ||
    items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);

  const subTotal =
    invoice.invoice_total ||
    items.reduce((s, it) => s + (Number(it.amount) || 0), 0);

  const taxSgst =
    Number(
      invoice.InvoiceTaxes?.find((t) => t.tax_type === "SGST")?.tax_amount
    ) || 0;

  const taxCgst =
    Number(
      invoice.InvoiceTaxes?.find((t) => t.tax_type === "CGST")?.tax_amount
    ) || 0;

  console.log(totalQty);

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page} wrap={false}>
        {/* ---------- TOP TITLE ---------- */}
        <View style={styles.topRow}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <Text style={styles.tag}>ORIGINAL FOR RECIPIENT</Text>
          </View>

          <Text style={{ fontSize: 7 }}>
            Most affordable Hardware store in town
          </Text>
        </View>

        {/* ---------- HEADER ---------- */}
        <View style={[styles.borderBox, styles.row]}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>
              {invoice.company_name || "Company Name"}
            </Text>
            <Text>{invoice.company_address || "-"}</Text>
            <Text>GSTIN: {invoice.gstin || "-"}</Text>
            <Text>Mobile: {invoice.company_phone || "-"}</Text>
            <Text>PAN: {invoice.pan || "-"}</Text>
          </View>

          {/* RIGHT */}
          <View style={styles.headerRight}>
            <View style={styles.metaRow}>
              <Text style={styles.metaCell}>Invoice No.</Text>
              <Text style={styles.metaCell}>Invoice Date</Text>
              <Text style={[styles.metaCell, { borderRightWidth: 0 }]}>
                Due Date
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaCell}>
                {invoice.invoice_number || "-"}
              </Text>
              <Text style={styles.metaCell}>
                {formatDate(invoice.invoice_date)}
              </Text>
              <Text style={[styles.metaCell, { borderRightWidth: 0 }]}>
                {formatDate(invoice.due_date)}
              </Text>
            </View>

            <View style={[styles.metaRow, { marginTop: 4 }]}>
              <Text style={styles.metaCell}>Challan No.</Text>
              <Text style={styles.metaCell}>P.O. No.</Text>
              <Text style={[styles.metaCell, { borderRightWidth: 0 }]}>
                E-way Bill No.
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaCell}>
                {invoice.challan_number || "-"}
              </Text>
              <Text style={styles.metaCell}>{invoice.po_number || "-"}</Text>
              <Text style={[styles.metaCell, { borderRightWidth: 0 }]}>
                {invoice.eway_bill_number || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* ---------- BILL / SHIP ---------- */}
        <View style={styles.billShipRow}>
          {/* Bill */}
          <View style={styles.billBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 3 }}>BILL TO</Text>
            <Text style={{ fontWeight: "bold" }}>
              {invoice.customer?.customer_name || "-"}
            </Text>
            <Text>{invoice.customer?.customer_address || "-"}</Text>
            <Text>Mobile: {invoice.customer?.customer_mobile || "-"}</Text>
            <Text>GSTIN: {invoice.customer?.gstin || "-"}</Text>
          </View>

          {/* Ship */}
          <View style={styles.shipBox}>
            <Text style={{ fontWeight: "bold", marginBottom: 3 }}>SHIP TO</Text>
            <Text style={{ fontWeight: "bold" }}>
              {invoice.ship_to?.customer_name ||
                invoice.customer?.customer_name ||
                "-"}
            </Text>
            <Text>
              {invoice.ship_to?.customer_address ||
                invoice.customer?.customer_address ||
                "-"}
            </Text>
            <Text>
              Mobile:{" "}
              {invoice.ship_to?.customer_mobile ||
                invoice.customer?.customer_mobile ||
                "-"}
            </Text>
            <Text>
              GSTIN: {invoice.ship_to?.gstin || invoice.customer?.gstin || "-"}
            </Text>
          </View>
        </View>

        {/* ---------- TABLE HEADER ---------- */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colSno, styles.th]}>S.NO.</Text>
          <Text style={[styles.colItems, styles.th]}>ITEMS</Text>
          <Text style={[styles.colHsn, styles.th]}>HSN</Text>
          <Text style={[styles.colQty, styles.th]}>QTY.</Text>
          <Text style={[styles.colSgst, styles.th]}>SGST</Text>
          <Text style={[styles.colCgst, styles.th]}>CGST</Text>
          <Text style={[styles.colAmount, styles.th]}>AMOUNT</Text>
        </View>

        {/* ---------- TABLE ROWS ---------- */}
        {items.map((it, i) => {
          const halfTax = Number(it.item_tax_amount || 0) / 2;

          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colSno}>{i + 1}</Text>
              <Text style={styles.colItems}>
                {it.item?.item_name || it.description || "-"}
              </Text>
              <Text style={styles.colHsn}>{it.hsn_code || "-"}</Text>
              <Text style={styles.colQty}>
                {it.quantity || 0} {it.unit || ""}
              </Text>
              <Text style={styles.colSgst}>{money(halfTax)}</Text>
              <Text style={styles.colCgst}>{money(halfTax)}</Text>
              <Text style={styles.colAmount}>{money(it.amount)}</Text>
            </View>
          );
        })}

        {/* ---------- TOTALS ---------- */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>₹{money(subTotal)}</Text>
        </View>

        <View style={styles.taxRow}>
          <Text style={styles.totalLabel}>SGST Total</Text>
          <Text style={styles.totalValue}>₹{money(taxSgst)}</Text>
        </View>

        <View style={styles.taxRow}>
          <Text style={styles.totalLabel}>CGST Total</Text>
          <Text style={styles.totalValue}>₹{money(taxCgst)}</Text>
        </View>

        {/* ---------- BOTTOM SINGLE ROW WITH BORDER ---------- */}
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#000",
            padding: 6,
            marginTop: 5,
          }}
        >
          {/* ---------- LEFT: BANK DETAILS ---------- */}
          <View style={{ flex: 1, paddingRight: 6 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
              Bank Details
            </Text>
            <Text style={{ fontSize: 8 }}>
              Account Name: {invoice.company_name || "-"}
            </Text>
            <Text style={{ fontSize: 8 }}>IFSC: ICICI0004924</Text>
            <Text style={{ fontSize: 8 }}>Acc No: 123456543</Text>
            <Text style={{ fontSize: 8 }}>Bank: Tirupur Branch</Text>
          </View>

          {/* ---------- CENTER: QR CODE + TERMS ---------- */}
          <View
            style={{
              paddingHorizontal: 5,
              borderLeftWidth: 1,
              borderColor: "#000",
              borderRightWidth: 1,
            }}
          >
            <Text style={{ fontSize: 8 }}>Terms & Conditions:</Text>
            <Text style={{ fontSize: 8 }}>
              1. Goods once sold won't be taken back.
            </Text>
            <Text style={{ fontSize: 8 }}>
              2. All disputes subject to Tirupur.
            </Text>
          </View>

          {/* ---------- RIGHT: SIGNATURE ---------- */}
          <View style={{ flex: 1, paddingLeft: 6, alignItems: "flex-end" }}>
            <Text style={{ fontWeight: "bold", fontSize: 9 }}>
              For {invoice.company_name || "Company"}
            </Text>
            <Text
              style={{
                marginTop: 20,
                fontSize: 8,
              }}
            >
              Authorised Signatory
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceA5;
