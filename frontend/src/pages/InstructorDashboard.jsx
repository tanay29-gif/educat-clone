import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import "../styles/InstructorDashboard.css";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      console.log("🔄 Fetching my courses...");
      const response = await courseService.getMyCourses();
      console.log("📥 My courses response:", response);
      setCourses(response.data.data);
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      setError("Failed to delete course");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <h1>My Courses</h1>
        <button
          className="create-course-btn"
          onClick={() => navigate("/create-course")}
        >
          + Create New Course
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any courses yet.</p>
          <button
            className="create-course-btn"
            onClick={() => navigate("/create-course")}
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              className="course-card"
              onClick={() => navigate(`/course/${course._id}/manage`)} // Navigate to manage page
              style={{ cursor: 'pointer' }}
            >
              <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="course-subtitle">{course.subtitle}</p>
                <p className="course-status">
                  Status: <span className={course.isPublished}>{course.isPublished || "Draft"}</span>
                </p>
                <div className="course-meta">
                  <span className="level">{course.level}</span>
                  <span className="price">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                </div>
                <div className="course-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      navigate(`/course/${course._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDeleteCourse(course._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
