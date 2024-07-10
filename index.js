const { ethers, Contract, JsonRpcProvider } = require("ethers");

//const ROOTSTOCK_RPC_NODE = "https://public-node.rsk.co";
/*
  Works fine with rpc url (public-node.rsk.co) but gives error with rpc api below.
*/
const ROOTSTOCK_RPC_NODE = "https://rpc.testnet.rootstock.io/AluZdy8x1eQCwbFLmeLm7SUbxMQ1vs-T";

// REF: https://developers.rsk.co/rif/rns/architecture/registry/
const RNS_REGISTRY_ADDRESS = "0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5";

const stripHexPrefix = (hex) => hex.slice(2);

const RNS_REGISTRY_ABI = [
  "function resolver(bytes32 node) public view returns (address)",
];

const RNS_ADDR_RESOLVER_ABI = [
  "function addr(bytes32 node) public view returns (address)",
];

const RNS_NAME_RESOLVER_ABI = [
  "function name(bytes32 node) external view returns (string)",
];

const RNSProvider = new JsonRpcProvider(ROOTSTOCK_RPC_NODE);
const rnsRegistryContract = new Contract(
  RNS_REGISTRY_ADDRESS,
  RNS_REGISTRY_ABI,
  RNSProvider,
);

const resolveRnsName = async (name) => {
  const nameHash = ethers.namehash(name);
  const resolverAddress = await rnsRegistryContract.resolver(nameHash);

  if (resolverAddress ===  ethers.ZeroAddress) {
    return null;
  }

  const addrResolverContract = new Contract(
    resolverAddress,
    RNS_ADDR_RESOLVER_ABI,
    RNSProvider,
  );

  const address = await addrResolverContract.addr(nameHash);

  if (address === undefined || address === null) {
    return null;
  }

  return address.toLowerCase();
};

const resolveReverseName = async (address) => {
  const reverseRecordHash = ethers.namehash(
      `${stripHexPrefix(address)}.addr.reverse`
    );

    const resolverAddress = await rnsRegistryContract.resolver(
      reverseRecordHash
    );

    if (resolverAddress === ethers.ZeroAddress) {
      return null;
    }

    const nameResolverContract = new Contract(
      resolverAddress,
      RNS_NAME_RESOLVER_ABI,
      RNSProvider
    );

    const name = await nameResolverContract.name(reverseRecordHash);

    if (name === undefined) {
      return null;
    }

    return name;
}


// main function to test resolve rns name
(async () => {
  // Resolve name
  const address = await resolveRnsName('alepc.rsk');
  console.log('Resolved address: ', address);

  // Reverse resolution
  const name = await resolveReverseName('0xA78C937844b27bEc024F042DCbE5B85d2B7344F6');
  console.log('Reverse resolution:', name);
})();