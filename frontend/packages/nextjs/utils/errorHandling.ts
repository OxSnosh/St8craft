// import { AbiCoder } from "ethers/lib/utils";

export function parseRevertReason(error: any): string {
    if (error?.data) {
      try {
        if (error.data.startsWith("0x08c379a0")) {
          return error.data.slice(10).replace(/0+$/, "").replace(/0x/g, "");
        }
      } catch (decodeError) {
        return "Unknown revert reason";
      }
    }
    return error?.message || "Transaction failed";
  }
