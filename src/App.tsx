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
import IndizualData from "./pages/report/IndizualData";

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

              {/* Report */}
              <Route path="over-all-report" element={<OverAllReport />} />
              <Route
                path="over-all-detail-report"
                element={<OverAllDetailReport />}
              />

              {/* Add-on Service */}
              <Route path="customers/:id/:name" element={<IndizualData />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
