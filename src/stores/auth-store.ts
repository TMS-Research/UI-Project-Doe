// stores/authStore.ts
import axiosInstance from "@/app/api/axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, remember: boolean) => Promise<boolean>;
  saveUser: (user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      login: async (accessToken, remember) => {
        Cookies.set("accessToken", accessToken, {
          expires: remember ? 1 : undefined, // 30 hari kalau "remember"
        });

        set({ accessToken });

        try {
          const response = await axiosInstance.get("/users/me");
          const user = response.data;
          set({ user });
          return true;
        } catch (error) {
          console.error("Error fetching user:", error);
          return false;
        }
      },

      saveUser: (user: User) => {
        Cookies.set("user", JSON.stringify(user), {
          expires: 1,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null });
        Cookies.remove("accessToken");
        Cookies.remove("user");
      },

      initializeAuth: () => {
        const accessToken = Cookies.get("accessToken");
        const user = Cookies.get("user");

        if (accessToken && user) {
          try {
            const parsedUser = JSON.parse(user);
            set({ accessToken, user: parsedUser });
          } catch {
            // clear corrupted cookie
            Cookies.remove("accessToken");
            Cookies.remove("user");
          }
        }
      },
    }),
    {
      name: "auth-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);
