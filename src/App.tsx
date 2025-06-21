import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './app/layout/Layout'
import Dashboard from './app/dashboard/Dashboard'
import { ThemeProvider } from './app/theme/theme-provider'
import Customer from './app/pages/customer/Customer'
import AddCustomer from './app/pages/customer/AddCustomer'
import { Provider } from 'react-redux'
import { store } from './app/store/Store'
import EditCustomer from './app/pages/customer/EditCustomer'

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
              <Route path="add-customer" element={<AddCustomer />} />
              <Route path="edit-customer/:CustomerId" element={<EditCustomer />} ></Route>

            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
