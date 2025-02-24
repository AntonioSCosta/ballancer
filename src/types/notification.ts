
export interface Notification {
  id: string;
  user_id: string;
  type: 'community_invite' | 'match_scheduled';
  content: string;
  related_id: string | null;
  created_at: string;
  read_at: string | null;
}
