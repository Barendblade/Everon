
import faunadb from 'faunadb';
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

export async function handler(event) {
  try {
    const { postId, userId } = JSON.parse(event.body);
    if (!postId || !userId) return { statusCode: 400, body: 'Missing postId or userId' };

    // Find the like
    const like = await client.query(
      q.Get(q.Match(q.Index('likes_by_post_user'), [postId, userId]))
    );

    await client.query(q.Delete(like.ref));

    return { statusCode: 200, body: JSON.stringify({ removed: true }) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
