import { useState } from "react"
import Search from "../icons/Search";
import Button from "./ui/Button";
import Add from "../icons/Add";

const tiles = ["Recent Spaces","My Space"]

const NavPanel = () => {
    const [activeTab,setActiveTab] = useState<string>("Recent Spaces");
    const [search,setSearch] = useState<string>("");
  return (
    <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-300">
      <div className="flex gap-4">
        {
            tiles.map((tile,key)=>{
                return <div className={`${activeTab === tile ? "text-black":"text-gray-500"} font-bold cursor-pointer`} onClick={()=>{setActiveTab(tile)}} key={key}>{tile}</div>
            })
        }
      </div>
      <div className="flex gap-3">
        <span className="flex gap-2 items-center border border-gray-300 rounded-lg w-[300px] text-sm ">
            <span className="pl-2 text-gray-400"><Search /></span>
            <input type="text" placeholder="Search Space" value={search} onChange={(e)=>{setSearch(e.target.value)}} className="w-full h-full py-2 outline-none rounded-lg"/>
        </span>
        <Button icon={<Add/>} text="Enter with Code" type="secondary"/>
        <Button icon={<Add/>} text="Create Space" type="primary"/>
      </div>
    </div>
  )
}

export default NavPanel
