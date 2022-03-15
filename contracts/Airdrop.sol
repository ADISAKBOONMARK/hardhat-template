// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Airdrop
/// @dev Airdrop is a contract for sending a token (ERC20) to a beneficiary.
contract Airdrop is Pausable, Ownable {
    
    /// @dev Emitted when the verifier changed.
    event VerifierChanged(address oldVerifier, address newVerifier);

    /// @dev Emitted when the airdrop changed.
    event AirdropChanged(address oldAirdrop, address newAirdrop);

    /// @dev Emitted when the claimer claimed an airdrop.
    event Claimed(address verifier, address claimer, uint256 amount);

    IERC20 public airdrop;
    address public verifier;

    /// @dev Claim status by address.
    mapping(address => bool) public claimStatus;

    /// @dev Initializes contract.
    /// @param _airdrop Airdrop address.
    constructor(address _airdrop) {
        airdrop = IERC20(_airdrop);
        verifier = msg.sender;
    }

    /// @dev Using for pause state.
    function pause() public onlyOwner {
        _pause();
    }

    /// @dev Using for unpause state.
    function unpause() public onlyOwner {
        _unpause();
    }

    /// @dev Using for set verifier.
    /// @param _verifier New verifier address.
    function setVerifier(address _verifier) public onlyOwner {
        require(verifier != _verifier, "MyAirdrop: Verifier already set");
        emit VerifierChanged(verifier, _verifier);
        verifier = _verifier;
    }

    /// @dev Using for set airdrop.
    /// @param _airdrop New airdrop address.
    function setAirdrop(address _airdrop) public onlyOwner {
        address airdropAddress = address(airdrop);
        require(airdropAddress != _airdrop, "MyAirdrop: Airdrop already set");
        emit AirdropChanged(airdropAddress, _airdrop);
        airdrop = IERC20(_airdrop);
    }

    /// @dev Using for verify claimer.
    /// @param _v Final byte (first byte of the next 32 bytes).
    /// @param _r First 32 bytes, after the length prefix.
    /// @param _s Second 32 bytes.
    /// @param _claimer Claimer address.
    /// @return Verify result.
    function verify(uint8 _v, bytes32 _r, bytes32 _s, address _claimer) public view returns(bool) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encodePacked(
                        "verify(address _claimer)",
                        _claimer
                    )
                )
            )
        );

        address verifierAddress = ecrecover(digest, _v, _r, _s);

        return (verifier == verifierAddress);
    }

    /// @dev Using for verify claimer.
    /// @param _v Final byte (first byte of the next 32 bytes).
    /// @param _r First 32 bytes, after the length prefix.
    /// @param _s Second 32 bytes.
    /// @param _claimer Claimer address.
    /// @param _amount Amount of airdrop.
    function claim(
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s,
        address _claimer,
        uint256 _amount
    ) public whenNotPaused {
        require(_claimer == msg.sender, "MyAirdrop: Is not own address");
        require(verify(_v,_r,_s,_claimer) == true, "MyAirdrop: Invalid verifier");
        require(claimStatus[_claimer] == false, "MyAirdrop: Already claimed");
        
        claimStatus[_claimer] = true;
        airdrop.transfer(_claimer, _amount);

        emit Claimed(verifier, _claimer, _amount);
    }
}
