import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"

const Hero = () => {
    const navigate = useNavigate();
  return (
    <div className="w-screen h-[70vh] flex flex-col gap-6 justify-center items-center overflow-hidden">
      <div className="text-center">
        <div className="text-5xl font-extrabold text-blue-800 mb-2">Explore. Create. Connect</div>
        <div className="text-gray-500 text-lg">Welcome to the 2D Metaverse of Endless possibilities</div>
      </div>
      <div onClick={()=>{navigate('/home')}}>
        <Button text="Explore" type="cta"/>
      </div>
    </div>
  )
}

export default Hero
