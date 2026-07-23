import { useState, useEffect } from "react";
import { courseService } from "../services/courseService";
import "../styles/Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    price: "",
    sort: "createdAt",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearching && searchQuery) {
      handleSearch();
    } else {
      fetchCourses();
    }
  }, [filters, page, isSearching, searchQuery]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.listCourses({
        page,
        limit: 12,
        ...filters,
      });
      console.log("Courses response:", response.data);
      setCourses(response.data?.data || []);
      setTotalPages(Math.ceil((response.data?.data?.length || 0) / 12));
    } catch  {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await courseService.searchCourses(searchQuery, page, 12);
      setCourses(response.data?.data || []);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setPage(1);
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Courses</h1>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          {isSearching && (
            <button type="button" onClick={handleClearSearch} className="clear-btn">
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="courses-container">
        <div className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="data">Data Science</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Level</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price</label>
            <select
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="createdAt">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>

        <div className="courses-grid-container">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="no-courses">
              <p>No courses found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="courses-grid">
                {courses.map((course) => (
                  <div key={course._id} className="course-card">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="course-thumbnail"
                    />
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p className="instructor">
                        By: {course.instructor?.name || "Unknown"}
                      </p>
                      <div className="course-meta">
                        <span className="rating">⭐ 4.5</span>
                        <span className="level">{course.level}</span>
                      </div>
                      <div className="course-footer">
                        <span className="price">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </span>
                        <a
                          href={`/course/${course._id}`}
                          className="view-btn"
                        >
                          View Course
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
