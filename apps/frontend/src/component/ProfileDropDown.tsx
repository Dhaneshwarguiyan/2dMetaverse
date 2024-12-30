import DropDownTile from "./ui/DropDownTile"
import Logout from "../icons/Logout";

const dropItems = [{text:"My Spaces"},{text:"Profile"},{text:"Logout",icon:<Logout/>}]

const ProfileDropDown = () => {
    
  return (
    <div className="border px-2 py-3 w-[250px] flex flex-col gap-2 cursor-pointer bg-white rounded-lg shadow-lg">
        {
            dropItems.map(items => {
                return <DropDownTile text={items.text} icon={items.icon}/>
            })
        }
  </div>
  )
}

export default ProfileDropDown
