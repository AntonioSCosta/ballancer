
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface FriendRequest {
  id: string;
  sender: Profile;
  receiver: Profile;
  status: string;
  created_at: string;
}

export interface Friend {
  id: string;
  friend: Profile;
}

export const useFriends = () => {
  const { user } = useAuth()
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchFriends = async () => {
      try {
        const { data, error } = await supabase
          .from('friends')
          .select(`
            id,
            friend:profiles!friends_user_id_2_fkey(id, username, avatar_url)
          `)
          .eq('user_id_1', user.id)

        if (error) throw error
        setFriends(data || [])
      } catch (error) {
        console.error('Error fetching friends:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [user])

  return { friends, loading }
}
