import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { sectionService } from "../services/sectionService";
import "../styles/SectionManagement.css";

export default function SectionManagement({ courseId: propCourseId }) {
  const { courseId: paramCourseId } = useParams();
  const courseId = propCourseId || paramCourseId;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    order: 1,
  });

  useEffect(() => {
    fetchSections();
  }, [courseId]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await sectionService.getSectionsByCourse(courseId);
      setSections(response.data?.data || []);
    } catch (err) {
      setError("Failed to load sections");
      console.error("Error fetching sections:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        // Update existing section
        const response = await sectionService.updateSection(editingId, {
          title: formData.title,
          order: formData.order,
        });
        setSections(
          sections.map((s) => (s._id === editingId ? response.data?.data : s))
        );
        setSuccess("Section updated successfully!");
      } else {
        // Create new section
        const response = await sectionService.createSection(courseId, {
          title: formData.title,
          order: formData.order,
        });
        setSections([...sections, response.data?.data]);
        setSuccess("Section created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ title: "", order: sections.length + 1 });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save section");
      console.error("Error saving section:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSection = (section) => {
    setEditingId(section._id);
    setFormData({ title: section.title, order: section.order });
    setShowForm(true);
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section and all its lectures?")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await sectionService.deleteSection(sectionId);
      setSections(sections.filter((s) => s._id !== sectionId));
      setSuccess("Section deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete section");
      console.error("Error deleting section:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-management">
      <div className="management-header">
        <h2>Manage Sections & Lectures</h2>
        <button
          className="add-section-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: "", order: sections.length + 1 });
          }}
          disabled={saving}
        >
          {showForm ? "Cancel" : "+ Add Section"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form onSubmit={handleAddSection} className="section-form">
          <div className="form-group">
            <label>Section Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter section title"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
              }
              min="1"
              disabled={saving}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Section" : "Create Section"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading sections...</div>
      ) : sections.length === 0 ? (
        <div className="empty-state">
          <p>No sections yet. Create your first section to add lectures.</p>
        </div>
      ) : (
        <div className="sections-list">
          {sections.map((section, index) => (
            <div key={section._id} className="section-item">
              <div className="section-header-info">
                <h3>
                  {index + 1}. {section.title}
                </h3>
                <span className="lecture-count">
                  {section.lectures?.length || 0} lectures
                </span>
              </div>

              <div className="section-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditSection(section)}
                  disabled={saving}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSection(section._id)}
                  disabled={saving}
                >
                  Delete
                </button>
              </div>

              {section.lectures && section.lectures.length > 0 && (
                <div className="lectures-list">
                  <h4>Lectures</h4>
                  {section.lectures.map((lecture, idx) => (
                    <div key={lecture._id} className="lecture-item">
                      <span>{idx + 1}. {lecture.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
