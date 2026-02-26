import api from "./api";

export const courseService = {
  createCourse: (courseData) => {
    const formData = new FormData();
    Object.keys(courseData).forEach((key) => {
      if (key === "thumbnail" && courseData[key]) {
        formData.append(key, courseData[key]);
      } else if (key === "category") {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    });
    return api.post("/courses/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateCourseDetails: (courseId, courseData) =>
    api.put(`/courses/${courseId}`, courseData),

  updateCourseThumbnail: (courseId, file) => {
    const formData = new FormData();
    formData.append("thumbnail", file);
    return api.put(`/courses/${courseId}/thumbnail`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  publishCourse: (courseId) => api.post(`/courses/${courseId}/publish`),

  listCourses: (params) => api.get("/courses", { params }),

  getCourseDetail: (courseId) => api.get(`/courses/${courseId}/profile`),

  searchCourses: (query, page = 1, limit = 10) =>
    api.get("/courses/search", { params: { q: query, page, limit } }),

  getMyCourses: () => api.get("/courses/instructor/my-courses"),

  getEnrolledCourses: () => api.get("/courses/student/enrolled"),

  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
};
