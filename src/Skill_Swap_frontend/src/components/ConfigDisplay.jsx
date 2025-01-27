// src/Skill_Swap_frontend/src/components/ConfigDisplay.jsx
import React from 'react';

const ConfigDisplay = () => {
  const dfxVersion = import.meta.env.VITE_DFX_VERSION;
  const dfxNetwork = import.meta.env.VITE_DFX_NETWORK;
  const canisterIdFrontend = import.meta.env.VITE_CANISTER_ID_SKILL_SWAP_FRONTEND;
  const canisterIdBackend = import.meta.env.VITE_CANISTER_ID_SKILL_SWAP_BACKEND;
  const canisterId = import.meta.env.VITE_CANISTER_ID;
  const canisterCandidPath = import.meta.env.VITE_CANISTER_CANDID_PATH;

  console.log('DFX Version:', dfxVersion);
  console.log('DFX Network:', dfxNetwork);
  console.log('Frontend Canister ID:', canisterIdFrontend);
  console.log('Backend Canister ID:', canisterIdBackend);
  console.log('Canister ID:', canisterId);
  console.log('Canister Candid Path:', canisterCandidPath);

  return (
    <div>
      <h2>Configuration Details</h2>
      <p>DFX Version: {dfxVersion}</p>
      <p>DFX Network: {dfxNetwork}</p>
      <p>Frontend Canister ID: {canisterIdFrontend}</p>
      <p>Backend Canister ID: {canisterIdBackend}</p>
      <p>Canister ID: {canisterId}</p>
      <p>Canister Candid Path: {canisterCandidPath}</p>
    </div>
  );
};

export default ConfigDisplay;
