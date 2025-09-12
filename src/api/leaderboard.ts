import api from "axios";
import type { AxiosResponse } from "axios";
import { API_URL } from "../config/api.config";

export interface User {
  username: string;
  score: number;
}

export interface UsersResponse {
  success: boolean
  error?: string
  errorCode?: number
  top10: User[]
}

/**
 * Get leaderboard
 * GET /leaderboard
 **/
export function getLeaderboard(): Promise<User[]> {
  return api.get<UsersResponse>(`${API_URL}/score/top10`)
    .then((response: AxiosResponse<UsersResponse>) => response.data.top10)
}