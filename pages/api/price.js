import Moralis from "moralis";

export default async function handler(req, res) {
  let data = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=myr"
  );

  data = await data.json();

  //   console.log(data.ethereum.myr);
  // console.log(data);

  res.status(200).json(data.ethereum.myr);
}
