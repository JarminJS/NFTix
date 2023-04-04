import clientPromise from "../../lib/mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("testing");

    const events = await db.collection("events").find({}).limit(50).toArray();

    res.json(events);
  } catch (e) {
    console.error(e);
  }
};
