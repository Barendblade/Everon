import faunadb from 'faunadb';
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

export async function handler(event) {
  try {
    const { postId, userId, text } = JSON.parse(event.body);
    if (!postId || !userId || !text) return { statusCode: 400, body: 'Missing fields' };

    const comment = await client.query(
      q.Create(q.Collection('Comments'), { data: { postId, userId, text, createdAt: new Date().toISOString() } })
    );

    return { statusCode: 200, body: JSON.stringify(comment.data) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}

