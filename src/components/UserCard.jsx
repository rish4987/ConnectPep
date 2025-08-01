import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "./utils/feedSlice";
import { FaTimes, FaHeart, FaInfoCircle, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

// Constants for request status to avoid magic strings
const REQUEST_STATUS = {
  IGNORED: "ignored",
  INTERESTED: "interested",
};

const UserCard = ({ user }) => {
  const { _id, firstName, photoUrl, lastName, age, gender } = user;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    ignored: false,
    interested: false,
  });

  const handleSendRequest = async (status, userId) => {
    try {
      setIsLoading((prev) => ({ ...prev, [status]: true }));
      await axios.post(
        `${BASE_URL}/requests/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Failed to send request:", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, [status]: false }));
    }
  };

  return (
    <div className="card bg-gradient-to-br from-white via-purple-50 to-blue-100 w-full max-w-xs sm:w-96 border border-purple-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 mx-auto">
      <figure className="w-full aspect-[3/3] overflow-hidden rounded-t-2xl   ">
        <img
          src={photoUrl || "/default-avatar.png"}
          alt={`${firstName} ${lastName}`}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
      </figure>
      <div className="card-body items-center">
        <h2 className="card-title text-2xl font-bold mb-1">
          {firstName} {lastName}
        </h2>
        <p className="text-base text-gray-700 mb-2">
          {age}, {gender}
        </p>
        <div className="card-actions justify-center my-4 gap-4">
          <button
            className={`btn btn-primary transition-transform duration-150 active:scale-95 ${isLoading.ignored ? "loading" : ""}`}
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={isLoading.ignored}
            aria-label="Ignore user"
          >
            {isLoading.ignored ? "Processing..." : "Ignore"}
          </button>
          <button
            className={`btn btn-secondary transition-transform duration-150 active:scale-95 ${isLoading.interested ? "loading" : ""}`}
            onClick={() => handleSendRequest("interested", _id)}
            disabled={isLoading.interested}
            aria-label="Show interest in user"
          >
            {isLoading.interested ? "Processing..." : "Interested"}
          </button>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    photoUrl: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
    about: PropTypes.string,
  }).isRequired,
};

export default React.memo(UserCard);   