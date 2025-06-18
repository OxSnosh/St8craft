import { BigInt, Address } from "@graphprotocol/graph-ts";
import { BlockadeCompleted } from "../generated/NavalBlockadeContract/NavalBlockadeContract";
import { Blockade } from "../generated/schema";
import { blockade } from '../../nextjs/utils/attacks';

export function handleBlockade(event: BlockadeCompleted): void {

    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let blockade = new Blockade(id)
    
    blockade.battleId = event.params.battleId,
    blockade.blockaderId = event.params.attackerId,
    blockade.blockadedId = event.params.defenderId,
    blockade.percentageReduction = event.params.percentageReduction,
    blockade.transactionHash = event.transaction.hash.toHex()
    
    blockade.save();

}