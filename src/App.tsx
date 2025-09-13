import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import { ThemeProvider } from "./theme/theme-provider";
import Customer from "./pages/customer/Customer";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import State from "./pages/state/State";
import IndividualData from "./pages/report/common/IndividualData";

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
              <Route path="states" element={<State />} />

              {/* Add-on Service */}
              <Route path="customers/:id" element={<IndividualData />} />
              <Route path="items/:id" element={<IndividualData />} />
              <Route path="mills/:id" element={<IndividualData />} />
              <Route path="yarn_types/:id" element={<IndividualData />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
