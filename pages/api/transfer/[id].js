import Moralis from "moralis";

export default async function handler(req, res) {
  let { id } = req.query;
  id = id.toString();
  let data;

  const response = await Moralis.EvmApi.nft.getNFTTransfers({
    chain: "0x5",
    format: "decimal",
    address: "0x010c84e9b271C1ABdeA845A2Ae9eD2C164c37352",
    tokenId: id,
  });

  data = response.raw;

  // console.log(data);

  res.status(200).json(data);
}

Moralis.start({
  apiKey: "UDe8hveE2aWy9mWhE0zXJJgxZnY0dEJB2V5cyhtNezr7lQCxChKiTx4OX8uLFcYl",
});
