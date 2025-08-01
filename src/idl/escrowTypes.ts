/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/escrow.json`.
 */
export type Escrow = {
  "address": "FrSh6N1nUpvrRowi85uYHC8XZNMeuUZuBV1nyXTGaKgD",
  "metadata": {
    "name": "escrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approveWork",
      "discriminator": [
        181,
        118,
        45,
        143,
        204,
        88,
        237,
        109
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "taker",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "escrow.maker",
                "account": "escrow"
              },
              {
                "kind": "account",
                "path": "escrow.escrow_id",
                "account": "escrow"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow.maker",
                "account": "escrow"
              },
              {
                "kind": "account",
                "path": "escrow.escrow_id",
                "account": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "arbiterResolve",
      "discriminator": [
        72,
        74,
        145,
        98,
        97,
        32,
        107,
        5
      ],
      "accounts": [
        {
          "name": "arbiter",
          "signer": true
        },
        {
          "name": "maker",
          "writable": true
        },
        {
          "name": "taker",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow.maker",
                "account": "escrow"
              },
              {
                "kind": "account",
                "path": "escrow.escrow_id",
                "account": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "takerAmount",
          "type": "u64"
        },
        {
          "name": "makerAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelBeforeStart",
      "discriminator": [
        180,
        233,
        11,
        38,
        90,
        126,
        45,
        141
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow.maker",
                "account": "escrow"
              },
              {
                "kind": "account",
                "path": "escrow.escrow_id",
                "account": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claimTimeout",
      "discriminator": [
        130,
        234,
        45,
        53,
        120,
        90,
        86,
        178
      ],
      "accounts": [
        {
          "name": "claimant",
          "writable": true,
          "signer": true
        },
        {
          "name": "escrow",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "escrow.maker",
                "account": "escrow"
              },
              {
                "kind": "account",
                "path": "escrow.escrow_id",
                "account": "escrow"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createEscrow",
      "discriminator": [
        253,
        215,
        165,
        116,
        36,
        108,
        68,
        80
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "taker"
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              },
              {
                "kind": "arg",
                "path": "escrowId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              },
              {
                "kind": "arg",
                "path": "escrowId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "i64"
        },
        {
          "name": "autoReleaseAt",
          "type": "i64"
        },
        {
          "name": "specHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "arbiter",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "raiseDispute",
      "discriminator": [
        41,
        243,
        1,
        51,
        150,
        95,
        246,
        73
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "escrow",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "evidenceUriHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "requestRevision",
      "discriminator": [
        205,
        195,
        75,
        171,
        242,
        149,
        90,
        14
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "escrow",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "submitWork",
      "discriminator": [
        158,
        80,
        101,
        51,
        114,
        130,
        101,
        253
      ],
      "accounts": [
        {
          "name": "taker",
          "writable": true,
          "signer": true
        },
        {
          "name": "escrow",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "deliverableHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "discriminator": [
        31,
        213,
        123,
        187,
        186,
        22,
        218,
        155
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidState",
      "msg": "Invalid escrow state for this operation"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "Invalid amount specified"
    },
    {
      "code": 6002,
      "name": "claimNotAvailable",
      "msg": "Claim not available at this time"
    },
    {
      "code": 6003,
      "name": "noFundsAvailable",
      "msg": "No funds available in escrow"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6005,
      "name": "alreadyDisputed",
      "msg": "This escrow is already disputed"
    },
    {
      "code": 6006,
      "name": "deadlinePassed",
      "msg": "Deadline has already passed"
    },
    {
      "code": 6007,
      "name": "fundsAlreadyReleased",
      "msg": "Funds have already been released"
    },
    {
      "code": 6008,
      "name": "invalidDeadline",
      "msg": "Invalid deadline specified"
    },
    {
      "code": 6009,
      "name": "invalidReleaseTime",
      "msg": "Invalid auto-release time specified"
    },
    {
      "code": 6010,
      "name": "overflow",
      "msg": "Arithmetic overflow"
    }
  ],
  "types": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "escrowId",
            "type": "u64"
          },
          {
            "name": "maker",
            "type": "pubkey"
          },
          {
            "name": "taker",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "autoReleaseAt",
            "type": "i64"
          },
          {
            "name": "completedAt",
            "type": "i64"
          },
          {
            "name": "disputedAt",
            "type": "i64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "arbiter",
            "type": "pubkey"
          },
          {
            "name": "amountTotal",
            "type": "u64"
          },
          {
            "name": "amountReleased",
            "type": "u64"
          },
          {
            "name": "amountRefunded",
            "type": "u64"
          },
          {
            "name": "milestoneIndex",
            "type": "u8"
          },
          {
            "name": "specHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "deliverableHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "revisionRequests",
            "type": "u16"
          },
          {
            "name": "disputeEvidenceUriHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    }
  ]
};
