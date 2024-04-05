import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";


const deployMocks: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const dai = await deploy("Dai", {
        from: deployer,
        args: [31337],
        log: true,
    });
    console.log(`Dai contract is deployed to: ${dai.address}`);
    const yDai = await deploy("yDAI", {
        from: deployer,
        args: [dai.address],
        log: true,
    });
    console.log(`yDai contract is deployed to: ${yDai.address}`);

}

export default deployMocks;
deployMocks.tags = ["all", "wallet"]