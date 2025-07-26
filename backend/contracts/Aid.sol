// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "./Senate.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title AidContract this contract facilitates aid being sent between nations
/// @author OxSnosh
contract AidContract is Ownable, ReentrancyGuard {
    address public countryMinter;
    address public treasury;
    address public forces;
    address public keeper;
    address public infrastructure;
    address public wonder1;
    address public senate;
    address public countryParameters;
    uint256 public aidProposalId;
    uint256 public proposalExpirationDays = 7;

    CountryMinter mint;
    WondersContract1 won1;
    KeeperContract keep;
    SenateContract sen;
    CountryParametersContract param;

    /// @dev this function is callable by the owner only
    /// @dev this function will be called after deployment to initiate contract pointers within this contract
    function settings(
        address _countryMinter,
        address _treasury,
        address _forces,
        address _infrastructure,
        address _keeper,
        address _wonder1,
        address _senate,
        address _countryParameters
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        treasury = _treasury;
        forces = _forces;
        infrastructure = _infrastructure;
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        wonder1 = _wonder1;
        won1 = WondersContract1(_wonder1);
        senate = _senate;
        sen = SenateContract(_senate);
        countryParameters = _countryParameters;
        param = CountryParametersContract(payable(_countryParameters));
    }

    struct Proposal {
        uint256 proposalId;
        uint256 dayProposed;
        uint256 idSender;
        uint256 idRecipient;
        uint256 techAid;
        uint256 soldierAid;
        bool accepted;
        bool cancelled;
    }

    event AidProposed(
        uint256 indexed proposalId,
        uint256 indexed idSender,
        uint256 indexed idRecipient,
        uint256 dayProposed,
        uint256 techAid,
        uint256 soldierAid
    );

    event AidAccepted(
        uint256 indexed proposalId,
        uint256 indexed idSender,
        uint256 indexed idRecipient,
        uint256 techAid,
        uint256 soldierAid
    );

    event ProposalCancelled(
        uint256 indexed proposalId,
        uint256 indexed idSender,
        uint256 indexed idRecipient
    );

    mapping(uint256 => Proposal) public idToProposal;
    mapping(uint256 => uint256[]) public idToAidProposalsSent;
    mapping(uint256 => uint256[]) public idToAidProposalsReceived;
    mapping(uint256 => mapping(uint256 => uint256[]))
        public idToAidProposalsLast10Days;

    /// @dev this is the function a nations owner will call to initiate an aid proposal
    /// @param idSender is the country ID of the aid sender (caller of the function)
    /// @param idRecipient is the country ID of the aid recipient
    /// @param techAid is the amount of Technology being sent in the proposal
    /// @param soldiersAid is the amount of troops beind sent in the proposal
    /// @notice the max aid is 100 Tech, 6,000,000 balance and 4,000 soldiers without a Federal Aid Commission
    /// @notice the max aid is 150 Tech, 9,000,000 balance and 6,000 soldiers with a Federal Aid Commission
    function proposeAid(
        uint256 idSender,
        uint256 idRecipient,
        uint256 techAid,
        uint256 soldiersAid
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(idSender, msg.sender);
        require(isOwner, "!nation ruler");
        bool availableAidSlot = checkAidSlots(idSender);
        require(availableAidSlot, "aid slot not available");
        bool availableAidSlotRecipient = checkAidSlots(idRecipient);
        require(availableAidSlotRecipient, "recipient aid slot not available");
        uint256 day = keep.getGameDay();
        idToAidProposalsLast10Days[idSender][day].push(aidProposalId);
        idToAidProposalsLast10Days[idRecipient][day].push(aidProposalId);
        bool aidAvailable = checkAvailability(
            idSender,
            techAid,
            soldiersAid
        );
        require(aidAvailable, "aid not available");
        bool sanctioned = sen.isSanctioned(idSender, idRecipient);
        require(!sanctioned, "trade not possible");
        bool federalAidEligible = getFederalAidEligibility(
            idSender,
            idRecipient
        );
        uint256[2] memory maximums;
        if (!federalAidEligible) {
            maximums = [
                uint256(100),
                uint256(4000)
            ];
        }
        if (federalAidEligible) {
            maximums = [
                uint256(150),
                uint256(6000)
            ];
        }
        require(techAid <= maximums[0], "max tech exceeded");
        require(soldiersAid <= maximums[1], "max soldier aid is exceeded");
        completeProposal(
            aidProposalId,
            day,
            idSender,
            idRecipient,
            techAid,
            soldiersAid
        );
    }

    function completeProposal(
        uint256 proposalId,
        uint256 day,
        uint256 idSender,
        uint256 idRecipient,
        uint256 techAid,
        uint256 soldiersAid
    ) internal {
        Proposal memory newProposal = Proposal(
            proposalId,
            day,
            idSender,
            idRecipient,
            techAid,
            soldiersAid,
            false,
            false
        );
        idToProposal[proposalId] = newProposal;
        idToAidProposalsSent[idSender].push(proposalId);
        idToAidProposalsReceived[idRecipient].push(proposalId);
        emit AidProposed(
            proposalId,
            idSender,
            idRecipient,
            day,
            techAid,
            soldiersAid
        );
        aidProposalId++;
    }

    ///@dev this function is public but called by the proposeAid() function to check the availabiliy of proposing aid
    ///@notice nations can only send one aid proposal per day without a Disaster Relief Agency
    ///@notice nations can send 2 aid proposals per day with a disaster relief agency
    ///@param idSender id the nation ID of the nation proposing aid
    ///@return bool returns a boolean value if there is an aid slot available for the propposal
    function checkAidSlots(uint256 idSender) public view returns (bool) {
        uint256 maxAidSlots = getMaxAidSlots(idSender);
        uint256 aidProposalsLast10Days = getAidProposalsLast10Days(idSender);
        if ((aidProposalsLast10Days + 1) <= maxAidSlots) {
            return true;
        } else {
            return false;
        }
    }

    ///@dev this function is public but also callable from the proposeAid() function
    ///@notice this function checks max aid slots per day for a nation
    ///@notice max aid slots allow you to propose 10 aid packages every 10 days (13 with a disaster relief agency)
    ///@param id id the nation ID of the nation proposing aid
    ///@return uint256 defaults to 1 aid slot per day and 2 with a disaster relief agency
    function getMaxAidSlots(uint256 id) public view returns (uint256) {
        uint256 maxAidSlotsPer10Days = 10;
        bool disasterReliefAgency = won1.getDisasterReliefAgency(id);
        if (disasterReliefAgency) {
            maxAidSlotsPer10Days += 3;
        }
        return (maxAidSlotsPer10Days);
    }

    function getAidProposalsLast10Days(
        uint256 id
    ) public view returns (uint256) {
        uint256 day = keep.getGameDay();
        uint256 proposalsLast10Days = 0;
        uint256 daysToCheck;
        if (day >= 10) {
            daysToCheck = 10;
        } else {
            daysToCheck = day;
        }
        for (uint256 i = 0; i < daysToCheck; i++) {
            uint256 dayToCheck = day - i;
            proposalsLast10Days += idToAidProposalsLast10Days[id][dayToCheck]
                .length;
            uint256[] memory proposalsForThatDay = idToAidProposalsLast10Days[
                id
            ][dayToCheck];
            for (uint256 j = 0; j < proposalsForThatDay.length; j++) {
                uint256 proposalId = proposalsForThatDay[j];
                bool cancelled = idToProposal[proposalId].cancelled;
                if (cancelled) {
                    proposalsLast10Days -= 1;
                }
            }
        }
        return proposalsLast10Days;
    }

    ///@dev this function is public but also callable by the proposeAid() and acceptProposal() function
    ///@notice this function checks that the aid proposed is less than the available aid of the sender nation
    ///@param idSender is the nation ID of the nations proposing aid
    ///@param techAid is the amount of Tech in the aid proposal
    ///@param soldiersAid is the amount of soldiers in the aid proposal
    ///@return bool true if the sender has enough of each aid parameter to send
    function checkAvailability(
        uint256 idSender,
        uint256 techAid,
        uint256 soldiersAid
    ) public view returns (bool) {
        uint256 techAvailable = InfrastructureContract(infrastructure)
            .getTechnologyCount(idSender);
        uint256 soldiersAvailable = ForcesContract(forces)
            .getDefendingSoldierCount(idSender);
        require(techAvailable >= techAid, "not enough tech for this proposal");
        require(
            soldiersAvailable >= soldiersAid,
            "not enough soldiers for this proposal"
        );
        return true;
    }

    ///@dev this function is a public view function that is called by the proposeAid() function
    ///@notice if both nations have a federal aid commission then max aid amounts increase 50%
    ///@param idSender is the nation ID of the sender of the aid proposal
    ///@param idRecipient id the nation ID of the recipient of the aid proposal
    ///@return bool true if both sender and reciever have a federal aid commission
    function getFederalAidEligibility(
        uint256 idSender,
        uint256 idRecipient
    ) public view returns (bool) {
        bool senderEligable = won1.getFederalAidCommission(idSender);
        bool recipientEligable = won1.getFederalAidCommission(idRecipient);
        if (senderEligable && recipientEligable) {
            return true;
        } else {
            return false;
        }
    }

    ///@dev this function is only callable by the owner of the contract
    ///@dev this function allows the contract owner to set how long aid proposals stay active for
    function setProposalExpiration(uint256 newExpiration) public onlyOwner {
        proposalExpirationDays = newExpiration;
    }

    ///@dev this is a view function that allows anyone to view the duration aid proposals have untile they expire
    ///@return uint256 the number of days a proposal has to be expected otherwise it expires
    function getProposalExpiration() public view returns (uint256) {
        return proposalExpirationDays;
    }

    ///@dev this function is a public view function that checks to see if an aid propoals is expired (too much time has elapsed since proposal)
    ///@notice this function will prevent an aid proposal from being fulfilled if the proposal is passed the expiration duration
    ///@param proposalId id the ID of the aid proposal
    ///@return bool true if amount of time elapsed since proposal is greater than the proposal expiration time
    function proposalExpired(uint256 proposalId) public view returns (bool) {
        uint256 day = keep.getGameDay();
        uint256 dayProposed = idToProposal[proposalId].dayProposed;
        uint256 timeElapsed = (day - dayProposed);
        bool expired = false;
        if (timeElapsed > proposalExpirationDays) {
            expired = true;
        }
        return expired;
    }

    ///@dev this is a public function that is callable by the recipient of the aid proposal
    ///@notice this function is called by the recipient of an aid proposal in order to accept the aid
    ///@param proposalId this id the ID of the aid proposal
    function acceptProposal(uint256 proposalId) public nonReentrant {
        require(!idToProposal[proposalId].accepted, "this offer has been accepted already");
        require(!idToProposal[proposalId].cancelled, "this offer has been cancelled");
        uint256 idSender = idToProposal[proposalId].idSender;
        uint256 idRecipient = idToProposal[proposalId].idRecipient;
        if (proposalExpired(proposalId)) {
            removeProposal(proposalId, idSender, idRecipient);
            revert("Proposal expired and removed");
        }
        uint256 tech = idToProposal[proposalId].techAid;
        uint256 soldiers = idToProposal[proposalId].soldierAid;
        address addressRecipient = mint.ownerOf(idRecipient);
        require(
            addressRecipient == msg.sender,
            "you are not the recipient of this proposal"
        );
        bool sanctioned = sen.isSanctioned(idSender, idRecipient);
        require(!sanctioned, "trade not possible");
        bool available = checkAvailability(idSender, tech, soldiers);
        require(available, "balances not available");
        idToProposal[proposalId].accepted = true;
        require(InfrastructureContract(infrastructure).sendTech(
            idSender,
            idRecipient,
            tech
        ));
        require(ForcesContract(forces).sendSoldiers(idSender, idRecipient, soldiers));
        finishAcceptProposal(
            proposalId,
            idSender,
            idRecipient,
            tech,
            soldiers
        );
    }

    function finishAcceptProposal(
        uint256 proposalId,
        uint256 idSender,
        uint256 idRecipient,
        uint256 tech,
        uint256 soldiers
    ) internal {
        uint256[] storage senderProposals = idToAidProposalsSent[idSender];
        uint256[] storage recipientProposals = idToAidProposalsReceived[
            idRecipient
        ];
        uint256 day = keep.getGameDay();
        for (uint256 i = 0; i < senderProposals.length; i++) {
            if (senderProposals[i] == proposalId) {
                senderProposals[i] = senderProposals[senderProposals.length - 1];
                senderProposals.pop();
            }
            Proposal memory proposal = idToProposal[proposalId];
            if (day - proposal.dayProposed > proposalExpirationDays) {
                senderProposals[i] = senderProposals[senderProposals.length - 1];
                senderProposals.pop();                    
            }
        }
        for (uint256 i = 0; i < recipientProposals.length; i++) {
            if (recipientProposals[i] == proposalId) {
                recipientProposals[i] = recipientProposals[recipientProposals
                    .length - 1];
                recipientProposals.pop();
            }
            Proposal memory proposal = idToProposal[proposalId];
            if (day - proposal.dayProposed > proposalExpirationDays) {
                recipientProposals[i] = recipientProposals[recipientProposals
                    .length - 1];
                recipientProposals.pop();                    
            }
        }
        emit AidAccepted(
            proposalId,
            idSender,
            idRecipient,
            tech,
            soldiers
        );
    }

    function removeProposal(uint256 proposalId, uint256 idSender, uint256 idRecipient) internal {
        delete idToProposal[proposalId];

        uint256[] storage senderProposals = idToAidProposalsSent[idSender];
        uint256[] storage recipientProposals = idToAidProposalsReceived[idRecipient];

        // Remove from sender's proposals
        for (uint256 i = 0; i < senderProposals.length; i++) {
            if (senderProposals[i] == proposalId) {
                senderProposals[i] = senderProposals[senderProposals.length - 1];
                senderProposals.pop();
                break;
            }
        }

        // Remove from recipient's proposals
        for (uint256 i = 0; i < recipientProposals.length; i++) {
            if (recipientProposals[i] == proposalId) {
                recipientProposals[i] = recipientProposals[recipientProposals.length - 1];
                recipientProposals.pop();
                break;
            }
        }
    }

    ///@dev this function is a public function that allows the aid proposal to be cancelled by the sender of the proposal
    ///@notice this function allows the aid sender or recipient to cancel an aid proposal prior to it being accepted
    ///@param proposalId this is the id of the proposal
    function cancelAid(uint256 proposalId) public nonReentrant{
        uint256 idRecipient = idToProposal[proposalId].idRecipient;
        uint256 idSender = idToProposal[proposalId].idSender;
        address addressRecipient = mint.ownerOf(idRecipient);
        address addressSender = mint.ownerOf(idSender);
        require(
            addressSender == msg.sender || addressRecipient == msg.sender,
            "caller not a participant in this trade"
        );
        bool cancelled = idToProposal[proposalId].cancelled;
        require(cancelled == false, "trade already cancelled");
        bool accepted = idToProposal[proposalId].accepted;
        require(accepted == false, "trade already accepted");
        bool expired = proposalExpired(proposalId);
        require(expired == false, "trade already expired");
        idToProposal[proposalId].cancelled = true;
        uint256 nationCancelling;
        if (addressSender == msg.sender) {
            nationCancelling = idSender;
        } else if (addressRecipient == msg.sender) {
            nationCancelling = idRecipient;
        }
        completeCancelAid(proposalId, idSender, idRecipient);
    }

    function completeCancelAid(
        uint256 proposalId,
        uint256 idSender,
        uint256 idRecipient
    ) internal {
        uint256[] storage senderProposals = idToAidProposalsSent[idSender];
        uint256[] storage recipientProposals = idToAidProposalsReceived[
            idRecipient
        ];
        uint256 day = keep.getGameDay();
        for (uint256 i = 0; i < senderProposals.length; i++) {
            if (senderProposals[i] == proposalId) {
                senderProposals[i] = senderProposals[senderProposals.length - 1];
                senderProposals.pop();
            }
            Proposal memory proposal = idToProposal[proposalId];
            if (day - proposal.dayProposed > proposalExpirationDays) {
                senderProposals[i] = senderProposals[senderProposals.length - 1];
                senderProposals.pop();                    
            }
        }
        for (uint256 i = 0; i < recipientProposals.length; i++) {
            if (recipientProposals[i] == proposalId) {
                recipientProposals[i] = recipientProposals[recipientProposals
                    .length - 1];
                recipientProposals.pop();
            }
            Proposal memory proposal = idToProposal[proposalId];
            if (day - proposal.dayProposed > proposalExpirationDays) {
                recipientProposals[i] = recipientProposals[recipientProposals
                    .length - 1];
                recipientProposals.pop();                    
            }
        }
        emit ProposalCancelled(
            proposalId,
            idSender,
            idRecipient
        );
    }

    ///@dev this is public view function that allows a caller to return the items in a proposal struct
    ///@return uint256 this funtion returns the contects of a proposal struct
    function getProposal(
        uint256 proposalId
    )
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        return (
            idToProposal[proposalId].proposalId,
            idToProposal[proposalId].dayProposed,
            idToProposal[proposalId].idSender,
            idToProposal[proposalId].idRecipient,
            idToProposal[proposalId].techAid,
            idToProposal[proposalId].soldierAid
        );
    }

    ///@dev this function is a public view function that allows the caller to see if an aid proposal is cancelled or accepted already
    ///@return bool true if the proposal has cancelled or accepted
    function checkCancelledOrAccepted(
        uint256 proposalId
    ) public view returns (bool, bool) {
        return (
            idToProposal[proposalId].accepted,
            idToProposal[proposalId].cancelled
        );
    }

    function getProposalsSent(uint256 id)
        public
        view
        returns (uint256[] memory)
    {
        return idToAidProposalsSent[id];
    }

    function getProposalsReceived(uint256 id)
        public
        view
        returns (uint256[] memory)
    {
        return idToAidProposalsReceived[id];
    }
}
