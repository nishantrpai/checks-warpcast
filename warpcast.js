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

// given the username find the connected address using searchcaster
async function getConnectedWallet(handle) {
  // e.g., https://searchcaster.xyz/api/profiles?username=nishu
  let response = await fetch(`https://searchcaster.xyz/api/profiles?username=${handle}`);
  let data = await response.json();
  return data[0].connectedAddress;
}

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
      count++;
      if(count > 10) break;
    }
    if(username.querySelector('span.font-semibold')) {
      userElements.push(username.querySelector('span.font-semibold'));
    }

    username = avatar.parentElement;
    count = 0;
    while (!username?.querySelector('span.font-bold.leading-5')) {
      username = username.parentElement;
      count++;
      if(count > 10) break;
    }

    if(username.querySelector('span.font-bold.leading-5')) {
      userElements.push(username.querySelector('span.font-bold.leading-5'));
    }

    // keep going up the parent till we have the closest .text-muted class that is the handle
    let handle = avatar.parentElement;
    count = 0;
    while (!handle?.querySelector('.text-muted')) {
      handle = handle.parentElement;
      count++;
      if(count > 10) break;
    }
    if(handle.querySelector('.text-muted')) {
      handles.push(handle.querySelector('.text-muted').innerText);
    }
    handle = avatar.parentElement;
    count = 0;
    while (!handle?.querySelector('.text-faint'))  {
      handle = handle.parentElement;
      count++;
      if(count > 10) break;
    }
    if(handle.querySelector('.text-faint')) {
      handles.push(handle.querySelector('.text-faint').innerText);
    }
  });
  // userelements are where we'll place the checks
  // handles are for querying the api for connected wallet address
  // add to locations the userElements and handles 'position' and 'username' respectively
  userElements.forEach((element, index) => {
    // handle should be @nishu etc can't have spaces or anything
    if(handles[index].includes(' ')) return; 
    if(!handles[index].includes('@')) return;
    // if location already exists then skip
    if(locations.find(location => location.position === element)) return;
    locations.push({
      position: element,
      username: handles[index]
    });
  });
  
  return locations;
}

// get all the checks from the address
// get the most rare check from the list
// display the most rare check in the username
const displayChecks = async () => {
  let locations = getAllUsernames();
  locations.forEach(async location => {
    // temperory display the check in the username
    let ctr = document.createElement('div');
    ctr.style.display = 'flex';
    ctr.style.width = '22px';
    ctr.style.height = '22px';
    ctr.style.justifyContent = 'center';
    let img = document.createElement('img');
    img.src = "data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22width%3A100%25%3Bbackground%3Atransparent%3B%22%3E%3Cdefs%3E%3Cpath%20id%3D%22c%22%20fill-rule%3D%22evenodd%22%20d%3D%22M21.36%209.886A3.93%203.93%200%200%200%2018%208a3.93%203.93%200%200%200-3.36%201.887%203.935%203.935%200%200%200-4.753%204.753A3.93%203.93%200%200%200%208%2018c0%201.423.755%202.669%201.886%203.36a3.935%203.935%200%200%200%204.753%204.753%203.93%203.93%200%200%200%204.863%201.59%203.95%203.95%200%200%200%201.858-1.589%203.935%203.935%200%200%200%204.753-4.754A3.93%203.93%200%200%200%2028%2018a3.93%203.93%200%200%200-1.887-3.36%203.93%203.93%200%200%200-1.042-3.711%203.93%203.93%200%200%200-3.71-1.043Zm-3.958%2011.713%204.562-6.844c.566-.846-.751-1.724-1.316-.878l-4.026%206.043-1.371-1.368c-.717-.722-1.836.396-1.116%201.116l2.17%202.15a.79.79%200%200%200%201.097-.22Z%22%2F%3E%3Cpath%20id%3D%22a%22%20stroke%3D%22%23191919%22%20d%3D%22M0%200h36v36H0z%22%2F%3E%3Cg%20id%3D%22b%22%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22196%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22232%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22268%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22304%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22340%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22376%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22412%22%20y%3D%22160%22%2F%3E%3Cuse%20href%3D%22%23a%22%20x%3D%22448%22%20y%3D%22160%22%2F%3E%3C%2Fg%3E%3C%2Fdefs%3E%3Cpath%20fill%3D%22transparent%22%20d%3D%22M0%200h680v680H0z%22%2F%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M188%20152h304v376H188z%22%2F%3E%3Cuse%20href%3D%22%23b%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%2236%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%2272%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22108%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22144%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22180%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22216%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22252%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22288%22%2F%3E%3Cuse%20href%3D%22%23b%22%20y%3D%22324%22%2F%3E%3Cuse%20href%3D%22%23c%22%20fill%3D%22%23DE3237%22%20transform%3D%22scale(3)%22%3E%3Canimate%20attributeName%3D%22fill%22%20values%3D%22%23DE3237%3B%23C23532%3B%23FF7F8E%3B%23E84AA9%3B%23371471%3B%23525EAA%3B%234576D0%3B%239AD9FB%3B%2333758D%3B%2377D3DE%3B%239DEFBF%3B%2386E48E%3B%23A7CA45%3B%23FAE272%3B%23F4C44A%3B%23FAD064%3B%23F2A840%3B%23F18930%3B%23D05C35%3B%23EC7368%3B%23DE3237%22%20dur%3D%2210s%22%20begin%3D%22d.begin%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fuse%3E%3Cpath%20fill%3D%22transparent%22%20d%3D%22M0%200h680v680H0z%22%3E%3Canimate%20attributeName%3D%22width%22%20from%3D%22680%22%20to%3D%220%22%20dur%3D%220.2s%22%20begin%3D%22click%22%20fill%3D%22freeze%22%20id%3D%22d%22%2F%3E%3C%2Fpath%3E%3C%2Fsvg%3E";
    ctr.appendChild(img);
    location.position.parentElement.appendChild(ctr);
    // let connectedAddress = await getConnectedWallet(location.username);
    // let checks = await fetchChecks(connectedAddress);
    // let rareCheck = fetchRareCheckFromList(checks.data);
    // // add adjacent to the username
    // let img = document.createElement('img');
    // img.src = rareCheck;
    // location.position.appendChild(img);
  });
}

// TODO: for checks20, checks40 and checks80 we need to merge all the check color into a gradient