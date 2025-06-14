import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './app/layout/layout'
import Page from './app/dashboard/page'
import Welcome from './app/pages/welcome'
import { ThemeProvider } from './components/theme-provider'

function App() {

  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Page />} />
          <Route path="welcome" element={<Welcome />} />
        </Route>
      </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
