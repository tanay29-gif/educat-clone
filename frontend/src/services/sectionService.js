import api from "./api";

export const sectionService = {
  // Create a new section for a course
  createSection: (courseId, sectionData) =>
    api.post(`/sections/course/${courseId}`, sectionData),

  // Get all sections for a course
  getSectionsByCourse: (courseId) =>
    api.get(`/sections/course/${courseId}`),

  // Update a section
  updateSection: (sectionId, sectionData) =>
    api.put(`/sections/${sectionId}`, sectionData),

  // Delete a section
  deleteSection: (sectionId) =>
    api.delete(`/sections/${sectionId}`),
};
