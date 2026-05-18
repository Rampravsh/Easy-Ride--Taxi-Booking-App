export interface RideReview {
  _id?: string;
  rideId: string;
  reviewerId?: string;
  receiverId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}
