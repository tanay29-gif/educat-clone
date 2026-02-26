import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../services/courseService";
import { sectionService } from "../services/sectionService";
import { lectureService } from "../services/lectureService";
import { userService } from "../services/userService";
import "../styles/CourseDetail.css";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const [playingLectureId, setPlayingLectureId] = useState(null);
  const [showLectureForm, setShowLectureForm] = useState(null); // Section ID
  const [lectureFormData, setLectureFormData] = useState({
    title: "",
    order: 1,
    video: null,
    isPreview: false,
  });

  useEffect(() => {
    fetchCourseData();
    fetchCurrentUser();
  }, [courseId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      setCurrentUser(response.data?.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch course details
      const courseResponse = await courseService.getCourseDetail(courseId);
      setCourse(courseResponse.data.data);
      
      // Fetch sections for this course
      const sectionsResponse = await sectionService.getSectionsByCourse(courseId);
      setSections(sectionsResponse.data?.data || []);
    } catch (err) {
      setError("Failed to fetch course details");
      console.error("Error fetching course data:", err);
    } finally {
      setLoading(false);
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

    setSaving(true);
    setError("");

    try {
      const response = await lectureService.createLecture(sectionId, lectureFormData);
      
      // Update sections to include new lecture
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
      setSaving(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    
    setSaving(true);
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
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading course details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div className="error-message">Course not found</div>;

  return (
    <div className="course-detail-page">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="course-hero">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{course.title}</h1>
            <p className="subtitle">{course.subtitle}</p>
            <div className="course-highlights">
              <span>⭐ 4.5 (320 reviews)</span>
              <span>👥 1.2K enrolled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content-wrapper">
        <div className="course-main">
          <section className="course-section">
            <h2>About this course</h2>
            <p>{course.description}</p>
          </section>

          <section className="course-section">
            <h2>Course Structure</h2>
            <div className="course-curriculum">
              {sections && sections.length > 0 ? (
                sections.map((section, index) => (
                  <div key={section._id} className="curriculum-section">
                    <div
                      className="section-header"
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === section._id ? null : section._id
                        )
                      }
                    >
                      <h3>
                        <span className="section-icon">
                          {expandedSection === section._id ? "▼" : "▶"}
                        </span>
                        {section.title}
                      </h3>
                      <span className="lecture-count">
                        {section.lectures?.length || 0} lectures
                      </span>
                    </div>

                    {expandedSection === section._id && (
                      <div className="section-lectures">
                        {section.lectures && section.lectures.length > 0 ? (
                          section.lectures.map((lecture) => (
                            <div key={lecture._id}>
                              <div
                                className="lecture-item"
                                onClick={() => setPlayingLectureId(lecture._id)}
                              >
                                <span className="lecture-icon">▶</span>
                                <span className="lecture-title">
                                  {lecture.title}
                                </span>
                                <span className="lecture-duration">
                                  {lecture.duration || "Video"} 
                                </span>
                                {currentUser && currentUser._id === course?.instructor?._id && (
                                  <button
                                    className="delete-lecture-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteLecture(lecture._id);
                                    }}
                                    disabled={saving}
                                    title="Delete lecture"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                              {playingLectureId === lecture._id && (
                                <div className="lecture-video-player">
                                  <video controls style={{ width: "100%", maxWidth: "600px" }}>
                                    <source src={lecture.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="no-lectures">
                            No lectures in this section
                          </p>
                        )}
                        
                        {currentUser && currentUser._id === course?.instructor?._id ?  (
                          showLectureForm === section._id ? (
                            <form
                              className="lecture-form"
                              onSubmit={(e) => handleAddLecture(e, section._id)}
                            >
                            <div className="form-group">
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
                                disabled={saving}
                                required
                              />
                            </div>

                            <div className="form-group">
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
                                disabled={saving}
                              />
                            </div>

                            <div className="form-group">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                  setLectureFormData({
                                    ...lectureFormData,
                                    video: e.target.files[0],
                                  })
                                }
                                disabled={saving}
                                required
                              />
                              {lectureFormData.video && (
                                <span className="file-name">
                                  {lectureFormData.video.name}
                                </span>
                              )}
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
                                  disabled={saving}
                                />
                                Preview (free for students)
                              </label>
                            </div>

                            <div className="form-actions">
                              <button
                                type="submit"
                                className="submit-btn"
                                disabled={saving}
                              >
                                {saving ? "Adding..." : "Add Lecture"}
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
                                disabled={saving}
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
                        )
                        ) : null}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No sections yet</p>
              )}
            </div>
          </section>

          <section className="course-section">
            <h2>What you'll learn</h2>
            <ul className="learning-points">
              <li>Master the fundamentals</li>
              <li>Build real-world projects</li>
              <li>Best practices and patterns</li>
              <li>Get certification upon completion</li>
            </ul>
          </section>
        </div>

        <div className="course-sidebar">
          <div className="course-card">
            <div className="course-price">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </div>

            <div className="course-details">
              <h3>Course Details</h3>
              <div className="detail-row">
                <span>Instructor:</span>
                <strong>{course.instructor?.fullName || "Unknown"}</strong>
              </div>
              <div className="detail-row">
                <span>Level:</span>
                <strong>{course.level}</strong>
              </div>
              <div className="detail-row">
                <span>Language:</span>
                <strong>{course.language}</strong>
              </div>
              <div className="detail-row">
                <span>Category:</span>
                <strong>{course.category?.name || "Uncategorized"}</strong>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <strong>{course.isPublished || "Draft"}</strong>
              </div>
            </div>

            <div className="course-stats">
              <div className="stat">
                <strong>1.2K</strong>
                <small>Students</small>
              </div>
              <div className="stat">
                <strong>{sections.reduce((total, s) => total + (s.lectures?.length || 0), 0)}</strong>
                <small>Lectures</small>
              </div>
              <div className="stat">
                <strong>12h 30m</strong>
                <small>Duration</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
