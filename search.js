const fs = require('fs');
const uniTokens = require('./UniTokens.json');
const sushiTokens = require('./listTokensSushi.json').tokens;

const mytokens = [];
// console.log(uniTokens);

function filter(){
  uniTokens.forEach((element) => {
    element.addressToken = "";
    element.decimalsToken = "";
  
  });
    for (let index = 0; index < uniTokens.length; index++) {
      for (let j = 0; j < sushiTokens.length; j++) {
        
        if (uniTokens[index].name == sushiTokens[j].symbol) {
          uniTokens[index].addressToken = sushiTokens[j].address;
          uniTokens[index].decimalsToken = sushiTokens[j].decimals;
          mytokens.push(uniTokens[index]);
          

          console.log(uniTokens[index]);
          console.log("=============================");
        }
        
        
      }
      
      
    }
    
    const jsonString = JSON.stringify(mytokens);
    
    fs.writeFile('filter.json', jsonString, 'utf8', (err) => {
      if (err) {
        console.error('file error:', err);
        return;
      }
      console.log('The file was written successfully.');
    });
}

filter();