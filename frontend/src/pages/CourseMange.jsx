import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { sectionService } from '../services/sectionService';
import { lectureService } from '../services/lectureService';
import '../styles/CourseManage.css';

const CourseMange = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Course states
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Section states
  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [savingSectionId, setSavingSectionId] = useState(null);
  
  // Lecture states
  const [expandedSection, setExpandedSection] = useState(null);
  const [showLectureForm, setShowLectureForm] = useState(null);
  const [lectureFormData, setLectureFormData] = useState({
    title: "",
    order: 1,
    video: null,
    isPreview: false,
  });
  const [savingLectureId, setSavingLectureId] = useState(null);

  useEffect(() => {
    fetchCourseAndSections();
  }, [courseId]);

  const fetchCourseAndSections = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch course details
      const courseResponse = await courseService.getCourseDetail(courseId);
      setCourse(courseResponse.data?.data);
      
      // Fetch sections
      const sectionsResponse = await sectionService.getSectionsByCourse(courseId);
      setSections(sectionsResponse.data?.data || []);
    } catch (err) {
      setError("Failed to load course. Please try again.");
      console.error("Error fetching course data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    
    if (!newSectionTitle.trim()) {
      alert("Please enter a section title");
      return;
    }

    setSavingSectionId("new");
    try {
      const response = await sectionService.createSection(courseId, {
        title: newSectionTitle,
        order: sections.length + 1,
      });
      
      setSections([...sections, response.data?.data]);
      setNewSectionTitle("");
      setSuccess("Section added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add section");
      console.error("Error adding section:", err);
    } finally {
      setSavingSectionId(null);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section and all its lectures?")) return;
    
    setSavingSectionId(sectionId);
    try {
      await sectionService.deleteSection(sectionId);
      setSections(sections.filter(s => s._id !== sectionId));
      setSuccess("Section deleted successfully!");
      setExpandedSection(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete section");
    } finally {
      setSavingSectionId(null);
    }
  };

  const handleAddLecture = async (e, sectionId) => {
    e.preventDefault();
    
    if (!lectureFormData.title.trim()) {
      alert("Please enter lecture title");
      return;
    }
    
    if (!lectureFormData.video) {
      alert("Please select a video file");
      return;
    }

    setSavingLectureId(sectionId);
    try {
      const response = await lectureService.createLecture(sectionId, lectureFormData);
      
      // Update sections with new lecture
      const updatedSections = sections.map(section => {
        if (section._id === sectionId) {
          return {
            ...section,
            lectures: [...(section.lectures || []), response.data?.data]
          };
        }
        return section;
      });
      setSections(updatedSections);
      
      setSuccess("Lecture added successfully!");
      setShowLectureForm(null);
      setLectureFormData({ title: "", order: 1, video: null, isPreview: false });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add lecture");
      console.error("Error adding lecture:", err);
    } finally {
      setSavingLectureId(null);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    
    setSavingLectureId(lectureId);
    try {
      await lectureService.deleteLecture(lectureId);
      
      // Update sections to remove deleted lecture
      const updatedSections = sections.map(section => ({
        ...section,
        lectures: section.lectures?.filter(l => l._id !== lectureId) || []
      }));
      setSections(updatedSections);
      
      setSuccess("Lecture deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lecture");
    } finally {
      setSavingLectureId(null);
    }
  };

  if (loading) return <div className="loading">Loading course...</div>;
  if (!course) return <div className="error-message">Course not found</div>;

  return (
    <div className="manage-course-container">
      <div className="manage-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>{course?.title}</h1>
        <button 
          onClick={() => navigate(`/course/${courseId}/edit`)}
          className="edit-course-btn"
        >
          Edit Course Details
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Add Section Form */}
      <div className="add-section-form">
        <h2>Add Section</h2>
        <form onSubmit={handleAddSection}>
          <input 
            type="text" 
            placeholder="Enter section title (e.g., Getting Started)" 
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            disabled={savingSectionId === "new"}
            required
          />
          <button 
            type="submit" 
            className="add-btn"
            disabled={savingSectionId === "new"}
          >
            {savingSectionId === "new" ? "Adding..." : "+ Add Section"}
          </button>
        </form>
      </div>

      {/* Sections List */}
      <div className="sections-list">
        <h2>Course Content ({sections.length} sections)</h2>
        
        {sections.length === 0 ? (
          <p className="empty-message">No sections created yet. Add your first section above.</p>
        ) : (
          sections.map((section, index) => (
            <div key={section._id} className="section-item">
              <div 
                className="section-header"
                onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="section-info">
                  <span className="section-icon">
                    {expandedSection === section._id ? "▼" : "▶"}
                  </span>
                  <span className="section-number">Section {index + 1}</span>
                  <h3>{section.title}</h3>
                  <span className="lecture-count">
                    {section.lectures?.length || 0} lectures
                  </span>
                </div>
                
                <button
                  className="delete-section-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(section._id);
                  }}
                  disabled={savingSectionId === section._id}
                  title="Delete section"
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Lectures List */}
              {expandedSection === section._id && (
                <div className="section-content">
                  <div className="lectures-list">
                    {section.lectures && section.lectures.length > 0 ? (
                      section.lectures.map((lecture, lectureIndex) => (
                        <div key={lecture._id} className="lecture-item">
                          <div className="lecture-info">
                            <span className="lecture-number">{lectureIndex + 1}.</span>
                            <div className="lecture-details">
                              <span className="lecture-title">{lecture.title}</span>
                              {lecture.isPreview && (
                                <span className="preview-badge">Preview</span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            className="delete-lecture-btn"
                            onClick={() => handleDeleteLecture(lecture._id)}
                            disabled={savingLectureId === lecture._id}
                            title="Delete lecture"
                          >
                            ✕ Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="no-lectures">No lectures in this section yet.</p>
                    )}
                  </div>

                  {/* Add Lecture Form */}
                  {showLectureForm === section._id ? (
                    <form 
                      className="lecture-form"
                      onSubmit={(e) => handleAddLecture(e, section._id)}
                    >
                      <h4>Add Lecture to {section.title}</h4>
                      
                      <div className="form-group">
                        <label>Lecture Title *</label>
                        <input
                          type="text"
                          placeholder="Lecture title"
                          value={lectureFormData.title}
                          onChange={(e) =>
                            setLectureFormData({
                              ...lectureFormData,
                              title: e.target.value,
                            })
                          }
                          disabled={savingLectureId === section._id}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Order</label>
                        <input
                          type="number"
                          placeholder="Order"
                          value={lectureFormData.order}
                          onChange={(e) =>
                            setLectureFormData({
                              ...lectureFormData,
                              order: parseInt(e.target.value),
                            })
                          }
                          min="1"
                          disabled={savingLectureId === section._id}
                        />
                      </div>

                      <div className="form-group">
                        <label>Video File * 
                          {lectureFormData.video && (
                            <span className="file-name"> - {lectureFormData.video.name}</span>
                          )}
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            setLectureFormData({
                              ...lectureFormData,
                              video: e.target.files[0],
                            })
                          }
                          disabled={savingLectureId === section._id}
                          required
                        />
                      </div>

                      <div className="form-group checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={lectureFormData.isPreview}
                            onChange={(e) =>
                              setLectureFormData({
                                ...lectureFormData,
                                isPreview: e.target.checked,
                              })
                            }
                            disabled={savingLectureId === section._id}
                          />
                          Preview (free for students)
                        </label>
                      </div>

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="submit-btn"
                          disabled={savingLectureId === section._id}
                        >
                          {savingLectureId === section._id ? "Adding..." : "Add Lecture"}
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => {
                            setShowLectureForm(null);
                            setLectureFormData({
                              title: "",
                              order: 1,
                              video: null,
                              isPreview: false,
                            });
                          }}
                          disabled={savingLectureId === section._id}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      className="add-lecture-btn"
                      onClick={() => setShowLectureForm(section._id)}
                    >
                      + Add Lecture
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseMange;