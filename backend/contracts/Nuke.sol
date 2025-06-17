//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./War.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Navy.sol";
import "./Improvements.sol";
import "./KeeperFile.sol";
import "./CountryParameters.sol";
import "./Missiles.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

///@title NukeContract
///@author OxSnosh
///@dev this contract inherits from chainlink VRF
///@dev this contract inherits from openzeppelin ownable
///@notice this contract will allow a nation to launch a nuclear missile at anoter nation
contract NukeContract is VRFConsumerBaseV2Plus, ReentrancyGuard {
    uint256 nukeAttackId;
    address countryMinter;
    address warAddress;
    address wonders1;
    address wonders4;
    address improvements3;
    address improvements4;
    address infrastructure;
    address forces;
    address navy;
    address missiles;
    address keeper;
    address parameters;
    uint256 mod = 50;

    //Chainlik Variables
    uint256[] private s_randomWords;
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    CountryMinter mint;
    WarContract war;
    WondersContract1 won1;
    WondersContract4 won4;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;
    InfrastructureContract inf;
    ForcesContract force;
    NavyContract nav;
    MissilesContract mis;
    CountryParametersContract param;
    KeeperContract keep;

    struct NukeAttack {
        uint256 warId;
        uint256 attackerId;
        uint256 defenderId;
        uint256 attackType;
    }

    mapping(uint256 => NukeAttack) nukeAttackIdToNukeAttack;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;
    mapping(uint256 => uint256) public gameDayToNukesLanded;
    mapping(uint256 => mapping(uint256 => bool))
        public nationIdToDayToNukeLanded;

    event NukeLaunched(
        uint256 indexed id,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256 warId,
        uint256 attackType
    );

    event NukeAttackEvent(
        uint256 indexed id,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256 warId,
        bool landed
    );

    ///@dev this function contains the variable necessary for chainlink randomness
    constructor(
        address vrfCoordinatorV2,
        uint256 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2Plus(vrfCoordinatorV2) {
        s_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function updateVRFCoordinator(
        address vrfCoordinatorV2
    ) public onlyOwner {
        s_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinatorV2);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _warAddress,
        address _wonders1,
        address _wonders4,
        address _improvements3,
        address _improvements4,
        address _infrastructure,
        address _forces,
        address _navy,
        address _missiles,
        address _keeper
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        navy = _navy;
        nav = NavyContract(_navy);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    function settings2(address _parameters) public onlyOwner {
        parameters = _parameters;
        param = CountryParametersContract(payable(_parameters));
    }

    ///@dev this is a public function callable only by the attacking nation owner
    ///@dev this function will launch a nuke strike against another nation, nations are required to be at war
    ///@notice this function will launch a nuke strike against another nation, nations are required to be at war
    ///@notice a nuke cannot be launched until a war is one day old
    ///@param attackType determines if the attack is a standard attack or an attack targeting infrastructure, land or technology
    ///@notice attack type will be 1 for a standard attack, 2 for an infrastructre attack, 3 for a land attack and 4 for a technology attack
    ///@notice if an attacking nation does not have a emp wonder, than the attack type will need to be a standard attack
    ///@param warId will be the war id of the active war between the 2 nations
    ///@param attackerId will be the id of the attacking nation (launching the nuke)
    ///@param defenderId will be the id of the defending nation
    function launchNuke(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType
    ) public nonReentrant{
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        bool isActive = war.isWarActive(warId);
        require(isActive, "war not active");
        (uint256 offenseId, uint256 defenseId) = war.getInvolvedParties(warId);
        require(
            attackerId == offenseId || attackerId == defenseId,
            "attacker not involved in this war"
        );
        require(
            defenderId == offenseId || defenderId == defenseId,
            "defender not involved in this war"
        );
        (uint256 daysLeft, ) = war.getDaysLeft(warId);
        require(daysLeft < 6, "not at war long enough to launch a nuke");
        uint256 count = mis.getNukeCount(attackerId);
        require(count >= 1, "need to own a nuke");
        uint256 day = keep.getGameDay();
        require(
            nationIdToDayToNukeLanded[defenderId][day] == false,
            "defender already nuked this day"
        );
        completeNukeLaunch(warId, attackerId, defenderId, attackType);
    }

    function completeNukeLaunch(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType
    ) internal {
        bool emp = won1.getEmpWeaponization(attackerId);
        if (!emp) {
            require(
                attackType == 1,
                "can only launch a standard attack without emp"
            );
        } else {
            require(attackType <= 4, "invalid attack type");
        }
        uint256 tech = inf.getTechnologyCount(attackerId);
        if (attackType == 2 || attackType == 3 || attackType == 4) {
            require(
                tech >= 5000,
                "emp attacks require a nation to have 5,000 tech"
            );
        }
        NukeAttack memory newAttack = NukeAttack(
            warId,
            attackerId,
            defenderId,
            attackType
        );
        nukeAttackIdToNukeAttack[nukeAttackId] = newAttack;
        war.cancelPeaceOffersUponAttack(warId);
        fulfillRequest(nukeAttackId);
        emit NukeLaunched(
            nukeAttackId,
            attackerId,
            defenderId,
            warId,
            attackType
        );
        nukeAttackId++;
    }

    ///@dev this function will be called by the launchNuke() function
    ///@dev this function will send a randomness request to the chainlink VRF contract
    function fulfillRequest(uint256 id) internal {
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_gasLane,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: true}))
            })
        );
        s_requestIdToRequestIndex[requestId] = id;
    }

    ///@dev this function will be called by the chainlink VRF contract in response to a randomness request
    ///@dev the random numbers will be used to determine if the nuke strike was a success or not
    ///@notice a nations default odds of a successful nuke strike are 50%
    ///@notice if a defender has a strategic defense initiative the odds of a successful strike go down 20%
    ///@notice if the attacker has sattelites, the odds of a succesful strike go up 5% per sattelite
    ///@notice if a defender has a missile defense, the odds of a sucessful strike go down 5% per missile defense
    ///@param requestId will be the request id passed in from the fulfillRequest() function
    ///@param randomWords is the randomly generate number for the calculation of a successful nuke strike
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 attackerId = nukeAttackIdToNukeAttack[requestNumber].attackerId;
        uint256 defenderId = nukeAttackIdToNukeAttack[requestNumber].defenderId;
        uint256 thwartOdds = getThwartOdds(attackerId, defenderId);
        uint256 randomNukeSuccessNumber = ((s_randomWords[0] % 100) + 1);
        if (randomNukeSuccessNumber > thwartOdds) {
            inflictNukeDamage(requestNumber);
            mis.decreaseNukeCountFromNukeContract(attackerId);
            param.inflictAnarchy(defenderId);
            uint256 gameDay = keep.getGameDay();
            gameDayToNukesLanded[gameDay]++;
            nationIdToDayToNukeLanded[defenderId][gameDay] = true;
            emit NukeAttackEvent(
                requestNumber,
                attackerId,
                defenderId,
                nukeAttackIdToNukeAttack[requestNumber].warId,
                true
            );
        } else {
            mis.decreaseNukeCountFromNukeContract(attackerId);
            emit NukeAttackEvent(
                requestNumber,
                attackerId,
                defenderId,
                nukeAttackIdToNukeAttack[requestNumber].warId,
                false
            );
        }
    }

    function getThwartOdds(
        uint256 attackerId,
        uint256 defenderId
    ) public view returns (uint256) {
        uint256 thwartOdds = 50;
        bool strategicDefenseInitiative = won4.getStrategicDefenseInitiative(
            defenderId
        );
        uint256 defenderMissileDefenses = imp4.getMissileDefenseCount(
            defenderId
        );
        uint256 attackerSattelites = imp3.getSatelliteCount(attackerId);
        if (strategicDefenseInitiative) {
            thwartOdds += 20;
        }
        if (defenderMissileDefenses > 0) {
            thwartOdds += (defenderMissileDefenses * 5);
        }
        if (attackerSattelites > 0) {
            thwartOdds -= (attackerSattelites * 5);
        }

        if (thwartOdds > 100) {
            thwartOdds = 100;
        } else if (thwartOdds < 0) {
            thwartOdds = 0;
        }
        
        return thwartOdds;
    }

    ///@dev this is an internal function that will be called in the event of a succesful nuke strike
    ///@notice this function will take the attack tyoe and direct the type of damage to inflict
    ///@param attackId this is the type of attack that was launched that will determine if the attack was a standard attack or an infrastructure, land or tech attack
    function inflictNukeDamage(uint256 attackId) internal {
        uint256 attackType = nukeAttackIdToNukeAttack[attackId].attackType;
        if (attackType == 1) {
            standardAttack(attackId);
        } else if (attackType == 2) {
            infrastructureAttack(attackId);
        } else if (attackType == 3) {
            landAttack(attackId);
        } else if (attackType == 4) {
            technologyAttack(attackId);
        }
    }

    ///@dev this is the function that will be called in the event of a standard attack
    ///@notice a standard nuke attack will decrease land, infrastructure and tech by 35%
    function standardAttack(uint256 attackId) internal {
        uint256 defenderId = nukeAttackIdToNukeAttack[attackId].defenderId;
        uint256 attackerId = nukeAttackIdToNukeAttack[attackId].attackerId;
        force.decreaseDefendingSoldierCountFromNukeAttack(defenderId);
        force.decreaseDefendingTankCountFromNukeContract(defenderId);
        nav.decreaseNavyFromNukeContract(defenderId);
        inf.decreaseLandCountFromNukeContract(defenderId, 35, 1);
        inf.decreaseInfrastructureCountFromNukeContract(
            defenderId,
            attackerId,
            35,
            1
        );
        inf.decreaseTechCountFromNukeContract(defenderId, 35, 1);
        mis.decreaseCruiseMissileCountFromNukeContract(defenderId);
    }

    ///@dev this is the function that will be called in the event of a infrastructure attack
    ///@notice an infrastructure nuke attack will decrease infrastructure by 45% and land and tech by 25%
    function infrastructureAttack(uint256 attackId) internal {
        uint256 defenderId = nukeAttackIdToNukeAttack[attackId].defenderId;
        uint256 attackerId = nukeAttackIdToNukeAttack[attackId].attackerId;
        force.decreaseDefendingSoldierCountFromNukeAttack(defenderId);
        force.decreaseDefendingTankCountFromNukeContract(defenderId);
        nav.decreaseNavyFromNukeContract(defenderId);
        inf.decreaseLandCountFromNukeContract(defenderId, 25, 2);
        inf.decreaseInfrastructureCountFromNukeContract(
            defenderId,
            attackerId,
            45,
            2
        );
        inf.decreaseTechCountFromNukeContract(defenderId, 25, 2);
        mis.decreaseCruiseMissileCountFromNukeContract(defenderId);
    }

    ///@dev this is the function that will be called in the event of a land attack
    ///@notice a land nuke attack will decrease land by 45% and infrastructe and tech by 25%
    function landAttack(uint256 attackId) internal {
        uint256 defenderId = nukeAttackIdToNukeAttack[attackId].defenderId;
        uint256 attackerId = nukeAttackIdToNukeAttack[attackId].attackerId;
        force.decreaseDefendingSoldierCountFromNukeAttack(defenderId);
        force.decreaseDefendingTankCountFromNukeContract(defenderId);
        nav.decreaseNavyFromNukeContract(defenderId);
        inf.decreaseLandCountFromNukeContract(defenderId, 45, 3);
        inf.decreaseInfrastructureCountFromNukeContract(
            defenderId,
            attackerId,
            25,
            3
        );
        inf.decreaseTechCountFromNukeContract(defenderId, 25, 3);
        mis.decreaseCruiseMissileCountFromNukeContract(defenderId);
    }

    ///@dev this is the function that will be called in the event of a tech attack
    ///@notice a tech nuke attack will decrease tech by 45% and infrastructe and land by 25%
    function technologyAttack(uint256 attackId) internal {
        uint256 defenderId = nukeAttackIdToNukeAttack[attackId].defenderId;
        uint256 attackerId = nukeAttackIdToNukeAttack[attackId].attackerId;
        force.decreaseDefendingSoldierCountFromNukeAttack(defenderId);
        force.decreaseDefendingTankCountFromNukeContract(defenderId);
        nav.decreaseNavyFromNukeContract(defenderId);
        inf.decreaseLandCountFromNukeContract(defenderId, 25, 4);
        inf.decreaseInfrastructureCountFromNukeContract(
            defenderId,
            attackerId,
            25,
            4
        );
        inf.decreaseTechCountFromNukeContract(defenderId, 45, 4);
        mis.decreaseCruiseMissileCountFromNukeContract(defenderId);
    }

    ///@dev this function is a public view function that will return the number of nukes launched in the game in the last 7 days
    ///@dev this function will be used to calculate global radiation levels (next function)
    function calculateNukesLandedLastSevenDays() public view returns (uint256) {
        uint256 sum = 0;
        uint256 gameDay = keep.getGameDay();
        uint256 daysToIterate;
        if (gameDay < 7) {
            daysToIterate = gameDay;
        } else {
            daysToIterate = 7;
        }
        for (uint256 i = 0; i < daysToIterate; i++) {
            sum += gameDayToNukesLanded[gameDay - i];
        }
        return sum;
    }

    ///@dev this is a public view function that will return the global radiation levels that will be used in a nations environment calculation
    ///@notice this function will return the global radiation levels for the game
    ///@notice global radiation is calulates by miltiplying nukes landed in the last 7 days by a modifier (default 300) and dividing by the number of countries
    ///@return uint256 is the global radiation level
    function getGlobalRadiation() public view returns (uint256) {
        uint256 countries = mint.getCountryCount();
        if (countries == 0) {
            countries = 1;
        }
        uint256 nukesLanded = calculateNukesLandedLastSevenDays();
        uint256 globalRadiation = ((nukesLanded * mod) / countries);
        return globalRadiation;
    }

    ///@dev this is a function callable by the owner of the contract that will allow the caller to update the modifier for the global radiation level
    ///@notice this function will allow the owner of the contract to adjust the modifier for the global radiation level
    ///@param newModifier is the new modifier for the global radiation level
    function updateGlobalRadiationModifier(
        uint256 newModifier
    ) public onlyOwner {
        mod = newModifier;
    }
}
