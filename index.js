const EthCrypto = require('eth-crypto');
const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
const HubStore = require('./src/HubStore.js');
const HubStore = require('./utils.js');

console.log("Starting...")

OrbitDB.addDatabaseType('hubstore', HubStore);
console.log("creating ipfs..")

const ipfs = new IPFS({
  repo: './orbitdb/examples/ipfs',
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
})

ipfs.on('error', (err) => console.error(err))

ipfs.on('ready', async () => {
  let hubble;
  try {
    const orbitdb = new OrbitDB(ipfs);
    hubble = await orbitdb.open('/orbitdb/QmYtBtgb8QYryFp7u7pXRVmFG4Ehc28ESgmNUiTyTTfbpr/hubble', { type: HubStore.type });
    await hubble.load()
    // Query immediately after loading
    console.log('We create an account here to interacct with Hubble.');
    const user = create('privkey');

    console.log('Our Hubble address');
    const addr = hubble.address();
    console.log(addr);

    
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  console.log("finished");
})
