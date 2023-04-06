import React from "react";

export default async function RM({ value }) {
  var data = await fetch("http://localhost:3000/api/price");
  data = data.json();

  return <div>{data * value}</div>;
}
