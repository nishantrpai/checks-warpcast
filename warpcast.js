// get all total supply from contract 0x036721e5a769cc48b3189efbb9cce4471e8a48b1
// add script <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
// type="application/javascript"></script>

// let  https://api.checks.art/checks?filter[owner]=0x5efdb6d8c798c2c2bea5b1961982a5944f92a5c1&page=1

const fetchChecks = async (owner) => {
  const response = await fetch(`https://api.checks.art/checks?filter[owner]=${owner.toLowerCase()}&page=1`);
  const data = await response.json();
  return data;
}
const fetchRareCheckFromList = (tokens) => {
  // in each token there are checks1, checks20, checks40 and checks80 checks1 is the most rare we pick the most rare from the list
  let mostRare = '';
  // merge all checks into one array checks1, checks20, checks40 and checks80
  let allChecks = {
    checks1: [],
    checks20: [],
    checks40: [],
    checks80: []
  }
  tokens.forEach(token => {
    console.log(token)
    if(!token.data) return;
    allChecks.checks1 = allChecks.checks1.concat(token.data.visuals.checks1);
    allChecks.checks20 = allChecks.checks20.concat(token.data.visuals.checks20);
    allChecks.checks40 = allChecks.checks40.concat(token.data.visuals.checks40);
    allChecks.checks80 = allChecks.checks80.concat(token.data.visuals.checks80);
  });

  // filter empty strings from all
  allChecks.checks1 = allChecks.checks1.filter(check => check !== '');
  allChecks.checks20 = allChecks.checks20.filter(check => check !== '');
  allChecks.checks40 = allChecks.checks40.filter(check => check !== '');
  allChecks.checks80 = allChecks.checks80.filter(check => check !== '');
  
  
  if (allChecks.checks1.length > 0) {
    mostRare = 'checks1'
  }
  else if (allChecks.checks20.length > 0) {
    mostRare = 'checks20'
  }
  else if (allChecks.checks40.length > 0) {
    mostRare = 'checks40'
  }
  else if (allChecks.checks80.length > 0) {
    mostRare = 'checks80'
  }
  return mostRare;
}

fetchChecks('0x5efdb6d8c798c2c2bea5b1961982a5944f92a5c1').then(data => {
  console.log(data);
  console.log(fetchRareCheckFromList(data.data));
});