import './App.css'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Metaverse from './pages/Metaverse'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Space from './pages/Space'

function App() {
  return (
    <div className='w-screen h-screen overflow-hidden'>
      <BrowserRouter>
      <Routes >
      <Route index element={<Metaverse />}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/space' element={<Space/>}/>
      <Route path='metaverse' element={<LandingPage/>}/>
      
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
