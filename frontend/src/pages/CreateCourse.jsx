import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import "../styles/CreateCourse.css";

export default function CreateCourse() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: "0",
    level: "beginner",
    language: "english",
    category: {
      name: "",
      description: "",
    },
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("category.")) {
      const categoryField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        category: {
          ...prev.category,
          [categoryField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await courseService.createCourse(formData);
      console.log("Course created:", response.data);
      localStorage.setItem("createdCourseId", response.data.data._id);
      navigate("/instructor-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <div className="create-course-card">
        <h2>Create New Course</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Learn Web Development"
              required
            />
          </div>

          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Short description of the course"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed course description"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0 for free"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language *</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                name="category.name"
                value={formData.category.name}
                onChange={handleChange}
                placeholder="e.g., Web Development"
                required
              />
            </div>

            <div className="form-group">
              <label>Category Description</label>
              <input
                type="text"
                name="category.description"
                value={formData.category.description}
                onChange={handleChange}
                placeholder="Category description"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Thumbnail *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleThumbnailChange}
                required
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="file-input-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Thumbnail
              </button>
              {formData.thumbnail && (
                <span className="file-name">{formData.thumbnail.name}</span>
              )}
            </div>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="thumbnail-preview"
              />
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
