import { describe, test, assert, beforeAll } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Nation } from "../generated/schema";

describe("Asserts", () => {
    beforeAll(() => {
        // Mocking the Sender
        let nation = new Nation("0");
        nation.nationId = BigInt.fromI32(0);
        nation.ruler = "OxSnosh"
        nation.name = "WAGMIA";
        nation.owner = Address.fromString("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
        nation.createdAt = BigInt.fromI32(1709849870);
        nation.transactionHash = "0x1909fcb0b41989e28308afcb0cf55adb6faba28e14fcbf66c489c69b8fe95dd6";
        nation.save();
    });

    test("Nation Entity", () => {
        // Testing proper entity creation and field assertion
        
        let id = "0";
        let nation = Nation.load(id);
        assert.assertNotNull(nation, "Nation entity should not be null");

        assert.fieldEquals("Nation", id, "nationId", "0");
        assert.equals(
            ethereum.Value.fromString(nation!.ruler),
            ethereum.Value.fromString("OxSnosh"),
            "Ruler should be OxSnosh"
        );
        assert.equals(
            ethereum.Value.fromString(nation!.name),
            ethereum.Value.fromString("WAGMIA"),
            "Nation name should be WAGMIA"
        );
        assert.equals(
            ethereum.Value.fromAddress(nation!.owner),
            ethereum.Value.fromAddress(Address.fromString("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")),
            "Owner address should match"
        );
    });
});
