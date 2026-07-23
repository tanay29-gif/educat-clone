import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarErrorLogged, setAvatarErrorLogged] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userService.getCurrentUser();
      // console.log("📥 Full response:", response);
      // console.log("📥 Response data:", response.data);
      const userData = response.data.data;
      console.log("✅ User data extracted:", userData);
      
      // Preload the avatar image before rendering (don't fail the whole fetch if image load fails)
      if (userData && userData.avatar) {
        try {
          await preloadImage(userData.avatar);
        } catch (imgErr) {
          console.warn("⚠️ Avatar preload failed, continuing without blocking:", imgErr);
        }
      }
      setUser(userData);
      setFormData({
        fullName: userData?.fullName || "",
        email: userData?.email || "",
      });
    } catch (err) {
      console.error("❌ Error fetching user:", err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  // Function to preload image
  const preloadImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  // Fallback avatar URL (placeholder)
  const fallbackAvatar = "https://via.placeholder.com/200?text=No+Avatar";

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      setUser(response.data.data);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch  {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await userService.changePassword(passwordData);
      setPasswordData({ oldPassword: "", newPassword: "" });
      setShowPasswordForm(false);
      setSuccess("Password changed successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    try {
      const response = await userService.updateAvatar(avatarFile);
      setUser(response.data.data);
      setAvatarFile(null);
      setSuccess("Avatar updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update avatar");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {user && (
          <>
            <div className="profile-avatar-section">
              <img
                src={user.avatar}
                alt="Profile"
                className="profile-avatar"
                onError={(e) => {
                  if (!avatarErrorLogged) {
                    console.warn("Avatar image failed to load, using placeholder");
                    setAvatarErrorLogged(true);
                  }
                  e.target.src = fallbackAvatar;
                }}
              />
              <form onSubmit={handleUpdateAvatar} className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <button type="submit" disabled={!avatarFile}>
                  Update Avatar
                </button>
              </form>
            </div>

            <div className="profile-info">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>

            {!isEditing ? (
              <>
                <div className="profile-info">
                  <p>
                    <strong>Full Name:</strong> {user.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
                <button
                  className="action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            <button
              className="action-btn"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="password-form">
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Update Password
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
