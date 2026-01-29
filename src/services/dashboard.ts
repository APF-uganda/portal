import axios from "axios";
import { API_BASE_URL } from "../config/api";

/**
 * API response shape for total applications
 */
export interface TotalApplicationsResponse {
  total_applications: number;
}
export interface TotalMemberResponse {
  total_members: number;
}

/**
 * Fetch total applications count for dashboard
 */
export async function fetchTotalApplications(): Promise<number> {
  try {
    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get<TotalApplicationsResponse>(
      `${API_BASE_URL}/api/v1/total-applications/`,
      {
        headers,
        timeout: 30000,
      }
    );
    return response.data.total_applications;
  } catch (error) {
    console.error("Failed to fetch total applications", error);
    return 0;
  }
}


/**
 * Fetch total member count for dashboard
 */
export async function fetchTotalMembers(): Promise<number> {
  try {
    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get<TotalMemberResponse>(
      `${API_BASE_URL}/api/v1/total-members/`,
      {
        headers,
        timeout: 30000,
      }
    );
    return response.data.total_members;
  } catch (error) {
    console.error("Failed to fetch total members", error);
    return 0;
  }
}


