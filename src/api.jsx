import { Actor, HttpAgent } from "@dfinity/agent";
import { canisterId, idlFactory } from "./declarations/Skill_Swap_backend"; // Ensure these are correctly imported

// Configuration for local development
const localHost = "http://localhost:4943";
const host = localHost;

// Create agent configuration
const createSkillSwapActor = (canisterId, options = {}) => {
  const agent = new HttpAgent({
    host: host,
    ...options?.agentOptions
  });

  // Only fetch root key when in development
  if (host === localHost) {
    agent.fetchRootKey(); // Correct usage
  }

  // Create actor with proper configuration
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions
  });
};

// Initialize the agent
const initializeAgent = async () => {
  const agent = new HttpAgent({ host });
  
  if (host === localHost) {
    await agent.fetchRootKey(); // Correct usage
  }
  
  return agent;
};

// Export the configured actor
export const skillSwapActor = createSkillSwapActor(canisterId);
