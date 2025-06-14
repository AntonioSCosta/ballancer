
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export const useFriends = () => {
  const { user } = useAuth()
  const [friends, setFriends] = useState([])
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
          .select('*')
          .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)

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
