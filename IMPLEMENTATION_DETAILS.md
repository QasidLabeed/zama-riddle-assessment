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

BUT considering this option will require paid plan for OpenAI, I'll be shifting to generating Riddles in advance and storing them in the App.

On runtime, the bot can pick a random one from the list as the next riddle.

The riddles are available in `riddles.js` file

Once the Bot is setup based on local file then the rest of the process was to include listeners for the 3 events in the smart contract and based on those events, update the states accordingly 

So intially when the Riddle is set the logic is to clear out the old winner if ther is any

While when an answer is attempted the state just updates the UI based on the answer being correct or not

And lastly the Winner event allows us to declare the event and then proceed with selecting a new riddle from the list


## Coding Process

- Create a fresh nextjs application using `npx create-next-app@latest`
- Setup hardhat on the local project https://hardhat.org/hardhat-runner/docs/guides/project-setup 
- Add the provide smart contract into the codebase and compile it using `npx hardhat compile` to generate the ABI
- Add UI for Riddle Game  
- The Metamask connection is established using ethers library
6. Add Riddle.ts under ignition/modules 
7. Deploy contract on localhost using `npx hardhat ignition deploy ./ignition/modules/Riddle.ts --network localhost`
8. Add logic to retrieve and set new Riddles
9. Add listeners for smart contract events for AnswerAttempted, Winner or RiddleSet



#### Possible Enhancements with more time
This is an initial version of the Riddle App which can be improved further with additional effort 
1. The User interface can be further enhanced with
1. The validation for the availability of accounts in the wallet can be added
3. Form validations like when a user has won and a new riddle is not set - the input field or the submit button should be disabled.
2. The Winner message can be upgraded based on if the same user who answered and won worses other players
3. The smart contract can be deployed on a testnet for testing across various devices
