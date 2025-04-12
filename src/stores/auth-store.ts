// stores/authStore.ts
import axiosInstance from "@/app/api/axios";
import { queryClient } from "@/lib/react-query";
import Cookies from "js-cookie";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, remember: boolean) => void;
  saveUser: (user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  login: async (accessToken, remember) => {
    Cookies.set("accessToken", accessToken, {
      expires: remember ? 1 : undefined, // 30 hari kalau "remember"
      secure: true,
      sameSite: "Strict",
    });

    set({ accessToken });

    queryClient
      .fetchQuery({
        queryKey: ["user"],
        queryFn: async () => {
          console.log("Login - Making /users/me request with token:", Cookies.get("accessToken"));
          const response = await axiosInstance.get("/courses");
          console.log("Login - Response:", response);
          return response.data;
        },
      })
      .then((user) => {
        set({ user });
        // router.push("/dashboard");
      });
  },

  saveUser: (user: User) => {
    Cookies.set("user", JSON.stringify(user), {
      expires: 1,
      secure: true,
      sameSite: "Strict",
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
}));
