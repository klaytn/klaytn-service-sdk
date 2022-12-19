import { BigNumber } from "ethers"
import { MapLike } from "typescript"

export interface Chain {
    id: number
    name: string
    icon: string
    block_delay: number
    gas_token_symbol: string
    explore_url: string
    rpc_url: string
    contract_addr: string
    drop_gas_amt?: string
}

export interface Token {
    symbol: string
    address: string
    decimal: number
    xfer_disabled: boolean
    display_symbol?: string /// FOR ETH <=====> WETH
}

export interface TokenInfo {
    token: Token
    name: string
    icon: string
    max_amt: string
    balance?: string
    inbound_lmt?: string
}

export interface PeggedPairConfig {
    org_chain_id: number
    org_token: TokenInfo
    pegged_chain_id: number
    pegged_token: TokenInfo
    pegged_deposit_contract_addr: string
    pegged_burn_contract_addr: string
    canonical_token_contract_addr: string
    vault_version: number
    bridge_version: number
}

export interface ChainTokenInfo {
    token: Array<TokenInfo>
}

export interface ITransferConfigs {
    chains: Array<Chain>
    chain_token: MapLike<ChainTokenInfo>
    farming_reward_contract_addr: string
    pegged_pair_configs: Array<PeggedPairConfig>
}

export interface ITransferObject {
    transferToken?: TokenInfo
    fromChain?: Chain
    toChain?: Chain
    value?: BigNumber
    nonce?: number
}
