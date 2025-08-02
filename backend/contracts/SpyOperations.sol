// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

interface IInfrastructure {
    function getInfrastructureCount(
        uint256 countryId
    ) external view returns (uint256);

    function getTechnologyCount(
        uint256 countryId
    ) external view returns (uint256);

    function getLandCount(uint256 countryId) external view returns (uint256);

    // Spy effect hooks
    function decreaseLandCountFromSpyContract(
        uint256 defenderId,
        uint256 amount
    ) external;

    function decreaseTechCountFromSpyContract(
        uint256 defenderId,
        uint256 amount
    ) external;

    function decreaseInfrastructureCountFromSpyContract(
        uint256 defenderId,
        uint256 amount
    ) external;

    function setTaxRateFromSpyContract(
        uint256 defenderId,
        uint256 newRate
    ) external;

    // (If you need capturing logic for infrastructure, adjust accordingly)
}

interface IForces {
    function getDefendingTankCount(
        uint256 defenderId
    ) external view returns (uint256);

    function decreaseDefendingTankCount(
        uint256 amount,
        uint256 defenderId
    ) external;
}

interface IMilitary {
    function getThreatLevel(uint256 countryId) external view returns (uint256);

    function setThreatLevelFromSpyContract(
        uint256 defenderId,
        uint256 level
    ) external;

    function setDefconLevelFromSpyContract(
        uint256 defenderId,
        uint256 level
    ) external;
}

interface INationStrength {
    function getNationStrength(
        uint256 countryId
    ) external view returns (uint256);
}

interface ITreasury {
    function spendBalance(uint256 attackerId, uint256 amount) external;
}

interface ICountryParameters {
    function getGovernmentType(
        uint256 countryId
    ) external view returns (uint256);

    function getGovernmentPreference(
        uint256 countryId
    ) external view returns (uint256);

    function updateDesiredGovernment(
        uint256 countryId,
        uint256 newPref
    ) external;

    function getReligionPreference(
        uint256 countryId
    ) external view returns (uint256);

    function updateDesiredReligion(uint256 countryId, uint256 newPref) external;
}

interface IWonders1 {
    function getCentralIntelligenceAgency(
        uint256 countryId
    ) external view returns (bool);
}

interface IWonders2 {
    function getHiddenNuclearMissileSilo(
        uint256 countryId
    ) external view returns (bool);
}

interface ICountryMinter {
    function checkOwnership(
        uint256 countryId,
        address user
    ) external view returns (bool);
}

interface ISpies {
    function getSpyCount(uint256 countryId) external view returns (uint256);

    function decreaseDefenderSpyCount(
        uint256 amount,
        uint256 defenderId
    ) external;
}

interface IMissiles {
    function getNukeCount(uint256 countryId) external view returns (uint256);

    function decreaseCruiseMissileCount(
        uint256 amount,
        uint256 defenderId
    ) external;

    function decreaseNukeCountFromSpyContract(uint256 defenderId) external;
}

interface IKeeper {
    function getGameDay() external view returns (uint256);
}

interface IVRFCoordinatorV2 {
    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256 requestId);
}

import "@openzeppelin/contracts/access/Ownable.sol";
import "@gelatonetwork/relay-context/contracts/GelatoRelayContextERC2771.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/* --------------------------------------------------------------------------
 * Contract
 * -------------------------------------------------------------------------- */

contract SpyOperationsContract is
    GelatoRelayContextERC2771,
    VRFConsumerBaseV2Plus
{
    struct DaySpies {
        uint8 outgoing;
        uint8 incoming;
    }

    struct PendingAttack {
        uint256 attackerId;
        uint256 defenderId;
        uint8 attackType;
        bool exists;
    }

    struct AttackMeta {
        uint256 attackerId;
        uint256 defenderId;
        uint8 attackType;
        bool success;
        bool revealed; // True if failure OR later reveal
        bool resolved;
    }

    /* ------------------------------- Constants -------------------------------- */

    uint8 public constant MAX_OUTGOING = 6;
    uint8 public constant MAX_INCOMING = 2;
    uint8 public constant MIN_ATTACK_TYPE = 1;
    uint8 public constant MAX_ATTACK_TYPE = 12;
    uint256 public constant MASK_SENTINEL = 0; // Masked attacker id in public success event

    /* --------------------------------- Storage -------------------------------- */

    // Incremental attack id
    uint256 public attackId;

    // day => nationId => counts
    mapping(uint256 => mapping(uint256 => DaySpies)) private _daySpyCount;

    // VRF request -> attackId
    mapping(uint256 => uint256) public vrfRequestToAttackId;

    // attackId -> pending (while waiting for VRF)
    mapping(uint256 => PendingAttack) public pending;

    // attackId -> final meta
    mapping(uint256 => AttackMeta) public attacks;

    /* -------------------------- External Contract Refs ------------------------ */

    IInfrastructure private inf;
    IForces private force;
    IMilitary private mil;
    INationStrength private strength;
    ITreasury private tsy;
    ICountryParameters private params;
    IMissiles private mis;
    IWonders1 private won1;
    IWonders2 private won2;
    ICountryMinter private mint;
    IKeeper private keep;
    ISpies private spy;

    /* ----------------------------- VRF Configuration --------------------------- */

    bytes32 private vrfKeyHash;
    uint256 private vrfSubId;
    uint16 private vrfMinConfirmations = 3;
    uint32 private vrfCallbackGasLimit;
    uint32 private vrfNumWords = 1;
    bool private useNativePayment = true;

    /* ---------------------------------- Events -------------------------------- */

    event SpyAttackCommitted(
        uint256 indexed attackId,
        uint256 indexed defenderId,
        uint8 attackType
    );
    event SpyAttackResolvedPublic(
        uint256 indexed attackId,
        uint256 maskedAttackerId,
        uint256 defenderId,
        bool success,
        uint256 attackType
    );
    event SpyAttackRevealed(uint256 indexed attackId, uint256 attackerId);
    event VrfRequested(uint256 indexed attackId, uint256 indexed requestId);

    event VrfConfigUpdated(
        bytes32 keyHash,
        uint64 subId,
        uint16 minConf,
        uint32 gasLimit,
        uint32 numWords,
        bool nativePayment
    );

    /* -------------------------------- Constructor ------------------------------ */

    constructor(
        address _vrfCoordinator,
        uint256 _subId,
        bytes32 _keyHash,
        uint32 _vrfCallbackGasLimit
    ) GelatoRelayContextERC2771() VRFConsumerBaseV2Plus(_vrfCoordinator) {
        vrfKeyHash = _keyHash;
        vrfSubId = _subId;
        vrfCallbackGasLimit = _vrfCallbackGasLimit;
    }

    /* ---------------------------- Owner Admin Setters ------------------------- */

    function settings(
        address _infrastructure,
        address _forces,
        address _military,
        address _nationStrength,
        address _wonders1,
        address _wonders2,
        address _treasury,
        address _parameters,
        address _missiles,
        address _countryMinter
    ) public onlyOwner {
        inf = IInfrastructure(_infrastructure);
        force = IForces(_forces);
        mil = IMilitary(_military);
        strength = INationStrength(_nationStrength);
        won1 = IWonders1(_wonders1);
        won2 = IWonders2(_wonders2);
        tsy = ITreasury(_treasury);
        params = ICountryParameters(payable(_parameters));
        mis = IMissiles(_missiles);
        mint = ICountryMinter(_countryMinter);
    }

    function settings2(address _keeper, address _spies) public onlyOwner {
        keep = IKeeper(_keeper);
        spy = ISpies(_spies);
    }

    function setVRFConfig(
        bytes32 _keyHash,
        uint64 _subId,
        uint16 _minConf,
        uint32 _gasLimit,
        uint32 _numWords,
        bool _useNative
    ) external onlyOwner {
        vrfKeyHash = _keyHash;
        vrfSubId = _subId;
        vrfMinConfirmations = _minConf;
        vrfCallbackGasLimit = _gasLimit;
        vrfNumWords = _numWords;
        useNativePayment = _useNative;
        emit VrfConfigUpdated(
            _keyHash,
            _subId,
            _minConf,
            _gasLimit,
            _numWords,
            _useNative
        );
    }

    /* ------------------------------ Public Getters ---------------------------- */

    function attackedAlready(uint256 defenderId) external view returns (bool) {
        uint256 day = keep.getGameDay();
        DaySpies storage def = _daySpyCount[day][defenderId];
        return def.incoming >= MAX_INCOMING;
    }

    function getAttackPublic(
        uint256 id
    )
        external
        view
        returns (
            uint256 attackerIdOrMask,
            uint256 defenderId,
            uint8 attackType,
            bool success,
            bool revealed,
            bool resolved
        )
    {
        AttackMeta storage m = attacks[id];
        require(m.resolved, "NOT_RESOLVED");
        uint256 shown = (m.success && !m.revealed)
            ? MASK_SENTINEL
            : m.attackerId;
        return (
            shown,
            m.defenderId,
            m.attackType,
            m.success,
            m.revealed,
            m.resolved
        );
    }

    event VrfRetried(
        uint256 indexed attackId,
        uint256 indexed oldRequestId,
        uint256 indexed newRequestId
    );
    event VrfRequestCleared(
        uint256 indexed attackId,
        uint256 indexed requestId
    );
    event VrfStaleResponseIgnored(
        uint256 indexed attackId,
        uint256 indexed staleRequestId
    );

    error RequestPending(uint256 attackId, uint256 retryAfter);
    error UnknownRequest(uint256 requestId);

    mapping(uint256 => bool) public pendingRequests; // attackId → in-flight?
    mapping(uint256 => uint256) public pendingRequestTimestamp; // attackId → block.timestamp
    mapping(uint256 => uint256) public attackIdToRequestId; // attackId → latest requestId     // requestId → attackId

    uint256 public constant RETRY_TIMEOUT = 5 minutes;

    /* helper: test if retry window elapsed */
    function canRetry(uint256 _attackId) public view returns (bool) {
        if (!pendingRequests[_attackId]) return true;
        return
            block.timestamp >=
            pendingRequestTimestamp[_attackId] + RETRY_TIMEOUT;
    }

    /* external retry entry -- make open or gated as you prefer */
    function retrySpyAttackVRF(uint256 _attackId) external onlyOwner {

        require(
            pendingRequests[_attackId] && canRetry(_attackId),
            "Retry not yet available"
        );
        _issueVRFRequest(_attackId);
    }

    function initiateSpyAttack(
        uint256 attackerId,
        uint256 defenderId,
        uint8 attackType
    ) external onlyGelatoRelayERC2771 returns (uint256 newAttackId) {
        require(
            attackType >= MIN_ATTACK_TYPE && attackType <= MAX_ATTACK_TYPE,
            "attackType"
        );
        require(attackerId != defenderId, "SELF");
        address user = _getMsgSender();
        require(mint.checkOwnership(attackerId, user), "!owner");

        _registerSpyOp(attackerId, defenderId);
        require(_internalCheckSpyOperation(defenderId, attackType), "!allowed");

        uint256 defenderStrength = strength.getNationStrength(defenderId);
        uint256 cost = _calculateSpyOpCost(attackType, defenderStrength);
        tsy.spendBalance(attackerId, cost);

        pending[attackId] = PendingAttack({
            attackerId: attackerId,
            defenderId: defenderId,
            attackType: attackType,
            exists: true
        });

        _issueVRFRequest(attackId);

        emit SpyAttackCommitted(attackId, defenderId, attackType);
        newAttackId = attackId;
        attackId++;
    }

    function _issueVRFRequest(uint256 _attackId) internal {
        if (
            pendingRequests[_attackId] &&
            block.timestamp < pendingRequestTimestamp[_attackId] + RETRY_TIMEOUT
        ) {
            revert RequestPending(
                _attackId,
                pendingRequestTimestamp[_attackId] + RETRY_TIMEOUT
            );
        }

        uint256 oldReqId = attackIdToRequestId[_attackId];
        uint256 newReqId = _requestRandomness(); // below

        vrfRequestToAttackId[newReqId] = _attackId;
        attackIdToRequestId[_attackId] = newReqId;
        pendingRequests[_attackId] = true;
        pendingRequestTimestamp[_attackId] = block.timestamp;

        if (oldReqId != 0 && oldReqId != newReqId) {
            emit VrfRetried(_attackId, oldReqId, newReqId);
        } else {
            emit VrfRequested(_attackId, newReqId);
        }
    }

    /* -------------------------- VRF Request Helper ---------------------------- */

    function _requestRandomness() internal returns (uint256 reqId) {
        VRFV2PlusClient.RandomWordsRequest memory req = VRFV2PlusClient
            .RandomWordsRequest({
                keyHash: vrfKeyHash,
                subId: vrfSubId,
                requestConfirmations: vrfMinConfirmations,
                callbackGasLimit: vrfCallbackGasLimit,
                numWords: vrfNumWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: useNativePayment
                    })
                )
            });

        reqId = s_vrfCoordinator.requestRandomWords(req);
    }

    /* -------------------------- VRF Fulfillment (v2.5) ------------------------ */

    /**
     * @dev VRFConsumerBaseV2Plus internal override.
     * NOTE: randomWords length = vrfNumWords.
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        uint256 _attackId = vrfRequestToAttackId[requestId];

        /* reject totally unknown requests */
        if (
            vrfRequestToAttackId[requestId] == 0 &&
            requestId != attackIdToRequestId[0]
        ) revert UnknownRequest(requestId);

        /* ignore stale fulfillments */
        if (
            attackIdToRequestId[_attackId] != requestId ||
            !pendingRequests[_attackId]
        ) {
            emit VrfStaleResponseIgnored(_attackId, requestId);
            return;
        }

        uint256 id = vrfRequestToAttackId[requestId];
        require(pending[id].exists, "no pending");

        PendingAttack memory p = pending[id];
        delete pending[id];
        delete vrfRequestToAttackId[requestId];

        // Compute success
        uint256 atkScore = getAttackerSuccessScore(p.attackerId);
        uint256 defScore = getDefenseSuccessScore(p.defenderId);
        uint256 total = atkScore + defScore;
        bool success = false;
        if (total > 0) {
            success = (randomWords[0] % total) < atkScore;
        }

        attacks[id] = AttackMeta({
            attackerId: p.attackerId,
            defenderId: p.defenderId,
            attackType: p.attackType,
            success: success,
            revealed: !success,
            resolved: true
        });

        if (success) {
            uint256 effectRand = uint256(
                keccak256(
                    abi.encode(randomWords[0], id, p.attackerId, p.defenderId)
                )
            );
            _applySpyEffects(
                p.attackerId,
                p.defenderId,
                p.attackType,
                effectRand
            );
            emit SpyAttackResolvedPublic(
                id,
                MASK_SENTINEL,
                p.defenderId,
                true,
                p.attackType
            );
        } else {
            emit SpyAttackResolvedPublic(
                id,
                p.attackerId,
                p.defenderId,
                false,
                p.attackType
            );
        }

        delete pendingRequests[_attackId];
        delete pendingRequestTimestamp[_attackId];
        delete attackIdToRequestId[_attackId];
        delete vrfRequestToAttackId[requestId];

        emit VrfRequestCleared(_attackId, requestId);
    }

    /* ------------------------------ Reveal Success ---------------------------- */

    function revealAttack(uint256 id) external {
        AttackMeta storage m = attacks[id];
        require(m.resolved, "!resolved");
        require(m.success, "only success");
        require(!m.revealed, "revealed");
        require(
            mint.checkOwnership(m.attackerId, _getMsgSender()) ||
                msg.sender == owner(),
            "!auth"
        );
        m.revealed = true;
        emit SpyAttackRevealed(id, m.attackerId);
    }

    /* ------------------------- Daily Cap Registration ------------------------- */

    function _registerSpyOp(uint256 attackerId, uint256 defenderId) internal {
        uint256 day = keep.getGameDay();

        DaySpies storage atk = _daySpyCount[day][attackerId];
        require(atk.outgoing < MAX_OUTGOING, "atk cap");
        atk.outgoing += 1;

        DaySpies storage def = _daySpyCount[day][defenderId];
        require(def.incoming < MAX_INCOMING, "def cap");
        def.incoming += 1;
    }

    /* ---------------------- Operation Allowance (internal) -------------------- */

    function _internalCheckSpyOperation(
        uint256 defenderId,
        uint8 attackType
    ) internal view returns (bool) {
        uint256 infra = inf.getInfrastructureCount(defenderId);
        uint256 tech = inf.getTechnologyCount(defenderId);
        uint256 land = inf.getLandCount(defenderId);

        if (attackType == 4) require(land >= 15, "land<15");
        if (attackType == 10) require(tech >= 15, "tech<15");
        if (attackType == 11) require(infra >= 15, "infra<15");
        if (attackType == 12) {
            uint256 nukeCount = mis.getNukeCount(defenderId);
            bool silo = won2.getHiddenNuclearMissileSilo(defenderId);
            if (silo) require(nukeCount >= 6, "nukes<6");
            else require(nukeCount >= 1, "nukes<1");
        }
        return true;
    }

    /* --------------------------- Success Score Logic -------------------------- */

    function getAttackerSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
        uint256 spyCount = spy.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 score = spyCount + (techAmount / 15);
        if (won1.getCentralIntelligenceAgency(countryId)) {
            score = (score * 110) / 100;
        }
        if (_accommodativeGov(countryId)) {
            score = (score * 110) / 100;
        }
        return score;
    }

    function getDefenseSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
        uint256 spyCount = spy.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 landAmount = inf.getLandCount(countryId);
        uint256 threat = mil.getThreatLevel(countryId);

        uint256 gross = spyCount + (techAmount / 20) + (landAmount / 70);
        if (threat == 1) return (gross * 75) / 100;
        if (threat == 2) return (gross * 90) / 100;
        if (threat == 3) return gross;
        if (threat == 4) return (gross * 110) / 100;
        if (threat == 4) return (gross * 125) / 100;
        return (gross * 125) / 100;
    }

    function _accommodativeGov(uint256 id) internal view returns (bool) {
        uint256 g = params.getGovernmentType(id);
        return (g == 2 || g == 7 || g == 10);
    }

    /* ------------------------------ Cost Function ----------------------------- */

    function _calculateSpyOpCost(
        uint8 attackType,
        uint256 defenderStrength
    ) internal pure returns (uint256) {
        if (attackType == 1) return 100_000 + defenderStrength;
        if (attackType == 2) return 100_000 + defenderStrength * 2;
        if (attackType == 3) return 100_000 + defenderStrength * 3;
        if (attackType == 4) return 100_000 + defenderStrength * 3;
        if (attackType == 5) return 100_000 + defenderStrength * 3;
        if (attackType == 6) return 150_000 + defenderStrength;
        if (attackType == 7) return 150_000 + defenderStrength * 5;
        if (attackType == 8) return 250_000 + defenderStrength * 2;
        if (attackType == 9) return 300_000 + defenderStrength * 2;
        if (attackType == 10) return 100_000 + defenderStrength * 20;
        if (attackType == 11) return 500_000 + defenderStrength * 5;
        if (attackType == 12) return 500_000 + defenderStrength * 15;
        revert("attackType");
    }

    /* ------------------------------- Effect Engine ---------------------------- */

    function _applySpyEffects(
        uint256 /*attackerId*/,
        uint256 defenderId,
        uint8 attackType,
        uint256 seed
    ) internal {
        if (attackType == 1) {
            _destroyCruiseMissiles(defenderId, seed);
        } else if (attackType == 2) {
            _destroyDefendingTanks(defenderId, seed);
        } else if (attackType == 3) {
            _captureLand(defenderId, seed);
        } else if (attackType == 4) {
            _changeDesiredGovernment(defenderId, seed);
        } else if (attackType == 5) {
            _changeDesiredReligion(defenderId, seed);
        } else if (attackType == 6) {
            mil.setThreatLevelFromSpyContract(defenderId, 1);
        } else if (attackType == 7) {
            mil.setDefconLevelFromSpyContract(defenderId, 5);
        } else if (attackType == 8) {
            _destroySpies(defenderId, seed);
        } else if (attackType == 9) {
            _captureTechnology(defenderId, seed);
        } else if (attackType == 10) {
            _sabotageTaxes(defenderId, seed);
        } else if (attackType == 11) {
            _captureInfrastructure(defenderId, seed);
        } else if (attackType == 12) {
            mis.decreaseNukeCountFromSpyContract(defenderId);
        }
    }

    function _randSlice(
        uint256 seed,
        bytes32 tag,
        uint256 modBase
    ) private pure returns (uint256) {
        return uint256(keccak256(abi.encode(seed, tag))) % modBase;
    }

    function _destroyCruiseMissiles(uint256 defenderId, uint256 seed) internal {
        uint256 amount = (_randSlice(seed, "CRUISE", 5) + 1); // 1..5
        mis.decreaseCruiseMissileCount(amount, defenderId);
    }

    function _destroyDefendingTanks(uint256 defenderId, uint256 seed) internal {
        uint256 pct = (_randSlice(seed, "TANKS", 5) + 5); // 5..9%
        uint256 defending = force.getDefendingTankCount(defenderId);
        uint256 delta = (defending * pct) / 100;
        if (delta > 0) force.decreaseDefendingTankCount(delta, defenderId);
    }

    function _captureLand(uint256 defenderId, uint256 seed) internal {
        uint256 amt = (_randSlice(seed, "LAND", 10) + 5); // 5..14
        inf.decreaseLandCountFromSpyContract(defenderId, amt);
    }

    function _changeDesiredGovernment(
        uint256 defenderId,
        uint256 seed
    ) internal {
        uint256 current = params.getGovernmentPreference(defenderId);
        uint256 newPref = (_randSlice(seed, "GOV", 10) + 1); // 1..10
        if (newPref == current) {
            newPref = (current == 1) ? 2 : current - 1;
        }
        params.updateDesiredGovernment(defenderId, newPref);
    }

    function _changeDesiredReligion(uint256 defenderId, uint256 seed) internal {
        uint256 current = params.getReligionPreference(defenderId);
        uint256 newPref = (_randSlice(seed, "REL", 14) + 1); // 1..14
        if (newPref == current) {
            newPref = (current == 1) ? 2 : current - 1;
        }
        params.updateDesiredReligion(defenderId, newPref);
    }

    function _destroySpies(uint256 defenderId, uint256 seed) internal {
        uint256 spyCount = spy.getSpyCount(defenderId);
        uint256 toDestroy = (_randSlice(seed, "SPY", 20) + 1); // 1..20
        if (toDestroy > spyCount) toDestroy = spyCount;
        if (toDestroy > 0) spy.decreaseDefenderSpyCount(toDestroy, defenderId);
    }

    function _captureTechnology(uint256 defenderId, uint256 seed) internal {
        uint256 amt = (_randSlice(seed, "TECH", 10) + 5); // 5..14
        inf.decreaseTechCountFromSpyContract(defenderId, amt);
    }

    function _sabotageTaxes(uint256 defenderId, uint256 seed) internal {
        uint256 newRate = (_randSlice(seed, "TAX", 4) + 20); // 20..23
        inf.setTaxRateFromSpyContract(defenderId, newRate);
    }

    function _captureInfrastructure(uint256 defenderId, uint256 seed) internal {
        uint256 amt = (_randSlice(seed, "INFRA", 10) + 5); // 5..14
        inf.decreaseInfrastructureCountFromSpyContract(defenderId, amt);
    }
}
