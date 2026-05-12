import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Callback from './pages/Callback'
import Result from './pages/Result'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analyzing" element={<Callback />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}
