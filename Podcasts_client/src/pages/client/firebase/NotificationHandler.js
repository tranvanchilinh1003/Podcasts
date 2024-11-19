// addNotification.js
import { getDatabase, onValue, ref, push, remove, get } from "firebase/database"; // Import các hàm cần thiết từ Firebase
import { getUserInfo } from "../../../layouts/client/component/getUserInfo";

export const addNotification = async (userId, senderId, postId, action, database) => {
    try {
      // Thêm thông báo vào Firebase Realtime Database với push để tự tạo ID
      await push(ref(database, 'notifications/'), {
        created_at: new Date().toISOString(),
        isread: "active",
        post_id: postId,
        sender_id: senderId,
        type: action, // "like", "comment", "follow", ...
        user_id: userId,
      });
  
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  export const deleteNotification = async (
    notificationId,
    database,
    setNotifications
  ) => {
    try {
      if (!notificationId) {
        console.error("Notification ID is missing.");
        return;
      }
  
      const notificationRef = ref(database, `notifications/${notificationId}`);
      // Kiểm tra thông báo có tồn tại hay không
      const snapshot = await get(notificationRef);
      if (!snapshot.exists()) {
        console.error(`Notification with ID ${notificationId} does not exist.`);
        console.log("Snapshot value:", snapshot.val());
        return;
      }
      await remove(notificationRef);
  
      if (setNotifications) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.id !== notificationId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error.message);
    }
  };

  export const findNotificationIdByPostId = async (postId) => {
    try {
      const database = getDatabase();
      const notificationsRef = ref(database, "notifications");
      
      const snapshot = await get(notificationsRef);
      if (!snapshot.exists()) {
        console.error("No notifications found.");
        return null;
      }
  
      const data = snapshot.val();
      const notificationEntry = Object.entries(data).find(
        ([key, value]) => value.post_id === postId
      );
  
      if (notificationEntry) {
        const [notificationId] = notificationEntry; // Lấy notificationId từ cặp [key, value]
        return notificationId;
      } else {
        console.error(`Notification for postId ${postId} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error finding notificationId by postId:", error);
      return null;
    }
  };

  export const findNotificationIdByType = async (type, userId, senderId) => {
    try {
        const db = getDatabase();
        const notificationsRef = ref(db, "notifications");

        const snapshot = await get(notificationsRef);

        if (!snapshot.exists()) {
            console.error("No notifications found.");
            return null;
        }

        const data = snapshot.val();
        const notificationEntry = Object.entries(data).find(
            ([key, value]) =>
                value.type === type &&
                value.user_id === userId &&
                value.sender_id === senderId
        );

        if (notificationEntry) {
            const [notificationId] = notificationEntry; // Lấy `notificationId`
            return notificationId;
        } else {
            console.error(`Notification with type "${type}" not found.`);
            return null;
        }
    } catch (error) {
        console.error("Error finding notificationId by type:", error);
        return null;
    }
};

  const fetchNotification = async (setNotifications, setLoading) => {
    const getUserFromLocalStorage = () => {
      const userArray = JSON.parse(localStorage.getItem("customer"));
      return userArray && userArray.length > 0 ? userArray[0] : null;
    };
  
    const userCache = {}; // Cache để lưu thông tin user
  
    try {
      setLoading(true);
      const customer = getUserFromLocalStorage();
      const userId = customer ? customer.id : null;
  
      if (!userId) {
        console.error("User ID not found in local storage");
        setNotifications([]);
        return;
      }
  
      const db = getDatabase();
      const notificationsRef = ref(db, `notifications`); // Reference all notifications at the root level
  
      onValue(notificationsRef, async (snapshot) => {
        const data = snapshot.val();
  
        if (data) {
          // Lấy danh sách thông báo của user hiện tại
          const userNotifications = Object.entries(data)
            .filter(([key, notification]) => notification.user_id === userId)
            .map(([id, notification]) => ({
              id, // Include the key as the notification ID
              ...notification,
            }));
  
          // Lấy thông tin user cho từng notification.user_id
          const notificationsWithUserInfo = await Promise.all(
            userNotifications.map(async (notification) => {
              // Kiểm tra trong cache trước khi gọi API
              if (!userCache[notification.sender_id]) {
                const userInfo = await getUserInfo(notification.sender_id); // Lấy thông tin user từ API
                userCache[notification.sender_id] = userInfo || { username: "Unknown User", images: "default-image.png" };
              }
  
              return {
                ...notification,
                username: userCache[notification.sender_id]?.username || "Unknown User", // Thêm username từ cache
                images: userCache[notification.sender_id]?.images || "default-image.png", // Thêm ảnh từ cache
              };
            })
          );
  
          // Cập nhật trạng thái thông báo (isread)
          const readNotifications = JSON.parse(localStorage.getItem("readNotifications")) || [];
          const notificationsWithReadStatus = notificationsWithUserInfo.map((notification) => ({
            ...notification,
            read: readNotifications.includes(notification.id),
          }));
  
          setNotifications(notificationsWithReadStatus); // Cập nhật state với thông báo đã bổ sung thông tin người dùng
        } else {
          setNotifications([]); // No notifications
        }
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false); // Loading complete
    }
  };
  
  
export default fetchNotification;