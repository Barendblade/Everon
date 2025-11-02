
import faunadb from 'faunadb';
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

export async function handler(event) {
  try {
    const { postId } = JSON.parse(event.body);
    if (!postId) return { statusCode: 400, body: 'Missing postId' };

    const comments = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index('comments_by_post'), postId), { size: 100 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );

    return { statusCode: 200, body: JSON.stringify(comments.data.map(c => c.data)) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
