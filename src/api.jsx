import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './declarations/counter';

// Replace with your canister id
const canisterId = "YOUR_CANISTER_ID";

// Fetch root key for local development
async function getRootKey() {
  if (process.env.NODE_ENV !== "production") {
    return await HttpAgent.fetchRootKey();
  }
  return false;
}


// Create the actor object
const createActor = async (canisterId) => {
  const agentOptions = { host: "http://localhost:8000" }; // For local development

  if (process.env.NODE_ENV === "production") {
    agentOptions.host = "https://ic0.app"; // For production
  } else {
    agentOptions.host = "http://localhost:8000"; // For local development
    const rootKey = await getRootKey();
    agentOptions.source = new HttpAgent({ ...agentOptions, rootKey });
  }

  return Actor.createActor(idlFactory, {
    agentOptions,
    canisterId,
  });
};

// Initialize the actor
let actor;
createActor(canisterId).then(a => actor = a);

// API functions
const api = {

  // Example: Get all skills
  getAllSkills: async () => {
    try {
      return await actor.getAllSkills();
    } catch (error) {
      console.error("Error getting skills:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  },

  // Example: Create a new skill
  createSkill: async (skillData) => {
    try {
      return await actor.createSkill(skillData);
    } catch (error) {
      console.error("Error creating skill:", error);
      throw error;
    }
  },

  // ... other API methods (e.g., getSkillById, updateSkill, deleteSkill, etc.)
  getUsers: async () => {
    try {
      return await actor.getUsers();
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      return await actor.createUser(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // ... other user-related API methods
  getForums: async () => {
    try {
      return await actor.getForums();
    } catch (error) {
      console.error("Error getting forums:", error);
      throw error;
    }
  },

  createForum: async (forumData) => {
    try {
      return await actor.createForum(forumData);
    } catch (error) {
      console.error("Error creating forum:", error);
      throw error;
    }
  },

  // ... other forum-related API methods
  getOrCreateConversation: async (userId1, userId2) => {
    try {
      return await actor.getOrCreateConversation(userId1, userId2);
    } catch (error) {
      console.error("Error getting or creating conversation:", error);
      throw error;
    }
  },

  getMessages: async (conversationId) => {
    try {
      return await actor.getMessages(conversationId);
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  },

  sendMessage: async (conversationId, message) => {
    try {
      return await actor.sendMessage(conversationId, message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
  // ... other chat-related API methods
};


export default api;
