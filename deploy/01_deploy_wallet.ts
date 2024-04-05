import {DeployFunction} from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

const  deployWallet : DeployFunction =async function (hre: HardhatRuntimeEnvironment) {
    const {getNamedAccounts, deployments, network} = hre;
    const {deploy, log}= deployments;
    const {deployer} = await getNamedAccounts();

    const dai = await ethers.getContract("Dai", deployer);
    const yDai = await ethers.getContract("yDAI", deployer);

    const daiAddress= await dai.getAddress();
    const yDaiAddress = await yDai.getAddress();


    const wallet= await deploy("Wallet", {
        from: deployer,
        args: [daiAddress, yDaiAddress],
        log: true,
    });
    console.log(`Wallet contract is deployed to: ${wallet.address}`);

}

export default deployWallet;
deployWallet.tags=["all", "wallet"]