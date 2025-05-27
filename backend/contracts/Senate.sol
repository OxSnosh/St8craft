//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title SenateContract
///@author OxSnosh
///@notice this contract will allow nation owners to vote for team senators
///@notice team senators will be able to sanction nations from trading with trading partners on the same team
///@dev this contract inherits from the openzeppelin ownable contract
contract SenateContract is Ownable {

    uint256 public epoch = 1;
    uint256 public interval = 28;
    uint256 maximumSanctions = 200;
    
    uint256 public dayOfLastElection;

    address public countryMinter;
    address public parameters;
    address public wonders3;
    address public keeper;
    address public resources;

    WondersContract3 won3;
    CountryMinter mint;
    KeeperContract keep;
    CountryParametersContract params;
    ResourcesContract res;

    struct Voter {
        bool initialized;
        uint256 lastVoteCast;
        bool senator;
        uint256 team;
        uint256 dayTeamJoined;
        mapping(uint256 => bool) sanctionsByTeam;
        mapping(uint256 => uint256) dayOfSanctionByTeam;
    }

    event Vote(
        uint256 indexed voterId,
        uint256 indexed team,
        uint256 indexed voteCastFor,
        address voter
    );

    event Sanction(
        uint256 indexed senatorId,
        uint256 indexed team,
        uint256 indexed sanctionedId
    );

    event SanctionLifted(
        uint256 indexed senatorId,
        uint256 indexed team,
        uint256 indexed sanctionedId
    );

    mapping(uint256 => Voter) public idToVoter;
    mapping(uint256 => uint256[]) public teamToCurrentSanctions;
    mapping(uint256 => mapping(uint256 => uint256[])) epochToTeamToSenatorVotes;
    mapping(uint256 => mapping(uint256 => uint256[])) epochToTeamToWinners;

    ///@param _interval is in days
    function updateInterval(uint _interval) public onlyOwner {
        interval = _interval;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _parameters,
        address _wonders3,
        address _keeper,
        address _resources
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        parameters = _parameters;
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        resources = _resources;
        res = ResourcesContract(_resources);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryminter"
        );
        _;
    }

    modifier onlyCountryParameters() {
        require(
            msg.sender == parameters,
            "function only callable from country paraeters contract"
        );
        _;
    }

    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryParametersContract(
        address newAddress
    ) public onlyOwner {
        parameters = newAddress;
        params = CountryParametersContract(newAddress);
    }

    ///@dev this function is only callable by the country minter contract when a nation is minted
    ///@notice this contract will allow set up a nations voting and senate capabilities upon minting
    ///@param id is the nation id of the nation being minted
    function generateVoter(uint256 id) public onlyCountryMinter {
        require(
            idToVoter[id].initialized == false,
            "Voter already initialized"
        );
        uint256 day = keep.getGameDay();
        Voter storage newVoter = idToVoter[id];
        newVoter.initialized = true;
        newVoter.lastVoteCast = 0;
        newVoter.senator = false;
        newVoter.team = 0;
        newVoter.dayTeamJoined = day;
    }

    ///@dev this function is only callable from the country parameters contract
    ///@notice this function will reset a nations team and votes for senator when a nation changes teams
    ///@param id is the nation id of the nation that changed team
    ///@param newTeam is the id of the new team the given nation joined
    function updateTeam(
        uint256 id,
        uint256 newTeam
    ) public onlyCountryParameters {
        uint256 day = keep.getGameDay();
        idToVoter[id].team = newTeam;
        idToVoter[id].dayTeamJoined = day;
    }

    ///@dev this is a public function callable only by the nation owner that will allow a nation to vote for a team senator
    ///@notice this function will allow a nation to vote for a team senator on their team
    ///@notice this function will emit a Vote event when a nation votes
    ///@notice you can only vote for a fellow team member
    ///@notice you can only vote once per epoch
    ///@param idVoter is the nation id of the nation casting the vote
    ///@param idOfSenateVote is the nation id of the nation being voted for senate
    function voteForSenator(uint256 idVoter, uint256 idOfSenateVote) public {
        bool isOwner = mint.checkOwnership(idVoter, msg.sender);
        require(isOwner, "!nation owner");
        require(idVoter != idOfSenateVote, "cannot vote for yourself");

        uint256 gameDay = keep.getGameDay();
        uint256 dayLastVoted = idToVoter[idVoter].lastVoteCast;

        require(
            dayLastVoted <= dayOfLastElection,
            "you already voted this epoch"
        );
        require(
            !hasVotedThisEpoch(idVoter),
            "nation has already voted this epoch"
        );

        uint256 dayTeamJoined = idToVoter[idVoter].dayTeamJoined;
        if (gameDay >= 30) {
            require(
                (dayTeamJoined + 30) < gameDay,
                "you must be on a team for 30 days before voting for a senator"
            );
        }

        uint256 voterTeam = idToVoter[idVoter].team;
        uint256 teamOfVote = idToVoter[idOfSenateVote].team;
        require(
            teamOfVote == voterTeam,
            "you can only vote for a fellow team member"
        );
        require(
            epochToTeamToSenatorVotes[epoch][voterTeam].length < 15000,
            "Vote limit reached for this team in this epoch"
        );
        epochToTeamToSenatorVotes[epoch][voterTeam].push(idOfSenateVote);

        bool lobbyists = won3.getPoliticalLobbyists(idVoter);
        if (lobbyists) {
            epochToTeamToSenatorVotes[epoch][voterTeam].push(idOfSenateVote);
        }

        idToVoter[idVoter].lastVoteCast = gameDay;
        recordVote(idVoter);

        emit Vote(idVoter, voterTeam, idOfSenateVote, msg.sender);
    }

    mapping(uint256 => uint256) private lastVoteEpoch;

    function hasVotedThisEpoch(uint256 idVoter) internal view returns (bool) {
        return lastVoteEpoch[idVoter] == epoch;
    }

    function recordVote(uint256 idVoter) internal {
        lastVoteEpoch[idVoter] = epoch;
    }

    function checkUpkeep() external view returns (bool upkeepNeeded) {
        uint256 gameDay = keep.getGameDay();
        upkeepNeeded = (gameDay - dayOfLastElection) > interval;
        return (upkeepNeeded);
    }

    function performUpkeep() external {
        require(this.checkUpkeep(), "Upkeep not needed");
        uint256 gameDay = keep.getGameDay();
        if ((gameDay - dayOfLastElection) > interval) {
            for (uint256 i = 0; i <= 8; i++) {
                runElections(i, epoch);
            }
            epoch++;
            dayOfLastElection = gameDay;
        }
    }

    uint256 orderId;

    struct Election {
        uint256 team;
        uint256 epoch;
        uint256[] teamVotes;
        uint256[] winners;
        bool completed;
    }

    mapping (uint256 => Election) public elections;

    event ElectionStarted(
        uint256 team,
        uint256 epoch,
        uint256[] teamVotes,
        uint256 orderId
    );

    ///@dev this is a public function that will be called from an off chain source
    ///@notice this function is only callable from the keeper performUpkeep()
    ///@notice this function will make the nations who won the team 7 election senators
    ///@param team this is the team for which the election is being conducted
    ///@param _epoch this is the epoch for which the election is occuring
    function runElections(
        uint256 team,
        uint256 _epoch
    ) internal {
       uint256[] memory teamVotes = epochToTeamToSenatorVotes[_epoch][team];
       elections[orderId] = Election({
            team: team,
            epoch: _epoch,
            teamVotes: teamVotes,
            winners: new uint256[](0),
            completed: false
        });
        emit ElectionStarted(
            team,
            _epoch,
            teamVotes,
            orderId
        );
        orderId++;
    }

    address public oracle = 0xdB3892b0FD38D73B65a9AD2fC3920B74B2B71dfb;

    modifier onlyOracle() {
        require(msg.sender == oracle, "!ORACLE");
        _;
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    ///@dev this is a public function that will be called from an off chain source
    ///@notice this function is only callable from the keeper performUpkeep()
    ///@notice this function will be called when the election is complete
    ///@param _orderId is the request id of the election
    ///@param _winners is the winners of the election
    ///@notice this function will set the winners of the election as senators
    ///@notice this function will set the previous senators to false
    function completeElection(
        uint256 _orderId,
        uint256[] memory _winners
    ) public onlyOracle {
        require(
            elections[_orderId].completed == false, "election already completed"
        );
        uint256 team = elections[_orderId].team;
        uint256 _epoch = elections[_orderId].epoch;
        elections[_orderId].winners = _winners;
        elections[_orderId].completed = true;
        uint256[] memory currentSenators = epochToTeamToWinners[_epoch - 1][team];
        for (uint i = 0; i < currentSenators.length; i++) {
            idToVoter[currentSenators[i]].senator = false;
        }
        for (uint256 i = 0; i < _winners.length; i++) {
            idToVoter[_winners[i]].senator = true;
        }
        epochToTeamToWinners[_epoch][team] = _winners;
    }

    ///@dev this is a public function that can only be called by the contract owner
    ///@param _maximumSanctions is the maximum number of sanctions a team can have at one time
    function updaateMaximumSanctions(
        uint256 _maximumSanctions
    ) public onlyOwner {
        maximumSanctions = _maximumSanctions;
    }

    ///@dev this is a public function callable by a senator
    ///@notice this function will only work if the senator and the nation being sanctioned are on the same team
    ///@param idSenator is the id of the senator calling the function that will cast the vote to sanction
    ///@param idSanctioned is the nation id of the nation who the senator is voting to sanction
    function sanctionTeamMember(
        uint256 idSenator,
        uint256 idSanctioned
    ) public {
        bool owner = mint.checkOwnership(idSenator, msg.sender);
        require(owner, "!nation owner");
        require(idToVoter[idSenator].senator == true, "!senator");
        require(
            idToVoter[idSanctioned].senator == false,
            "cannot sanction a senator"
        );
        uint256 senatorTeam = idToVoter[idSenator].team;
        uint256 sanctionedTeam = idToVoter[idSanctioned].team;
        require(
            senatorTeam == sanctionedTeam,
            "you can only sanction a fellow team member"
        );
        uint256[] memory currentTeamSanctions = teamToCurrentSanctions[
            sanctionedTeam
        ];
        require(
            currentTeamSanctions.length < maximumSanctions,
            "this team has reached the limit for sanctions"
        );
        uint256 gameDay = keep.getGameDay();
        Voter storage sanctioned = idToVoter[idSanctioned];
        require(
            sanctioned.sanctionsByTeam[sanctionedTeam] == false,
            "this nation is already sanctioned"
        );
        sanctioned.sanctionsByTeam[sanctionedTeam] = true;
        sanctioned.dayOfSanctionByTeam[sanctionedTeam] = gameDay;
        teamToCurrentSanctions[sanctionedTeam].push(idSanctioned);
        res.removeTradingPartnersFromSanction(idSanctioned, sanctionedTeam);
        emit Sanction(idSenator, senatorTeam, idSanctioned);
    }

    ///@dev this is a public function callable by a senator
    ///@notice this function will only work if the senator and the nation being sanctioned are on the same team
    ///@notice sanctions can only be lifted after 10 days
    ///@notice lifting a sanction only requires one vote from a senator
    ///@param idSenator is the id of the senator calling the function that will cast the vote to lift the sanction
    ///@param idSanctioned is the nation id of the nation who the senator is voting to lift the sanction on
    function liftSanctionVote(uint256 idSenator, uint256 idSanctioned) public {
        require(idToVoter[idSenator].senator == true, "!senator");
        uint256 senatorTeam = idToVoter[idSenator].team;
        uint256 sanctionedTeam = idToVoter[idSanctioned].team;
        require(
            senatorTeam == sanctionedTeam,
            "you can only lift a sanction on a fellow team member"
        );
        Voter storage sanctioned = idToVoter[idSanctioned];
        uint256 gameDay = keep.getGameDay();
        uint256 dayOfTeamSanction = sanctioned.dayOfSanctionByTeam[senatorTeam];
        require(
            (dayOfTeamSanction + 10) < gameDay,
            "you must wait 10 days before lifting a sanction"
        );
        require(
            sanctioned.sanctionsByTeam[sanctionedTeam] == true,
            "this nation is not sanctioned"
        );
        sanctioned.sanctionsByTeam[senatorTeam] = false;
        uint256[] storage currentTeamSanctions = teamToCurrentSanctions[
            sanctionedTeam
        ];
        for (uint256 i = 0; i < currentTeamSanctions.length; i++) {
            if (currentTeamSanctions[i] == idSanctioned) {
                currentTeamSanctions[i] = currentTeamSanctions[
                    currentTeamSanctions.length - 1
                ];
                currentTeamSanctions.pop();
            }
        }
        emit SanctionLifted(idSenator, senatorTeam, idSanctioned);
    }

    ///@dev this is a public view function that will return if a nation is a senator
    ///@notice this function will return if a nation is a senator
    ///@param id this is the nation id of the nation being queried
    ///@return bool will be true if a nation is a senator
    function isSenator(uint256 id) public view returns (bool) {
        return idToVoter[id].senator;
    }

    ///@notice this function will return the current election epoch
    function getCurrentEpoch() public view returns (uint256) {
        return epoch;
    }

    function isSanctioned(
        uint256 idSender,
        uint256 idReceiver
    ) public view returns (bool) {
        uint256 senderTeam = idToVoter[idSender].team;
        uint256 receiverTeam = idToVoter[idReceiver].team;
        bool senderSanctionedSenderTeam = idToVoter[idSender].sanctionsByTeam[
            senderTeam
        ];
        bool recieverSanctionedRecieverTeam = idToVoter[idReceiver]
            .sanctionsByTeam[receiverTeam];
        bool senderSanctionedRecieverTeam = idToVoter[idSender].sanctionsByTeam[
            receiverTeam
        ];
        bool recieverSanctionedSenderTeam = idToVoter[idReceiver]
            .sanctionsByTeam[senderTeam];
        bool sanctioned;
        if (senderTeam == receiverTeam) {
            if (
                senderSanctionedSenderTeam == true ||
                recieverSanctionedRecieverTeam == true
            ) {
                sanctioned = true;
            } else {
                sanctioned = false;
            }
        } else if (senderTeam != receiverTeam) {
            if (
                senderSanctionedRecieverTeam == true ||
                recieverSanctionedSenderTeam == true
            ) {
                sanctioned = true;
            } else {
                sanctioned = false;
            }
        }
        return sanctioned;
    }

    function electSenatorForTesting(uint256 id) public onlyOwner {
        idToVoter[id].senator = true;
    }

    function getSenatorVotes(
        uint256 team
    ) public view returns (uint256[] memory) {
        return epochToTeamToSenatorVotes[epoch][team];
    }

    function getSenators(uint256 team) public view returns (uint256[] memory) {
        return epochToTeamToWinners[epoch][team];
    }

    function getDaysUntilNextElection() public view returns (uint256) {
        uint256 gameDay = keep.getGameDay();
        return (dayOfLastElection + interval) - gameDay;
    }
}
