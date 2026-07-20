import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import apiClient from "../services/api";

/**
 * Custom React Hook to check and restore active user session on app launch
 */
export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const response = await apiClient.get("/user/currentData");
        
        // Populate Redux state if valid session is returned
        if (response.data?.user) {
          dispatch(setCredentials(response.data.user));
        }
      } catch (error) {
        // Safe to ignore on initial load (user might just be unauthenticated)
        console.log("No active user session initialized.");
      }
    };

    fetchActiveSession();
  }, [dispatch]);
};

export default useAuthInit;
