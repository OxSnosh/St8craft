"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_node_1 = require("./functions/run-node");
const launchNode = async () => {
    // Read the restartOnly flag from command line arguments
    const restartOnly = process.argv.includes('--restart');
    const runNodeArgs = {
        restartOnly: restartOnly
    };
    await (0, run_node_1.runNode)(runNodeArgs);
};
launchNode();
