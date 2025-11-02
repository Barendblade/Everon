// functions/addLike.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Service Role key for server-side
);

export async function handler(event) {
  try {
    const { postId, userId } = JSON.parse(event.body);

    if (!postId || !userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing postId or userId' }) };
    }

    // Check if user already liked this post
    const { data: existing, error: fetchError } = await supabase
      .from('likes') // Make sure you have a "likes" table
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      return { statusCode: 500, body: JSON.stringify(fetchError) };
    }

    if (existing) {
      return { statusCode: 200, body: JSON.stringify({ liked: true }) };
    }

    // Add the like
    const { data, error: insertError } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (insertError) {
      return { statusCode: 500, body: JSON.stringify(insertError) };
    }

    return { statusCode: 200, body: JSON.stringify({ liked: true }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
