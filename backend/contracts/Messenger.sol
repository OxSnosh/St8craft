// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

interface ICountryMinter {
    function checkOwnership(uint256 nationId, address caller) external view returns (bool);
}

/// @title Messenger
/// @author OxSnosh
/// @notice This contract allows a nation's ruler to send messages or post updates
contract Messenger {
    ICountryMinter public countryMinter;

    event MessageSent(uint256 indexed nationId, uint256 indexed receiver, string message, uint256 timestamp);
    event PostSent(uint256 indexed nationId, string post, uint256 timestamp);
    event SenderBlocked(uint256 indexed nationId, uint256 indexed blockedNationId);
    event SenderUnblocked(uint256 indexed nationId, uint256 indexed unblockedNationId);

    uint256 public constant MAX_MESSAGE_LENGTH = 1500;
    uint256 public constant MAX_POST_LENGTH = 500;

    mapping(uint256 => mapping(uint256 => bool)) public isBlocked;

    /// @notice Initializes the contract with the address of the CountryMinter contract
    /// @param _countryMinter The address of the CountryMinter contract
    constructor(address _countryMinter) {
        countryMinter = ICountryMinter(_countryMinter);
    }

    /// @dev Allows the ruler of a nation to send a message to another user
    /// @param nationId The ID of the nation sending the message
    /// @param _receiver The address of the message recipient
    /// @param _message The message being sent
    function sendMessage(uint256 nationId, uint256 _receiver, string memory _message) public {
        require(countryMinter.checkOwnership(nationId, msg.sender), "Caller does not own this nation");
        require(bytes(_message).length <= MAX_MESSAGE_LENGTH, "Message exceeds 1500 characters");
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(!isBlocked[nationId][_receiver], "You are blocked from sending posts to this nation");

        emit MessageSent(nationId, _receiver, _message, block.timestamp);
    }

    /// @dev Allows the ruler of a nation to post a public message
    /// @param nationId The ID of the nation posting the message
    /// @param _post The message being posted
    function postMessage(uint256 nationId, string memory _post) public {
        require(countryMinter.checkOwnership(nationId, msg.sender), "Caller does not own this nation");
        require(bytes(_post).length <= MAX_POST_LENGTH, "Post exceeds 500 characters");
        require(bytes(_post).length > 0, "Post cannot be empty");
        
        emit PostSent(nationId, _post, block.timestamp);
    }

    function blockSender(uint256 nationId, uint256 blockedNationId) public {
        require(countryMinter.checkOwnership(nationId, msg.sender), "Caller does not own this nation");
        require(nationId != blockedNationId, "Cannot block yourself");
        isBlocked[nationId][blockedNationId] = true;
        emit SenderBlocked(nationId, blockedNationId);
    }

    function unblockSender(uint256 nationId, uint256 blockedNationId) public {
        require(countryMinter.checkOwnership(nationId, msg.sender), "Caller does not own this nation");
        isBlocked[nationId][blockedNationId] = false;
        emit SenderUnblocked(nationId, blockedNationId);
    }
}

