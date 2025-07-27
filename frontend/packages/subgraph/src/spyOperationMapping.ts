import { SpyAttackResolvedPublic } from "../generated/SpyOperationsContract/SpyOperationsContract"
import { SpyOperation } from "../generated/schema"

export function handleSpyOperation(event: SpyAttackResolvedPublic): void {
  let entity = new SpyOperation(event.params.attackId.toString())
  entity.attackId = event.params.attackId
  entity.attackerId = event.params.maskedAttackerId
  entity.defenderId = event.params.defenderId
  entity.success = event.params.success
  entity.attackType = event.params.attackType
  entity.transactionHash = event.transaction.hash.toHexString()
  entity.save()
}