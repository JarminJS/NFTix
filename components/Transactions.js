import React, { useState, useEffect } from "react";

export default function Transaction({ transactions }) {
  const weiToEth = 1000000000000000000;
  const [total, setTotal] = useState(6);

  var record = transactions.result;

  const [items, setItems] = useState(record.slice(0, total));

  useEffect(() => {
    if (total) {
      setItems(record.slice(0, total));
    }
  }, [total, record]);

  function loadMore() {
    setTotal(total + 6);
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="text-lg font-bold pb-3">List of Transactions </div>
        <table className="mb-3 table truncate w-screen sm:w-auto overflow-x-auto">
          <thead>
            <tr>
              <th>Hash</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="ticket" key={item.hash}>
                <td>{item.hash.slice(0, 8) + "..." + item.hash.slice(-6)}</td>
                <td>Type</td>
                <td>
                  {item.from_address.slice(0, 6) +
                    "..." +
                    item.from_address.slice(-4)}
                </td>
                <td>
                  {item.to_address &&
                    item.to_address?.slice(0, 6) +
                      "..." +
                      item.to_address?.slice(-4)}
                  {!item.to_address && " "}
                </td>
                <td>{item.value / weiToEth} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" flex justify-center mb-6">
        <div className="btn btn-primary w-fit" onClick={loadMore}>
          Load More
        </div>
      </div>
    </>
  );
}
