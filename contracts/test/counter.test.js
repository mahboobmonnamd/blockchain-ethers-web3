const chai = require('chai');
const { ethers } = require('hardhat');

const {expect} = chai;

let contract = '';

describe('sample test', () => {
    before(async () => {
        const factory = await ethers.getContractFactory('Counter');
        contract = await factory.deploy();
    });
    it('do increment of the count', async () => {
        await contract.increment();
        const count = await contract.getCount();
        expect(count.toString()).equal("1");
    })
})