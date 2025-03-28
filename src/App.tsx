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
import TransactionHistory from './pages/History/TransactionHistory'
import IncomingRequests from './pages/Requests/IncomingRequests'
import OutgoingRequests from './pages/Requests/OutgoingRequests'

function App() {



  return (
    <>
      <ConfigProvider
        theme={{
          "components": {
            "Button": {
              controlHeight: 40,
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
  
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} /> 
                <Route path="/history" element={<TransactionHistory />} /> 
                <Route path="/incoming" element={<IncomingRequests />} /> 
                <Route path="/outgoing" element={<OutgoingRequests />} /> 

              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/tx/:id" element={<TransactionDetails />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </>
  )
}

export default App
