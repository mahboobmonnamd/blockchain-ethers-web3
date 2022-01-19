import counter from '../contracts/artifacts/counter.sol/Counter.json';
import {Contract, ContractFactory, ethers, Wallet} from 'ethers';

const privateKey = '24b091a2f6e9d6e220e573a5b8d7a619f80d5cc57ca2eb3e712d1ec4d820e3b2';
const walletAddress = '0xB6F6F13Bb5b42CD9ba8c7025Ba6eC3cB66eB725e';

const provider = new ethers.providers.JsonRpcProvider('HTTP:127.0.0.1:7545');
const webSocketProvider = new ethers.providers.WebSocketProvider('ws:127.0.0.1:7545');

const wallet = new Wallet(privateKey, provider);
let contractAddress = '';

/**
 * use ethers to deploy contract
 */
const deployContract = async () => {
    const{abi, bytecode} = counter;

    const factory = new ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();

    const tx = await contract.deployTransaction;
    const result = await tx.wait();
    console.log("🚀 ~ file: ethers.js ~ line 23 ~ deployContract ~ result", result);
    contractAddress = result.contractAddress;
    increment();
}

const increment = async () => {
    // contractAddress = '';
    const {abi, bytecode} = counter;
    // can use wallet or signer. For deploy contract we used wallet, so here using signer
    const contract = new Contract(contractAddress, abi, provider.getSigner(walletAddress));
    await contract.increment();
    const count = await contract.getCount();
    console.log("🚀 ~ file: ethers.js ~ line 35 ~ increment ~ count", count.toString());
}

deployContract();


// Event listeners using socket connection
// https://docs.ethers.io/v5/api/providers/provider/#Provider--event-methods
webSocketProvider.on('open', async() => {
    console.log('Connection established');
});

webSocketProvider.on('closed', async() => {
    console.log('Connection closed');
});

webSocketProvider.on('block', async(log) => {
    console.log(await provider.getBlock(log));
})
