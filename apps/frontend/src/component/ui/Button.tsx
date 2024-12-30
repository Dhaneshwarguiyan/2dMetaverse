import { ReactElement } from "react"

interface propType{
    icon?:ReactElement,
    text:string,
    type:"primary" | "secondary" | "cta"
}

const Button = ({icon,text,type}:propType) => {
  return (
    <div className={`w-fit h-fit flex justify-center items-center  gap-2  ${type === "cta" ? "text-xl text-white bg-blue-500 rounded-full px-7 py-3 font-medium" : "py-2 px-4 rounded-lg text-sm font-extrabold"}  ${type === "primary" && "text-white bg-blue-600"} ${type === "secondary" && "text-blue-900 bg-blue-100"} cursor-pointer`}>
        {icon &&
          <span>{icon}</span>
        }
        <span className="">{text}</span>
    </div>
  )
}

export default Button
