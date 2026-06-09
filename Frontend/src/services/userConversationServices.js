import { USER_CONVERSATION_API } from "../config/config";
import api from "../utils/axios";

const fetchUserConversationDetails = async ({ userId, convoId }) => {
  try {
    const response = await api.get(
      `${USER_CONVERSATION_API.fetch}/${userId}/${convoId}`,
      { withCredentials: true }
    );
    return response.data.userConvo;
  } catch (error) {
    console.error("Error fetching user details for this conversation.", error.message);
    throw error;
  }
};

const updateUserConversationDetails = async ({ userId, convoId, role, lastReadAt, mutedUntil, pinned }) => {
  try {
    const payload = {};

    if (role !== undefined) payload.role = role;
    if (lastReadAt !== undefined) payload.lastReadAt = lastReadAt;
    if (mutedUntil !== undefined) payload.mutedUntil = mutedUntil;
    if (pinned !== undefined) payload.pinned = pinned;

    const response = await api.patch(
      `${USER_CONVERSATION_API.update}/${userId}/${convoId}`,
      payload,
      { withCredentials: true }
    );

    return response.data; // return updated object
  } catch (error) {
    console.error("Error updating user details for this conversation.", error.message);
    throw error;
  }
};

export {
  fetchUserConversationDetails,
  updateUserConversationDetails,
};
