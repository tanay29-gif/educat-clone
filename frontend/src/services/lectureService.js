import api from "./api";

export const lectureService = {
  // Create a new lecture in a section
  createLecture: (sectionId, lectureData) => {
    const formData = new FormData();
    
    // Add form fields
    formData.append("title", lectureData.title);
    formData.append("order", lectureData.order);
    
    if (lectureData.isPreview) {
      formData.append("isPreview", lectureData.isPreview);
    }
    
    // Add video file if exists
    if (lectureData.video) {
      formData.append("video", lectureData.video);
    }
    
    return api.post(`/lectures/${sectionId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update lecture details
  updateLecture: (lectureId, lectureData) =>
    api.put(`/lectures/${lectureId}`, lectureData),

  // Delete a lecture
  deleteLecture: (lectureId) =>
    api.delete(`/lectures/${lectureId}`),

  // Get lecture by ID
  getLectureById: (lectureId) =>
    api.get(`/lectures/${lectureId}`),
};
