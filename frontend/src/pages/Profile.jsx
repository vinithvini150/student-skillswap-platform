import { useEffect, useRef, useState } from "react";
import { Camera, Save, UserRound } from "lucide-react";
import api from "../services/api.js";

function Profile() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skillsToTeach: "",
    skillsToLearn: ""
  });

  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/users/me");
        const user = response.data.user;

        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          skillsToTeach: (user.skillsToTeach || []).join(", "),
          skillsToLearn: (user.skillsToLearn || []).join(", ")
        });

        setProfileImage(user.profileImage || "");
        setPreviewImage(user.profileImage || "");
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const convertSkillsToArray = (value) =>
    value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

  const saveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put("/users/me", {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        skillsToTeach: convertSkillsToArray(formData.skillsToTeach),
        skillsToLearn: convertSkillsToArray(formData.skillsToLearn)
      });

      const updatedUser = response.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          id: updatedUser._id,
          name: updatedUser.name,
          profileImage: updatedUser.profileImage || ""
        })
      );

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (selectedFile.size > 3 * 1024 * 1024) {
      setError("Image must be smaller than 3 MB.");
      return;
    }

    const localPreview = URL.createObjectURL(selectedFile);

    setPreviewImage(localPreview);
    setUploading(true);
    setError("");
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("profileImage", selectedFile);

    try {
      const response = await api.post(
        "/users/me/profile-image",
        uploadData
      );

      const updatedUser = response.data.user;

      setProfileImage(updatedUser.profileImage || "");
      setPreviewImage(updatedUser.profileImage || "");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          id: updatedUser._id,
          name: updatedUser.name,
          profileImage: updatedUser.profileImage || ""
        })
      );

      setMessage("Profile image uploaded successfully.");
    } catch (err) {
      setPreviewImage(profileImage);
      setError(err.response?.data?.message || "Could not upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <p className="loading-text">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">My Profile</p>
        <h1>Tell students what you can share.</h1>
        <p>Add skills separated by commas, such as HTML5, CSS, Bootstrap.</p>
      </section>

      {error && <p className="form-error page-message">{error}</p>}
      {message && <p className="form-success page-message">{message}</p>}

      <section className="profile-layout">
        <aside className="profile-image-card">
          <div className="profile-image-wrapper">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="profile-image"
                onError={() => setError("Profile image could not be loaded.")}
              />
            ) : (
              <div className="profile-image-placeholder">
                <UserRound size={54} />
              </div>
            )}

            <button
              type="button"
              className="profile-image-button"
              onClick={openFilePicker}
              disabled={uploading}
              title="Upload profile image"
            >
              <Camera size={18} />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden-file-input"
            onChange={uploadImage}
          />

          <h2>{formData.name || "Student"}</h2>
          <p>
            {uploading
              ? "Uploading image..."
              : "JPG, PNG or WEBP · Maximum 3 MB"}
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={openFilePicker}
            disabled={uploading}
          >
            <Camera size={17} />
            {uploading ? "Uploading..." : "Change photo"}
          </button>
        </aside>

        <form className="profile-form-card" onSubmit={saveProfile}>
          <label>
            Full name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            About you
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="5"
              maxLength="500"
            />
          </label>

          <label>
            Skills I can teach
            <input
              type="text"
              name="skillsToTeach"
              value={formData.skillsToTeach}
              onChange={handleChange}
              placeholder="React.js, JavaScript"
            />
            <small>Separate skills using commas.</small>
          </label>

          <label>
            Skills I want to learn
            <input
              type="text"
              name="skillsToLearn"
              value={formData.skillsToLearn}
              onChange={handleChange}
              placeholder="Node.js, MongoDB"
            />
            <small>Separate skills using commas.</small>
          </label>

          <button type="submit" className="save-button" disabled={saving}>
            <Save size={18} />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Profile;