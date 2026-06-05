import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../services/courseService";
import SectionManagement from "./SectionManagement";
import "../styles/EditCourse.css";

export default function EditCourse() {
  const { courseId } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [course, setCourse] = useState(null);
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
  });

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      console.log("Fetching course data for ID:", courseId);
      const response = await courseService.getCourseDetail(courseId);
      console.log("Fetched course data:", response.data);
      setCourse(response.data.data);
      setFormData({
        title: response.data.data.title,
        subtitle: response.data.data.subtitle || "",
        description: response.data.data.description,
        price: response.data.data.price || "0",
        level: response.data.data.level,
        language: response.data.data.language,
        category: response.data.data.category || {
          name: "",
          description: "",
        },
      });
      setThumbnailPreview(response.data.data.thumbnail);
    } catch {
      setError("Failed to fetch course data");
    } finally {
      setLoading(false);
    }
  };

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
      uploadThumbnail(file);
    }
  };

  const uploadThumbnail = async (file) => {
    setSaving(true);
    setError("");
    try {
      const response = await courseService.updateCourseThumbnail(courseId, file);
      setCourse(response.data.data);
      setThumbnailPreview(response.data.data.thumbnail);
      setSuccess("Thumbnail updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update thumbnail");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await courseService.updateCourseDetails(courseId, formData);
      setCourse(response.data.data);
      setSuccess("Course details updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishCourse = async () => {
    if (!window.confirm("Are you sure you want to publish this course?")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await courseService.publishCourse(courseId);
      setCourse(response.data.data);
      setSuccess("Course published successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-course-container">
      <div className="edit-course-card">
        <h2>Edit Course: {course?.title}</h2>
        <p className="course-status">
          Status: <span className={course?.isPublished}>{course?.isPublished || "Draft"}</span>
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="tabs">
          <button
            className={`tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Course Details
          </button>
          <button
            className={`tab ${activeTab === "thumbnail" ? "active" : ""}`}
            onClick={() => setActiveTab("thumbnail")}
          >
            Thumbnail
          </button>
          <button
            className={`tab ${activeTab === "sections" ? "active" : ""}`}
            onClick={() => setActiveTab("sections")}
          >
            Sections & Lectures
          </button>
          <button
            className={`tab ${activeTab === "publish" ? "active" : ""}`}
            onClick={() => setActiveTab("publish")}
          >
            Publish
          </button>
        </div>

        {activeTab === "details" && (
          <form onSubmit={handleUpdateDetails} className="course-form">
            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="submit-btn">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "thumbnail" && (
          <div className="thumbnail-section">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Current Thumbnail"
                className="current-thumbnail"
              />
            )}

            <div className="file-input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="file-input-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                {saving ? "Uploading..." : "Change Thumbnail"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "sections" && (
          <div className="sections-tab">
            <SectionManagement courseId={courseId} />
          </div>
        )}

        {activeTab === "publish" && (
          <div className="publish-section">
            <div className="publish-info">
              <h3>Ready to Publish?</h3>
              <p>
                Make sure your course has:
              </p>
              <ul>
                <li>✓ Course title, description, and thumbnail</li>
                <li>✓ At least one section</li>
                <li>✓ At least one lecture in each section</li>
                <li>✓ Category with description</li>
              </ul>

              <button
                onClick={handlePublishCourse}
                disabled={saving || course?.isPublished === "published"}
                className={`publish-btn ${
                  course?.isPublished === "published" ? "published" : ""
                }`}
              >
                {course?.isPublished === "published"
                  ? "Already Published"
                  : "Publish Course"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
