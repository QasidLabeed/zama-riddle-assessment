Add commentMore actions
#### Thought Process

**Smart Contract and UI**

We need an application that can connect with a smart contrat using it's address and ABI

The interaction will happen using Metamask while the web application will be based on NextJs

The Web Application will use Ether.js to send requests and listen to events on the blockchain

The smart contract will need to be deployed first for which I can either use an Ethereum test network and deploy it using infura RPC

OR the contract can be deployed locally using Hardhat for testing

**Riddle generation - the AI Bot**

To generate a new riddle, I'll use OpenAI GPT-4 model and will connect using OpenAI APIs
The prompt I'll be using will be 
> Give me a riddle with it's answer in JSON format having key question and answer

**Answer format**
```json
{
  "question": "The more you take, the more you leave behind. What am I?",
  "answer": "Footsteps"
}
```

## Coding Process

- Create a fresh nextjs application using `npx create-next-app@latest`
- Setup hardhat on the local project https://hardhat.org/hardhat-runner/docs/guides/project-setup 
- Add the provide smart contract into the codebase and compile it using `npx hardhat compile` to generate the ABI
- Add UI for Riddle Game  
- The Metamask connection is established using ethers library