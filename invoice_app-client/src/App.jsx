import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import CreateInvoice from './components/CreateInvoice'

if (!localStorage.getItem('buyerPAN')) {
  localStorage.setItem('buyerPAN', 'BAJPC4350M')
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createInvoice" element={<CreateInvoice />} />
      </Routes>
    </Router>
  )
}
export default App

