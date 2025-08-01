import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "./utils/connectionSlice";
import { Link } from "react-router-dom";

// Reusable Connection Card Component
const ConnectionCard = ({ connection }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

  return (
    <div
      className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-6 border border-gray-200/80
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
    >
      <img
        alt={`${firstName} ${lastName}`}
        className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
        src={photoUrl || "https://i.pravatar.cc/150"}
        onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/150")}
      />

      <div className="flex-1 mt-5 sm:mt-0 sm:ml-6 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-gray-500 font-medium mt-1">
            {age}, {gender}
          </p>
        )}

        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {about || "No bio available."}
        </p>
      </div>

      <div className="mt-5 sm:mt-0 sm:ml-4 flex-shrink-0">
        <Link to={`/chat/${_id}`}>
          <button
            className="flex items-center gap-2 bg-purple-400 text-white font-semibold px-5 py-2.5 rounded-full 
                       hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                       transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.707 3.293a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L5.414 9H14.5a1 1 0 100-2H5.414l1.707-1.707a1 1 0 00-1.414-1.414l-3 3z" />
            </svg>
            Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const [loading, setLoading] = useState(!connections || connections.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!connections || connections.length === 0) {
      const fetchConnections = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/user/users/connections`, {
            withCredentials: true,
          });
          dispatch(addConnections(res.data.connections));
        } catch (err) {
          console.error(err);
          setError("Could not load your connections. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchConnections();
    }
  }, [dispatch, connections]);

 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <h1 className="text-2xl font-semibold text-red-600">{error}</h1>
      </div>
    );
  }

  // 🚫 No Connections
  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h1 className="text-3xl font-bold text-gray-700">No Connections Yet</h1>
        <p className="mt-2 text-gray-500">Start exploring and connect with new people!</p>
      </div>
    );
  }

  // ✅ Success State
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 mt-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 border-b-2 border-purple-300 pb-2 ">
          Your Connections
        </h1>
        <div className="space-y-6">
          {connections.map((conn) => (
            <ConnectionCard key={conn._id} connection={conn} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
