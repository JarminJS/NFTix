import { Network, Alchemy } from "alchemy-sdk";

// // Optional Config object, but defaults to demo api-key and eth-mainnet.
// const settings = {
//   apiKey: { apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }, // Replace with your Alchemy API Key.
//   network: Network.ETH_GOERLI, // Replace with your network.
// };

// const alchemy = new Alchemy(settings);

// // Print NFT metadata returned in the response:
// alchemy.nft.getNftMetadata(
//   "0x5180db8F5c931aaE63c74266b211F580155ecac8",
//   "1590"
// ).then(console.log);

// const options = { method: "GET", headers: { accept: "application/json" } };

// fetch(
//   "https://alchemy-sdk-core-example.com/docs-demo/getNftMetadata?contractAddress=0x3978398d6485c07BF0f4A95Ef8E4678B747E56b6&tokenId=1&refreshCache=false",
//   options
// )
//   .then((response) => response.json())
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err));

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { id } = req.query;

  console.log(id);
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_GOERLI,
  };

  const alchemy = new Alchemy(settings);

  const contract = "0x3978398d6485c07bf0f4a95ef8e4678b747e56b6";

  // Print NFT metadata returned in the response:
  const response = await alchemy.nft.getNftMetadata(contract, 1);
  res.json(response);
};
