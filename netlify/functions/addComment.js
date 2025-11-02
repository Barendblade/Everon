// functions/addComment.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,         // Your Supabase project URL
  process.env.SUPABASE_SERVICE_KEY  // Supabase service role key (never expose to frontend)
);

export async function handler(event) {
  try {
    const { postId, userId, text } = JSON.parse(event.body);

    if (!postId || !userId || !text) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const { data, error } = await supabase
      .from('comments')  // Make sure you have a "comments" table in Supabase
      .insert([
        { post_id: postId, user_id: userId, text, created_at: new Date().toISOString() }
      ])
      .select(); // return the inserted row

    if (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return { statusCode: 200, body: JSON.stringify(data[0]) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
