"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import riddleArtifact from "../../hardhat/artifacts/contracts/Riddle.sol/OnchainRiddle.json";
import Riddles from "../../riddles.js";

export const CONTRACT_ABI = riddleArtifact.abi;
export const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with your contract address

export default function Riddle() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcApiProvider | null>(
    null
  );
  const [riddle, setRiddle] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [answer, setAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState("");
  const [winner, setWinner] = useState<string | null>(null);

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
      setContract(_contract)

      console.log("Connected to contract: " + _contract?.runner.address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }
  /**
   * Loads the contract data and fetches the current riddle.
   *
   **/
  const loadContractData = async () => {
    try {
      const riddle = await contract!.riddle();

      if (!riddle) {
        //Find a random riddle from the list
        const {question, answer}:{question:string, answer:string} = selectRandomRiddle()
        console.log("Setting new riddle:", riddle);

        setRiddleInContract(question, answer);
      }
      console.log("Current Riddle:", riddle);
      setRiddle(riddle);
      // Update state or UI with the riddle
    } catch (err) {
      console.error("Failed to fetch riddle:", err);
    }
  };

  const setRiddleInContract = async (question: string, answer: string) => {
    try {
      const answerHash = ethers.keccak256(ethers.toUtf8Bytes(answer));

      const tx = await contract!.setRiddle(question, answerHash);
      await tx.wait();
      setRiddle(question);

      console.log("Riddle set successfully");

    } catch (err) {
      console.error("Failed to set riddle:", err);
    }
  };


  const submitAnswer = async () => {
    if (!contract || !answer) return;

    try {
      setAnswerStatus('Submitting answer...');

      const tx = await contract.submitAnswer(answer);
      await tx.wait();
      setAnswerStatus('Answer submitted!');
      setAnswer('');
    } catch (err) {
      console.error(err);
      setAnswerStatus('Error submitting answer');
    }
  };

    const selectRandomRiddle = () => {
    const riddlesLength = Riddles.length;
    const randomNumber = Math.floor(Math.random() * riddlesLength);

    const selectedRiddle = Riddles[randomNumber];
    return selectedRiddle;
  }

  // Set a new riddle if none exists
  const setRiddleHandler = async ()=>{
    const {question, answer} = selectRandomRiddle();
    await setRiddleInContract(question, answer);
  }

   useEffect(() => {
    if (!contract) return;

    //Load initial riddle or set a new one if not present
    loadContractData()

    contract.on("RiddleSet", () => {  
      //Reset last winner
      setWinner(null);

    }); 
    contract.on("AnswerAttempt", (user, correct) => {
      setAnswerStatus(
        `Attempt by ${user} — ${correct ? 'Correct!' : 'Incorrect.'}`
      );
    });

    contract.on("Winner", (user) => {
      // Set the winner and update the UI
      setWinner(user);

      // Set a new riddle 5 seconds after a winner is declared
      setTimeout(()=> setRiddleHandler(),5000);

      setAnswerStatus(`Riddle solved by ${user}`);
    });

    return () => {
      contract.removeAllListeners();
    };
  }, [contract]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6"> Riddle Game</h1>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Current Riddle:</h2>
          <p className="text-gray-300 italic">{"Riddle Question " + riddle}</p>
        </div>

        {winner && (
          <div className="bg-green-800 text-green-200 p-3 rounded-md">
            Winner: {winner}
          </div>
        )}
        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            // disabled={!account}
          />
          <button
            onClick={submitAnswer}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-lg font-medium"
          >
            Submit Answer
          </button>
        </div>

         {answerStatus && (
          <div className="mt-4 text-sm text-center text-gray-300">
            {answerStatus}
          </div>
        )}
      </div>
    </div>
  );
}
