//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./War.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./Missiles.sol";
import "./KeeperFile.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

///@title AirBattleContract
///@author OxSnosh
///@dev this contract allows you to launch a bombing campaign against another nation
contract AirBattleContract is VRFConsumerBaseV2Plus, ReentrancyGuard {
    uint256 airBattleId;
    address warAddress;
    address fighterAddress;
    address bomberAddress;
    address infrastructure;
    address forces;
    address missiles;
    address wonders1;
    address fighterLosses;
    address countryMinter;
    address addAirBattleAddress;
    address keeper;

    WarContract war;
    FightersContract fighter;
    BombersContract bomber;
    InfrastructureContract inf;
    ForcesContract force;
    MissilesContract mis;
    WondersContract1 won1;
    FighterLosses fighterLoss;
    CountryMinter mint;
    AdditionalAirBattle addAirBattle;
    KeeperContract keep;

    uint256[] private s_randomWords;
    uint256 public s_subscriptionId;
    bytes32 public s_gasLane;
    uint32 public s_callbackGasLimit;
    uint16 public s_confirmations = 3;
    uint32 public s_numWords = 6;
    bool public s_useNative = true;

    struct AirBattle {
        uint256 warId;
        uint256 attackerId;
        uint256 defenderId;
        uint256[] attackerFighterArray;
        uint256[] attackerBomberArray;
        uint256[] defenderFighterArray;
        uint256[] attackerFighterCasualties;
        uint256[] attackerBomberCasualties;
        uint256[] defenderFighterCasualties;
        uint256[] damage;
    }

    event AirAssaultLaunched(
        uint256 indexed battleId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256[] attackerFighterArray,
        uint256[] attackerBomberArray,
        uint256[] defenderFighterArray,
        uint256 warId
    );

    mapping(uint256 => AirBattle) airBattleIdToAirBattle;

    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    ///@dev this is the constructor funtion for the contact
    constructor(
        address vrfCoordinatorV2,
        uint256 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) {
        s_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinatorV2);
        s_gasLane = gasLane;
        s_subscriptionId = subscriptionId;
        s_callbackGasLimit = callbackGasLimit;
    }

    function setVRFConfig(
        bytes32 _keyHash,
        uint64  _subId,
        uint16  _minConf,
        uint32  _gasLimit,
        uint32  _numWords,
        bool    _useNative
    ) external onlyOwner {
        s_gasLane                   = _keyHash;
        s_subscriptionId            = _subId;
        s_confirmations             = _minConf;
        s_callbackGasLimit          = _gasLimit;
        s_numWords                  = _numWords;
        s_useNative                 = _useNative;
        emit VrfConfigUpdated(_keyHash, _subId, _minConf, _gasLimit, _numWords, _useNative);
    }

    event VrfConfigUpdated(
        bytes32 keyHash,
        uint64 subId,
        uint16 minConf,
        uint32 gasLimit,
        uint32 numWords,
        bool useNative
    );

    ///@dev this function is only callable by the owner
    ///@dev this function will be called right after deployment in order to set up contract pointers
    function settings(
        address _warAddress,
        address _fighter,
        address _bomber,
        address _infrastructure,
        address _forces,
        address _fighterLosses,
        address _mint,
        address _addAirBattle,
        address _keeper
    ) public onlyOwner {
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        fighterAddress = _fighter;
        fighter = FightersContract(_fighter);
        bomberAddress = _bomber;
        bomber = BombersContract(_bomber);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        fighterLosses = _fighterLosses;
        fighterLoss = FighterLosses(_fighterLosses);
        countryMinter = _mint;
        mint = CountryMinter(_mint);
        addAirBattleAddress = _addAirBattle;
        addAirBattle = AdditionalAirBattle(_addAirBattle);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    ///@dev this function is a public function
    ///@notice this function allows one nation to launch a bombing campaign against another nation
    ///@notice can only be called if a war is active between the two nations
    ///@param warId is the ID of the current war between the two nations
    ///@param attackerId is the nation ID of the attacker nation
    // /@param defenderId is the nation ID of the defending nation
    function airBattle(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256[] memory attackerFighterArray,
        uint256[] memory attackerBomberArray
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        bool isActiveWar = war.isWarActive(warId);
        require(isActiveWar, "!not active war");
        require(attackerFighterArray.length == 9, "Invalid attacker fighter array length");
        require(attackerBomberArray.length == 9, "Invalid attacker bomber array length");
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            warId
        );
        require(
            warOffense == attackerId || warOffense == defenderId,
            "attacker not involved in this war"
        );
        require(
            warDefense == attackerId || warDefense == defenderId,
            "defender not involved in this war"
        );
        uint256 attackerFighterSum = getAttackerFighterSum(
            attackerFighterArray
        );
        _registerSortie(attackerId, defenderId);
        uint256 attackerBomberSum = getAttackerBomberSum(attackerBomberArray);
        uint256 attackSum = (attackerFighterSum + attackerBomberSum);
        require(attackSum <= 25, "cannot send more than 25 planes on a sortie");
        bool fighterCheck = verifyAttackerFighterArrays(
            attackerId,
            attackerFighterArray
        );
        bool bomberCheck = verifyAttackerBomberArray(
            attackerId,
            attackerBomberArray
        );
        require(fighterCheck, "!fighter check");
        require(bomberCheck, "!bomber check");
        completeAirBattleLaunch(
            warId,
            attackerId,
            defenderId,
            attackerFighterArray,
            attackerBomberArray,
            airBattleId
        );
        airBattleId++;
    }

    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint8))) private _pairSorties;
    uint8 constant MAX_PAIR_SORTIES = 2;

    function _registerSortie(uint256 attackerId, uint256 defenderId) internal {
        uint256 today = keep.getGameDay();
        uint8 sorties = _pairSorties[attackerId][defenderId][today];

        require(sorties < MAX_PAIR_SORTIES, "daily cap vs defender reached");

        _pairSorties[attackerId][defenderId][today] = sorties + 1;
    }

    function getSortiesToday(
        uint256 attackerId,
        uint256 defenderId
    ) external view returns (uint8 sortieCount) {
        uint256 today = keep.getGameDay();
        uint8 sorties = _pairSorties[attackerId][defenderId][today];
        return (sorties);
    }

    function completeAirBattleLaunch(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256[] memory attackerFighterArray,
        uint256[] memory attackerBomberArray,
        uint256 _airBattleId
    ) internal {
        war.cancelPeaceOffersUponAttack(warId);
        AirBattle storage newAirBattle = airBattleIdToAirBattle[_airBattleId];
        newAirBattle.warId = warId;
        newAirBattle.attackerId = attackerId;
        newAirBattle.defenderId = defenderId;
        newAirBattle.attackerFighterArray = attackerFighterArray;
        newAirBattle.attackerBomberArray = attackerBomberArray;
        uint256[] memory defenderFighterArray = generateDefenderFighters(
            defenderId,
            _airBattleId
        );
        emit AirAssaultLaunched(
            airBattleId,
            attackerId,
            defenderId,
            attackerFighterArray,
            attackerBomberArray,
            defenderFighterArray,
            warId
        );
        fulfillRequest(_airBattleId);
    }

    //make a function that will verify that the attacker has the planes included in the arrays
    function verifyAttackerFighterArrays(
        uint256 attackerId,
        uint256[] memory attackerFighterArray
    ) internal view returns (bool) {
        require(
            fighter.getYak9Count(attackerId) >= attackerFighterArray[0],
            "not enough yak9s"
        );
        require(
            fighter.getP51MustangCount(attackerId) >= attackerFighterArray[1],
            "not enough p51s"
        );
        require(
            fighter.getF86SabreCount(attackerId) >= attackerFighterArray[2],
            "not enough f86s"
        );
        require(
            fighter.getMig15Count(attackerId) >= attackerFighterArray[3],
            "not enough mig15s"
        );
        require(
            fighter.getF100SuperSabreCount(attackerId) >=
                attackerFighterArray[4],
            "not enough f100s"
        );
        require(
            fighter.getF35LightningCount(attackerId) >= attackerFighterArray[5],
            "not enough f35s"
        );
        require(
            fighter.getF15EagleCount(attackerId) >= attackerFighterArray[6],
            "not enough f15s"
        );
        require(
            fighter.getSu30MkiCount(attackerId) >= attackerFighterArray[7],
            "not enough su30s"
        );
        require(
            fighter.getF22RaptorCount(attackerId) >= attackerFighterArray[8],
            "not enough f22s"
        );
        require(
            attackerFighterArray.length == 9,
            "Invalid fighter array length"
        );
        return true;
    }

    function getAttackerFighterSum(
        uint256[] memory attackerFighterArray
    ) internal pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < attackerFighterArray.length; i++) {
            sum += attackerFighterArray[i];
        }
        return sum;
    }

    function getAttackerBomberSum(
        uint256[] memory attackerBomberArray
    ) internal pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < attackerBomberArray.length; i++) {
            sum += attackerBomberArray[i];
        }
        return sum;
    }

    function verifyAttackerBomberArray(
        uint256 attackerId,
        uint256[] memory attackerBomberArray
    ) internal view returns (bool) {
        require(
            bomber.getAh1CobraCount(attackerId) >= attackerBomberArray[0],
            "not enough ah1 Cobras"
        );
        require(
            bomber.getAh64ApacheCount(attackerId) >= attackerBomberArray[1],
            "not enough ah64s"
        );
        require(
            bomber.getBristolBlenheimCount(attackerId) >=
                attackerBomberArray[2],
            "not enough bristols"
        );
        require(
            bomber.getB52MitchellCount(attackerId) >= attackerBomberArray[3],
            "not enough b52 Mitchells"
        );
        require(
            bomber.getB17gFlyingFortressCount(attackerId) >=
                attackerBomberArray[4],
            "not enough b17s"
        );
        require(
            bomber.getB52StratofortressCount(attackerId) >=
                attackerBomberArray[5],
            "not enough b52 Strato's"
        );
        require(
            bomber.getB2SpiritCount(attackerId) >= attackerBomberArray[6],
            "not enough b2 Spirits"
        );
        require(
            bomber.getB1bLancerCount(attackerId) >= attackerBomberArray[7],
            "not enough b1b Lancers"
        );
        require(
            bomber.getTupolevTu160Count(attackerId) >= attackerBomberArray[8],
            "not enough tupolev's"
        );
        require(attackerBomberArray.length == 9, "Invalid bomber array length");
        return true;
    }

    function generateDefenderFighters(
        uint256 defenderId,
        uint256 _airBattleId
    ) internal returns (uint256[] memory) {
        uint256[] memory defenderFighterArray = new uint256[](9);
        defenderFighterArray[0] = fighter.getYak9Count(defenderId);
        defenderFighterArray[1] = fighter.getP51MustangCount(defenderId);
        defenderFighterArray[2] = fighter.getF86SabreCount(defenderId);
        defenderFighterArray[3] = fighter.getMig15Count(defenderId);
        defenderFighterArray[4] = fighter.getF100SuperSabreCount(defenderId);
        defenderFighterArray[5] = fighter.getF35LightningCount(defenderId);
        defenderFighterArray[6] = fighter.getF15EagleCount(defenderId);
        defenderFighterArray[7] = fighter.getSu30MkiCount(defenderId);
        defenderFighterArray[8] = fighter.getF22RaptorCount(defenderId);
        AirBattle storage newAirBattle = airBattleIdToAirBattle[_airBattleId];
        newAirBattle.defenderFighterArray = defenderFighterArray;
        return defenderFighterArray;
    }

    mapping(uint256 => bool) public pendingRequests;
    mapping(uint256 => uint256) public pendingRequestTimestamp;
    uint256 public constant RETRY_TIMEOUT = 5 minutes;

    function retryFulfillRequest(uint256 battleId) public {
        require(pendingRequests[battleId], "No pending request");
        require(
            block.timestamp > pendingRequestTimestamp[battleId] + RETRY_TIMEOUT,
            "Retry not allowed yet"
        );

        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_gasLane,
                subId: s_subscriptionId,
                requestConfirmations: s_confirmations,
                callbackGasLimit: s_callbackGasLimit,
                numWords: s_numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: s_useNative}))
            })
        );
        s_requestIdToRequestIndex[requestId] = battleId;
        pendingRequests[battleId] = true;
        pendingRequestTimestamp[battleId] = block.timestamp;
    }

    function fulfillRequest(uint256 battleId) internal {
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_gasLane,
                subId: s_subscriptionId,
                requestConfirmations: s_confirmations,
                callbackGasLimit: s_callbackGasLimit,
                numWords: s_numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: s_useNative}))
            })
        );
        s_requestIdToRequestIndex[requestId] = battleId;
        pendingRequests[battleId] = true;
        pendingRequestTimestamp[battleId] = block.timestamp;
    }

    bytes32 jobId;
    address oracleAddress;
    uint256 fee;

    event AirBattleRequested(
        uint256 battleId,
        uint256 attackerId,
        uint256 defenderId,
        uint256[] randomNumbers,
        uint256[] attackerFighters,
        uint256[] attackerBombers,
        uint256[] defenderFighters,
        uint256 timestamp
    );

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        require(
            pendingRequests[s_requestIdToRequestIndex[requestId]],
            "Request not pending"
        );
        uint256 battleId = s_requestIdToRequestIndex[requestId];
        delete pendingRequests[battleId];
        delete pendingRequestTimestamp[battleId];
        s_requestIndexToRandomWords[battleId] = randomWords;
        uint256[] memory defenderFighters = airBattleIdToAirBattle[
            battleId
        ].defenderFighterArray;
        uint256[] memory attackerFighters = airBattleIdToAirBattle[
            battleId
        ].attackerFighterArray;
        uint256[] memory attackerBombers = airBattleIdToAirBattle[battleId]
            .attackerBomberArray;
        uint256 attackerId = airBattleIdToAirBattle[battleId].attackerId;
        uint256 defenderId = airBattleIdToAirBattle[battleId].defenderId;
        emit AirBattleRequested(
            battleId,
            attackerId,
            defenderId,
            randomWords,
            attackerFighters,
            attackerBombers,
            defenderFighters,
            block.timestamp
        );
    }

    address public oracle = 0xA918a6FE02d64e999FadB6FB9c3E2C74A63ED67C;

    modifier onlyOracle() {
        require(msg.sender == oracle, "!ORACLE");
        _;
    }

    function setOracle(address _oracleAddress) public onlyOwner {
        oracle = _oracleAddress;
    }

    function completeAirBattle(
        uint256[] memory attackerFighterCasualtiesBytes,
        uint256[] memory attackerBomberCasualtiesBytes,
        uint256[] memory defenderFighterCasualtiesBytes,
        uint256 attackerId,
        uint256 defenderId,
        uint256 infrastructureDamage,
        uint256 tankDamage,
        uint256 cruiseMissileDamage,
        uint256 battleId
    ) public nonReentrant onlyOracle {
        addAirBattle.completeAirBattle(
            attackerFighterCasualtiesBytes,
            attackerBomberCasualtiesBytes,
            defenderFighterCasualtiesBytes,
            attackerId,
            defenderId,
            infrastructureDamage,
            tankDamage,
            cruiseMissileDamage,
            battleId
        );
    }
}

contract AdditionalAirBattle is Ownable, ReentrancyGuard {
    address warAddress;
    address fighterAddress;
    address bomberAddress;
    address infrastructure;
    address forces;
    address missiles;
    address wonders1;
    address fighterLosses;
    address countryMinter;
    address airBattleAddress;

    WarContract war;
    FightersContract fighter;
    BombersContract bomber;
    InfrastructureContract inf;
    ForcesContract force;
    MissilesContract mis;
    WondersContract1 won1;
    FighterLosses fighterLoss;
    CountryMinter mint;
    AirBattleContract airBattle;

    struct AirBattleCasualties {
        uint256[] attackerFighterCasualties;
        uint256[] attackerBomberCasualties;
        uint256[] defenderFighterCasualties;
        uint256[] damage;
    }

    event AirBattleFulfilled(
        uint256 indexed battleId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256[] attackerFighterCasualties,
        uint256[] attackerBomberCasualties,
        uint256[] defenderFighterCasualties,
        uint256 infrastructureDamage,
        uint256 tankDamage,
        uint256 cruiseMissileDamage
    );

    modifier onlyAirBattle() {
        require(msg.sender == airBattleAddress, "Not authorized");
        _;
    }

    //@dev this function is only callable by the owner
    ///@dev this function will be called right after deployment in order to set up contract pointers
    function settings(
        address _warAddress,
        address _fighter,
        address _bomber,
        address _infrastructure,
        address _forces,
        address _fighterLosses,
        address _mint,
        address _airBattle,
        address _wonder1,
        address _missiles
    ) public onlyOwner {
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        fighterAddress = _fighter;
        fighter = FightersContract(_fighter);
        bomberAddress = _bomber;
        bomber = BombersContract(_bomber);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        fighterLosses = _fighterLosses;
        fighterLoss = FighterLosses(_fighterLosses);
        countryMinter = _mint;
        mint = CountryMinter(_mint);
        airBattleAddress = _airBattle;
        airBattle = AirBattleContract(_airBattle);
        wonders1 = _wonder1;
        won1 = WondersContract1(_wonder1);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
    }

    function completeAirBattle(
        uint256[] memory attackerFighterCasualtiesBytes,
        uint256[] memory attackerBomberCasualtiesBytes,
        uint256[] memory defenderFighterCasualtiesBytes,
        uint256 attackerId,
        uint256 defenderId,
        uint256 infrastructureDamage,
        uint256 tankDamage,
        uint256 cruiseMissileDamage,
        uint256 battleId
    ) public onlyAirBattle nonReentrant {
        handleDamage(
            defenderId,
            infrastructureDamage,
            tankDamage,
            cruiseMissileDamage
        );
        handleCasualties(
            attackerFighterCasualtiesBytes,
            attackerBomberCasualtiesBytes,
            defenderFighterCasualtiesBytes,
            defenderId,
            attackerId
        );
        emit AirBattleFulfilled(
            battleId,
            attackerId,
            defenderId,
            attackerFighterCasualtiesBytes,
            attackerBomberCasualtiesBytes,
            defenderFighterCasualtiesBytes,
            infrastructureDamage,
            tankDamage,
            cruiseMissileDamage
        );
    }

    function handleDamage(
        uint256 defenderId,
        uint256 infrastructureDamage,
        uint256 tankDamage,
        uint256 cruiseMissileDamage
    ) internal {
        bool antiAir = won1.getAntiAirDefenseNetwork(defenderId);
        if (antiAir) {
            infrastructureDamage = ((infrastructureDamage * 60) / 100);
            tankDamage = ((tankDamage * 60) / 100);
            cruiseMissileDamage = ((cruiseMissileDamage * 60) / 100);
        }

        try inf.decreaseInfrastructureCountFromAirBattleContract(defenderId, infrastructureDamage) returns (bool success1) {
            require(success1, "INFRASTRUCTURE: returned false");
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("INFRASTRUCTURE ERROR: ", reason)));
        } catch {
            revert("INFRASTRUCTURE: unknown failure");
        }

        try force.decreaseDefendingTankCountFromAirBattleContract(defenderId, tankDamage) returns (bool success2) {
            require(success2, "TANK: returned false");
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("TANK ERROR: ", reason)));
        } catch {
            revert("TANK: unknown failure");
        }

        try mis.decreaseCruiseMissileCountFromAirBattleContract(defenderId, cruiseMissileDamage) returns (bool success3) {
            require(success3, "MISSILE: returned false");
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("MISSILE ERROR: ", reason)));
        } catch {
            revert("MISSILE: unknown failure");
        }
    }

    function handleCasualties(
        uint256[] memory attackerFighterCasualties,
        uint256[] memory attackerBomberCasualties,
        uint256[] memory defenderFighterCasualties,
        uint256 defenderId,
        uint256 attackerId
    ) internal {
        if (attackerFighterCasualties.length != 0) {
            try fighterLoss.decrementLosses(attackerFighterCasualties, attackerId) returns (bool success1) {
                require(success1, "ATTACKER FIGHTER: returned false");
            } catch Error(string memory reason) {
                revert(string(abi.encodePacked("ATTACKER FIGHTER ERROR: ", reason)));
            } catch {
                revert("ATTACKER FIGHTER: unknown failure");
            } 
        }
        if (attackerBomberCasualties.length != 0) {
            try bomber.decrementBomberLosses(attackerBomberCasualties, attackerId) returns (bool success2) {
                require(success2, "ATTACKER BOMBER: returned false");
            } catch Error(string memory reason) {
                revert(string(abi.encodePacked("ATTACKER BOMBER ERROR: ", reason)));
            } catch {
                revert("ATTACKER BOMBER: unknown failure");
            }
        }
        if (defenderFighterCasualties.length != 0) {
            try fighterLoss.decrementLosses(defenderFighterCasualties, defenderId) returns (bool success3) {
                require(success3, "DEFENDER FIGHTER: returned false");
            } catch Error(string memory reason) {
                revert(string(abi.encodePacked("DEFENDER FIGHTER ERROR: ", reason)));
            } catch {
                revert("DEFENDER FIGHTER: unknown failure");
            }
        }
    }
}
