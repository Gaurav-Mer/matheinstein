/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { auth } from "./firebaseClient";

// Helper: wait for current user to be available
const getCurrentUser = (): Promise<any> => {
    return new Promise((resolve) => {
        const user = auth.currentUser;
        if (user) resolve(user);
        else {
            const unsubscribe = auth.onAuthStateChanged((u) => {
                unsubscribe();
                resolve(u);
            });
        }
    });
};

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use(async (config) => {
    if (typeof window !== "undefined" && config.headers) {
        const user = await getCurrentUser();
        if (user) {
            const token = await user.getIdToken(); // always fresh
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
