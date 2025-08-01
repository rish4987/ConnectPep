import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "./utils/feedSlice";
import { useEffect, useState, useRef } from "react";
import UserCard from "./UserCard";
import TinderCard from "react-tinder-card";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const childRefs = useRef([]);

  useEffect(() => {
    const getFeed = async () => {
      if (feed && feed.length > 0) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/user/feed`, {
          withCredentials: true,
        });
        dispatch(addFeed(res?.data?.users));
      } catch (err) {
        setError("Failed to load users.");
        console.error("Feed error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    getFeed();
  }, [dispatch, feed]);

  const handleSwipe = (direction, userId) => {
    dispatch(removeUserFromFeed(userId));
  };

  const handleAction = (direction, userId) => {
    const idx = feed.findIndex((u) => u._id === userId);
    if (idx >= 0 && childRefs.current[idx]?.swipe) {
      childRefs.current[idx].swipe(direction);
    }
  };

  if (error) {
    return <h1 className="text-center text-red-500 mt-10">{error}</h1>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid mb-4"></div>
        <p className="text-purple-700 font-medium">Loading users...</p>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <img src="/no-users.svg" alt="No Users" className="w-40 h-40 mb-4" />
        <h2 className="text-xl text-gray-700">No new users found!</h2>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full pt-20 px-4 sm:px-8 md:px-20 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 overflow-hidden">
      {feed.map((user, index) => (
        <TinderCard
          className="absolute w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-500 ease-in-out hover:scale-105"
          key={user._id}
          onSwipe={(dir) => handleSwipe(dir, user._id)}
          preventSwipe={["up", "down"]}
          ref={(el) => (childRefs.current[index] = el)}
        >
          <div
            className="relative flex justify-center items-center"
            style={{ zIndex: feed.length - index }} // Ensure correct stacking
          >
            <UserCard user={user} onAction={handleAction} />
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default Feed;
