'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  useAccount,
  useWriteContract,
  usePublicClient,
  useWaitForTransactionReceipt
} from 'wagmi';
import { simulateContract, writeContract } from 'wagmi/actions';
import { wagmiConfig } from '../../../utils/wagmiConfig';
import { useAllContracts } from '~~/utils/scaffold-eth/contractsData';

import { encodeFunctionData } from 'viem';
// import { useAccount } from 'wagmi';
import { useTransactor } from '~~/hooks/scaffold-eth/useTransactor';
// import { CountryMinter } from '~~/utils/contracts';

export function MintNation() {
  
  const [form, setForm] = useState({
    rulerName: '',
    nationName: '',
    capitalCity: '',
    nationSlogan: '',
  });
  
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [nations, setNations] = useState<Array<any>>([]);
  
  const { writeContractAsync } = useWriteContract();
  const { address: walletAddress } = useAccount();
  const writeTx = useTransactor();

  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const countryMinterContract = contractsData?.CountryMinter;
  const countryParametersContract = contractsData?.CountryParametersContract;

  const { data: txReceipt } = useWaitForTransactionReceipt({ hash: txHash });

  const fetchNationDetails = useCallback(async () => {
    if (!walletAddress || !countryMinterContract || !countryParametersContract || !publicClient) return;

    try {
      const tokenIds = await publicClient.readContract({
        abi: countryMinterContract.abi,
        address: countryMinterContract.address,
        functionName: 'tokensOfOwner',
        args: [walletAddress],
      });

      const details = await Promise.all(
        (tokenIds as any[]).map(async (tokenId) => {
          const id = tokenId.toString();
          const [nationName, rulerName, capitalCity, nationSlogan] = await Promise.all([
            publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: 'getNationName',
              args: [id],
            }),
            publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: 'getRulerName',
              args: [id],
            }),
            publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: 'getCapital',
              args: [id],
            }),
            publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: 'getSlogan',
              args: [id],
            }),
          ]);

          return { tokenId: id, nationName, rulerName, capitalCity, nationSlogan };
        })
      );

      setNations(details);
    } catch (err) {
      console.error('Failed to fetch nations:', err);
    }
  }, [walletAddress, countryMinterContract, countryParametersContract, publicClient]);

  useEffect(() => {
    fetchNationDetails();
  }, [fetchNationDetails]);

  const handleMint = async () => {
    console.log(writeContractAsync, "writeContractAsync");

    console.log("Mint button clicked");
    
    if (!walletAddress) {
      console.log("No wallet address found");
      alert("Connect wallet first");
      return;
    }
    
    console.log("Wallet connected with address:", walletAddress);
    
    if (!countryMinterContract?.abi || !countryMinterContract?.address) {
      console.error("Contract not initialized");
      alert('Contract not initialized');
      return;
    }
    
    try {
      console.log("Preparing transaction data...");
      const data = encodeFunctionData({
        abi: countryMinterContract.abi,
        functionName: 'generateCountry',
        args: [
          form.rulerName,
          form.nationName,
          form.capitalCity,
          form.nationSlogan,
        ],
      });
      
      console.log("Encoded transaction data:", data);
      console.log("About to send transaction with writeTx");
      
      // Try direct wallet connection without using writeTx
      const tx = await writeTx({
        to: countryMinterContract.address,
        data,
        account: walletAddress,
      });
      
      console.log("Transaction sent, hash:", tx);
    } catch (err) {
      console.error("Transaction failed:", err);
      console.dir(err); // Log the full error object
      alert("Transaction error: " + (err || "unknown error"));
    }
  };
  

  useEffect(() => {
  }, [walletAddress, countryMinterContract, writeContractAsync, writeTx, publicClient]);

  return (
    <div
      className="font-special text-center bg-secondary p-10 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/mintnationspage_expanded.jpg')",
        backgroundSize: '5440px 3300px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center -330px',
        width: '100vw',
        height: '2800px',
        position: 'absolute',
        top: '0',
        left: '0',
      }}
    >
      <div
        className="flex flex-col gap-4 w-full max-w-md"
        style={{ position: 'absolute', top: '270px', left: '47%', transform: 'translateX(-50%)' }}
      >
        {['Ruler Name', 'Nation Name', 'Capital City', 'Nation Slogan'].map((label, i) => {
          const key = ['rulerName', 'nationName', 'capitalCity', 'nationSlogan'][i] as keyof typeof form;
          return (
            <input
              key={key}
              type="text"
              placeholder={label}
              className="input input-primary"
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          );
        })}

        <button
          className="btn btn-primary mt-6"
          disabled={isPending || !walletAddress}
          onClick={handleMint}
          style={{ alignSelf: 'center', fontSize: '24px', fontWeight: 'bold' }}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            'Mint Nation'
          )}
        </button>
      </div>

      <div className="w-full flex flex-col justify-center items-center text-white min-h-screen">
        {nations.length === 0 ? (
          <p className="text-center">You do not have any minted nations yet.</p>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4"
            style={{ minHeight: '800px', marginTop: '800px' }}
          >
            {nations.map((nation, index) => (
              <a
                key={index}
                href={`/nations?id=${nation.tokenId}`}
                className="relative rounded-lg font-orbitron text-black text-center overflow-hidden"
                style={{
                  width: '225px',
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundImage: `url('/post-it-note.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%',
                  }}
                />
                <div className="font-special relative z-10 bg-opacity-90 p-4 rounded-lg">
                  <h3 className="text-xl font-special">
                    {nation.tokenId} : {nation.nationName}
                  </h3>
                  <p>Ruler: {nation.rulerName}</p>
                  <p>Capital: {nation.capitalCity}</p>
                  <p>Slogan: {nation.nationSlogan}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
