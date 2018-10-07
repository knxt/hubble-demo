const EthCrypto = require('eth-crypto');
const KeyValueStore = require('orbit-db-kvstore');

class HubStore extends KeyValueStore {

    constructor(ipfs, id, dbname, options = {}) {
      super(ipfs, id, dbname, options);

      // A keypair is generated for our cosigner
      const _keypair = EthCrypto.createIdentity();

      // We create a getter to allow access to our cosigner's address
      this.address = function() { return _keypair.address; }

      // We create a getter to allow access to our cosigner's pubkey
      this.publicKey = function() { return _keypair.publicKey; }

      // We create a function that signs withdrawals with our cosigner's privkey
      this.signTx = function(rawtx) {
        EthCrypto.signTransaction(rawtx, _keypair.privateKey);
      }

    }

    deposit (tx) {
      if (tx.to != this.address()) throw new Error('Tx was not sent to this Hub.');
      super.put(tx.from, addBalance(tx.from, tx.value));
    }

    /*
    check = {
      to,
      from,
      value,
      nonce
    }
    */

    transfer (check, sig) {
      if (check.to == this.address()) throw new Error('You cannot open a thread with the Hub.');
      if (check.from != recover(check, sig)) throw new Error();
      if (check.value <= super.get(check.from)) throw new Error();
      if (super.get(check) == true) throw new Error();
      const from = check.from;
      const to = check.to;
      const value = check.value;

      super.get(from).
      then(balance => super.put(from, subBalance(from, value)));

      super.get(to).
      then(balance => super.put(to, addBalance(to, value)));


      // add nonce
      super.put(check, true);
    }

    /*
    withdrawRequest = {
      from,
      nonce
    }
    */

    withdraw (withdrawRequest, sig) {
      if (withdrawRequest.from != recover(withdrawRequest, sig)) throw new Error();
      sendToPayee(withdrawRequest.from);
    }

    sendToPayee(to) {
      const rawtx = {
        from: this.address(), // sender address
        to: to, // receiver address
        value: super.get(to), // amount of wei we want to send
        nonce: Date.now(), // we convert the current timestamp into an integer for noncing
        gasPrice: 5000000000,
        gasLimit: 21000 // normal gasLimit for code-less transactions
      }

      return this.signTx(rawtx);
    }

    addBalance(from, value) {
      const balance = super.get(from);
      return balance + value;
    }

    subBalance(from, value) {
      const balance = super.get(from);
      return balance - value;
    }

    put () {
      return 'hey :)';
    }

    static get type () {
      return 'hubstore';
    }
}

module.exports = HubStore;
