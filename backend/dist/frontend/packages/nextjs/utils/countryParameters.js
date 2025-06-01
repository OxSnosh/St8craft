"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReligion = exports.setGovernment = exports.setTeam = exports.setAlliance = exports.setNationSlogan = exports.setCapitalCity = exports.setNationName = exports.setRulerName = void 0;
const setRulerName = async (nationId, publicClient, parametersContract, rulerName, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !rulerName) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(rulerName, "rulerName");
        console.error("Missing required data: publicClient, nationContract, nationId, or rulerName.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setRulerName",
        args: [rulerName, nationId],
    });
};
exports.setRulerName = setRulerName;
const setNationName = async (nationId, publicClient, parametersContract, nationName, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !nationName) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(nationName, "nationName");
        console.error("Missing required data: publicClient, nationContract, nationId, or nationName.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setNationName",
        args: [nationName, nationId],
    });
};
exports.setNationName = setNationName;
const setCapitalCity = async (nationId, publicClient, parametersContract, capitalCity, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !capitalCity) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(capitalCity, "capitalCity");
        console.error("Missing required data: publicClient, nationContract, nationId, or capitalCity.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setCapitalCity",
        args: [capitalCity, nationId],
    });
};
exports.setCapitalCity = setCapitalCity;
const setNationSlogan = async (nationId, publicClient, parametersContract, nationSlogan, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !nationSlogan) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(nationSlogan, "nationSlogan");
        console.error("Missing required data: publicClient, nationContract, nationId, or nationSlogan.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setNationSlogan",
        args: [nationSlogan, nationId],
    });
};
exports.setNationSlogan = setNationSlogan;
const setAlliance = async (nationId, publicClient, parametersContract, alliance, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !alliance) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(alliance, "alliance");
        console.error("Missing required data: publicClient, nationContract, nationId, or alliance.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setAlliance",
        args: [alliance, nationId],
    });
};
exports.setAlliance = setAlliance;
const setTeam = async (nationId, publicClient, parametersContract, team, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !team) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(team, "team");
        console.error("Missing required data: publicClient, nationContract, nationId, or team.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setTeam",
        args: [nationId, team],
    });
};
exports.setTeam = setTeam;
const setGovernment = async (nationId, publicClient, parametersContract, government, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !government) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(government, "government");
        console.error("Missing required data: publicClient, nationContract, nationId, or government.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setGovernment",
        args: [nationId, government],
    });
};
exports.setGovernment = setGovernment;
const setReligion = async (nationId, publicClient, parametersContract, religion, writeContractAsync) => {
    if (!publicClient || !parametersContract || !nationId || !religion) {
        console.log(publicClient, "publicClient");
        console.log(parametersContract, "nationContract");
        console.log(nationId, "nationId");
        console.log(religion, "religion");
        console.error("Missing required data: publicClient, nationContract, nationId, or religion.");
        return;
    }
    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setReligion",
        args: [nationId, religion],
    });
};
exports.setReligion = setReligion;
