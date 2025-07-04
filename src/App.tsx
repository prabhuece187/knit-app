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

function App() {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />

              {/* Customer */}
              <Route path="customers" element={<Customer />} />
              <Route path="items" element={<Item />} />
              <Route path="states" element={<State />} />
              <Route path="mills" element={<Mill />} />
              <Route path="yarn_types" element={<YarnType />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
