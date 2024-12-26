import Profile from '../../public/profile.png';

const Text = ({text,sender}:{text:string,sender:string}) => {
  return (
    <div className='flex gap-4 items-center'>
      <img src={Profile} alt="Avatar" className='w-[40px] h-[40px] object-center rounded-full'/>
      <div>
        <div className='text-black text-sm font-light'>
            {sender}
        </div>
        <div className='text-black'>
            {text}
        </div>
      </div>
    </div>
  )
}

export default Text
