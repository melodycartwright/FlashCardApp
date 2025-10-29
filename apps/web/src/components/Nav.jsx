import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/decks" className="text-xl font-bold text-indigo-600">
                FlashCards
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/decks"
                className={`${
                  isActive("/decks")
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Decks
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/login"
              className={`${
                isActive("/login")
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${
                isActive("/register")
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
