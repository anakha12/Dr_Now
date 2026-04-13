import type { AxiosInstance } from "axios";

export const reviewApiService = {
  createReview: async (reviewData: { bookingId: string; rating: number; comment: string }, axios: AxiosInstance) => {
    const response = await axios.post("/reviews", reviewData);
    return response.data;
  },

  getDoctorReviews: async (doctorId: string, axios: AxiosInstance) => {
    const response = await axios.get(`/reviews/doctor/${doctorId}`);
    return response.data;
  },

  getDoctorRating: async (doctorId: string, axios: AxiosInstance) => {
    const response = await axios.get(`/reviews/doctor/${doctorId}/rating`);
    return response.data;
  },
};
