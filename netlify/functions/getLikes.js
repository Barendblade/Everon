// functions/getLikes.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // server-side key
);

export async function handler(event) {
  try {
    const { postId } = JSON.parse(event.body);
    if (!postId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing postId' }) };
    }

    // Count likes for the post
    const { count, error } = await supabase
      .from('likes') // your "likes" table
      .select('*', { count: 'exact' })
      .eq('post_id', postId);

    if (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ likes: count })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
