import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import { ThemeProvider } from "./theme/theme-provider";
import Customer from "./pages/customer/Customer";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import State from "./pages/state/State";
import Item from "./pages/items/Item";
import Mill from "./pages/mill/Mill";
import YarnType from "./pages/yarntype/YarnType";
import Inward from "./pages/inward/Inward";
import AddInward from "./pages/inward/component/AddInward";
import EditInward from "./pages/inward/component/EditInward";
import Outward from "./pages/outward/Outward";
import AddOutward from "./pages/outward/component/AddOutward";
import EditOutward from "./pages/outward/component/EditOutward";
import OverAllReport from "./pages/report/OverAll";
import OverAllDetailReport from "./pages/report/OverAllDetail";
import IndividualData from "./pages/report/common/IndividualData";
import Invoice from "./pages/invoice/Invoice";
import AddInvoice from "./pages/invoice/component/AddInvoice";
import Bank from "./pages/bank/Bank";
import EditInvoice from "./pages/invoice/component/EditInvoice";
import PrintInvoice from "./pages/invoice/component/PrintInvoice";

function App() {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />

              {/* Master */}
              <Route path="banks" element={<Bank />} />
              <Route path="customers" element={<Customer />} />
              <Route path="items" element={<Item />} />
              <Route path="states" element={<State />} />
              <Route path="mills" element={<Mill />} />
              <Route path="yarn_types" element={<YarnType />} />

              {/* Inward */}
              <Route path="inward" element={<Inward />} />
              <Route path="addinward" element={<AddInward />} />
              {/* this id set same as params inwardId */}
              <Route path="/editinward/:inwardId" element={<EditInward />} />

              {/* Outward */}
              <Route path="outward" element={<Outward />} />
              <Route path="addoutward" element={<AddOutward />} />
              <Route path="/editoutward/:outwardId" element={<EditOutward />} />

              {/* Invoice */}
              <Route path="invoice" element={<Invoice />} />
              <Route path="addinvoice" element={<AddInvoice />} />
              <Route path="/editinvoice/:invoiceId" element={<EditInvoice />} />
              <Route path="/printinvoice/:invoiceId" element={<PrintInvoice />} />

              {/* Report */}
              <Route path="over-all-report" element={<OverAllReport />} />
              <Route
                path="over-all-detail-report"
                element={<OverAllDetailReport />}
              />

              {/* Add-on Service */}
              <Route path="customers/:id" element={<IndividualData />} />
              <Route path="items/:id" element={<IndividualData />} />
              <Route path="mills/:id" element={<IndividualData />} />
              <Route path="yarn_types/:id" element={<IndividualData />} />
              <Route path="banks/:id" element={<IndividualData />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
