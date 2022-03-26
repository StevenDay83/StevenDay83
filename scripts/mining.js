const RANDOM_MULTIPLER = 1000000;
// const TEST_TARGET = '04f0264d4d183248e2732d8b825dc5ef05f7508426d887134e6e2e4d3b4ade8d';
// const TEST_TARGET = 'af0264d4d183248e2732d8b825dc5ef05f7508426d887134e6e2e4d3b4ade8d';
const TEST_TARGET = '00000fd4d183248e2732d8b825dc5ef05f7508426d887134e6e2e4d3b4ade8d';

// const TEST_BLOCK_HEADER = {
//   "previousblackhash":'f5fef5edebf8801bd8031958786369122d2b4531e78e6ba7f4026baa7efb9280',
//   "nonce":1149702158,
//   "mediantime":1647651216337
// };

const PREV_HASH_TEST = 'f5fef5edebf8801bd8031958786369122d2b4531e78e6ba7f4026baa7efb9280';
const SUBSIDY_TRANSACTION_HASH_TEST = '72b79b759f8c50f0fe883e790d3c7c7a83e273fe4afc7398469ff253c55061c1';
var MEDIAN_TIME_TEST = 1647651216337;


var AbortMining = false;
var MiningStatus = 0;
var medianTime = Date.now();
var BlockChain = {
  '00000fbe50fd0132f435826a4cbb2c005bfd59158e54a6ddcbdbfd8ea50367d2': {
    "prevhash": "0000000000000000000000000000000000000000000000000000000000000000",
    "nonce": 3211,
    "timestamp": 1647912628934,
    "bits":'1dfd4d18',
    "merkelroot": "eb37388d94902ab863150347902f2955594dbd8d963db5869c1a778b555b6282",
    "ntx": 11,
    "hash": "00000fbe50fd0132f435826a4cbb2c005bfd59158e54a6ddcbdbfd8ea50367d2"
  },
  '00000246c7a009ae03614abbe606ee0d26e1125b949798a06dd445b7099a94a5': {
    "prevhash": "00000fbe50fd0132f435826a4cbb2c005bfd59158e54a6ddcbdbfd8ea50367d2",
    "nonce": 1159,
    "timestamp": 1647915792309,
    "bits":'1dfd4d18',
    "merkelroot": "b76f3d0c8aaad8b54685594a32fd2eabc71cb9306ffa73fd91cdbdb5eb065792",
    "ntx": 11,
    "hash": "00000246c7a009ae03614abbe606ee0d26e1125b949798a06dd445b7099a94a5"
  },
  '0000055c1dbaf81ae0e83694781810a334f2512842370ab8455921d443068572': {
    "prevhash": "00000246c7a009ae03614abbe606ee0d26e1125b949798a06dd445b7099a94a5",
    "nonce": 1375,
    "timestamp": 1647916875899,
    "bits":'1dfd4d18',
    "merkelroot": "010a5b96de68d3cbd680ddfdf626eb26310d7b62fc74114f4eec62c4e2d3e925",
    "ntx": 2001,
    "hash": "0000055c1dbaf81ae0e83694781810a334f2512842370ab8455921d443068572"
  }
};

// Merkel Tree should be 098517780a57d2811fc5dd8299c3e84e3e455f818b1a51c10694181ccad98be4
const HASH_ARRAY_TEST_1 = ['4562955c56dd19000e152a598ea30e8c59794cbe22e8385e729754cec300b906', 'ab6918976b256a81040c530cffc79fd00ae24d68044465fc7657dfb191ebcb28'];

// Merkel Tree should be 547098e4d825414d4e7a7bbbb808d2f52925aa6131fd8120d922cf064ec202c1
const HASH_ARRAY_TEST_2 = ['ea174ba4058cf6b883444083b435fa6c95f69f20fb7d654250f55de059b8a8e4', 'dc082e829e6192115b769d73e5f8d699472d90d222836fece9b68ff556e04b14', '9e990674f24948cd4574bba2aca49629f7eae59687e0d30b1c34bb8ec36b56e1'];

function getGenesisBlockHash(){
  var blockHashes = Object.keys(BlockChain);
  var genBlockHash = undefined;

  for (var i = 0; i < blockHashes.length; i++){
    thisBlock = BlockChain[blockHashes[i]];

    if (thisBlock != undefined){
      if (thisBlock.prevhash == '0000000000000000000000000000000000000000000000000000000000000000'){
        genBlockHash = blockHashes[i];
        break;
      }
    }
  }

  return genBlockHash;
}

function getBlockChain(){
  return BlockChain;
}

function getBlock(blockHash) {
  return BlockChain[blockHash];
}

function setNewBlock (block) {

}

async function verifyBlock (block) {
  var isVerified = false;
  thisHash = block.hash;

  if (thisHash == sha256(await serializeblock(block))) {
    // Check timestamp is previous hash exists
  }

  return isVerified;
}

function getMedianTime(){
  // Get the last 5 blocks

  // var blockHashes = Object.keys(BlockChain);

  var medianTime = Date.now();
  var thisBlockHash = getBlockTip();
  var numArray = [];


  var thisBlock = getBlock(thisBlockHash);

  for (var i = 0; i < 11; i++){
    numArray.push(thisBlock.timestamp);

    if (thisBlock.hash == getGenesisBlockHash()){
      break;
    }

    thisBlock = getBlock(thisBlock.prevhash);
  }

  medianTime = getMedian(numArray);

  return medianTime;
}

function getMedian(arrayNumbers){
  var medianNumber = undefined;

  if (arrayNumbers != undefined && Array.isArray(arrayNumbers) && arrayNumbers.length > 0){
    if (arrayNumbers.length == 1){
      medianNumber = arrayNumbers[0];
    } else {
      var sortedNumbersArray = arrayNumbers.slice();
      sortedNumbersArray.sort(numberCmp);
      if (sortedNumbersArray.length % 2 == 1){
        // Odd
        medianNumber = sortedNumbersArray[Math.ceil(sortedNumbersArray.length / 2)];
      } else {
        // Even
        medianNumber = (sortedNumbersArray[sortedNumbersArray.length / 2] + sortedNumbersArray[(sortedNumbersArray.length / 2) - 1]) / 2;
      }
    }
  }

  return medianNumber;
}

function numberCmp(a,b) {
  return a - b;
}

function getNextBlock(blockHash){
  var nextBlockHash = undefined;
  var blockHashes = Object.keys(BlockChain);

  for (var i = 0;  i < blockHashes.length; i++) {
    thisBlock = BlockChain[blockHashes[i]];

    if (thisBlock.prevhash == blockHash){
      nextBlockHash = blockHashes[i];
      break;
    }
  }

  return nextBlockHash;
}

function getBlockTip() {
  var latestBlock = undefined;
  var blockHashes = Object.keys(BlockChain);

  for (var i = 0; i < blockHashes.length; i++) {
    thisBlock = BlockChain[blockHashes[i]];

    if (thisBlock != undefined && getNextBlock(blockHashes[i]) == undefined){
      latestBlock = blockHashes[i];
      break;
    }
  }

  return latestBlock;
}


async function generateRandomHashes(n) {
  var hashArray = [];

  if (n > 0){
    for (var i = 0; i < n; i++){
      thisHash = await sha256(Math.floor(Math.random() * RANDOM_MULTIPLER));

      hashArray.push(thisHash);
    }
  }

  return hashArray;
}

async function getMerkelRoot (hashArray, firstrun = true){
  var merkelRoot;
  var merkelBranch = [];

  if ((hashArray != undefined && (hashArray.length > 1 && !firstrun)) || (hashArray.length >= 1 && firstrun)){
    var merkelHashArray = [];
      if ((hashArray.length % 2) == 1) {
        merkelHashArray = hashArray.slice();
        merkelHashArray.push(merkelHashArray[merkelHashArray.length - 1]);
      } else {
        merkelHashArray = hashArray;
      }

    for (var i = 0; i < merkelHashArray.length; i+=2){
      merkelBranch.push(await sha256(await sha256(merkelHashArray[i] + merkelHashArray[i+1])));
    }
    merkelRoot = getMerkelRoot(merkelBranch, false);
  } else if (hashArray.length == 1 && !firstrun) {
    merkelRoot = hashArray[0];
  }

  return merkelRoot;
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 8) {
        result.push(parseInt(str.substring(0, 8), 16));

        str = str.substring(8, str.length);
    }

    return result;
}

// Target = coefficient * 2 ^ ( 8 * (index — 3) )
// Calculate Target Here. Use bigInt

function getDifficultyTarget(difficultyBits) {
  var targetHash = TEST_TARGET;
  var zero = '0';

  if (difficultyBits.length == 8){
    var coefficient = difficultyBits.substr(2,8);
    var index = Number('0x' + difficultyBits.substr(0,2));
    if (index < 0x1f) {
      var leadingZeroIndex = ((256 - (8 * (index - 3))) / 4) - 6;

      // targetHash = leadingZeroIndex;

      targetHash = zero.repeat(leadingZeroIndex) + coefficient;
      targetHash += zero.repeat(64 - targetHash.length);
    }
  }

  return targetHash;
}

async function getMinedBlock(prevhash, mediantime, timeNow, mempool, rewardhash, target, callback){
  callback(await mineBlock(prevhash, mediantime, timeNow, mempool, rewardhash, target));
}

async function mineBlock (prevhash, mediantime, timeNow, mempool, rewardhash, target) {
  var unconfirmedTransactions = mempool.slice();
  var candidateTransactions = [];
  var candidateBlock = {};
  var hashFound = false;
  MiningStatus = 1;

  // Add reward hash
  unconfirmedTransactions.unshift(rewardhash);

  // Loop for mempool transactions. If no target can be found for the current
  // Block subsidy hash + mempool, we remove a transaction until we are left with
  // Just the subsidy.
  for (var i = unconfirmedTransactions.length; i > 0; i--){
    candidateTransactions = unconfirmedTransactions.slice(0,i);
    var merkelRootHash = await getMerkelRoot(candidateTransactions); // Recalculate Merkel Root

    // For loop for time stamp
    for (var j = -1; j < timeNow + 7200000; j++) {
      var timeStamp;
      if (j == -1){
        // Try time now
        timeStamp = timeNow;
      } else {
        timeStamp = timeNow + j;
      }
      // For loop for nonce
      for (var k = 0; k < 4000; k++){
        candidateBlock = {
          "prevhash":prevhash,
          "nonce":k,
          "timestamp":timeStamp,
          "merkelroot":merkelRootHash,
          "ntx":candidateTransactions.length
        };

        var blockSerialized = serializeblock(candidateBlock);
        var attemptedHash = await sha256(blockSerialized);

        if (attemptedHash < target){
          hashFound = true;
          candidateBlock.hash = attemptedHash;
          break;
        }

        if (hashFound || AbortMining){
          break;
        }
      } // Nonce
      if (hashFound || AbortMining){
        break;
      }
    } // time stamp

    if (hashFound || AbortMining){
      break;
    }
  }

  MiningStatus = 0;
  return candidateBlock;
}

function serializeblock (block){
  return block.prevhash + block.nonce + block.timestamp + block.merkelroot + block.ntx;
}

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder('utf-8').encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  // console.log(hashHex);
  return hashHex;
}

async function getHashRateBenchmark(callback) {
  var timeStampNow = Date.now();
  var hCount = 0;

  while(Date.now() - timeStampNow <= 60000){
    await sha256(Math.floor(Math.random() * RANDOM_MULTIPLER));
    hCount++;
  }

  callback(hCount);
}
