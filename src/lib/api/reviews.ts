// User Reviews API
export interface UserReview {
  id: string;
  userName: string;
  userAvatar?: string;
  lawyerName: string;
  lawyerSpecialty: string;
  title: string;
  content: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  serviceType: string;
  verified: boolean;
}

// Mock user reviews
const mockReviews: UserReview[] = [
  {
    id: 'rev-001',
    userName: 'Ahmad Ismail',
    lawyerName: 'Dato\' Ahmad bin Abdullah',
    lawyerSpecialty: 'Property Law',
    title: 'Excellent Property Law Service',
    content: 'The lawyer was very professional and helped me resolve my property dispute quickly. Highly recommended!',
    rating: 5,
    comment: 'Excellent service! The lawyer was very professional and helped me resolve my property dispute quickly.',
    date: '2024-01-20',
    location: 'Kuala Lumpur',
    serviceType: 'Property Law',
    verified: true,
  },
  {
    id: 'rev-002',
    userName: 'Sarah Tan',
    lawyerName: 'Puan Siti Nurhaliza',
    lawyerSpecialty: 'Family Law',
    title: 'Professional Family Law Consultation',
    content: 'Very satisfied with the legal consultation. Clear explanations and reasonable pricing. Would definitely recommend.',
    rating: 5,
    comment: 'Very satisfied with the legal consultation. Clear explanations and reasonable pricing.',
    date: '2024-01-18',
    location: 'Penang',
    serviceType: 'Family Law',
    verified: true,
  },
  {
    id: 'rev-003',
    userName: 'Kumar Raj',
    lawyerName: 'Mr. Rajesh Kumar',
    lawyerSpecialty: 'Business Law',
    title: 'Knowledgeable Business Lawyer',
    content: 'Good experience overall. The lawyer was knowledgeable and responsive to all my business law queries.',
    rating: 4,
    comment: 'Good experience overall. The lawyer was knowledgeable and responsive.',
    date: '2024-01-15',
    location: 'Johor',
    serviceType: 'Business Law',
    verified: true,
  },
  {
    id: 'rev-004',
    userName: 'Nurul Huda',
    lawyerName: 'Puan Nurul Izzah',
    lawyerSpecialty: 'Employment Law',
    title: 'Great Employment Law Service',
    content: 'Highly recommend! Professional service and great results. Helped me with my employment dispute efficiently.',
    rating: 5,
    comment: 'Highly recommend! Professional service and great results.',
    date: '2024-01-12',
    location: 'Selangor',
    serviceType: 'Employment Law',
    verified: true,
  },
  {
    id: 'rev-005',
    userName: 'David Wong',
    lawyerName: 'Mr. Wong Kah Wai',
    lawyerSpecialty: 'Corporate Law',
    title: 'Outstanding Corporate Legal Advice',
    content: 'Outstanding legal advice. Very helpful and patient in explaining complex legal matters. Excellent service!',
    rating: 5,
    comment: 'Outstanding legal advice. Very helpful and patient in explaining complex legal matters.',
    date: '2024-01-10',
    location: 'Kuala Lumpur',
    serviceType: 'Corporate Law',
    verified: true,
  },
  {
    id: 'rev-006',
    userName: 'Fatimah Ali',
    lawyerName: 'Puan Fatimah binti Ali',
    lawyerSpecialty: 'Property Law',
    title: 'Fair and Professional Service',
    content: 'Good service and fair pricing. Would use again for future property matters. Very satisfied with the outcome.',
    rating: 4,
    comment: 'Good service and fair pricing. Would use again.',
    date: '2024-01-08',
    location: 'Melaka',
    serviceType: 'Property Law',
    verified: true,
  },
];

// Fetch all reviews
export async function fetchReviews(limit?: number): Promise<UserReview[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (limit) {
    return mockReviews.slice(0, limit);
  }
  
  return mockReviews;
}

// Fetch reviews by service type
export async function fetchReviewsByService(serviceType: string): Promise<UserReview[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockReviews.filter(r => r.serviceType === serviceType);
}

// Calculate average rating
export function calculateAverageRating(reviews: UserReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

// Fetch top reviews
export async function fetchTopReviews(limit: number = 6): Promise<UserReview[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockReviews
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Fetch review statistics
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export async function fetchReviewStats(): Promise<ReviewStats> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const totalReviews = mockReviews.length;
  const averageRating = calculateAverageRating(mockReviews);
  
  const ratingDistribution = {
    5: mockReviews.filter(r => r.rating === 5).length,
    4: mockReviews.filter(r => r.rating === 4).length,
    3: mockReviews.filter(r => r.rating === 3).length,
    2: mockReviews.filter(r => r.rating === 2).length,
    1: mockReviews.filter(r => r.rating === 1).length,
  };
  
  return {
    totalReviews,
    averageRating,
    ratingDistribution,
  };
}
