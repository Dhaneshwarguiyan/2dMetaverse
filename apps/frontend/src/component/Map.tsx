import { useNavigate } from 'react-router-dom';
import Options from '../icons/Options';

interface propType {
    thumbnail:string;
    name:string
}

const Map = ({thumbnail,name}:propType) => {
  const navigate = useNavigate();
  return (
    <div className='w-[283px] cursor-pointer' onClick={()=>{navigate('/meta')}} >
      <img src={thumbnail} alt="map" className='w-[283px] h-[170px] rounded-lg object-cover'/>
      <div className='flex justify-between px-2 mt-2'>
        <span>{name}</span>
        <span><Options /></span>
      </div>
    </div>
  )
}

export default Map
