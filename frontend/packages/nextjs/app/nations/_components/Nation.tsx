"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { NationSearchBar } from "../../../components/NationSearch";
import ActiveWars from "./ActiveWars";
import AllianceManagement from "./AllianceManagement";
import BuyBombers from "./BuyBombers";
import BuyCruiseMissiles from "./BuyCruiseMissiles";
import BuyFighters from "./BuyFighters";
import BuyImprovement from "./BuyImprovements";
import BuyInfrastructure from "./BuyInfrastructure";
import BuyLand from "./BuyLand";
import BuyNavy from "./BuyNavy";
import BuyNukes from "./BuyNukes";
import BuySoldiers from "./BuySoldiers";
import BuySpies from "./BuySpies";
import BuyTanks from "./BuyTanks";
import BuyTechnology from "./BuyTechnology";
import BuyWonder from "./BuyWonder";
import CollectTaxes from "./CollectTaxes";
import ManageWars from "./DeclareWar";
import TransferDeleteNation from "./DeleteTransfer";
import WBXSwap from "./Swap";
import GovernmentDetails from "./GovernmentDetails";
import ManageTrades from "./ManageTrades";
import Messages from "./Messages";
import MilitarySettings from "./MilitarySettings";
import NationDetailsPage from "./NationDetailsPage";
import PayBills from "./PayBills";
import Senate from "./Senate";
import SendAid from "./SendAid";
import SpyAttackCard from "./SpyAttack";
import { useAccount, usePublicClient } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

const menuItems = [
  { category: "SEARCH NATIONS", options: ["Search"] },
  {
    category: "NATION SETTINGS",
    options: ["Government Settings", "Military Settings", "Manage Trades", "Send Aid", "Senate", "Alliance"],
  },
  { category: "MANAGE WARS", options: ["Declare War", "Active Wars", "Spy Attack"] },
  { category: "TREASURY", options: ["Collect Taxes", "Pay Bills", "Swap for WBX"] },
  { category: "MUNICIPAL PURCHASES", options: ["Infrastructure", "Technology", "Land"] },
  { category: "NATION UPGRADES", options: ["Improvements", "Wonders"] },
  {
    category: "TRAIN MILITARY",
    options: ["Soldiers", "Tanks", "Fighters", "Bombers", "Navy", "Cruise Missiles", "Nukes", "Spies"],
  },
  { category: "ADMIN", options: ["Messages", "Transfer or Delete"] },
];

const Nation = () => {
  const searchParams = useSearchParams();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const countryMinterContract = contractsData?.CountryMinter;
  const countryParametersContract = contractsData?.CountryParametersContract;
  const treasuryContract = contractsData?.TreasuryContract;
  const router = useRouter();

  const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [mintedNations, setMintedNations] = useState<{ name: string; href: string }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedNationName, setSelectedNationId] = useState<string | null>(null);
  const [selectedNationBalance, setSelectedNationBalance] = useState<string | null>(null);

  const nationId = searchParams.get("id");

  //can you have this refresh every time nationId changes?
  useEffect(() => {
    const fetchNationName = async () => {
      if (!nationId) return;
      const name = await getSelectedNationName(nationId);
      setSelectedNationId(name as string);
      const wbxBalance = await getWarBucksBalance(nationId);
      setSelectedNationBalance(wbxBalance as string);
    };
    fetchNationName();
  }, [nationId]);

  const getSelectedNationName = async (tokenIdString: string) => {
    if (!publicClient) {
      throw new Error("publicClient is not defined");
    }
    const nationName = await publicClient.readContract({
      abi: countryParametersContract.abi,
      address: countryParametersContract.address,
      functionName: "getNationName",
      args: [tokenIdString],
    });
    return nationName;
  };

  const getWarBucksBalance = async (tokenIdString: string) => {
    if (!publicClient) {
      throw new Error("publicClient is not defined");
    }
    const warBucks = await publicClient.readContract({
      abi: treasuryContract.abi,
      address: treasuryContract.address,
      functionName: "checkBalance",
      args: [tokenIdString],
    });
    return warBucks;
  };

  const formatBalance = (balance: string) => {
    const warbucksFormatted = Number(balance) / 1e18;
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(warbucksFormatted);
  };

  // Fetch user's nations from contract
  useEffect(() => {
    const fetchMyNations = async () => {
      if (!publicClient || !countryMinterContract) return;
      try {
        if (!walletAddress) return;

        const tokenIds = await publicClient.readContract({
          abi: countryMinterContract.abi,
          address: countryMinterContract.address,
          functionName: "tokensOfOwner",
          args: [walletAddress],
        });

        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
          console.warn("No tokens found for this wallet.");
          setMintedNations([]);
          return;
        }

        // Map token IDs to nation data with query parameter links
        const nations = tokenIds.map((tokenId: string) => ({
          name: `Nation ${tokenId}`, // Replace with actual nation name if available
          href: `/nations?id=${tokenId}`, // Dynamic link to the nation's page using query parameters
        }));

        setMintedNations(nations);
      } catch (error) {
        console.error("Error fetching minted nations:", error);
        setMintedNations([]);
      }
    };

    fetchMyNations();
  }, [walletAddress, countryMinterContract, publicClient]);

  const playClickSound = () => {
    const audio = new Audio("/pageturn.wav");
    audio.play().catch(error => console.error("Audio playback failed:", error));
  };

  const handleNationSelect = (nationId: string, nationName: string) => {
    playClickSound();
    setSelectedMenuItem(nationName);
    localStorage.setItem("selectedMenuItem", nationName); // Save selection
    setSelectedComponent(<NationDetailsPage nationId={nationId} onPropeseTrade={handlePropeseTrade} />);
    setIsDropdownOpen(false); // Close dropdown

    // Update the query string in the URL
    router.push(`/nations?id=${nationId}`, { scroll: false });
  };

  // Function to handle trade proposals
  const handlePropeseTrade = () => {
    setSelectedMenuItem("Manage Trades");
    setSelectedComponent(<ManageTrades />);
  };

  // Load last selected menu item from localStorage when the page loads
  useEffect(() => {
    const savedMenuItem = localStorage.getItem("selectedMenuItem");
    if (savedMenuItem) {
      setSelectedMenuItem(savedMenuItem);

      // Set the corresponding component based on the saved menu item
      if (savedMenuItem === "Collect Taxes") {
        setSelectedComponent(<CollectTaxes />);
      } else if (savedMenuItem.startsWith("Nation")) {
        const nationIdFromStorage = savedMenuItem.split(" ")[1]; // Extract ID
        setSelectedComponent(<NationDetailsPage nationId={nationIdFromStorage} onPropeseTrade={handlePropeseTrade} />);
      } else if (savedMenuItem === "Government Settings") {
        setSelectedComponent(<GovernmentDetails />);
      } else if (savedMenuItem === "Military Settings") {
        setSelectedComponent(<MilitarySettings />);
      } else if (savedMenuItem === "Pay Bills") {
        setSelectedComponent(<PayBills />);
      } else if (savedMenuItem === "Swap for WBX") {
        setSelectedComponent(<WBXSwap wbxAddress="0x4DeaEee7C7a34aAfED7BCDDB9CC042eAD4aD98F9" />);
      } else if (savedMenuItem === "Infrastructure") {
        setSelectedComponent(<BuyInfrastructure />);
      } else if (savedMenuItem === "Technology") {
        setSelectedComponent(<BuyTechnology />);
      } else if (savedMenuItem === "Land") {
        setSelectedComponent(<BuyLand />);
      } else if (savedMenuItem === "Improvements") {
        setSelectedComponent(<BuyImprovement />);
      } else if (savedMenuItem === "Wonders") {
        setSelectedComponent(<BuyWonder />);
      } else if (savedMenuItem === "Soldiers") {
        setSelectedComponent(<BuySoldiers />);
      } else if (savedMenuItem === "Tanks") {
        setSelectedComponent(<BuyTanks />);
      } else if (savedMenuItem === "Cruise Missiles") {
        setSelectedComponent(<BuyCruiseMissiles />);
      } else if (savedMenuItem === "Nukes") {
        setSelectedComponent(<BuyNukes />);
      } else if (savedMenuItem === "Spies") {
        setSelectedComponent(<BuySpies />);
      } else if (savedMenuItem === "Fighters") {
        setSelectedComponent(<BuyFighters />);
      } else if (savedMenuItem === "Bombers") {
        setSelectedComponent(<BuyBombers />);
      } else if (savedMenuItem === "Navy") {
        setSelectedComponent(<BuyNavy />);
      } else if (savedMenuItem === "Manage Trades") {
        setSelectedComponent(<ManageTrades />);
      } else if (savedMenuItem === "Send Aid") {
        setSelectedComponent(<SendAid />);
      } else if (savedMenuItem === "Declare War") {
        setSelectedComponent(<ManageWars />);
      } else if (savedMenuItem === "Active Wars") {
        setSelectedComponent(<ActiveWars />);
      } else if (savedMenuItem === "Senate") {
        setSelectedComponent(<Senate />);
      } else if (savedMenuItem === "Alliance") {
        setSelectedComponent(<AllianceManagement />);
      } else if (savedMenuItem === "Transfer or Delete") {
        setSelectedComponent(<TransferDeleteNation />);
      } else if (savedMenuItem === "Messages") {
        setSelectedComponent(<Messages />);
      } else if (savedMenuItem === "Search") {
        setSelectedComponent(<NationSearchBar />);
      } else if (savedMenuItem === "Spy Attack") {
        setSelectedComponent(<SpyAttackCard />);
      } else {
        setSelectedComponent(<div className="p-6">Coming Soon...</div>);
      }
    } else if (nationId) {
      // If there is a nation ID, default to loading that nation's details
      setSelectedMenuItem(`Nation ${nationId}`);
    }
  }, [nationId]);

  // Handle menu clicks and save the selection in localStorage
  const handleMenuClick = (option: string) => {
    setSelectedMenuItem(option);
    localStorage.setItem("selectedMenuItem", option); // Save selected menu item
    playClickSound();
    if (option === "Collect Taxes") {
      setSelectedComponent(<CollectTaxes />);
    } else if (option === "Government Settings") {
      setSelectedComponent(<GovernmentDetails />);
    } else if (option === "Military Settings") {
      setSelectedComponent(<MilitarySettings />);
    } else if (option === "Pay Bills") {
      setSelectedComponent(<PayBills />);
    } else if (option === "Swap for WBX") {
      setSelectedComponent(<WBXSwap wbxAddress="0x4DeaEee7C7a34aAfED7BCDDB9CC042eAD4aD98F9" />);
    } else if (option === "Infrastructure") {
      setSelectedComponent(<BuyInfrastructure />);
    } else if (option === "Technology") {
      setSelectedComponent(<BuyTechnology />);
    } else if (option === "Land") {
      setSelectedComponent(<BuyLand />);
    } else if (option === "Improvements") {
      setSelectedComponent(<BuyImprovement />);
    } else if (option === "Wonders") {
      setSelectedComponent(<BuyWonder />);
    } else if (option === "Soldiers") {
      setSelectedComponent(<BuySoldiers />);
    } else if (option === "Tanks") {
      setSelectedComponent(<BuyTanks />);
    } else if (option === "Cruise Missiles") {
      setSelectedComponent(<BuyCruiseMissiles />);
    } else if (option === "Nukes") {
      setSelectedComponent(<BuyNukes />);
    } else if (option === "Spies") {
      setSelectedComponent(<BuySpies />);
    } else if (option === "Fighters") {
      setSelectedComponent(<BuyFighters />);
    } else if (option === "Bombers") {
      setSelectedComponent(<BuyBombers />);
    } else if (option === "Navy") {
      setSelectedComponent(<BuyNavy />);
    } else if (option === "Manage Trades") {
      setSelectedComponent(<ManageTrades />);
    } else if (option === "Send Aid") {
      setSelectedComponent(<SendAid />);
    } else if (option === "Declare War") {
      setSelectedComponent(<ManageWars />);
    } else if (option === "Active Wars") {
      setSelectedComponent(<ActiveWars />);
    } else if (option === "Senate") {
      setSelectedComponent(<Senate />);
    } else if (option === "Alliance") {
      setSelectedComponent(<AllianceManagement />);
    } else if (option === "Transfer or Delete") {
      setSelectedComponent(<TransferDeleteNation />);
    } else if (option === "Messages") {
      setSelectedComponent(<Messages />);
    } else if (option === "Search") {
      setSelectedComponent(<NationSearchBar />);
    } else if (option === "Spy Attack") {
      setSelectedComponent(<SpyAttackCard />);
    } else {
      setSelectedComponent(<div className="p-6">Coming Soon...</div>);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Left 15% */}
      <div
        className="w-1/6 text-white p-4 flex flex-col h-full min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/aged_paper.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          minHeight: "calc(100vh + 250px)",
        }}
      >
        <h2 className="font-special text-lg text-black mb-4">
          {nationId}: {selectedNationName}
        </h2>
        <h3 className="font-special text-lg text-black mb-4">
          {selectedNationBalance ? `${formatBalance(selectedNationBalance)} WBX` : "Balance not available"}
        </h3>

        {/* My Nations Dropdown */}
        {walletAddress && mintedNations.length > 0 && (
          <div className="relative">
            <button
              className="font-special btn btn-sm bg-secondary text-white hover:bg-secondary-dark"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              My Nations
            </button>

            {isDropdownOpen && (
              <ul className="font-special absolute left-0 mt-2 p-2 shadow bg-primary text-white rounded-box w-52">
                {mintedNations.map(nation => (
                  <li
                    key={nation.href}
                    onClick={() => handleNationSelect(nation.href.split("=")[1], nation.name)}
                    className="hover:bg-secondary p-2 rounded cursor-pointer"
                  >
                    <Link href={nation.href}>{nation.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Other Menu Items */}
        {menuItems.map(section => (
          <div key={section.category} className="mt-4">
            {/* Menu Headers - Special Font & Black */}
            <h3 className="font-special font-bold text-black">{section.category}</h3>
            <ul className="pl-2 mt-2">
              {section.options.map(option => (
                <li
                  key={option}
                  className={`cursor-pointer py-1 font-special text-black hover:text-yellow-400 ${
                    selectedMenuItem === option ? "text-yellow-400" : "text-black"
                  }`}
                  onClick={() => handleMenuClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Main Content - Right 85% */}
      <div className="w-5/6 p-1">{selectedComponent}</div>
    </div>
  );
};

export default Nation;
