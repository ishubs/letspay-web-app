import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Auth/login'
import { AuthProvider } from './contexts/AuthContext'
import { ConfigProvider } from 'antd'
import './App.css'
import ProtectedRoute from './ProtectedRoute'
import HomePage from './pages/Home'
import Onboarding from './pages/onboarding'
import TransactionDetails from './pages/TransactionDetails'
import Welcome from './pages/Welcome'

function App() {



  return (
    <>
      <ConfigProvider
        theme={{
          "components": {
            "Button": {
              controlHeight: 48,
              fontSize: 16,
            },
            "Input": {
              controlHeight: 46,
              fontSize: 16,
            }
          }
        }}
      >
        <AuthProvider>
          <Router>
            <Routes>
              <Route path='/welcome' element={<Welcome />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} /> {/* Example protected page */}
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/tx/:id" element={<TransactionDetails />} /> {/* Example protected page */}
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </>
  )
}

export default App
