import Moralis from "moralis";

export default async function handler(req, res) {
  let data;

  const response = await Moralis.EvmApi.token.getTokenPrice({
    chain: "0x1",
    exchange: "uniswap-v2",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
  });

  data = response.raw;

  // console.log(data);

  res.status(200).json(data);
}

Moralis.start({
  apiKey: "UDe8hveE2aWy9mWhE0zXJJgxZnY0dEJB2V5cyhtNezr7lQCxChKiTx4OX8uLFcYl",
});
