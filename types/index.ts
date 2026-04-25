export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  location: string;
  rating: number;
  reviews: number;
  experience: number;
  languages: string[];
  rate: number;
  currency: string;
  bio: string;
  education: Education[];
  certifications: string[];
  availability: Availability[];
  image: string;
  verified: boolean;
  createdAt: Date;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Availability {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "lawyer" | "admin";
  image?: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  clientId: string;
  lawyerId: string;
  date: Date;
  time: string;
  duration: number;
  type: "video" | "audio" | "chat";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  lawyerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface PracticeArea {
  id: string;
  name: string;
  nameMs: string;
  nameZh: string;
  description: string;
  icon: string;
}
