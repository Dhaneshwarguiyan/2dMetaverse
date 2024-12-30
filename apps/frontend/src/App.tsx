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
import Navigate from './pages/Navigate'

function App() {
  return (
    <div className='w-screen h-screen overflow-scroll'>
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Navigate/>}>
          <Route index element={<LandingPage />}/>
          <Route path='/login' element={<Loggedout/>}>
            <Route index element={<LoginPage/>}/>
            <Route path='/login/signup' element={<SignupPage/>}/>
      </Route>
        </Route>
      <Route path='/home' element={<LoggedIn/>}>
        {/* maps can be selected here and user infos */}
        <Route path='/home/dashboard' element={<Dashboard/>}/>
        {/* you choose your avatar */}
        <Route path='/home/space' element={<Space/>}/>
        <Route index element={<Metaverse/>}/>
      </Route>      
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
