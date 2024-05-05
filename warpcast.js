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
  

  console.log(allChecks)

  if (allChecks.checks1.length > 0) {
    mostRare = allChecks.checks1[0];
  }
  else if (allChecks.checks20.length > 0) {
    mostRare = allChecks.checks20[0]
  }
  else if (allChecks.checks40.length > 0) {
    mostRare = allChecks.checks40[0]
  }
  else if (allChecks.checks80.length > 0) {
    mostRare = allChecks.checks80[0]
  }
  return mostRare;
}

fetchChecks('0x5efdb6d8c798c2c2bea5b1961982a5944f92a5c1').then(data => {
  console.log(data);
  console.log(fetchRareCheckFromList(data.data));
});

// get the selector to the username
function getAllUsernames() {
  // gets all the imgs that have the alt attribute containing the word avatar
  let avatars = document.querySelectorAll('img[alt*="avatar"]');
  let handles = [];
  const userElements = [];
  let locations = [];
  avatars.forEach(avatar => {
    // go up the parentelement till we get span with font-semibold class that is the username
    let username = avatar.parentElement;
    let count = 0;
    while (!username?.querySelector('span.font-semibold')) {
      username = username.parentElement;
      if(count > 10) break;
    }
    if(username.querySelector('span.font-semibold')) {
      userElements.push(username.querySelector('span.font-semibold'));
    }

    // keep going up the parent till we have the closest .text-muted class that is the handle
    let handle = avatar.parentElement;
    count = 0;
    while (!handle?.querySelector('.text-muted')) {
      handle = handle.parentElement;
      if(count > 10) break;
    }

    if(handle.querySelector('.text-muted')) {
      handles.push(handle.querySelector('.text-muted').innerText);
    }
  });
  // userelements are where we'll place the checks
  // handles are for querying the api for connected wallet address
  // add to locations the userElements and handles 'position' and 'username' respectively
  userElements.forEach((element, index) => {
    locations.push({
      position: element,
      username: handles[index]
    });
  });
  
  console.log(locations);
}
// given the username find the connected address using searchcaster
// get all the checks from the address
// get the most rare check from the list
// display the most rare check in the username

// TODO: for checks20, checks40 and checks80 we need to merge all the check color into a gradient