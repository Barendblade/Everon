// functions/getComments.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service role key for server-side
);

export async function handler(event) {
  try {
    const { postId } = JSON.parse(event.body);
    if (!postId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing postId' }) };
    }

    // Fetch comments for the post
    const { data: comments, error } = await supabase
      .from('comments') // Make sure you have a "comments" table
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true }); // oldest first

    if (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(comments)
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
