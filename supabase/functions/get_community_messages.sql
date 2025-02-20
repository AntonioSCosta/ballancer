
CREATE OR REPLACE FUNCTION get_community_messages(community_id UUID)
RETURNS TABLE (
  id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  sender_id UUID,
  sender JSON
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.id,
    cm.content,
    cm.created_at,
    cm.sender_id,
    json_build_object(
      'username', p.username
    ) as sender
  FROM community_messages cm
  JOIN profiles p ON p.id = cm.sender_id
  WHERE cm.community_id = get_community_messages.community_id
  ORDER BY cm.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION send_community_message(
  p_community_id UUID,
  p_content TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO community_messages (community_id, sender_id, content)
  VALUES (p_community_id, auth.uid(), p_content);
END;
$$;
