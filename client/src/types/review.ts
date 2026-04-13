export interface Review {
  id: string;
  doctorId: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRatingBrief {
  averageRating: number;
  reviewCount: number;
}
