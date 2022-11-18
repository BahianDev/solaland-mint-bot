const axios = require("axios");
const anchor = require("@project-serum/anchor");
const https = require("https");
const {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  MintLayout,
} = require("@solana/spl-token");

const { base58_to_binary } = require("base58-js");
// const fs = require("fs");
const bs58 = require("bs58");

const constants = {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: new anchor.web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  ),
  TOKEN_METADATA_PROGRAM_ID: new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  ),
  NOVA_LAUNCH_PROGRAM: new anchor.web3.PublicKey(
    "nva24Y1vHfhCrCLcqqFLXher9uZR4JjKP4D89MHhkmA"
  ),
  LAUNCHPAD_PROGRAM: new anchor.web3.PublicKey(
    "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb"
  ),
  CIVIC: new anchor.web3.PublicKey(
    "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"
  ),
  CANDY_MACHINE_PROGRAM: new anchor.web3.PublicKey(
    "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
  ),
  MONKE_LABS: new anchor.web3.PublicKey(
    "minwAEdewYNqagUwzrVBUGWuo277eeSMwEwj76agxYd"
  ),
  LMNFT_PROGRAM: new anchor.web3.PublicKey(
    "ArAA6CZC123yMJLUe4uisBEgvfuw2WEvex9iFmFCYiXv"
  ),
  CANDY_MACHINE_ID: new anchor.web3.PublicKey(
    "Bit2K3gjW7vXJvUZcHn4sCX6VdAqhQyvzNQcduH8fYwH"
  ),
};

const connection = new anchor.web3.Connection(
  "https://small-red-dew.solana-mainnet.quiknode.pro/a7a53c5e116e9196170c3ee6ddc1a150dd64cf9b/",
  { commitment: "finalized" }
);

const keypair = anchor.web3.Keypair.fromSecretKey(
  anchor.utils.bytes.bs58.decode(
    ""
  )
);
const wallet = new anchor.Wallet(keypair);

const provider = new anchor.Provider(connection, wallet, {
  preflightCommitment: "processed",
});

async function start() {
  try {
    const idl = await anchor.Program.fetchIdl(LAUNCHPAD_PROGRAM, provider);

    const program = new anchor.Program(idl, LAUNCHPAD_PROGRAM, provider);
    const candyMachineDetails = await program.account.candyMachine.fetch(
      CANDY_MACHINE_ID
    );

    let rawTransaction = Buffer.from([]);

    const mintObject = await createLaunchpadMint(
      connection,
      CANDY_MACHINE_ID,
      wallet.payer.publicKey,
      program,
      candyMachineDetails,
      10000,
      "So11111111111111111111111111111111111111112"
    );

    const transactionMint = [mintObject.B, mintObject.W];
    const signers = mintObject.signers;

    const B = transactionMint[0];
    const W = transactionMint[1];

    console.log(1);
    const transaction = await getSignature(B, W, null, 10000);

    // const notaryResult = await axios({
    //   method: "POST",
    //   url: `https://wk-notary-prod.magiceden.io/sign`,
    //   data: {
    //     response: "",
    //     message: bs58.encode(transaction.serializeMessage()),
    //   },
    // });

    // console.log(2)

    // // console.log(notaryResult);

    // await program.provider.wallet.signTransaction(transaction);
    // transaction.partialSign(mintObject.W.mint);
    // transaction.addSignature(
    //   mintObject.W.notary,
    //   bs58.decode(notaryResult.data.signature)
    // );
    // const sendTx = transaction.serialize({ verifySignatures: !1 });

    // let mintTxId = await program.provider.connection.sendRawTransaction(
    //   sendTx,
    //   { preflightCommitment: "processed" }
    // );

    // console.log(mintTxId);

    console.log("misc", `Signing transaction...`);

    transaction.partialSign(...signers);
    console.log(2);
    const signedTx = await wallet.signTransaction(transaction);
    console.log(3);

    rawTransaction = signedTx.serialize({
      verifySignatures: true,
    });

    let sig = bs58.encode(
      new Uint8Array(Buffer.from(rawTransaction)).slice(1, 65)
    );

    connection.sendRawTransaction(rawTransaction);

    console.log(transaction);
  } catch (error) {
    console.log(error);
  }
}

async function createLaunchpadMint(
  connection,
  id,
  payer,
  program,
  details,
  delay,
  paymentMint
) {
  try {
    let l =
      null != details.notary &&
      !details.notary.equals(anchor.web3.SystemProgram.programId);

    let x = await Promise.all(
      new Array(1).fill(null).map(async function () {
        return await bump(payer);
      })
    );

    let h = x.filter(function (e) {
      return null !== e;
    });

    let T = [];
    let I;

    if (!(I = h[0])) {
      throw 1;
    }

    let v = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      I.publicKey,
      payer
    );
    let N = await getMetadata(I.publicKey);
    let O = await getMasterEdition(I.publicKey);

    let k = await limit(id, payer);
    let L = k;
    let w = L[0];
    let P = L[1];
    let C = await getLaunchStagesInfo(id);

    let D = C;
    let K = D[0];
    let U = new anchor.web3.PublicKey(paymentMint);
    let G = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      U,
      details.walletAuthority
    );
    let W;

    if (U.equals(NATIVE_MINT)) {
      W = payer;
    } else {
      W = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        U,
        payer
      );
    }

    let B = [I];
    T.push(I);

    let M;

    const blockhash = await connection.getLatestBlockhash("finalized");

    let B1 = {
      walletLimitInfoBump: k[1],
      inOrder: false,
      blockhash: blockhash.blockhash,
      needsNotary: l,
      isLite: false,
    };

    let W1 = {
      config: details.config,
      candyMachine: id,
      launchStagesInfo: K,
      candyMachineWalletAuthority: details.walletAuthority,
      mintReceiver: payer,
      payer: payer,
      payTo: G,
      payFrom: W,
      mint: I.publicKey,
      tokenAta: v,
      metadata: N[0],
      masterEdition: O[0],
      walletLimitInfo: w,
      tokenMetadataProgram: constants.TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      orderInfo: details.orderInfo,
      slotHashes: new anchor.web3.PublicKey(
        "SysvarS1otHashes111111111111111111111111111"
      ),
      notary:
        null !== (M = details.notary) && void 0 !== M
          ? M
          : anchor.web3.PublicKey.default,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    return {
      B: B1,
      W: W1,
      signers: [I],
    };
  } catch (err) {
    console.log(err);
    console.log("error", "Unknown error while creating mint!");

    return await createLaunchpadMint(
      connection,
      id,
      payer,
      program,
      details,
      delay,
      paymentMint
    );
  }
}

async function bump(payer) {
  try {
    let s, c, m, d, l, p, f;

    let a = 0;
    let t = [payer].length > 1 && void 0 !== [payer][1] ? [payer][1] : 100;

    while (true) {
      if (!(a < t)) {
        throw 1;
      }

      let r = anchor.web3.Keypair.generate();
      let metadataFunctions = await Promise.all([
        getMetadata(r.publicKey),
        getMasterEdition(r.publicKey),
        getTokenWallet(payer, r.publicKey),
      ]);

      if (
        ((s = metadataFunctions),
        (c = s[0]),
        c[0],
        (m = c[1]),
        (d = s[1]),
        d[0],
        (l = d[1]),
        (p = s[2]),
        p[0],
        (f = p[1]),
        255 !== m || 255 !== l || 255 !== f)
      ) {
        a += 1;
      } else {
        return r;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getSignature(B, W, agentSettings, delay) {
  try {
    const idl = await anchor.Program.fetchIdl(LAUNCHPAD_PROGRAM, provider);

    const program = new anchor.Program(idl, LAUNCHPAD_PROGRAM, provider);

    let a = {
      config: W.config.toBase58(),
      candyMachine: W.candyMachine.toBase58(),
      launchStagesInfo: W.launchStagesInfo.toBase58(),
      candyMachineWalletAuthority: W.candyMachineWalletAuthority.toBase58(),
      mintReceiver: W.mintReceiver.toBase58(),
      payer: W.payer.toBase58(),
      payTo: W.payTo.toBase58(),
      payFrom: W.payFrom.toBase58(),
      mint: W.mint.toBase58(),
      tokenAta: W.tokenAta.toBase58(),
      metadata: W.metadata.toBase58(),
      masterEdition: W.masterEdition.toBase58(),
      walletLimitInfo: W.walletLimitInfo.toBase58(),
      tokenMetadataProgram: W.tokenMetadataProgram.toBase58(),
      tokenProgram: W.tokenProgram.toBase58(),
      systemProgram: W.systemProgram.toBase58(),
      rent: W.rent.toBase58(),
      orderInfo: W.orderInfo.toBase58(),
      slotHashes: W.slotHashes.toBase58(),
      notary: W.notary.toBase58(),
      associatedTokenProgram: W.associatedTokenProgram.toBase58(),
    };

    const rent =
      await program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );

    const candyMachineDetails = await program.account.candyMachine.fetch(
      CANDY_MACHINE_ID
    );

    const tx = program.transaction.mintNft(
      B.walletLimitBump,
      false,
      null,
      new anchor.BN(Date.now()),
      {
        accounts: {
          config: candyMachineDetails.config,
          candyMachine: new anchor.web3.PublicKey(a.candyMachine),
          launchStagesInfo: new anchor.web3.PublicKey(a.launchStagesInfo), //
          payer: new anchor.web3.PublicKey(a.payer),
          candyMachineWalletAuthority: new anchor.web3.PublicKey(
            a.candyMachineWalletAuthority
          ),
          mintReceiver: new anchor.web3.PublicKey(a.mintReceiver),
          payTo: new anchor.web3.PublicKey(a.payTo),
          payFrom: new anchor.web3.PublicKey(a.payFrom),
          mint: new anchor.web3.PublicKey(a.mint), //
          tokenAta: new anchor.web3.PublicKey(a.tokenAta),
          metadata: new anchor.web3.PublicKey(a.metadata), //
          masterEdition: new anchor.web3.PublicKey(a.masterEdition), //
          walletLimitInfo: new anchor.web3.PublicKey(a.walletLimitInfo), //
          mintAuthority: new anchor.web3.PublicKey(a.payer), //
          updateAuthority: new anchor.web3.PublicKey(a.payer), //
          tokenMetadataProgram: constants.TOKEN_METADATA_PROGRAM_ID, //
          tokenProgram: TOKEN_PROGRAM_ID, //
          systemProgram: anchor.web3.SystemProgram.programId, //
          rent: anchor.web3.SYSVAR_RENT_PUBKEY, //
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY, //
          orderInfo: new anchor.web3.PublicKey(a.orderInfo),
          slotHashes: new anchor.web3.PublicKey(
            "SysvarS1otHashes111111111111111111111111111"
          ), //
          notary: new anchor.web3.PublicKey(a.notary),
          associatedTokenProgram: new anchor.web3.PublicKey(
            a.associatedTokenProgram
          ),
        },
        signers: [W.mint],
        remainingAccounts: [
          {
            pubkey: new anchor.web3.PublicKey(
              "11111111111111111111111111111111"
            ),
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: new anchor.web3.PublicKey(a.payer),
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey:
              new anchor.web3.PublicKey(a.notary) ||
              anchor.web3.SystemProgram.programId,
            isWritable: false,
            isSigner: true,
          },
        ],
        instructions: [
          anchor.web3.SystemProgram.createAccount({
            fromPubkey: new anchor.web3.PublicKey(a.payer),
            newAccountPubkey: new anchor.web3.PublicKey(a.mint),
            space: MintLayout.span,
            lamports: rent,
            programId: TOKEN_PROGRAM_ID,
          }),
          Token.createInitMintInstruction(
            TOKEN_PROGRAM_ID,
            new anchor.web3.PublicKey(a.mint),
            0,
            new anchor.web3.PublicKey(a.payer),
            new anchor.web3.PublicKey(a.payer)
          ),
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            new anchor.web3.PublicKey(a.mint),
            new anchor.web3.PublicKey(a.tokenAta),
            new anchor.web3.PublicKey(a.payer),
            new anchor.web3.PublicKey(a.payer)
          ),
          Token.createMintToInstruction(
            TOKEN_PROGRAM_ID,
            new anchor.web3.PublicKey(a.mint),
            new anchor.web3.PublicKey(a.tokenAta),
            new anchor.web3.PublicKey(a.payer),
            [],
            1
          ),
        ],
      }
    );

    tx.feePayer = new anchor.web3.PublicKey(a.payer);
    tx.recentBlockhash = (
      await connection.getLatestBlockhash("finalized")
    ).blockhash;

    return tx;
  } catch (err) {
    console.log(err);

    console.log("error", "Unknown error while signing mint!");
  }
}

start();

const getMetadata = async (mint) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      constants.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    constants.TOKEN_METADATA_PROGRAM_ID
  );
};

const getMasterEdition = async (mint) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      constants.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    constants.TOKEN_METADATA_PROGRAM_ID
  );
};

const getTokenWallet = async (wallet, mint) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    constants.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

const limit = async (cmid, payer) => {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("wallet_limit"),
      cmid.toBuffer(),
      payer.toBuffer(),
    ],
    constants.LAUNCHPAD_PROGRAM
  );
};

const getLaunchStagesInfo = async (candyMachineId) => {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("candy_machine"),
      anchor.utils.bytes.utf8.encode("launch_stages"),
      candyMachineId.toBuffer(),
    ],
    constants.LAUNCHPAD_PROGRAM
  );
};
