// functions/removeLike.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  try {
    const { postId, userId } = JSON.parse(event.body);
    if (!postId || !userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing postId or userId' }) };
    }

    // Delete the like for the user on this post
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ removed: true })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
