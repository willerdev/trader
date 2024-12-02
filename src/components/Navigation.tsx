import { NavLink } from 'react-router-dom'
import { Home, LineChart, History, User, BarChart2 } from 'lucide-react'

const Navigation = () => {
  const linkClass = "flex flex-col items-center text-xs gap-1"
  const activeClass = "text-blue-600"
  const inactiveClass = "text-gray-600"

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/markets" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <LineChart size={20} />
          <span>Markets</span>
        </NavLink>
        <NavLink to="/trading" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <BarChart2 size={20} />
          <span>Trading</span>
        </NavLink>
        <NavLink to="/portfolio" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <History size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default Navigation