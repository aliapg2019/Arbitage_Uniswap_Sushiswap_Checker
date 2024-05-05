const axios = require('axios');
const fs = require('fs');
require('dotenv').config()

console.log(process.env.COINMARKETCAP_API_KEY);
const getValidTokens = async () => {
  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
      }
    });
    const tokens = response.data.data;
    const validTokens = [];
    for (const token of tokens) {
      const tokenInfo = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${token.id}`, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        }
      });
      if (tokenInfo.data.data[token.id].platform === 'ethereum') {
        validTokens.push(token.symbol);
      }
    }
    return validTokens;
  } catch (error) {
    console.error(error);
  }
};

const saveTokensToFile = async (tokens, filename) => {
  try {
    const data = JSON.stringify(tokens);
    fs.writeFileSync(filename, data);
    console.log(`Tokens saved to ${filename}`);
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  const tokenList = await getValidTokens();
  await saveTokensToFile(tokenList, 'valid_tokens.json');
};

main();