import './App.css'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Loggedout from './layouts/Loggedout'
import LoggedIn from './layouts/LoggedIn'
import Metaverse from './pages/Metaverse'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Space from './pages/Space'

function App() {
  return (
    <div className='w-screen h-screen overflow-hidden'>
      <BrowserRouter>
      <Routes >
      <Route index element={<LandingPage />}/>
      <Route path='/login' element={<Loggedout/>}>
        <Route index element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
      </Route>
      <Route path='/home' element={<LoggedIn/>}>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/space' element={<Space/>}/>
        <Route path='/metaverse' element={<Metaverse/>}/>
      </Route>      
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
