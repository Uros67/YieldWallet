// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IYtoken.sol";

/**
 * @title Contract implemented for yield earning wallet
 * @author Uros Djordjevic
 * @notice depositing assets to Yearn finance vaults
 * @dev Used mock contracts of DAI and YDAI for testing
 * @dev In YDAI mock contract address of DAI contract is changed to mock DAI contract
 */

contract Wallet {
    /**
     * @notice address of admin
     */
    address admin;

/**
 * @notice interface for ERC20 token
 */
    IERC20 token;
/**
 * @notice interface for yearn finance token
 */
    IYtoken yToken;

/**
 * 
 * @param tokenAddress Address of token contract
 * @param yTokenAddress Address of Yearn token contract
 */
    constructor(IERC20 tokenAddress, IYtoken yTokenAddress) {
        admin= msg.sender;
        token= IERC20(tokenAddress);
        yToken= IYtoken(yTokenAddress);
        
    }
    /**
     * 
     * @param amount Amount of token to deposit
     * @notice Send tokens to yearn token contract
     */
    function save(uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
        _save(amount);
    }
    /**
     * 
     * @param amount Amount of token to send to recepient
     * @param recepient Address of recepient
     * @notice Burn YTokens and send tokens to recepient
     */
    function spend(uint256 amount, address recepient) external {
        require(msg.sender== admin, "Only admin!");
        uint256 balanceShares= yToken.balanceOf(address(this));
        yToken.withdraw(balanceShares);
        token.transfer(recepient, amount);
        uint256 balanceToken=token.balanceOf(address(this));
        if(balanceToken > 0){
            _save(balanceToken);
        }

    }
    /**
     * 
     * @param amount Amount of tokens to deposit
     * @notice internal function of save
     */
    function _save(uint256 amount) internal {
        token.approve(address(yToken), amount);
        yToken.deposit(amount);
    }
    /**
     * @notice Return balance of saved tokens
     */
    function balance() external view returns(uint256){
        uint256 price= yToken.getPricePerFullShare();
        uint256 balanceShares= yToken.balanceOf(address(this));
        return (price * balanceShares);

    }
    /**
     * 
     * @param tokenAddress Address of token to deposit
     * @param yTokenAddress Address of yearn token
     * @notice Change token for saving
     */
    function changeToken(string calldata tokenAddress, string calldata yTokenAddress) external{
        token= IERC20(address(bytes20(bytes(tokenAddress))));
        yToken= IYtoken(address(bytes20(bytes(yTokenAddress))));
    }
    function getToken() external view returns(IERC20){
        return token;
    }
    function getYToken() external view returns(IYtoken){
        return yToken;
    }
    function getTokenBalance() external view returns(uint256){
        return token.balanceOf(msg.sender);
    }
    function getYTokenBalance() external view returns(uint256){
        return yToken.balanceOf(msg.sender);
    }
}
