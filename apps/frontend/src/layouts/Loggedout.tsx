import { Outlet } from "react-router-dom"

const Loggedout = () => {
  return (
    <div>
      logout layout
      <Outlet />
    </div>
  )
}

export default Loggedout
