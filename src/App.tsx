import Layout from '@/components/common/Layout'
import { ROUTES } from '@/routes/routes'
import { ThemeProvider } from '@/context/theme-provider'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="receipt-analyzer-ui-theme">
      <Router>
        <Layout>
          <Routes>
            {ROUTES.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
          <Toaster />
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
