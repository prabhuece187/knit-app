import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import { ThemeProvider } from './theme/theme-provider'
import Customer from './pages/customer/Customer'
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
               <Route path="customers" element={<Customer />} />

            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
