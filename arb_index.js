// Arbitrage chacker Uniswap and Sushiswap
const ethers = require('ethers');
const mytokens = require('./filter.json');

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/7daf85c40c5d4f6187c849747ad0076b');
const uniRouterAddress = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const sushiRouterAddress = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
const routerAbi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
]
const uniRouter = new ethers.Contract(uniRouterAddress, routerAbi, provider);
const sushiRouter = new ethers.Contract(sushiRouterAddress, routerAbi, provider);
const amountIn = ethers.parseEther('1');
const tokenPairs = [
  // ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x6b175474e89094c44da98b954eedeac495271d0f' , 18], // WETH-DAI
  // ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 18], // WETH-UNI
  // ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6], // WETH-USDC
  // ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x4e47951508fd4a4126f8ff9cf5e6fa3b7cc8e073', 18], // WETH-Fluid
  
];
for (let index = 0; index < mytokens.length; index++) {
  
  tokenPairs.push(['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', mytokens[index].addressToken , mytokens[index].decimalsToken ]);
}
console.log(tokenPairs[0][0]);




async function test (){
  for (let index = 0; index < tokenPairs.length; index++) {
    const token0 = tokenPairs[index][0];
    const token1 = tokenPairs[index][1];
    const decimals = tokenPairs[index][2];
    try {
      
      const uniAmount = await uniRouter.getAmountsOut(amountIn, [token0, token1]);
      const sushiAmount = await sushiRouter.getAmountsOut(amountIn, [token0, token1]);
      let uniPrice , sushiPrice;
      if (decimals == 18) {
        uniPrice = Number(uniAmount[1]) / Number(uniAmount[0]);
        sushiPrice = Number(sushiAmount[1]) / Number(sushiAmount[0]);
      } else {
        deltaD = 18 - decimals;
        uniPrice = (Number(uniAmount[1]) / Number(uniAmount[0])) * (10 ** deltaD);
        sushiPrice = (Number(sushiAmount[1]) / Number(sushiAmount[0])) * (10 ** deltaD);
  
      }
      // const uniPrice = Number(uniAmount[1]) / Number(uniAmount[0]);
      // const sushiPrice = Number(sushiAmount[1]) / Number(sushiAmount[0]);
      
      
      console.log(`Token pair: ${token0}-${token1}`);
      console.log("Uniswap price :", uniPrice);
      console.log("SushiSwap price :", sushiPrice);
      const test = ethers.parseUnits(uniPrice.toString(), decimals);
      const amountTest = await sushiRouter.getAmountsOut(test, [token1, token0]);
      console.log("Result:", ethers.formatEther(amountTest[1]));

      if (amountTest[1]> amountIn) {
        
        console.log("ARBITRAGGE :", ethers.formatEther(amountTest[1]));
        return 0;
      }
      
    } catch (error) {
      console.log(error);
    }
  }
}

test();




