import Moralis from "moralis";

export default async function handler(req, res) {
  let { address } = req.query;
  address = address.toString();
  let data;

  const response =
    await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
      chain: "0x5",
      address: address,
    });

  data = response.raw;

  // console.log(data);

  res.status(200).json(data);
}

Moralis.start({
  apiKey: "UDe8hveE2aWy9mWhE0zXJJgxZnY0dEJB2V5cyhtNezr7lQCxChKiTx4OX8uLFcYl",
});
