import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageStructure from './pages/structure'
import { ToastContainer } from "react-toastify";
import PaymentStatus from './pages/paymentStatus';

function App() {
  return (
    <div>
      <>
      <ToastContainer
      bodyClassName={() => "flex items-center text-xs "}
      />
      <BrowserRouter>
        <Routes>
          <Route index element={<PageStructure />} />
          <Route path="/status" element={<PaymentStatus />} />
        </Routes>
      </BrowserRouter>
      </>
    </div>
  )
}

export default App
