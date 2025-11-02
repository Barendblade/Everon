
import faunadb from 'faunadb';
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

export async function handler(event) {
  try {
    const { postId, userId } = JSON.parse(event.body);
    if (!postId || !userId) return { statusCode: 400, body: 'Missing postId or userId' };

    // Check if user already liked
    const exists = await client.query(
      q.Exists(q.Match(q.Index('likes_by_post_user'), [postId, userId]))
    );

    if (exists) {
      return { statusCode: 200, body: JSON.stringify({ liked: true }) };
    }

    // Add like
    await client.query(
      q.Create(q.Collection('Likes'), { data: { postId, userId } })
    );

    return { statusCode: 200, body: JSON.stringify({ liked: true }) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
