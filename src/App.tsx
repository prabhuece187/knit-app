import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import { ThemeProvider } from './theme/theme-provider'
import Customer from './pages/customer/Customer'
import AddCustomer from './pages/customer/AddCustomer'
import { Provider } from 'react-redux'
import { store } from './store/Store'

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
              <Route path="customers" element={<Customer name={"Customer"} />} />
              <Route path="add-customer" element={<AddCustomer />} />

            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
