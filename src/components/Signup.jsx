import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "./utils/userSlice";
import { BASE_URL } from "./utils/constants";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormInput = ({ label, type = "text", value, onChange, placeholder, required = true, name }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    photoUrl: "",
    age: "",
    gender: "Prefer not to say",
    about: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.age < 18) {
      setError("You must be at least 18 years old.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/signup`,
        formData,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred during sign up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-2xl max-w-sm w-full">
          <h1 className="text-3xl font-bold text-green-600">Welcome!</h1>
          <p className="mt-2 text-gray-600">Your account has been created successfully.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-700 transition-colors"
          >
            Proceed to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 my-4 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-6 text-purple-700 border-b-2 border-purple-300 pb-2">
            Create an Account
          </h1>
         
        </div>
        <form
          onSubmit={handleSignUp}
          className="bg-white p-8 rounded-2xl shadow-md border border-gray-200/80 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="6+ characters"
                required
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <FormInput label="Photo URL" name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="https://example.com/image.png" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Must be 18 or older" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tell us a little about yourself..."
            ></textarea>
          </div>

          {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full max-w-xs bg-purple-600 text-white font-semibold px-4 py-3 rounded-full 
                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                         transition-all duration-200 disabled:bg-gray-400"
            >
              {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Sign Up"}
            </button>
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-700 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
