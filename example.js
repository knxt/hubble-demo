const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
const HubStore = require('./src/HubStore.js');

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
  let db
  try {
    const orbitdb = new OrbitDB(ipfs);
    db = await orbitdb.open('/orbitdb/QmYtBtgb8QYryFp7u7pXRVmFG4Ehc28ESgmNUiTyTTfbpr/hubble', { type: HubStore.type });
    await db.load()
    // Query immediately after loading
    const addr = db.address();
    console.log(db.publicKey());
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  console.log("finished");
})
