const Web3 = require('web3');
const EthCrypto = require('eth-crypto');
export const web3 = new Web3(new Web3.providers.HttpProvider('ENDPOINT'));

export const submitTx = txSig => web3.eth.sendSignedTransaction(txSig);
export const getTxDetails = txHash => web3.eth.getTransaction(txHash);
export const getBalance = address => web3.eth.getBalance(address);
export const getKeypair = privkey => {
  privateKey: privkey,
  publicKey: EthCrypto.publicKeyByPrivateKey(privkey)
}
export const create = privkey => getKeypair(privkey).then(keys => keys[address] = EthCrypto.publicKey.toAddress(keys[publicKey]));
export const balance = (db, address) => db.get(address);
