import {
  AuthDto,
  CreateEventDto,
  CreateProfileDto,
  UpdateEventDto,
  UpdateProfileDto,
  Event,
  Profile,
  AuthResponse,
  CreateTagDto,
  UpdateTagDto,
  EditUserDto,
  RSVPDto,
  RSVP,
  Tag,
  User,
  RSVPSummary,
  AuthDtoSignin,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

// Event API
export const eventApi = {
  getAll: (): Promise<Event[]> => fetchWithAuth("/events/all"),
  getMyEvents: (): Promise<Event[]> => fetchWithAuth("/events/me"),
  getById: (id: string): Promise<Event> => fetchWithAuth(`/events/${id}`),
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
};

// Profile API
export const profileApi = {
  getMyProfile: (): Promise<Profile> => fetchWithAuth("/profile/me"),
  getById: (id: string): Promise<Profile> => fetchWithAuth(`/profile/${id}`),
  create: (data: CreateProfileDto): Promise<Profile> =>
    fetchWithAuth("/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateProfileDto): Promise<Profile> =>
    fetchWithAuth(`/profile/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/profile/${id}`, {
      method: "DELETE",
    }),
  updateAvatar: async (userId: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append("file", file);

    return fetchWithAuth(`/profile/upload-avatar/${userId}`, {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};

// Auth API
export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const authApi = {
  signup: async (data: AuthDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      setAuthToken(result.access_token);
    }
    return result;
  },
  signin: async (data: AuthDtoSignin): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      setAuthToken(result.access_token);
    }
    return result;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};

// RSVP API
export const rsvpApi = {
  createOrUpdate: (data: RSVPDto): Promise<RSVP> =>
    fetchWithAuth("/rsvps", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getUserRSVPs: (): Promise<RSVP[]> => fetchWithAuth("/rsvps"),
  getByEvent: (eventId: string): Promise<RSVP> =>
    fetchWithAuth(`/rsvps/${eventId}`),
  getSummary: (eventId: string): Promise<RSVPSummary[]> =>
    fetchWithAuth(`/rsvps/events/${eventId}`),
};

// Tags API
export const tagsApi = {
  create: (data: CreateTagDto): Promise<Tag> =>
    fetchWithAuth("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByEvent: (eventId: string): Promise<Tag[]> =>
    fetchWithAuth(`/tags/${eventId}`),
  update: (id: string, data: UpdateTagDto): Promise<Tag> =>
    fetchWithAuth(`/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string): Promise<void> =>
    fetchWithAuth(`/tags/${id}`, {
      method: "DELETE",
    }),
};

// User API
export const userApi = {
  getMe: (): Promise<User> => fetchWithAuth("/users/me"),
  edit: (data: EditUserDto): Promise<User> =>
    fetchWithAuth("/users", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
