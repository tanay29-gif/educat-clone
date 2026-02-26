import api from "./api";

export const userService = {
  register: (formData) => api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

  login: (credentials) => api.post("/users/login", credentials),

  logout: () => api.post("/users/logout"),

  getCurrentUser: () => api.get("/users/profile"),

  updateProfile: (profileData) => api.put("/users/profile", profileData),

  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.put("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  changePassword: (passwords) => api.post("/users/change-password", passwords),

  deleteUser: () => api.delete("/users/:id"),

  refreshAccessToken: () => api.post("/users/refresh-token"),
};
