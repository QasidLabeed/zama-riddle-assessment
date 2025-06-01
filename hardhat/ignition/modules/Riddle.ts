import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Riddle", (m) => {
  const riddle = m.contract("OnchainRiddle");
  return { riddle };
});