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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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

// User API
export const userApi = {
  getMe: (): Promise<User> => fetchWithAuth("/users/me"),
  edit: (data: EditUserDto): Promise<User> =>
    fetchWithAuth("/users", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const profileApi = {
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
  getMyProfile: (): Promise<Profile> => fetchWithAuth("/profile/me"),
};

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

export const tagsApi = {
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
  getByEventId: (eventId: string): Promise<Tag[]> =>
    fetchWithAuth(`/tags/${eventId}`),
};

function setAuthToken(token: string) {
  localStorage.setItem("token", token);
}
