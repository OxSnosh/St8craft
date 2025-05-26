//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Navy.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

///@title ImprovementsContract1
///@author OxSnosh
///@notice this contract will allow a nation owner to buy certain improvements
contract ImprovementsContract1 is Ownable, ReentrancyGuard {
    address public treasury;
    address public improvements2;
    address public improvements3;
    address public improvements4;
    address public wonders1;
    address public navy;
    address public additionalNavy;
    address public countryMinter;
    address public infrastructure;
    uint256 public airportCost = 100000 * (10 ** 18);
    uint256 public bankCost = 100000 * (10 ** 18);
    uint256 public barracksCost = 50000 * (10 ** 18);
    uint256 public borderFortificationCost = 125000 * (10 ** 18);
    uint256 public borderWallCost = 60000 * (10 ** 18);
    uint256 public bunkerCost = 200000 * (10 ** 18);
    uint256 public casinoCost = 100000 * (10 ** 18);
    uint256 public churchCost = 40000 * (10 ** 18);
    uint256 public clinicCost = 50000 * (10 ** 18);
    uint256 public drydockCost = 100000 * (10 ** 18);
    uint256 public factoryCost = 150000 * (10 ** 18);

    WondersContract1 won1;
    CountryMinter mint;
    TreasuryContract tres;
    InfrastructureContract inf;

    struct Improvements1 {
        uint256 improvementCount;
        //Airport
        //$100,000
        //reduces aircraft cost -2%
        //reduces aircraft upkeep cost -2%
        //Limit 3
        uint256 airportCount;
        //Bank
        //$100,000
        //population income +7%
        uint256 bankCount;
        //Barracks
        //$50,000
        //increases soldier efficiency +10%
        //reduces soldier upkeep -10%
        uint256 barracksCount;
        //Border Fortifications
        //$125,000
        //Raises effectiveness of defending soldiers +2%
        //reduces max deployment -2%
        //Requires maintaining a border wall for each Border Fortification
        //Limit 3
        //Cannot own if forward operating base is owned
        //Collection required to delete
        uint256 borderFortificationCount;
        //Border Walls
        //$60,000
        //Decreases citizen count by -2%
        //increases population happiness +2,
        //Improves environment +1
        //Reduces the number of criminals in a nation 1% for each Border Wall.
        //Border Walls may only be purchased one at a time.
        uint256 borderWallCount;
        //Bunker
        //$200,000
        //Reduces infrastructure damage from [[aircraft,]] cruise missiles, and nukes -3%
        //Requires maintaining a Barracks for each Bunker.
        //Limit 5
        //Cannot build if Munitions Factory or Forward Operating Base is owned.
        //Collection required to delete
        uint256 bunkerCount;
        //Casino
        //$100,000
        //Increases happiness by 1.5,
        //decreases citizen income by 1%
        //-25 to crime prevention score.
        //Limit 2.
        uint256 casinoCount;
        //Church
        //$40,000
        //Increases population happiness +1.
        uint256 churchCount;
        //Clinic
        //$50,000
        //Increases population count by 2%
        //Purchasing 2 or more clinics allows you to purchase hospitals.
        //This improvement may not be destroyed if it is supporting a hospital until the hospital is first destroyed.
        uint256 clinicCount;
        //Drydock
        //$100,000
        //Allows nations to build and maintain navy Corvettes, Battleships, Cruisers, and Destroyers
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //requires Harbor
        uint256 drydockCount;
        //Factory
        //$150,000
        //Decreases cost of cruise missiles -5%
        //decreases tank cost -10%,
        //reduces initial infrastructure purchase cost -8%.
        uint256 factoryCount;
    }

    mapping(uint256 => Improvements1) public idToImprovements1;

    event Improvement1Purchased(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    event Improvement1Deleted(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _navy,
        address _additionalNavy,
        address _countryMinter,
        address _wonders1,
        address _infrastructure
    ) public onlyOwner {
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
        improvements2 = _improvements2;
        improvements3 = _improvements3;
        improvements4 = _improvements4;
        navy = _navy;
        additionalNavy = _additionalNavy;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
    }

    modifier approvedAddress() {
        require(
            msg.sender == improvements2 ||
                msg.sender == improvements3 ||
                msg.sender == improvements4,
            "Unable to call"
        );
        _;
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable by countryMinter contract"
        );
        _;
    }

    ///@dev this function is only callable by the countryMinter contract
    ///@dev this function will initialize the struct to store the info about the minted nations improvements
    ///@notice this function will allow each minted nation to buy imoprovements
    ///@param id this is the nation ID for the nation being minted
    function generateImprovements(uint256 id) public onlyCountryMinter {
        require(
            idToImprovements1[id].improvementCount == 0,
            "Improvements already exist"
        );
        Improvements1 memory newImprovements1 = Improvements1(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToImprovements1[id] = newImprovements1;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of an airport
    function updateAirportCost(uint256 newPrice) public onlyOwner {
        airportCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a bank
    function updateBankCost(uint256 newPrice) public onlyOwner {
        bankCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a barracks
    function updateBarracksCost(uint256 newPrice) public onlyOwner {
        barracksCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a border fortification
    function updateBorderFortificationCost(uint256 newPrice) public onlyOwner {
        borderFortificationCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a border wall
    function updateBorderWallCost(uint256 newPrice) public onlyOwner {
        borderWallCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a bunker
    function updateBunkerCost(uint256 newPrice) public onlyOwner {
        bunkerCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a casino
    function updateCasinoCost(uint256 newPrice) public onlyOwner {
        casinoCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a church
    function updateChurchCost(uint256 newPrice) public onlyOwner {
        churchCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a clinic
    function updateClinicCost(uint256 newPrice) public onlyOwner {
        clinicCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a drydock
    function updateDrydockCost(uint256 newPrice) public onlyOwner {
        drydockCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a factory
    function updateFactoryCost(uint256 newPrice) public onlyOwner {
        factoryCost = newPrice;
    }

    ///@dev this function will allow the caller to return the cost of an improvement
    ///@return airportCost this will be the cost of an airport
    ///@return bankCost this will be the cost of a bank...
    function getCost1()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            airportCost,
            bankCost,
            barracksCost,
            borderFortificationCost,
            borderWallCost,
            bunkerCost,
            casinoCost,
            churchCost,
            clinicCost,
            drydockCost,
            factoryCost
        );
    }

    ///@dev this is a public view function that will return the number of improvements a nation owns
    ///@notice this function will return the number of improvements a nation owns
    ///@param id this is the nation ID of the nation being queried
    ///@return count this is the number of improvements for a given nation
    function getImprovementCount(
        uint256 id
    ) public view returns (uint256 count) {
        count = idToImprovements1[id].improvementCount;
        return count;
    }

    ///@dev this is a publiv function that is only callable from the other improvement contracts
    ///@notice this function will incrase the number of improvements for a nation when improvements are purchased
    ///@param id this is the ID for the nation purchasing improvements
    ///@param newCount is the updated total of improvements for a given nation
    function updateImprovementCount(
        uint256 id,
        uint256 newCount
    ) public approvedAddress {
        idToImprovements1[id].improvementCount = newCount;
    }

    function checkCitizenCountForImprovementPurchase(
        uint256 id,
        uint256 amount
    ) public view returns (bool) {
        bool possible = false;
        (uint256 citizens, ) = inf.getTaxablePopulationCount(id);
        uint256 improvementCount = idToImprovements1[id].improvementCount;
        require(
            ((citizens / 1000) >= (improvementCount + amount)),
            "population too low to purchase improvement"
        );
        possible = true;
        return (possible);
    }

    ///@dev this is a public function that allows a nation owner to purchase improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to purchase certain improvements
    ///@param amount is the number of improvements being purchased
    ///@param countryId is the nation purchasing improvements
    /**
     * @param improvementId this will determine which improvement is being purchased
     * 1 = airport
     * 2 = bank
     * 3 = barracks
     * 4 = border fortification
     * 5 = border wall
     * 6 = bunker
     * 7 = casino
     * 8 = church
     * 9 = clinic
     * 10 = drydock
     * 11 = factory
     */
    function buyImprovement1(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(improvementId <= 11, "Invalid improvement ID");
        uint256 daysSince = tres.getDaysSinceLastBillsPaid(countryId);
        require(daysSince == 0, "must pay bills before buying improvements");
        bool populationCheck = checkCitizenCountForImprovementPurchase(
            countryId,
            amount
        );
        require(
            populationCheck == true,
            "population not high enough for purchase"
        );
        uint256 balance = TreasuryContract(treasury).checkBalance(countryId);
        uint256 purchasePrice;
        if (improvementId == 1) {
            purchasePrice = airportCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].airportCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements1[countryId].airportCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 2) {
            purchasePrice = bankCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].bankCount;
            uint256 maxAmount = 5;
            bool federalReserve = won1.getFederalReserve(countryId);
            if (federalReserve) {
                maxAmount = 7;
            }
            require(
                (existingCount + amount) <= maxAmount,
                "Cannot own more than 5"
            );
            idToImprovements1[countryId].bankCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 3) {
            purchasePrice = barracksCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].barracksCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements1[countryId].barracksCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 4) {
            purchasePrice = borderFortificationCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId]
                .borderFortificationCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            uint256 borderWallAmount = idToImprovements1[countryId]
                .borderWallCount;
            require(
                (existingCount + amount) <= borderWallAmount,
                "Must own a border wall for every fortification"
            );
            uint256 fobCount = ImprovementsContract2(improvements2)
                .getForwardOperatingBaseCount(countryId);
            require(
                fobCount == 0,
                "Cannot own if forward operating base is owned"
            );
            idToImprovements1[countryId].borderFortificationCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 5) {
            require(
                amount == 1,
                "Border walls can only be purchased 1 at a time"
            );
            purchasePrice = borderWallCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId]
                .borderWallCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].borderWallCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 6) {
            purchasePrice = bunkerCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].bunkerCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            uint256 barracksAmount = idToImprovements1[countryId].barracksCount;
            require(
                (existingCount + amount) <= barracksAmount,
                "Must own a barracks for every bunker"
            );
            uint256 fobCount = ImprovementsContract2(improvements2)
                .getForwardOperatingBaseCount(countryId);
            require(
                fobCount == 0,
                "Cannot own if forward operating base is owned"
            );
            uint256 munitionsFactoryCount = ImprovementsContract4(improvements4)
                .getMunitionsFactoryCount(countryId);
            require(
                munitionsFactoryCount == 0,
                "Cannot own if munitions factory is owned"
            );
            idToImprovements1[countryId].bunkerCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 7) {
            purchasePrice = casinoCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].casinoCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements1[countryId].casinoCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 8) {
            purchasePrice = churchCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].churchCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].churchCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 9) {
            purchasePrice = clinicCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].clinicCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].clinicCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else if (improvementId == 10) {
            purchasePrice = drydockCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].drydockCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            uint256 harborCount = ImprovementsContract2(improvements2)
                .getHarborCount(countryId);
            require(harborCount > 0, "Must own a harbor first");
            idToImprovements1[countryId].drydockCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        } else {
            purchasePrice = factoryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].factoryCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].factoryCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
        }
        require(
            TreasuryContract(treasury).spendBalance(countryId, purchasePrice),
            "Unable to spend balance"
        );
        emit Improvement1Purchased(countryId, improvementId, amount);
    }

    ///@dev this is a public function that allows a nation owner to delete improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to delete certain improvements
    ///@param amount is the number of improvements being deleted
    ///@param countryId is the nation deleting improvements
    /**
     * @param improvementId this will determine which improvement is being deleted
     * 1 = airport
     * 2 = bank
     * 3 = barracks
     * 4 = border fortification
     * 5 = border wall
     * 6 = bunker
     * 7 = casino
     * 8 = church
     * 9 = clinic
     * 10 = drydock
     * 11 = factory
     */
    function deleteImprovement1(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(improvementId <= 11, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements1[countryId].airportCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].airportCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements1[countryId].bankCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].bankCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements1[countryId].barracksCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].barracksCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements1[countryId]
                .borderFortificationCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].borderFortificationCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements1[countryId]
                .borderWallCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].borderWallCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements1[countryId].bunkerCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].bunkerCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements1[countryId].casinoCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].casinoCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements1[countryId].churchCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].churchCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 9) {
            uint256 existingCount = idToImprovements1[countryId].clinicCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 hospitalCount = ImprovementsContract2(improvements2)
                .getHospitalCount(countryId);
            require(
                hospitalCount == 0,
                "Cannot delete while nation owns a hospital"
            );
            idToImprovements1[countryId].clinicCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 10) {
            uint256 existingCount = idToImprovements1[countryId].drydockCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 vesselCount = AdditionalNavyContract(additionalNavy)
                .getVesselCountForDrydock(countryId);
            require(
                vesselCount == 0,
                "Cannot delete drydock while it supports vessels"
            );
            idToImprovements1[countryId].drydockCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else {
            uint256 existingCount = idToImprovements1[countryId].factoryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].factoryCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        }
        emit Improvement1Deleted(countryId, improvementId, amount);
    }

    ///@dev this is a public view function that will return the number of airports for a given nation
    ///@notice this function will return the number of airports a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of airports a given nation owns
    function getAirportCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 airportAmount = idToImprovements1[countryId].airportCount;
        return airportAmount;
    }

    ///@dev this is a public view function that will return the number of barracks for a given nation
    ///@notice this function will return the number of barracks a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of barracks a given nation owns
    function getBarracksCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 barracksAmount = idToImprovements1[countryId].barracksCount;
        return barracksAmount;
    }

    ///@dev this is a public view function that will return the number of border fortifications for a given nation
    ///@notice this function will return the number of border fortifications a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of border fortifications a given nation owns
    function getBorderFortificationCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 borderFortificationAmount = idToImprovements1[countryId]
            .borderFortificationCount;
        return borderFortificationAmount;
    }

    ///@dev this is a public view function that will return the number of border walls for a given nation
    ///@notice this function will return the number of border walls a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of border walls a given nation owns
    function getBorderWallCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].borderWallCount;
    }

    ///@dev this is a public view function that will return the number of banks for a given nation
    ///@notice this function will return the number of banks a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of banks a given nation owns
    function getBankCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].bankCount;
    }

    ///@dev this is a public view function that will return the number of bunkers for a given nation
    ///@notice this function will return the number of bunkers a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of bunkers a given nation owns
    function getBunkerCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].bunkerCount;
    }

    ///@dev this is a public view function that will return the number of casinos for a given nation
    ///@notice this function will return the number of casinos a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of casinos a given nation owns
    function getCasinoCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].casinoCount;
    }

    ///@dev this is a public view function that will return the number of churches for a given nation
    ///@notice this function will return the number of churches a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of churches a given nation owns
    function getChurchCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].churchCount;
    }

    ///@dev this is a public view function that will return the number of drydocks for a given nation
    ///@notice this function will return the number of drydocks a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of drydocks a given nation owns
    function getDrydockCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].drydockCount;
    }

    ///@dev this is a public view function that will return the number of clinics for a given nation
    ///@notice this function will return the number of clinics a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of clinics a given nation owns
    function getClinicCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].clinicCount;
    }

    ///@dev this is a public view function that will return the number of factories for a given nation
    ///@notice this function will return the number of factories a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of factories a given nation owns
    function getFactoryCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements1[countryId].factoryCount;
    }
}

///@title ImprovementsContract2
///@author OxSnosh
///@notice this contract will allow a nation owner to buy certain improvements
contract ImprovementsContract2 is Ownable, ReentrancyGuard {
    address public treasury;
    address public improvements1;
    address public forces;
    address public wonders1;
    address public countryMinter;
    address public resources;
    address public spies;
    uint256 public foreignMinistryCost = 120000 * (10 ** 18);
    uint256 public forwardOperatingBaseCost = 125000 * (10 ** 18);
    uint256 public guerillaCampCost = 20000 * (10 ** 18);
    uint256 public harborCost = 200000 * (10 ** 18);
    uint256 public hospitalCost = 180000 * (10 ** 18);
    uint256 public intelligenceAgencyCost = 38500 * (10 ** 18);
    uint256 public jailCost = 25000 * (10 ** 18);
    uint256 public laborCampCost = 150000 * (10 ** 18);

    WondersContract1 won1;
    CountryMinter mint;
    TreasuryContract tres;
    ResourcesContract res;
    SpyContract spy;

    struct Improvements2 {
        bool initialized;
        //Foreign Ministry
        //$120,000
        //Increases population income by 5%
        //Opens +1 extra foreign aid slot.
        //Limit one foreign ministry per nation
        uint256 foreignMinistryCount;
        //Forward Operating Base
        //$125,000
        //Increases spoils from ground attack damage 2% for balance
        //Increases spoils from ground attack damage +1/fob for Land and Tech;
        //Reduces effectiveness of one's own defending soldiers -3%.
        //Requires maintaining a Barracks for each Forward Operating Base.
        //Limit 2.
        //Cannot own if Border Fortifications or Bunker is owned.
        //Collection required to delete.
        uint256 forwardOperatingBaseCount;
        //Guerilla Camp
        //$20,000
        //Increases soldier efficiency +35%,
        //reduces soldier upkeep cost -10%
        //reduces citizen income -8%.
        uint256 guerillaCampCount;
        //Harbor
        //$200,000
        //Increases population income by 1%.
        //Opens +1 extra trade slot
        //Limit one harbor per nation.
        //This improvement may not be destroyed if it is supporting trade agreements or navy vessels until those trade agreements and navy vessels are first removed.
        uint256 harborCount;
        //Hospital
        //$180,000
        //Increases population count by 6%.
        //Need 2 clinics for a hospital.
        //Limit one hospital per nation.
        //Nations must retain at least one hospital if that nation owns a Universal Health Care wonder.
        uint256 hospitalCount;
        //Intelligence Agency
        //$38,500
        //Increases happiness for tax rates greater than 23% +1
        //Each Intelligence Agency allows nations to purchase + 100 spies
        //This improvement may not be destroyed if it is supporting spies until those spies are first destroyed.
        uint256 intelligenceAgencyCount;
        //Jail
        //$25,000
        //Incarcerates up to 500 criminals
        //Limit 5
        uint256 jailCount;
        //Labor Camp
        //$150,000
        //Reduces infrastructure upkeep costs -10%
        //reduces population happiness -1.
        //Incarcerates up to 200 criminals per Labor Camp.
        uint256 laborCampCount;
    }

    mapping(uint256 => Improvements2) public idToImprovements2;

    event Improvement2Purchased(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    event Improvement2Deleted(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _forces,
        address _wonders1,
        address _countryMinter,
        address _improvements1,
        address _resources,
        address _spies
    ) public onlyOwner {
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
        forces = _forces;
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        improvements1 = _improvements1;
        resources = _resources;
        res = ResourcesContract(_resources);
        spies = _spies;
        spy = SpyContract(_spies);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable by countryMinter contract"
        );
        _;
    }

    ///@dev this function is only callable by the countryMinter contract
    ///@dev this function will initialize the struct to store the info about the minted nations improvements
    ///@notice this function will allow each minted nation to buy imoprovements
    ///@param id this is the nation ID for the nation being minted
    function generateImprovements(uint256 id) public onlyCountryMinter {
        require(
            idToImprovements2[id].initialized == false,
            "Improvements already initialized"
        );
        Improvements2 memory newImprovements2 = Improvements2(
            true,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToImprovements2[id] = newImprovements2;
    }

    ///@dev this function will allow the caller to return the cost of an improvement
    ///@return foreignMinistryCost this will be the cost of a foreign ministry
    ///@return forwardOperatingBaseCost this will be the cost of a forward operating base...
    function getCost2()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            foreignMinistryCost,
            forwardOperatingBaseCost,
            guerillaCampCost,
            harborCost,
            hospitalCost,
            intelligenceAgencyCost,
            jailCost,
            laborCampCost
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a foreign ministry
    function updateForeignMinistryCost(uint256 newPrice) public onlyOwner {
        foreignMinistryCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a forward operating base
    function updateForwardOperatingBaseCost(uint256 newPrice) public onlyOwner {
        forwardOperatingBaseCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a guerilla camp
    function updateGuerillaCampCost(uint256 newPrice) public onlyOwner {
        guerillaCampCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a harbor
    function updateHarborCost(uint256 newPrice) public onlyOwner {
        harborCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a hospital
    function updateHospitalCost(uint256 newPrice) public onlyOwner {
        hospitalCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of an intel agency
    function updateIntelligenceAgencyCost(uint256 newPrice) public onlyOwner {
        intelligenceAgencyCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a jail
    function updateJailCost(uint256 newPrice) public onlyOwner {
        jailCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a labor camp
    function updateLaborCampCost(uint256 newPrice) public onlyOwner {
        laborCampCost = newPrice;
    }

    ///@dev this is a public function that allows a nation owner to purchase improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to purchase certain improvements
    ///@param amount is the number of improvements being purchased
    ///@param countryId is the nation purchasing improvements
    /**
     * @param improvementId this will determine which improvement is being purchased
     * 1 = foreign ministry
     * 2 = forward operating base
     * 3 = guerilla camp
     * 4 = harbor
     * 5 = hospital
     * 6 = intel agency
     * 7 = jail
     * 8 = labor camp
     */
    function buyImprovement2(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        uint256 daysSince = tres.getDaysSinceLastBillsPaid(countryId);
        require(daysSince == 0, "must pay bills before buying improvements");
        bool populationCheck = ImprovementsContract1(improvements1)
            .checkCitizenCountForImprovementPurchase(countryId, amount);
        require(
            populationCheck == true,
            "population not high enough for purchase"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasury).checkBalance(countryId);
        uint256 purchasePrice;
        if (improvementId == 1) {
            purchasePrice = foreignMinistryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .foreignMinistryCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].foreignMinistryCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 2) {
            purchasePrice = forwardOperatingBaseCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .forwardOperatingBaseCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 borderFortificationAmount = ImprovementsContract1(
                improvements1
            ).getBorderFortificationCount(countryId);
            require(
                borderFortificationAmount == 0,
                "Cannot own if border fortification is owned"
            );
            uint256 bunkerAmount = ImprovementsContract1(improvements1)
                .getBunkerCount(countryId);
            require(bunkerAmount == 0, "Cannot own if bunker is owned");
            idToImprovements2[countryId].forwardOperatingBaseCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 3) {
            purchasePrice = guerillaCampCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .guerillaCampCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].guerillaCampCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 4) {
            purchasePrice = harborCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].harborCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].harborCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 5) {
            purchasePrice = hospitalCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].hospitalCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            uint256 clinicCount = ImprovementsContract1(improvements1)
                .getClinicCount(countryId);
            require(clinicCount >= 2, "Need to own at least 2 clinics");
            idToImprovements2[countryId].hospitalCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 6) {
            purchasePrice = intelligenceAgencyCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .intelligenceAgencyCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].intelligenceAgencyCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 7) {
            purchasePrice = jailCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].jailCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].jailCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 8) {
            purchasePrice = laborCampCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].laborCampCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].laborCampCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        }
        require(TreasuryContract(treasury).spendBalance(countryId, purchasePrice),
            "Unable to spend balance"
        );
        emit Improvement2Purchased(countryId, improvementId, amount);
    }

    ///@dev this is a public function that allows a nation owner to delete improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to delete certain improvements
    ///@param amount is the number of improvements being deleted
    ///@param countryId is the nation deleting improvements
    /**
     * @param improvementId this will determine which improvement is being deleted
     * 1 = foreign ministry
     * 2 = forward operating base
     * 3 = guerilla camp
     * 4 = harbor
     * 5 = hospital
     * 6 = intel agency
     * 7 = jail
     * 8 = labor camp
     */
    function deleteImprovement2(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(improvementId <= 12, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements2[countryId]
                .foreignMinistryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].foreignMinistryCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements2[countryId]
                .forwardOperatingBaseCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].forwardOperatingBaseCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements2[countryId]
                .guerillaCampCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].guerillaCampCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements2[countryId].harborCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 drydockCount = ImprovementsContract1(improvements1)
                .getDrydockCount(countryId);
            require(
                drydockCount == 0,
                "Cannot delete a drydock if it supports a harbor"
            );
            //need a requirement that it cannot be deleted if it supports a trade agreement
            uint256[] memory partners = res.getTradingPartners(countryId);
            require(
                partners.length <= 4,
                "Cannot delete, harbor supports a trade"
            );
            idToImprovements2[countryId].harborCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements2[countryId].hospitalCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].hospitalCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);

            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements2[countryId]
                .intelligenceAgencyCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 spyCount = spy.getSpyCount(countryId);
            uint256 newIntelAgencyCount = existingCount - amount;
            bool centralIntelAgency = won1.getCentralIntelligenceAgency(
                countryId
            );
            uint256 baseSpyCount = 50;
            if (centralIntelAgency) {
                baseSpyCount = 300;
            }
            require(
                spyCount <= (baseSpyCount + (newIntelAgencyCount * 100)),
                "You have too many spies to delete, each intel agency supports 100 spies"
            );
            idToImprovements2[countryId].intelligenceAgencyCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements2[countryId].jailCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].jailCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements2[countryId].laborCampCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].laborCampCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        }
        emit Improvement2Deleted(countryId, improvementId, amount);
    }

    ///@dev this is a public view function that will return the number of foreign ministries for a given nation
    ///@notice this function will return the number of foreign ministries a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of foreign ministries a given nation owns
    function getForeignMinistryCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].foreignMinistryCount;
    }

    ///@dev this is a public view function that will return the number of forward operating bases for a given nation
    ///@notice this function will return the number of forward operating bases a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of forward operating bases a given nation owns
    function getForwardOperatingBaseCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].forwardOperatingBaseCount;
    }

    ///@dev this is a public view function that will return the number of guerilla camps for a given nation
    ///@notice this function will return the number of guerialls camps a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of guerilla camps a given nation owns
    function getGuerillaCampCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].guerillaCampCount;
    }

    ///@dev this is a public view function that will return the number of harbors for a given nation
    ///@notice this function will return the number of harbors a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of harbors a given nation owns
    function getHarborCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].harborCount;
    }

    ///@dev this is a public view function that will return the number of hospitals for a given nation
    ///@notice this function will return the number of hospitals a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of hospitals a given nation owns
    function getHospitalCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].hospitalCount;
    }

    ///@dev this is a public view function that will return the number of intel agencies for a given nation
    ///@notice this function will return the number of intel agencies a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of intel agencies a given nation owns
    function getIntelAgencyCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].intelligenceAgencyCount;
    }

    ///@dev this is a public view function that will return the number of jails for a given nation
    ///@notice this function will return the number of jails a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of jails a given nation owns
    function getJailCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].jailCount;
    }

    ///@dev this is a public view function that will return the number of labor camps for a given nation
    ///@notice this function will return the number of labor camps a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of labor camps a given nation owns
    function getLaborCampCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements2[countryId].laborCampCount;
    }
}

///@title ImprovementsContract4
///@author OxSnosh
///@notice this contract will allow a nation owner to buy certain improvements
contract ImprovementsContract4 is Ownable, ReentrancyGuard {
    address public treasury;
    address public improvements1;
    address public improvements2;
    address public forces;
    address public countryMinter;
    address public wonders4;
    address public resources;
    uint256 public missileDefenseCost = 90000 * (10 ** 18);
    uint256 public munitionsFactoryCost = 200000 * (10 ** 18);
    uint256 public navalAcademyCost = 300000 * (10 ** 18);
    uint256 public navalConstructionYardCost = 300000 * (10 ** 18);
    uint256 public officeOfPropagandaCost = 200000 * (10 ** 18);
    uint256 public policeHeadquartersCost = 75000 * (10 ** 18);

    WondersContract1 won1;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    CountryMinter mint;
    TreasuryContract tres;
    WondersContract4 won4;
    ResourcesContract res;

    struct Improvements4 {
        bool initialized;
        //Missile Defense
        //$90,000
        //Reduces effectiveness of incoming cruise missiles used against your nation -10%.
        //Nations must retain at least three missile defenses if that nation owns a Strategic Defense Initiative wonder.
        uint256 missileDefenseCount;
        //MunitionsFactory
        //$200,000
        //Increases enemy infrastructure damage from your [[aircraft,]] cruise missiles, and nukes +3%
        //+0.3 penalty to environment per Munitions Factory.
        //Requires maintaining 3 or more Factories.
        //Requires having Lead as a resource to purchase.
        //Limit 5.
        //Cannot build if Bunkers owned.
        uint256 munitionsFactoryCount;
        //Naval Academy
        //$300,000
        //Increases both attacking and defending navy vessel strength +1.
        //Limit 2 per nation.
        //Requires Harbor.
        uint256 navalAcademyCount;
        //Naval Construction Yard
        //$300,000
        //Increases the daily purchase limit for navy vessels +1.
        //Limit 3 per nation.
        //requires Harbor
        uint256 navalConstructionYardCount;
        //Office of Propoganda
        //$200,000
        //Decreases the effectiveness of enemy defending soldiers 3%.
        //Requires maintaining a Forward Operating Base for each Office of Propaganda
        //Limit 2
        uint256 officeOfPropagandaCount;
        //Police Headquarters
        //$75,000
        //Increases population happiness +2.
        uint256 policeHeadquartersCount;
    }

    mapping(uint256 => Improvements4) public idToImprovements4;

    event Improvement4Purchased(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    event Improvement4Deleted(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _forces,
        address _improvements1,
        address _improvements2,
        address _countryMinter,
        address _wonders4,
        address _resources
    ) public onlyOwner {
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
        forces = _forces;
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        resources = _resources;
        res = ResourcesContract(_resources);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable by countryMinter contract"
        );
        _;
    }

    ///@dev this function is only callable by the countryMinter contract
    ///@dev this function will initialize the struct to store the info about the minted nations improvements
    ///@notice this function will allow each minted nation to buy imoprovements
    ///@param id this is the nation ID for the nation being minted
    function generateImprovements(uint256 id) public onlyCountryMinter {
        require(
            idToImprovements4[id].initialized == false,
            "Improvements already initialized"
        );
        Improvements4 memory newImprovements4 = Improvements4(true, 0, 0, 0, 0, 0, 0);
        idToImprovements4[id] = newImprovements4;
    }

    ///@dev this function will allow the caller to return the cost of an improvement
    ///@return missileDefenseCost this will be the cost of a foreign ministry
    ///@return munitionsFactoryCost this will be the cost of a forward operating base...
    function getCost4()
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        return (
            missileDefenseCost,
            munitionsFactoryCost,
            navalAcademyCost,
            navalConstructionYardCost,
            officeOfPropagandaCost,
            policeHeadquartersCost
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a missile defense
    function updateMissileDefenseCost(uint256 newPrice) public onlyOwner {
        missileDefenseCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a munitions factory
    function updateMunitionsFactoryCost(uint256 newPrice) public onlyOwner {
        munitionsFactoryCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of naval academy
    function updateNavalAcademyCost(uint256 newPrice) public onlyOwner {
        navalAcademyCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of naval construction yard
    function updateNavalConstructionYardCost(
        uint256 newPrice
    ) public onlyOwner {
        navalConstructionYardCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of an office of propaganda
    function updateOfficeOfPropagandaCost(uint256 newPrice) public onlyOwner {
        officeOfPropagandaCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a police headquarters
    function updatePoliceHeadquartersCost(uint256 newPrice) public onlyOwner {
        policeHeadquartersCost = newPrice;
    }

    ///@dev this is a public function that allows a nation owner to purchase improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to purchase certain improvements
    ///@param amount is the number of improvements being purchased
    ///@param countryId is the nation purchasing improvements
    /**
     * @param improvementId this will determine which improvement is being purchased
     * 1 = missile defense
     * 2 = munitions factory
     * 3 = naval academy
     * 4 = naval construction yard
     * 5 = office of propaganda
     * 6 = police headquarters
     */
    function buyImprovement4(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        uint256 daysSince = tres.getDaysSinceLastBillsPaid(countryId);
        require(daysSince == 0, "must pay bills before buying improvements");
        bool populationCheck = ImprovementsContract1(improvements1)
            .checkCitizenCountForImprovementPurchase(countryId, amount);
        require(
            populationCheck == true,
            "population not high enough for purchase"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasury).checkBalance(countryId);
        uint256 purchasePrice;
        if (improvementId == 1) {
            purchasePrice = missileDefenseCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements4[countryId]
                .missileDefenseCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements4[countryId].missileDefenseCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 2) {
            purchasePrice = munitionsFactoryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements4[countryId]
                .munitionsFactoryCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            uint256 bunkerAmount = ImprovementsContract1(improvements1)
                .getBunkerCount(countryId);
            require(bunkerAmount == 0, "Cannot own if bunker is owned");
            uint256 factoryCount = imp1.getFactoryCount(countryId);
            require(
                factoryCount >= 3,
                "Must own at least 3 factories to purchase"
            );
            require(
                res.viewLead(countryId) == true,
                "Must possess lead to purchase"
            );
            idToImprovements4[countryId].munitionsFactoryCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 3) {
            purchasePrice = navalAcademyCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements4[countryId]
                .navalAcademyCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 harborAmount = imp2.getHarborCount(countryId);
            require(harborAmount > 0, "must own a harbor to purchase");
            idToImprovements4[countryId].navalAcademyCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 4) {
            purchasePrice = navalConstructionYardCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements4[countryId]
                .navalConstructionYardCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            uint256 harborAmount = imp2.getHarborCount(countryId);
            require(harborAmount > 0, "must own a harbor to purchase");
            idToImprovements4[countryId].navalConstructionYardCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 5) {
            purchasePrice = officeOfPropagandaCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements4[countryId]
                .officeOfPropagandaCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 forwardOperatingBaseAmount = ImprovementsContract2(
                improvements2
            ).getForwardOperatingBaseCount(countryId);
            require(
                (existingCount + amount) <= forwardOperatingBaseAmount,
                "Must own 1 forward operating base for each office of propaganda"
            );
            idToImprovements4[countryId].officeOfPropagandaCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 6) {
            purchasePrice = policeHeadquartersCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements4[countryId]
                .policeHeadquartersCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements4[countryId].policeHeadquartersCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        }
        require(TreasuryContract(treasury).spendBalance(countryId, purchasePrice),
            "Unable to spend balance"
        );
        emit Improvement4Purchased(countryId, improvementId, amount);
    }

    ///@dev this is a public function that allows a nation owner to delete improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to delete certain improvements
    ///@param amount is the number of improvements being delete
    ///@param countryId is the nation deleting improvements
    /**
     * @param improvementId this will determine which improvement is being deleted
     * 1 = missile defense
     * 2 = munitions factory
     * 3 = naval academy
     * 4 = naval construction yard
     * 5 = office of propaganda
     * 6 = police headquarters
     */
    function deleteImprovement4(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(improvementId <= 12, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements4[countryId]
                .missileDefenseCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            //cannot delete below 3 if strategic defense init
            bool strategicDefenseInitiative = won4
                .getStrategicDefenseInitiative(countryId);
            if (strategicDefenseInitiative) {
                require(
                    (existingCount - amount) >= 3,
                    "Cannot delete if Strategic Defense Initiative owned"
                );
            }
            idToImprovements4[countryId].missileDefenseCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements4[countryId]
                .munitionsFactoryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements4[countryId].munitionsFactoryCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements4[countryId]
                .navalAcademyCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements4[countryId].navalAcademyCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements4[countryId]
                .navalConstructionYardCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements4[countryId].navalConstructionYardCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements4[countryId]
                .officeOfPropagandaCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements4[countryId].officeOfPropagandaCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements4[countryId]
                .policeHeadquartersCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements4[countryId].policeHeadquartersCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        }
        emit Improvement4Deleted(countryId, improvementId, amount);
    }

    ///@dev this is a public view function that will return the number of missile defenses for a given nation
    ///@notice this function will return the number of missile defenses a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of missile defenses a given nation owns
    function getMissileDefenseCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements4[countryId].missileDefenseCount;
    }

    ///@dev this is a public view function that will return the number of munitions factories for a given nation
    ///@notice this function will return the number of munitions factories a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of munitions factories a given nation owns
    function getMunitionsFactoryCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements4[countryId].munitionsFactoryCount;
    }

    ///@dev this is a public view function that will return the number of naval academies for a given nation
    ///@notice this function will return the number of naval academies a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of naval academies a given nation owns
    function getNavalAcademyCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements4[countryId].navalAcademyCount;
    }

    ///@dev this is a public view function that will return the number of naval construction yards for a given nation
    ///@notice this function will return the number of naval construction yards a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of naval construction yards a given nation owns
    function getNavalConstructionYardCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements4[countryId].navalConstructionYardCount;
    }

    ///@dev this is a public view function that will return the number of offices of propaganda for a given nation
    ///@notice this function will return the number of roffices of propaganda a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of offices of propaganda a given nation owns
    function getOfficeOfPropagandaCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements4[countryId].officeOfPropagandaCount;
    }

    ///@dev this is a public view function that will return the number of police headquarters for a given nation
    ///@notice this function will return the number of police headquuarters a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of police headquarters a given nation owns
    function getPoliceHeadquartersCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements4[countryId].policeHeadquartersCount;
    }
}

///@title ImprovementsContract3
///@author OxSnosh
///@notice this contract will allow a nation owner to buy certain improvements
contract ImprovementsContract3 is Ownable, ReentrancyGuard {
    address public treasury;
    address public improvements1;
    address public improvements2;
    address public navy;
    address public additionalNavy;
    address public countryMinter;
    address public bonusResources;
    address public wonder4;
    uint256 public prisonCost = 200000 * (10 ** 18);
    uint256 public radiationContainmentChamberCost = 200000 * (10 ** 18);
    uint256 public redLightDistrictCost = 50000 * (10 ** 18);
    uint256 public rehabilitationFacilityCost = 500000 * (10 ** 18);
    uint256 public satelliteCost = 90000 * (10 ** 18);
    uint256 public schoolCost = 85000 * (10 ** 18);
    uint256 public shipyardCost = 100000 * (10 ** 18);
    uint256 public stadiumCost = 110000 * (10 ** 18);
    uint256 public universityCost = 180000 * (10 ** 18);

    CountryMinter mint;
    TreasuryContract tres;
    BonusResourcesContract bonus;
    WondersContract4 won4;

    struct Improvements3 {
        bool initialized;
        //Prison
        //$200,000
        //Incarcerates up to 5,000 criminals.
        //Limit 5
        uint256 prisonCount;
        //RadiationContainmentChamber
        //$200,000
        //Lowers global radiation level that affects your nation by 20%.
        //Requires maintaining Radiation Cleanup bonus resource to function
        //Requires maintaining a Bunker for each Radiation Containment Chamber.
        //Limit 2.
        //Collection required to delete.
        uint256 radiationContainmentChamberCount;
        //RedLightDistrict
        //$50,000
        //Increases happiness by 1,
        //penalizes environment by 0.5,
        //-25 to crime prevention score
        //Limit 2
        uint256 redLightDistrictCount;
        //Rehabilitation Facility
        //$500,000
        //Sends up to 500 criminals back into the citizen count
        //Limit 5
        uint256 rehabilitationFacilityCount;
        //Satellite
        //$90,000
        //Increases effectiveness of cruise missiles used by your nation +10%.
        //Nations must retain at least three satellites if that nation owns a Strategic Defense Initiative wonder
        uint256 satelliteCount;
        //School
        //$85,000
        //Increases population income by 5%
        //increases literacy rate +1%
        //Purchasing 3 or more schools allows you to purchase universities
        //This improvement may not be destroyed if it is supporting universities until the universities are first destroyed.
        uint256 schoolCount;
        //Shipyard
        //$100,000
        //Allows nations to build and maintain navy Landing Ships, Frigates, Submarines, and Aircraft Carriers.
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //Requires Harbor
        uint256 shipyardCount;
        //Stadium
        //$110,000
        //Increases population happiness + 3.
        uint256 stadiumCount;
        //University
        //$180,000
        //Increases population income by 8%
        //reduces technology cost -10%
        //increases literacy rate +3%.
        //Three schools must be purchased before any universities can be purchased.
        //Limit 2
        uint256 universityCount;
    }

    mapping(uint256 => Improvements3) public idToImprovements3;

    event Improvement3Purchased(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    event Improvement3Deleted(
        uint256 indexed countryId,
        uint256 indexed improvementId,
        uint256 indexed amount
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _additionalNavy,
        address _improvements1,
        address _improvements2,
        address _countryMinter,
        address _bonusResources,
        address _wonder4
    ) public onlyOwner {
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
        additionalNavy = _additionalNavy;
        improvements1 = _improvements1;
        improvements2 = _improvements2;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
        wonder4 = _wonder4;
        won4 = WondersContract4(_wonder4);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable by countryMinter contract"
        );
        _;
    }

    ///@dev this function is only callable by the countryMinter contract
    ///@dev this function will initialize the struct to store the info about the minted nations improvements
    ///@notice this function will allow each minted nation to buy imoprovements
    ///@param id this is the nation ID for the nation being minted
    function generateImprovements(uint256 id) public onlyCountryMinter {
        require(
            idToImprovements3[id].initialized == false,
            "Improvements already initialized"
        ); 
        Improvements3 memory newImprovements3 = Improvements3(
            true,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToImprovements3[id] = newImprovements3;
    }

    ///@dev this function will allow the caller to return the cost of an improvement
    ///@return officeOfPropagandaCost this will be the cost of an office of propaganda
    ///@return policeHeadquartersCost this will be the cost of a police headquarters...
    function getCost3()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            prisonCost,
            radiationContainmentChamberCost,
            redLightDistrictCost,
            rehabilitationFacilityCost,
            satelliteCost,
            schoolCost,
            shipyardCost,
            stadiumCost,
            universityCost
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a prison
    function updatePrisonCost(uint256 newPrice) public onlyOwner {
        prisonCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a radiatiion containment chamber
    function updateRadiationContainmentChamberCost(
        uint256 newPrice
    ) public onlyOwner {
        radiationContainmentChamberCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a red light district
    function updateRedLightDistrictCost(uint256 newPrice) public onlyOwner {
        redLightDistrictCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a rehab facility
    function updateRehabilitationFacilityCost(
        uint256 newPrice
    ) public onlyOwner {
        rehabilitationFacilityCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a satellite
    function updateSatelliteCost(uint256 newPrice) public onlyOwner {
        satelliteCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a school
    function updateSchoolCost(uint256 newPrice) public onlyOwner {
        schoolCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a shipyard
    function updateShipyardCost(uint256 newPrice) public onlyOwner {
        shipyardCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a stadium
    function updateStadiumCost(uint256 newPrice) public onlyOwner {
        stadiumCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will allow the owner of the contract to update the cost of a university
    function updateUniversityCost(uint256 newPrice) public onlyOwner {
        universityCost = newPrice;
    }

    ///@dev this is a public function that allows a nation owner to purchase improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to purchase certain improvements
    ///@param amount is the number of improvements being purchased
    ///@param countryId is the nation purchasing improvements
    /**
     * @param improvementId this will determine which improvement is being purchased
     * 1 = prison
     * 2 = radiaton containment chambers
     * 3 = red light district
     * 4 = rehab facilities
     * 5 = satellite
     * 6 = school
     * 7 = shipyard
     * 8 = stadium
     * 9 = university
     */
    function buyImprovement3(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        uint256 daysSince = tres.getDaysSinceLastBillsPaid(countryId);
        require(daysSince == 0, "must pay bills before buying improvements");
        bool populationCheck = ImprovementsContract1(improvements1)
            .checkCitizenCountForImprovementPurchase(countryId, amount);
        require(
            populationCheck == true,
            "population not high enough for purchase"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasury).checkBalance(countryId);
        uint256 purchasePrice;
        if (improvementId == 1) {
            purchasePrice = prisonCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].prisonCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].prisonCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 2) {
            purchasePrice = radiationContainmentChamberCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .radiationContainmentChamberCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 bunkerAmount = ImprovementsContract1(improvements1)
                .getBunkerCount(countryId);
            require(
                (existingCount + amount) <= bunkerAmount,
                "Must own a bunker for each radiation containment chamber"
            );
            bool radiationCleanup = bonus.viewRadiationCleanup(countryId);
            require(
                radiationCleanup,
                "nation must possess radiation cleanup bonus resource to purchase"
            );
            idToImprovements3[countryId]
                .radiationContainmentChamberCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 3) {
            purchasePrice = redLightDistrictCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .redLightDistrictCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements3[countryId].redLightDistrictCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 4) {
            purchasePrice = rehabilitationFacilityCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .rehabilitationFacilityCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].rehabilitationFacilityCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 5) {
            purchasePrice = satelliteCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].satelliteCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].satelliteCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 6) {
            purchasePrice = schoolCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].schoolCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].schoolCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 7) {
            purchasePrice = shipyardCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].shipyardCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].shipyardCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 8) {
            purchasePrice = stadiumCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].stadiumCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].stadiumCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else {
            purchasePrice = universityCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .universityCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 schoolAmount = idToImprovements3[countryId].schoolCount;
            require(
                schoolAmount >= 3,
                "Must own 3 schools to own a university"
            );
            idToImprovements3[countryId].universityCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        }
        require(TreasuryContract(treasury).spendBalance(countryId, purchasePrice),
            "Unable to spend balance"
        );
        emit Improvement3Purchased(countryId, improvementId, amount);
    }

    ///@dev this is a public function that allows a nation owner to delete improvements
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to delete certain improvements
    ///@param amount is the number of improvements being delete
    ///@param countryId is the nation deleting improvements
    /**
     * @param improvementId this will determine which improvement is being deleted
     * 1 = prison
     * 2 = radiaton containment chambers
     * 3 = red light district
     * 4 = rehab facilities
     * 5 = satellite
     * 6 = school
     * 7 = shipyard
     * 8 = stadium
     * 9 = university
     */
    function deleteImprovement3(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public nonReentrant {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(improvementId <= 12, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements3[countryId].prisonCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].prisonCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements3[countryId]
                .radiationContainmentChamberCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId]
                .radiationContainmentChamberCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements3[countryId]
                .redLightDistrictCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].redLightDistrictCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements3[countryId]
                .rehabilitationFacilityCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].rehabilitationFacilityCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements3[countryId].satelliteCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            bool strategicDefense = won4.getStrategicDefenseInitiative(
                countryId
            );
            if (strategicDefense) {
                require(
                    (existingCount - amount) >= 3,
                    "must maintain 3 satellites with strategic defense initiative"
                );
            }
            idToImprovements3[countryId].satelliteCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements3[countryId].schoolCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 universityAmount = idToImprovements3[countryId]
                .universityCount;
            uint256 newCount = existingCount - amount;
            require(
                newCount >= universityAmount,
                "Must own one school for each university"
            );
            idToImprovements3[countryId].schoolCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements3[countryId].shipyardCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 shipyardVesselCount = AdditionalNavyContract(additionalNavy)
                .getVesselCountForShipyard(countryId);
            require(
                shipyardVesselCount == 0,
                "Cannot delete shipyard while it supports vessels"
            );
            idToImprovements3[countryId].shipyardCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements3[countryId].stadiumCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].stadiumCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        } else {
            uint256 existingCount = idToImprovements3[countryId]
                .universityCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].universityCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvements1
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvements1).updateImprovementCount(
                countryId,
                newImprovementTotal
            );
        }
        emit Improvement3Deleted(countryId, improvementId, amount);
    }

    ///@dev this is a public view function that will return the number of prisons for a given nation
    ///@notice this function will return the number of prisons a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of prisons a given nation owns
    function getPrisonCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].prisonCount;
    }

    ///@dev this is a public view function that will return the number of radiation containment chambers for a given nation
    ///@notice this function will return the number of radiation containment chambers a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of radiation containment chambers a given nation owns
    function getRadiationContainmentChamberCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].radiationContainmentChamberCount;
    }

    ///@dev this is a public view function that will return the number of red light districts for a given nation
    ///@notice this function will return the number of red light districts a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of red light districts a given nation owns
    function getRedLightDistrictCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].redLightDistrictCount;
    }

    ///@dev this is a public view function that will return the number of rehab facilities for a given nation
    ///@notice this function will return the number of rehab facilities a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of rehab facilities a given nation owns
    function getRehabilitationFacilityCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].rehabilitationFacilityCount;
    }

    ///@dev this is a public view function that will return the number of satellites for a given nation
    ///@notice this function will return the number of satellites a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of satellites a given nation owns
    function getSatelliteCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].satelliteCount;
    }

    ///@dev this is a public view function that will return the number of schools for a given nation
    ///@notice this function will return the number of schools a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of schools a given nation owns
    function getSchoolCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].schoolCount;
    }

    ///@dev this is a public view function that will return the number of shipyards for a given nation
    ///@notice this function will return the number of shipyards a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of shipyards a given nation owns
    function getShipyardCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].shipyardCount;
    }

    ///@dev this is a public view function that will return the number of stadiums for a given nation
    ///@notice this function will return the number of stadiums a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of stadiums a given nation owns
    function getStadiumCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].stadiumCount;
    }

    ///@dev this is a public view function that will return the number of universities for a given nation
    ///@notice this function will return the number of universities a nation owns
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the number of universities a given nation owns
    function getUniversityCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToImprovements3[countryId].universityCount;
    }
}
