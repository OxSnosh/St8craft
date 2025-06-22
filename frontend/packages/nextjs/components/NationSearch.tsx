"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash.debounce";

const SEARCH_NATIONS = gql`
  query SearchNations($where: Nation_filter) {
    nations(first: 10, where: $where, orderBy: createdAt, orderDirection: desc) {
      id
      name
      nationId
      ruler
      owner
    }
  }
`;

const FILTER_OPTIONS = [
  { label: "Nation Name", value: "name" },
  { label: "Ruler Name", value: "ruler" },
  { label: "Nation ID", value: "nationId" },
];

type Nation = {
  id: string;
  name: string;
  nationId: string;
  ruler: string;
  owner: string;
};

export function NationSearchBar({
  onSelect,
  placeholder = "Search...",
}: {
  onSelect?: (nation: Nation) => void;
  placeholder?: string;
}) {
  const [filterBy, setFilterBy] = useState<"name" | "ruler" | "nationId">("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Nation[]>([]);
  const [searchNations, { loading }] = useLazyQuery(SEARCH_NATIONS, {
    onCompleted: data => setResults(data.nations),
  });

  const router = useRouter();

  const handleSearch = debounce((value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const whereClause = filterBy === "nationId" ? { nationId: value } : { [`${filterBy}_contains_nocase`]: value };

    searchNations({ variables: { where: whereClause } });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSelect = (nation: Nation) => {
    if (onSelect) {
      onSelect(nation);
    } else {
      localStorage.setItem("selectedMenuItem", `Nation ${nation.nationId}`);
      router.push(`/nations?id=${nation.nationId}`);
    }

    // Clear input & results
    setSearchTerm("");
    setResults([]);
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('input[type="text"]');
      input?.blur();
    }, 100);
  };

  return (
    <div className="relative w-full max-w-md space-y-2">
      <div className="flex gap-2">
        <select
          value={filterBy}
          onChange={e => setFilterBy(e.target.value as "name" | "ruler" | "nationId")}
          className="select select-bordered dark:bg-gray-800 dark:text-white"
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>

      {loading && (
        <div className="absolute z-50 bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-600 w-full mt-1 rounded shadow px-4 py-2">
          Loading...
        </div>
      )}

      {results.length > 0 && (
        <ul className="absolute z-50 bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-600 w-full mt-1 rounded shadow">
          {results.map(nation => (
            <li
              key={nation.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(nation)}
            >
              Nation: {nation.name} | Ruler: {nation.ruler} | ID: {nation.nationId}
            </li>
          ))}
        </ul>
      )}

      {searchTerm && !results.length && !loading && (
        <div className="absolute z-50 bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-600 w-full mt-1 rounded shadow px-4 py-2">
          No results found
        </div>
      )}
    </div>
  );
}
