"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import riddleArtifact from "../../hardhat/artifacts/contracts/Riddle.sol/OnchainRiddle.json";

export const CONTRACT_ABI = riddleArtifact.abi;
export const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with your contract address

export default function Riddle() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcApiProvider | null>(
    null
  );
  const [riddle, setRidle] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    //Connect to wallet
    connectWallet();
  }, []);

  const connectWallet = async () => {

    try {
      const _provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      setProvider(_provider);
      // Get first account from local node (unlocked by default)
      const _signer = await _provider.getSigner(0);
      setSigner(_signer);

      const _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        _signer
      );
       setContract(_contract);

      console.log("Connected to contract: " + _contract?.runner.address);


      if (_contract) {
        // Load contract data
        loadContractData(_contract);
      }

    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }
  /**
   * Loads the contract data and fetches the current riddle.
   *
   **/
  const loadContractData = async (contractInstance: ethers.Contract) => {
    try {
      const riddle = await contractInstance.riddle();

      if (!riddle) {
        setRiddle(contractInstance, "Question", "Answer");
      }
      console.log("Current Riddle:", riddle);
      setRidle(riddle);
      // Update state or UI with the riddle
    } catch (err) {
      console.error("Failed to fetch riddle:", err);
    }
  };

  const setRiddle = async (
    contractInstance: ethers.Contract,
    question: string,
    answer: string
  ) => {
    try {
      const answerHash = ethers.keccak256(ethers.toUtf8Bytes(answer));

      const tx = await contractInstance.setRiddle(question, answerHash);
      await tx.wait();
      console.log("Riddle set successfully");

    } catch (err) {
      console.error("Failed to set riddle:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6"> Riddle Game</h1>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Current Riddle:</h2>
          <p className="text-gray-300 italic">{"Riddle Question" + riddle}</p>
        </div>

        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
            placeholder="Enter your answer"
            value={"Answer"}
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-lg font-medium">
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}
