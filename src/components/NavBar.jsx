import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "./utils/constants";
import { removeUser } from "./utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
    
      console.log(err);
    }
  };

  return (
    <div className="navbar bg-white/60 backdrop-blur-md shadow-lg fixed top-0 left-0 w-full z-50 border-b border-white/30">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold tracking-wide text-purple-700 hover:bg-purple-100 transition">
          ConnectPep
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border-2 border-purple-400 hover:border-pink-400 transition duration-200 shadow-md hover:scale-105"
            >
              <div className="w-10 rounded-full overflow-hidden">
                <img
                  alt="user photo"
                  src={user.photoUrl || "https://www.gravatar.com/avatar/?d=mp&f=y"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://www.gravatar.com/avatar/?d=mp&f=y";
                  }}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white/90 backdrop-blur-md rounded-2xl z-[1] mt-3 w-56 p-2 shadow-lg border border-white/30 transition-all duration-300"
            >
              <li>
                <Link to="/profile" className="justify-between hover:bg-purple-100 rounded-lg transition">
                  Profile
                  <span className="badge bg-purple-400 text-white">New</span>
                </Link>
              </li>
              <li>
                <Link to="/ReceivedRequests" className="hover:bg-purple-200 rounded-lg transition">Requests</Link>
              </li>
               <li>
                <Link to="/connections" className="hover:bg-purple-200 rounded-lg transition">My connections</Link>
              </li> 
              <li>
                <Link to="/premium" className="hover:bg-purple-200 rounded-lg transition">Premium</Link>
              </li>
              <li>
                <a onClick={handleLogout} className="hover:bg-purple-200 text-pink-600 rounded-lg transition">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default NavBar;