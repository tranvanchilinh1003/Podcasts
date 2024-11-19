import { API_ENDPOINT } from "../../../config/api-endpoint.config";
import axios from "axios";

export const getUserInfo = async (userId) => {
    try {
      if (!userId) {
        console.error("User ID is required to fetch user information.");
        return null;
      }
      const response = await axios.get(`${API_ENDPOINT.auth.base}/customers/noti/${userId}`);
      if (response.status === 200) {
        return response.data.data; 
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user information:", error.message);
      return null;
    }
  };
  
 
