import axios from 'axios';
import { ApiResponse, Event, Location, User, Member, AuthResponse, MembershipApplication } from '@/lib/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Auth API ---
export const authAPI = {
  register: async (userData: { username: string, email: string, password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  },
  login: async (credentials: { email: string, password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },
};

// --- Locations API ---
export const locationsAPI = {
  getLocations: async (params?: { page?: number; limit?: number; query?: string; category?: string; lat?: number; lng?: number; radius?: number }): Promise<{ locations: Location[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ locations: Location[]; pagination: any }>>('/locations', { params });
    return response.data.data!;
  },
  getLocationById: async (id: string): Promise<Location> => {
    const response = await api.get<ApiResponse<{ location: Location }>>(`/locations/${id}`);
    return response.data.data!.location;
  },
};

// --- Events API ---
export const eventsAPI = {
  getEvents: async (params?: { page?: number; limit?: number; query?: string; category?: string; date?: string; }): Promise<{ events: Event[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ events: Event[]; pagination: any }>>('/events', { params });
    return response.data.data!;
  },
  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get<ApiResponse<{ event: Event }>>(`/events/${id}`);
    return response.data.data!.event;
  },
};

// --- Members API ---
export const membersAPI = {
  getFeaturedMembers: async (params?: { limit?: number }): Promise<{ members: Member[] }> => {
    // This endpoint doesn't exist yet on the backend, but we define the service for it.
    // It would fetch users with membershipStatus: 'plus_approved'.
    // For now, this will fail until the backend is updated.
    const response = await api.get<ApiResponse<{ members: Member[] }>>('/members/featured', { params });
    return response.data.data!;
  },
};

// --- Profile API ---
export const profileAPI = {
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/profile');
    return response.data.data!;
  },
  updateProfile: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put<ApiResponse<{ user: User }>>('/profile', data);
    return response.data.data!;
  },
  addToFavorites: async (type: 'events' | 'locations', itemId: string): Promise<any> => {
    const response = await api.post<ApiResponse>('/profile/favorites', { type, itemId });
    return response.data.data!;
  },
  removeFromFavorites: async (type: 'events' | 'locations', itemId: string): Promise<any> => {
    const response = await api.delete<ApiResponse>('/profile/favorites', { data: { type, itemId } });
    return response.data.data!;
  },
};

// --- Membership API ---
export const membershipAPI = {
  applyForMembership: async (applicationData: { instagramHandle?: string; bio: string; sampleWork?: string; }): Promise<MembershipApplication> => {
    const response = await api.post<ApiResponse<{ application: MembershipApplication }>>('/membership/apply', applicationData);
    return response.data.data!.application;
  },
  getApplicationStatus: async (): Promise<{ application: MembershipApplication | null }> => {
    const response = await api.get<ApiResponse<{ application: MembershipApplication | null }>>('/membership/status');
    return response.data.data!;
  },
  reviewApplication: async (applicationId: string, reviewData: { status: 'approved' | 'rejected', reviewNotes?: string }): Promise<MembershipApplication> => {
    const response = await api.patch<ApiResponse<{ application: MembershipApplication }>>(`/membership/applications/${applicationId}/review`, reviewData);
    return response.data.data!.application;
  },
};

// --- Search API ---
export const searchAPI = {
  search: async (params: { query: string; type?: 'events' | 'locations' | 'all'; page?: number; limit?: number; }): Promise<any> => {
    const response = await api.get<ApiResponse>('/search', { params });
    return response.data.data!;
  },
};

// --- Content (Reels) API ---
export const contentAPI = {
  // Methods for submitting and managing content will go here
};
