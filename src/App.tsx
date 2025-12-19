import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/context/theme-provider'
import Layout from '@/components/common/Layout'
import { ROUTES } from '@/config/routes'
import './App.css'
import { useEffect } from 'react'
import { Firestore } from '@/config/firebase'

function App() {
  useEffect(() => {
    Firestore.getParticipants().then((data) => console.log(data))
  }, [])

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
