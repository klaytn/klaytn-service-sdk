
const transferConfigs = {
    "chains": [
      {
        "id": 5,
        "name": "Goerli",
        "icon": "https://get.celer.app/cbridge-icons/ETH.png",
        "block_delay": 5,
        "gas_token_symbol": "ETH",
        "explore_url": "https://goerli.etherscan.io/",
        "contract_addr": "0x358234B325EF9eA8115291A8b81b7d33A2Fa762D",
        "drop_gas_amt": "0",
        "drop_gas_cost_amt": "0",
        "drop_gas_balance_alert": "0",
        "suggested_gas_cost": "0",
        "flat_usd_fee": 0,
        "farming_reward_contract_addr": "0x1a9E665dAdE720B654758327dCA914402eaF316B",
        "transfer_agent_contract_addr": "0xBC06BA73f674E3eECDF05ddC7B946351889A5cB6"
      },
      {
        "id": 71401,
        "name": "Godwoken Testnet",
        "icon": "https://get.celer.app/cbridge-icons/chain-icon/nervos.png",
        "block_delay": 1,
        "gas_token_symbol": "CKB",
        "explore_url": "https://gw-explorer.nervosdao.community",
        "contract_addr": "0x7A4a65Db21864384d2D21a60367d7Fd5c86F8Fba",
        "drop_gas_amt": "0",
        "drop_gas_cost_amt": "0",
        "drop_gas_balance_alert": "0",
        "suggested_gas_cost": "0",
        "flat_usd_fee": 0,
        "farming_reward_contract_addr": "",
        "transfer_agent_contract_addr": ""
      },
      {
        "id": 80001,
        "name": "Polygon Mumbai",
        "icon": "https://get.celer.app/cbridge-icons/chain-icon/Polygon.png",
        "block_delay": 3,
        "gas_token_symbol": "MATIC",
        "explore_url": "https://mumbai.polygonscan.com/",
        "contract_addr": "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
        "drop_gas_amt": "0",
        "drop_gas_cost_amt": "0",
        "drop_gas_balance_alert": "0",
        "suggested_gas_cost": "144755",
        "flat_usd_fee": 0.5,
        "farming_reward_contract_addr": "",
        "transfer_agent_contract_addr": ""
      }
    ],
    "chain_token": {
      "5": {
        "token": [
          {
            "token": {
              "symbol": "USDC",
              "address": "0xCbE56b00d173A26a5978cE90Db2E33622fD95A28",
              "decimal": 6,
              "xfer_disabled": false
            },
            "name": "USD Coin",
            "icon": "https://get.celer.app/cbridge-icons/USDC.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "20000000000",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          }
        ]
      },
      "71401": {
        "token": [
          {
            "token": {
              "symbol": "USDC",
              "address": "0x4Ea08DCA142F103ac2D5FF95F1d376712C5EF5a9",
              "decimal": 6,
              "xfer_disabled": true
            },
            "name": "USDC",
            "icon": "https://get.celer.app/cbridge-icons/ETH.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          },
          {
            "token": {
              "symbol": "USDT",
              "address": "0xCdb3D2dC427A5BC9aF54a9c2Ed2F5950619184BF",
              "decimal": 6,
              "xfer_disabled": true
            },
            "name": "USDT",
            "icon": "https://get.celer.app/cbridge-icons/ETH.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          }
        ]
      },
      "80001": {
        "token": [
          {
            "token": {
              "symbol": "FLOWUSDC",
              "address": "0xb3eE310FB0566b053BbC3925E7F17Cd4505d00DB",
              "decimal": 6,
              "xfer_disabled": true
            },
            "name": "FLOWUSDC",
            "icon": "https://get.celer.app/cbridge-icons/ETH.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          },
          {
            "token": {
              "symbol": "MATIC",
              "address": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
              "decimal": 18,
              "xfer_disabled": true
            },
            "name": "MATIC",
            "icon": "https://get.celer.app/cbridge-icons/ETH.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          },
          {
            "token": {
              "symbol": "USDC",
              "address": "0x6De33698e9e9b787e09d3Bd7771ef63557E148bb",
              "decimal": 6,
              "xfer_disabled": false
            },
            "name": "USD Coin",
            "icon": "https://get.celer.app/cbridge-icons/USDC.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          },
          {
            "token": {
              "symbol": "WUSDC",
              "address": "0xD9d1034ef3d21221F008C7e96346CA999966752C",
              "decimal": 6,
              "xfer_disabled": false
            },
            "name": "WUSDC",
            "icon": "https://get.celer.app/cbridge-icons/USDC.png",
            "inbound_lmt": "",
            "inbound_epoch_cap": "",
            "transfer_disabled": false,
            "liq_add_disabled": false,
            "liq_rm_disabled": false,
            "liq_agg_rm_src_disabled": false,
            "delay_threshold": "",
            "delay_period": 0
          }
        ]
      }
    },
    "farming_reward_contract_addr": "",
    "pegged_pair_configs": [
      {
        "org_chain_id": 5,
        "org_token": {
          "token": {
            "symbol": "USDC",
            "address": "0xCbE56b00d173A26a5978cE90Db2E33622fD95A28",
            "decimal": 6,
            "xfer_disabled": false
          },
          "name": "USD Coin",
          "icon": "https://get.celer.app/cbridge-icons/USDC.png",
          "inbound_lmt": "",
          "inbound_epoch_cap": "",
          "transfer_disabled": false,
          "liq_add_disabled": false,
          "liq_rm_disabled": false,
          "liq_agg_rm_src_disabled": false,
          "delay_threshold": "",
          "delay_period": 0
        },
        "pegged_chain_id": 71401,
        "pegged_token": {
          "token": {
            "symbol": "USDC",
            "address": "0x4Ea08DCA142F103ac2D5FF95F1d376712C5EF5a9",
            "decimal": 6,
            "xfer_disabled": false
          },
          "name": "USD Coin",
          "icon": "https://get.celer.app/cbridge-icons/USDC.png",
          "inbound_lmt": "",
          "inbound_epoch_cap": "",
          "transfer_disabled": false,
          "liq_add_disabled": false,
          "liq_rm_disabled": false,
          "liq_agg_rm_src_disabled": false,
          "delay_threshold": "",
          "delay_period": 0
        },
        "pegged_deposit_contract_addr": "0x28b37266a82aA7aae2b5ACA5a557C4Af0717b114",
        "pegged_burn_contract_addr": "0x70D4814e111Ad66B90B90D54a44797BC696BcdAF",
        "canonical_token_contract_addr": "",
        "vault_version": 0,
        "bridge_version": 2,
        "migration_peg_burn_contract_addr": ""
      }
    ]
  }

  export {
    transferConfigs
  }