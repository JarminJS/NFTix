import { Network, Alchemy } from "alchemy-sdk";
// export default function handler(req, res) {
//   res.status(200).json({ message: "Hello from Next.js!" });
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { id } = req.query;
  //   const num = id;
  //   res.json(`Post : ${id}`);
  //   console.log(num);

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_GOERLI,
  };

  const alchemy = new Alchemy(settings);

  const contract = "0x3978398d6485c07bf0f4a95ef8e4678b747e56b6";

  // Print NFT metadata returned in the response:
  const response = await alchemy.nft.getNftMetadata(contract, id);
  res.status(200).json(response);
};
