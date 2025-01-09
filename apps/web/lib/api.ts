import {
  CreateEventDto,
  UpdateEventDto,
  Event,
  CreateTagDto,
  UpdateTagDto,
  Tag,
  AuthDto,
  AuthResponse,
  CreateProfileDto,
  UpdateProfileDto,
  Profile,
  EditUserDto,
  User,
  RSVPDto,
  RSVP,
  RSVPSummary,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return response.json();
}

// Auth API
function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

export const authApi = {
  signup: async (data: AuthDto): Promise<AuthResponse> => {
    const response = await fetchWithAuth("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    saveToken(response.access_token);
    return response;
  },
  signin: async (data: AuthDto): Promise<AuthResponse> => {
    const response = await fetchWithAuth("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
    saveToken(response.access_token);
    return response;
  },
  logout: (): void => {
    localStorage.removeItem("token");
  },
};

// User API
export const userApi = {
  getMe: (): Promise<User> => fetchWithAuth("/users/me"),
  edit: (data: EditUserDto): Promise<User> =>
    fetchWithAuth("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Profile API
export const profileApi = {
  getMyProfile: (): Promise<Profile> => fetchWithAuth("/profiles/me"),
  create: (data: CreateProfileDto): Promise<Profile> =>
    fetchWithAuth("/profiles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateProfileDto): Promise<Profile> =>
    fetchWithAuth(`/profiles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Event API
export const eventApi = {
  create: (data: CreateEventDto): Promise<Event> =>
    fetchWithAuth("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateEventDto): Promise<Event> =>
    fetchWithAuth(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/events/${id}`, {
      method: "DELETE",
    }),
  getAll: (): Promise<Event[]> => fetchWithAuth("/events"),
  getById: (id: string): Promise<Event> => fetchWithAuth(`/events/${id}`),
  getMyEvents: (): Promise<Event[]> => fetchWithAuth("/events/my-events"),
  addTag: (eventId: string, tagName: string): Promise<Event> =>
    fetchWithAuth(`/events/${eventId}/tags`, {
      method: "POST",
      body: JSON.stringify({ name: tagName }),
    }),
  removeTag: (eventId: string, tagId: string): Promise<Event> =>
    fetchWithAuth(`/events/${eventId}/tags/${tagId}`, {
      method: "DELETE",
    }),
};

// Tag API
export const tagApi = {
  create: (data: CreateTagDto): Promise<Tag> =>
    fetchWithAuth("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateTagDto): Promise<Tag> =>
    fetchWithAuth(`/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/tags/${id}`, {
      method: "DELETE",
    }),
  getAll: (): Promise<Tag[]> => fetchWithAuth("/tags"),
  getByEventId: (eventId: string): Promise<Tag[]> =>
    fetchWithAuth(`/tags/event/${eventId}`),
};

// RSVP API
export const rsvpApi = {
  createOrUpdate: (data: RSVPDto): Promise<RSVP> =>
    fetchWithAuth("/rsvps", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByEventId: (eventId: string): Promise<RSVP[]> =>
    fetchWithAuth(`/rsvps/event/${eventId}`),
  getUserRSVPs: (): Promise<RSVP[]> => fetchWithAuth("/rsvps/user"),
  getSummary: (eventId: string): Promise<RSVPSummary[]> =>
    fetchWithAuth(`/rsvps/summary/${eventId}`),
};
