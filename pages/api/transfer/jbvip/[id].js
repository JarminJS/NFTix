import Moralis from "moralis";

export default async function handler(req, res) {
  let { id } = req.query;
  id = id.toString();
  let data;

  try {
    Moralis.start({
      apiKey:
        "UDe8hveE2aWy9mWhE0zXJJgxZnY0dEJB2V5cyhtNezr7lQCxChKiTx4OX8uLFcYl",
    });
  } catch (e) {
    console.log(e);
  } finally {
    const response = await Moralis.EvmApi.nft.getNFTTransfers({
      chain: "0x5",
      format: "decimal",
      address: "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1",
      tokenId: id,
    });

    data = response.raw;
  }

  // console.log(data);

  res.status(200).json(data);
}
