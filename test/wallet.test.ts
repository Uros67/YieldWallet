import { deployments, ethers } from "hardhat";
import {assert, expect} from "chai";
import { Wallet, IERC20, Dai, YDAI } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import "dotenv/config";

import { Address } from "hardhat-deploy/dist/types";


describe("Wallet", async function () {
    let wallet : Wallet;
    let dai: Dai;
    let yDai: YDAI;
    let deployer : SignerWithAddress;
    let guest: SignerWithAddress;

    
    beforeEach(async function () {
        const accounts= await ethers.getSigners();
        deployer= accounts[0];
        guest = accounts[1];

        await deployments.fixture("all");
        wallet= await ethers.getContract("Wallet", deployer);
        dai = await ethers.getContract("Dai", deployer);
        yDai= await ethers.getContract("yDAI", deployer);


    })
    describe("constructor", async function () {
        it("Sets stablecoin adress", async function () {
            const token = await wallet.getToken();
            const daiTokenAddress = await dai.getAddress();
            assert.equal(token, daiTokenAddress)
        })
        it("Sets stablecoin yearn finance token adress", async function () {
            const yToken = await wallet.getYToken();
            console.log(`yToken is: ${yToken}`);
            const yDaiTokenAddress = await yDai.getAddress();
            console.log(`yDaiTokenAddress is: ${yDaiTokenAddress}`);
            assert.equal(yToken, yDaiTokenAddress);
        })
    })
    describe("Change token", async function () {
        it("Should change token address", async function () {
            const response= await wallet.getToken();
            console.log(`Token address before change is: ${response}`);
            const tokenAddress: string  = process.env.USDC_TOKEN_ADDRESS!;
            console.log(`Token address after change is: ${tokenAddress}`);
            const yTokenAddress : string = process.env.Y_USDC_TOKEN_ADDRESS!;
            await wallet.changeToken(tokenAddress, yTokenAddress);
            const responseAfter = await wallet.getToken();
            assert.notEqual(response, responseAfter);
        })
        it("Should change yearn token address", async function () {
            const response = await wallet.getYToken();
            console.log(`YToken address before change is: ${response}`);
            const tokenAddress: string = process.env.USDC_TOKEN_ADDRESS!;
            const yTokenAddress: string = process.env.Y_USDC_TOKEN_ADDRESS!;
            console.log(`Token address after change is: ${yTokenAddress}`);
            await wallet.changeToken(tokenAddress, yTokenAddress);
            const responseAfter = await wallet.getYToken();

            assert.notEqual(response, responseAfter);
        })


    })
    it("Should check balance of dai token", async function () {
        await dai.mint(deployer, 3);
        const balanceDep= await dai.balanceOf(deployer);
        console.log(`Balance of DAI is :${balanceDep}`);
        // const yDai = await ethers.getContractAt("IYtoken", process.env.Y_DAI_TOKEN_ADDRESS!, deployer);
        const yDaiAddress= await yDai.getAddress();
        await dai.approve(yDaiAddress, 2);
        await yDai.deposit(2);
        const balanceYearn = await yDai.balanceOf(deployer);
        console.log(`Balance of yDAI is :${balanceYearn}`);

        assert.equal(balanceYearn, BigInt(2));
    })
    it("Should save DAI", async function () {
        await dai.mint(deployer, 3);
        await dai.approve(await wallet.getAddress(), 2);
        await wallet.save(2);
        const balance = await wallet.balance(); 
        console.log(`balance is: ${balance}`);
        assert.equal(balance, ethers.parseEther("2"));

    })
    it("Should spend yDai and update balance", async function () {
        await dai.mint(deployer, 3);
        await dai.approve(await wallet.getAddress(), 2);
        await wallet.save(2);
        const balance = await wallet.balance();
        console.log(`balance is: ${balance}`);
        await wallet.spend(1, guest);
        const remainingBalance = await wallet.balance();
        console.log(`remainingBalance is: ${remainingBalance}`);
        assert.isTrue(remainingBalance< balance);
    });
    it("Should spend yDai and send Dai to guest", async function () {
        await dai.mint(deployer, 3);
        await dai.approve(await wallet.getAddress(), 2);
        await wallet.save(2);
        const balance = await wallet.balance();
        console.log(`balance is: ${balance}`);
        await wallet.spend(1, guest);
        const guestBalanceDai = await dai.balanceOf(guest.address);
        console.log(`guestBalanceDai is: ${guestBalanceDai}`);
        assert.equal(guestBalanceDai, BigInt(1))
    })
})