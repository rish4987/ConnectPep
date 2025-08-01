import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setReceivedRequests } from './utils/requestSlice';
import { BASE_URL } from './utils/constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestCard = ({ request, onReview, processingRequestId }) => {
  const { _id, fromUserId } = request;
  const isSubmitting = processingRequestId === _id;

  const handleReview = (status) => {
    if (!isSubmitting) onReview(_id, status);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-6 border border-gray-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <img
        alt={`${fromUserId.firstName} ${fromUserId.lastName}`}
        className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100"
        src={fromUserId.photoUrl}
        onError={(e) => (e.target.src = "https://i.pravatar.cc/150")}
      />
      <div className="flex-1 mt-5 sm:mt-0 sm:ml-6 text-center sm:text-left">
        <h2 className="text-xl font-bold text-gray-900">
          {fromUserId.firstName} {fromUserId.lastName}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Wants to connect with you.</p>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
        {['accepted', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => handleReview(status)}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 w-32 font-semibold px-4 py-2.5 rounded-full 
              ${status === 'accepted' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'} 
              text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
              transition-all duration-200 disabled:bg-gray-400`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  {status === 'accepted' ? (
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  )}
                </svg>
                {status === 'accepted' ? 'Accept' : 'Reject'}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---
const ReceivedRequests = () => {
  const dispatch = useDispatch();
  const { received, currentPage, totalPages } = useSelector(state => state.requests);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  const fetchRequests = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/requests/requests?page=${page}&limit=5`, {
        withCredentials: true,
      });
      dispatch(setReceivedRequests(res.data));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Could not load requests.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const reviewRequest = async (requestId, status) => {
    setProcessingRequestId(requestId);
    try {
      await axios.patch(`${BASE_URL}/requests/request/review/${status}/${requestId}`, {}, {
        withCredentials: true,
      });
      toast.success(`Request ${status}`);
      fetchRequests(currentPage);  // Stay on current page
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  useEffect(() => {
    fetchRequests(1); // Always start from page 1 on mount
  }, [fetchRequests]);

  if (loading && !received.length) {
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

  if (!received || received.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h1 className="text-3xl font-bold text-gray-700">No New Requests</h1>
        <p className="mt-2 text-gray-500">Your received requests list is empty for now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 mt-5 lg:px-8">
      <ToastContainer position="top-right" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 border-b-2 border-purple-300 pb-2">
          Received Requests
        </h1>

        <div className="space-y-6">
          {received.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              onReview={reviewRequest}
              processingRequestId={processingRequestId}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => currentPage !== i + 1 && fetchRequests(i + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  currentPage === i + 1
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-purple-100 border border-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedRequests;
