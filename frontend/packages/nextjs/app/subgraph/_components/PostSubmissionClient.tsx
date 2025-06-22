"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

const PostSubmissionClient = ({ nationId }: { nationId: string }) => {
  const { address: walletAddress } = useAccount();
  const [newPost, setNewPost] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractsData = useAllContracts();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const countryMinter = contractsData?.CountryMinter;
  const messenger = contractsData?.Messenger;

  useEffect(() => {
    const checkOwnership = async () => {
      if (!walletAddress || !nationId || !countryMinter || !publicClient) return;

      try {
        const result = await publicClient.readContract({
          address: countryMinter.address,
          abi: countryMinter.abi,
          functionName: "checkOwnership",
          args: [nationId, walletAddress],
        });
        setIsOwner(Boolean(result));
      } catch (err) {
        console.error("Error checking ownership:", err);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [walletAddress, nationId, countryMinter, publicClient]);

  const handlePostSubmit = async () => {
    if (!newPost.trim() || !nationId || !messenger) return;

    try {
      await writeContractAsync({
        abi: messenger.abi,
        address: messenger.address,
        functionName: "postMessage",
        args: [nationId, newPost],
      });

      alert("Post submitted successfully!");
      setNewPost("");
    } catch (error) {
      console.error("Error submitting post:", error);
      setError("Failed to submit post.");
    }
  };

  if (!isOwner) return null;

  return (
    <div className="mt-6 w-full max-w-2xl">
      {error && <p className="text-red-500">{error}</p>}
      <textarea
        value={newPost}
        onChange={e => setNewPost(e.target.value)}
        className="textarea textarea-bordered w-full"
        placeholder="Write your post..."
      />
      <button onClick={handlePostSubmit} className="btn btn-primary mt-2 w-full">
        Submit Post
      </button>
    </div>
  );
};

export default PostSubmissionClient;
