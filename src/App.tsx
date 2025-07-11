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
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
