import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import CreateInvoice from './components/CreateInvoice'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateInvoice />} />
      </Routes>
    </Router>
  )
}
export default App

