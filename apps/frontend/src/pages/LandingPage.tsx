import { useNavigate } from "react-router-dom"

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      Landing page
      <button onClick={()=>{navigate('/login')}}>Login</button>
      <button onClick={()=>{navigate('/login/signup')}}>signup</button>
    </div>
  )
}

export default LandingPage