import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import { BASE_URL } from "./utils/constants";
import UserCard from "./UserCard";

// --- Reusable Input Component ---
const FormInput = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

const EditProfile = ({ user = {} }) => {
  const dispatch = useDispatch();

  // Initialize with optional chaining to avoid crashes if user prop is missing
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return "First and Last Name are required.";
    }
    if (!age || isNaN(age) || Number(age) <= 0) {
      return "Please enter a valid age.";
    }
    if (!gender.trim()) {
      return "Gender is required.";
    }
    if (photoUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(photoUrl)) {
      return "Photo URL must be a valid image link.";
    }
    return "";
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      scrollToTop();
      return;
    }

    setIsSaving(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/profile/edit`,
        {
          firstName,
          lastName,
          photoUrl,
          age: Number(age),
          gender,
          about,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowSuccess(true);
      scrollToTop();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Edit profile error:", err);
      setError(err?.response?.data?.message || "An unexpected error occurred.");
      scrollToTop();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 mt-5 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 border-b-2 border-purple-300 pb-2">
          Edit Your Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12">
          {/* --- Form Section --- */}
          <div className="md:col-span-2">
            <form
              onSubmit={saveProfile}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-200/80 space-y-6"
              aria-label="Edit profile form"
            >
              {/* Success Message */}
              {showSuccess && (
                <div
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
                  role="alert"
                >
                  <p className="font-bold">Success!</p>
                  <p>Your profile has been updated.</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-600 font-semibold" role="alert">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <FormInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <FormInput label="Photo URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                <FormInput
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="e.g., Male, Female, Non-binary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                             focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tell us a little about yourself..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 w-40 bg-purple-600 text-white font-semibold px-4 py-2.5 rounded-full 
                             hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                             transition-all duration-200 disabled:bg-gray-400"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* --- Live Preview Section --- */}
          <div className="mt-12 md:mt-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center md:text-left">Live Preview</h2>
            <div className="sticky top-24">
              <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
