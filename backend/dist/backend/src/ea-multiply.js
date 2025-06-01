"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PORT = 8081;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.post("/", async function (req, res) {
    const eaInputData = req.body;
    console.log("Request data received: ", eaInputData);
    let answer = eaInputData.data.numberToMultiply * 1000;
    let eaResponse = {
        data: {
            product: answer,
        },
        requestId: eaInputData.requestId,
        statusCode: 0,
    };
    try {
        // It's common practice to store the desired result value in a top-level result field.
        eaResponse.statusCode = 200;
        console.log("returned response:  ", eaResponse);
        res.json(eaResponse);
    }
    catch (error) {
        console.error("Response Error: ", error);
        eaResponse.error = error.message;
        eaResponse.statusCode = error.response.status;
        res.json(eaResponse);
    }
    return;
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
process_1.default.on("SIGINT", () => {
    console.info("\nShutting down server...");
    process_1.default.exit(0);
});
