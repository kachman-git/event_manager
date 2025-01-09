export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // Full ISO-8601 datetime string
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[]; // Changed from optional to required
  rsvps?: RSVP[];
}

export interface Tag {
  id: string;
  name: string;
  eventId: string;
}

export interface RSVP {
  id: string;
  userId: string;
  eventId: string;
  status: "GOING" | "MAYBE" | "NOT_GOING";
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  location: string;
  date: string; // Full ISO-8601 datetime string
  tags: string[]; // Array of tag names
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  location?: string;
  date?: string; // Full ISO-8601 datetime string
  tags?: string[]; // Array of tag names
}

export interface CreateProfileDto {
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateProfileDto {
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface CreateTagDto {
  name: string;
  eventId: string;
}

export interface UpdateTagDto {
  name: string;
}

export interface EditUserDto {
  email?: string;
  name?: string;
}

export interface RSVPDto {
  eventId: string;
  status: "GOING" | "MAYBE" | "NOT_GOING";
}

export interface RSVPSummary {
  status: "GOING" | "MAYBE" | "NOT_GOING";
  count: number;
}

