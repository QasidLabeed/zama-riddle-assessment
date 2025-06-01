"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Riddle() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    //Connect to wallet
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to play the game. Please install it.");
      return;
    }

    try {

      //Provider to the blockchain
      const _provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(_provider);

     //Signer to sign the transactions
      const _signer = await _provider.getSigner();
      setSigner(_signer);
      
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6"> Riddle Game</h1>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Current Riddle:</h2>
          <p className="text-gray-300 italic">{"Riddle Question"}</p>
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
