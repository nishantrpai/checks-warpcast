// get all total supply from contract 0x036721e5a769cc48b3189efbb9cce4471e8a48b1
// add script <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
// type="application/javascript"></script>

// let  https://api.checks.art/checks?filter[owner]=0x5efdb6d8c798c2c2bea5b1961982a5944f92a5c1&page=1

let locations = [];
let checks = {};

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
    if (!token.data) return;
    allChecks.checks1 = allChecks.checks1.concat(token.data.visuals.checks1);
    allChecks.checks20 = allChecks.checks20.concat(token.data.visuals.checks20);
    allChecks.checks40 = allChecks.checks40.concat(token.data.visuals.checks40);
    allChecks.checks80 = allChecks.checks80.concat(token.data.visuals.checks80);
  });

  // filter empty strings from all
  allChecks.checks1 = allChecks.checks1.filter(check => check !== '');
  allChecks.checks4 = allChecks.checks4.filter(check => check !== '');
  allChecks.checks5 = allChecks.checks5.filter(check => check !== '');
  allChecks.checks10 = allChecks.checks10.filter(check => check !== '');
  allChecks.checks20 = allChecks.checks20.filter(check => check !== '');
  allChecks.checks40 = allChecks.checks40.filter(check => check !== '');
  allChecks.checks80 = allChecks.checks80.filter(check => check !== '');


  if (allChecks.checks1.length > 0) {
    mostRare = allChecks.checks1[0];
  }
  else if (allChecks.checks4.length > 0) {
    mostRare = allChecks.checks4[0]
  }
  else if (allChecks.checks5.length > 0) {
    mostRare = allChecks.checks5[0]
  }
  else if (allChecks.checks10.length > 0) {
    mostRare = allChecks.checks10[0]
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
  avatars.forEach(avatar => {
    // go up the parentelement till we get span with font-semibold class that is the username
    let username = avatar.parentElement;
    let count = 0;
    while (!username?.querySelector('span.font-semibold')) {
      username = username.parentElement;
      count++;
      if (count > 10) break;
    }
    if (username.querySelector('span.font-semibold')) {
      userElements.push(username.querySelector('span.font-semibold'));
    }

    username = avatar.parentElement;
    count = 0;
    while (!username?.querySelector('span.font-bold.leading-5')) {
      username = username.parentElement;
      count++;
      if (count > 10) break;
    }

    if (username.querySelector('span.font-bold.leading-5')) {
      userElements.push(username.querySelector('span.font-bold.leading-5'));
    }

    // keep going up the parent till we have the closest .text-muted class that is the handle
    let handle = avatar.parentElement;
    count = 0;
    while (!handle?.querySelector('.text-muted')) {
      handle = handle.parentElement;
      count++;
      if (count > 10) break;
    }
    if (handle.querySelector('.text-muted')) {
      handles.push(handle.querySelector('.text-muted').innerText);
    }
    handle = avatar.parentElement;
    count = 0;
    while (!handle?.querySelector('.text-faint')) {
      handle = handle.parentElement;
      count++;
      if (count > 10) break;
    }
    if (handle.querySelector('.text-faint')) {
      handles.push(handle.querySelector('.text-faint').innerText);
    }
  });
  // userelements are where we'll place the checks
  // handles are for querying the api for connected wallet address
  // add to locations the userElements and handles 'position' and 'username' respectively
  userElements.forEach((element, index) => {
    // handle should be @nishu etc can't have spaces or anything
    if (handles[index].includes(' ')) return;
    if (!handles[index].includes('@')) return;
    // if location already exists then skip
    if (locations.find(location => location.position === element)) return;
    locations.push({
      position: element,
      username: handles[index]
    });
  });

  return locations;
}

function getGradient(colorArray) {
  // get the gradient from the array of colors
  let gradient = '';
  gradient += '<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">';
  colorArray.forEach((color, index) => {
    // linear gradient for svg
    gradient += `<stop offset="${index * 20}%" stop-color="${color}" />`;
  });
  gradient += '</linearGradient>';
  return gradient;
}


function getArrayofColors(svg) {
  let matrix = [];
  let div = document.createElement('div');
  div.innerHTML = svg;
  let checks = document.querySelectorAll('use[href="#check"]');
  matrix = Array.from(checks).map(check => check.getAttribute('fill'));
  return matrix;
}


// get all the checks from the address
// get the most rare check from the list
// display the most rare check in the username
const displayChecks = async () => {
  let locations = getAllUsernames();
  let checksvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" style="width:100%;background:transparent;"><defs><path id="c" fill-rule="evenodd" d="M21.36 9.886A3.93 3.93 0 0 0 18 8a3.93 3.93 0 0 0-3.36 1.887 3.935 3.935 0 0 0-4.753 4.753A3.93 3.93 0 0 0 8 18c0 1.423.755 2.669 1.886 3.36a3.935 3.935 0 0 0 4.753 4.753 3.93 3.93 0 0 0 4.863 1.59 3.95 3.95 0 0 0 1.858-1.589 3.935 3.935 0 0 0 4.753-4.754A3.93 3.93 0 0 0 28 18a3.93 3.93 0 0 0-1.887-3.36 3.93 3.93 0 0 0-1.042-3.711 3.93 3.93 0 0 0-3.71-1.043Zm-3.958 11.713 4.562-6.844c.566-.846-.751-1.724-1.316-.878l-4.026 6.043-1.371-1.368c-.717-.722-1.836.396-1.116 1.116l2.17 2.15a.79.79 0 0 0 1.097-.22Z"/><path id="a" stroke="#191919" d="M0 0h36v36H0z"/><g id="b"><use href="#a" x="196" y="160"/><use href="#a" x="232" y="160"/><use href="#a" x="268" y="160"/><use href="#a" x="304" y="160"/><use href="#a" x="340" y="160"/><use href="#a" x="376" y="160"/><use href="#a" x="412" y="160"/><use href="#a" x="448" y="160"/></g></defs><path fill="transparent" d="M0 0h680v680H0z"/><path fill="#111" d="M188 152h304v376H188z"/><use href="#b"/><use href="#b" y="36"/><use href="#b" y="72"/><use href="#b" y="108"/><use href="#b" y="144"/><use href="#b" y="180"/><use href="#b" y="216"/><use href="#b" y="252"/><use href="#b" y="288"/><use href="#b" y="324"/><use href="#check" fill="#DE3237" transform="scale(3)"><animate attributeName="fill" values="#DE3237;#C23532;#FF7F8E;#E84AA9;#371471;#525EAA;#4576D0;#9AD9FB;#33758D;#77D3DE;#9DEFBF;#86E48E;#A7CA45;#FAE272;#F4C44A;#FAD064;#F2A840;#F18930;#D05C35;#EC7368;#DE3237" dur="10s" begin="d.begin" repeatCount="indefinite"/></use><path fill="transparent" d="M0 0h680v680H0z"><animate attributeName="width" from="680" to="0" dur="0.2s" begin="click" fill="freeze" id="d"/></path></svg>'


  locations.forEach(async location => {
    // temperory display the check in the username
    let connectedAddress = await getConnectedWallet(location.username);
    let checks = await fetchChecks(connectedAddress);
    let rareCheck = fetchRareCheckFromList(checks.data);
    // get the gradient from the rare check
    let colors = getArrayofColors(rareCheck);
    let gradient = getGradient(colors);
    // add the gradient to the svg
    checksvg = checksvg.replace('<defs>', `<defs>${gradient}`);
    checksvg = checksvg.replace('<use href="#check" fill="#DE3237"', `<use href="#check" fill="url(#gradient)"`);

    let ctr = document.createElement('div');
    ctr.style.display = 'flex';
    ctr.style.width = '22px';
    ctr.style.height = '22px';
    ctr.style.justifyContent = 'center';
    let img = document.createElement('img');
    img.src = 'data:image/svg+xml,' + encodeURIComponent(checksvg);
    ctr.appendChild(img);
    location.position.parentElement.appendChild(ctr);
    // // add adjacent to the username
    // let img = document.createElement('img');
    // img.src = rareCheck;
    // location.position.appendChild(img);
  });
}

// TODO: for checks20, checks40 and checks80 we need to merge all the check color into a gradient