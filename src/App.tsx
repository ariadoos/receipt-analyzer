import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/context/theme-provider'
import Layout from '@/components/common/Layout'
import { ROUTES } from '@/config/routes'
import './App.css'

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
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
