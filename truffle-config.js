module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Host address
      port: 7545, // Match the port displayed in Ganache GUI
      network_id: "5777", // Network ID shown in Ganache
      gas: 6721975, // Optional: specify gas limit
      gasPrice: 20000000000, // Optional: specify gas price
    },
    develop: {
      port: 8545,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Match this with your contract's compiler version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200, // Adjust to balance deployment and runtime gas costs
        },
      },
    },
  },
};
