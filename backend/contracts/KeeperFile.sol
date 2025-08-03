//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

///@title KeeperContract
///@author OxSnosh
///@dev this contract will allow gelato automation to maintain the game clock that increments every 12 hours
contract KeeperContract is Ownable {
    uint256 public gameDay;
    uint public interval;
    uint public lastTimeStamp;

    event GameDayIncremented(uint256 indexed gameDay);


    constructor() {
        interval = 12 hours;
        lastTimeStamp = block.timestamp;
        gameDay = 0;
    }

    function checkUpkeep() external view returns (bool upkeepNeeded) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) >= interval;
        return (upkeepNeeded);
    }

    function performUpkeep() external {
        require((block.timestamp - lastTimeStamp) >= interval, "Upkeep not needed");
        lastTimeStamp = lastTimeStamp + interval;
        gameDay++;
        emit GameDayIncremented(gameDay);
    }

    function incrementGameDay() public onlyOwner {
        gameDay++;
        lastTimeStamp = block.timestamp;
        emit GameDayIncremented(gameDay);
    }

    function updateInterval(uint _interval) public onlyOwner {
        interval = _interval;
    }

    function getGameDay() public view returns (uint256) {
        return gameDay;
    }
}
