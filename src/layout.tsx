import AppHeader from "@/components/layout/app.header"
import { Outlet } from "react-router-dom"

const Layout = () => {

  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  )
}

export default Layout
