import { Network, Alchemy } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { address } = req.query;

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  // Print all NFTs returned in the response:
  const response = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [
      "0x3978398d6485c07BF0f4A95Ef8E4678B747E56b6",
      "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1",
    ],
  });

  //   console.log(response);

  res.status(200).json(response);
};
