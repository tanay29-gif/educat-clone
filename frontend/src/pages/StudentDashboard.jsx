import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import { courseService } from "../services/courseService";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getEnrolledCourses();
      setEnrolledCourses(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      setError("Failed to load your courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName}! 👋</h1>
        <p className="subtitle">Your Learning Journey</p>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div className="dashboard-content">
        <div className="courses-section">
          <h2>My Enrolled Courses ({enrolledCourses.length})</h2>

          {enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't enrolled in any courses yet.</p>
              <button
                className="explore-btn"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {enrolledCourses.map((course) => (
                <div key={course._id} className="course-card">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="course-thumbnail"
                    />
                  )}
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p className="instructor">by {course.instructor?.fullName}</p>
                    <div className="progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${course.progress || 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress || 0}%</span>
                    </div>
                    <button
                      className="continue-btn"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-sidebar">
          <div className="sidebar-card">
            <h3>Quick Stats</h3>
            <div className="stat">
              <span>Courses Enrolled:</span>
              <strong>{enrolledCourses.length}</strong>
            </div>
            <div className="stat">
              <span>Learning Hours:</span>
              <strong>
                {enrolledCourses.reduce(
                  (total, course) => total + (course.totalHours || 0),
                  0
                )}
              </strong>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Quick Links</h3>
            <button onClick={() => navigate("/courses")} className="link-btn">
              Browse More Courses
            </button>
            <button onClick={() => navigate("/profile")} className="link-btn">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
