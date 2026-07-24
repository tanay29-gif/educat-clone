import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { courseService } from "../services/courseService";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
} from "@mui/material";
import CourseCard from "../components/CourseCard";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      handleSearch(query, page);
    } else {
      fetchCourses();
    }
  }, [filters, page, searchParams]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.listCourses({
        page,
        limit: 12,
        ...filters,
      });
      setCourses(response.data?.data || []);
      setTotalPages(Math.ceil((response.data?.data?.length || 0) / 12));
    } catch {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, pageNum) => {
    setLoading(true);
    try {
      const response = await courseService.searchCourses(query, pageNum, 12);
      setCourses(response.data?.data || []);
      setTotalPages(Math.ceil((response.data?.total || 0) / 12));
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
    setSearchParams({ search: searchQuery });
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Explore Courses
      </Typography>
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          label="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
        {searchParams.get("search") && (
          <Button variant="outlined" onClick={handleClearSearch}>
            Clear
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select name="category" value={filters.category} onChange={handleFilterChange} label="Category">
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="web">Web Development</MenuItem>
                <MenuItem value="mobile">Mobile Development</MenuItem>
                <MenuItem value="data">Data Science</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="business">Business</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Level</InputLabel>
              <Select name="level" value={filters.level} onChange={handleFilterChange} label="Level">
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Price</InputLabel>
              <Select name="price" value={filters.price} onChange={handleFilterChange} label="Price">
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort By</InputLabel>
              <Select name="sort" value={filters.sort} onChange={handleFilterChange} label="Sort By">
                <MenuItem value="createdAt">Newest</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : courses.length === 0 ? (
            <Typography>No courses found. Try adjusting your filters.</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {courses.map((course) => (
                  <Grid item key={course._id} xs={12} sm={6} md={4}>
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

