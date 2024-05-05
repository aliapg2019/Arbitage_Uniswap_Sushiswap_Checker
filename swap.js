const { ethers, upgrades } = require("hardhat");

async function main() {
  // Create a signer with a balance for testing
  const [signer] = await ethers.getSigners();

  // Fork the mainnet
  await ethers.provider.send("hardhat_reset", [
    {
      forking: {
        jsonRpcUrl: process.env.INFURA_NODE,
        blockNumber: 14390000
      }
    }
  ]);

  // Deploy the contract with upgrades
  const MyContract = await ethers.getContractFactory("MyContract");
  const myContract = await upgrades.deployProxy(MyContract);
  await myContract.deployed();

  // Swap tokens on Uniswap
  const IUniswapV2Router02 = await ethers.getContractFactory("IUniswapV2Router02");
  const router = IUniswapV2Router02.attach("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");

  const tokenInAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // Replace with input token address
  const tokenOutAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // Replace with output token address
  const amountIn = ethers.utils.parseEther("1"); // Replace with the amount of input token to swap

  // Approve the router to spend input token
  const inputToken = await ethers.getContractAt("IERC20", tokenInAddress);
  await inputToken.approve(router.address, amountIn);

  // Perform the swap
  await router.swapExactTokensForTokens(
    amountIn,
    0, // minAmountOut (set to 0 for simplicity)
    [tokenInAddress, tokenOutAddress],
    myContract.address,
    Date.now() + 1000 * 60 * 10 // deadline (10 minutes from now)
  );

  console.log("Swap completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });