const ethers = require("ethers");
const constants = require("./constants");
const { Command } = require("commander");
const { setupParentArgs, waitForTx, expandDecimals } = require("./utils");
const key = process.env.key;
const mint = new Command("mint")
  .description("Adds an admin")
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].ADMIN_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    " contract address",
    constants[key].ERC20_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address")
  .option("--amount <amount>", "amount", 100000)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.ERC20.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    const tx1 = await nftInstance.mint(args.to, expandDecimals(args.amount));
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const batchMint = new Command("batch-mint")
  .description("Adds an admin")
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].ADMIN_PRIVATE_KEY
  )
  .option("--admin <address>", "admin contract address", constants[key].ADMIN)
  .option(
    "--contract <address>",
    " contract address",
    constants[key].ERC20_CONTRACT_ADDRESS
  )
  .option("--to <address>", "address")
  .option("--amount <amount>", "amount", 100000)
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.FCR.abi,
      args.wallet
    );
    console.log(`Adding ${args.admin} as a admin.`);

    const tx1 = await nftInstance.BatchMint(
      [args.to],
      [expandDecimals(args.amount)]
    );
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const transfer = new Command("transfer")
  .description("Adds an admin")
  .option(
    "--privateKey <value>",
    "Private key to use",
    constants[key].ADMIN_PRIVATE_KEY
  )
  .option(
    "--contract <address>",
    "Bridge contract address",
    constants[key].NFT_CONTRACT_ADDRESS
  )
  .option("--from <address>", "admin contract address", constants[key].ADMIN)
  .option("--amounts [amount]", "amounts", 1)
  .option("--to <address>", "to")
  .action(async function (args) {
    await setupParentArgs(args, args.parent.parent);
    const nftInstance = new ethers.Contract(
      args.contract,
      constants.ContractABIs.ERC20.abi,
      args.wallet
    );
    console.log(`Adding ${args.contract} as a admin.`);

    //   let tx1 =await nftInstance.mint(constants.ADMIN,args.id,args.amount,'0x00');
    //   await waitForTx(args.provider, tx1.hash)
    const tx1 = await nftInstance.transfer(args.from, args.to, args.amounts);
    await waitForTx(args.provider, tx1.hash);

    const tx = await nftInstance.balanceOf(args.to, args.ids);
    console.log("---", tx);
    //   await waitForTx(args.provider, tx.hash)
  });

const ERCCmd = new Command("ERC");
ERCCmd.addCommand(mint);
ERCCmd.addCommand(batchMint);
ERCCmd.addCommand(transfer);
module.exports = ERCCmd;
