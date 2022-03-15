// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title My Token 20 (MT20)
/// @dev MT20 is a simulated token, based development from ERC20.

contract MyToken20 is ERC20, Pausable, Ownable {
    /// @dev Initializes contract.
    constructor() ERC20("My Token 20", "MT20") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

    /// @dev Using for pause state.
    function pause() public onlyOwner {
        _pause();
    }

    /// @dev Using for unpause state.
    function unpause() public onlyOwner {
        _unpause();
    }

    /// @dev Using for mint token.
    /// @param _to Target address for receiving the token.
    /// @param _amount Amount of token that needs to mint.
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    /// @dev Using for burn token.
    /// @param _account Target address to burn token.
    /// @param _amount Amount of token that needs to burn.
    function burn(address _account, uint256 _amount) public onlyOwner {
        _burn(_account, _amount);
    }

    /// @dev Overriding `_beforeTokenTransfer` by adding modifier `whenNotPaused`.
    function _beforeTokenTransfer(address _from, address _to, uint256 _amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(_from, _to, _amount);
    }
}
