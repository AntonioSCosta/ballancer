
import { supabase } from "@/integrations/supabase/client";

export interface CommunityData {
  name: string;
  description: string;
}

export async function createCommunityWithMembers(
  userId: string,
  communityData: CommunityData,
  memberIds: string[]
) {
  try {
    // Step 1: Create the community
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .insert({
        name: communityData.name,
        description: communityData.description,
        creator_id: userId,
      })
      .select()
      .single();

    console.log("Community creation response:", { community, communityError });
    
    if (communityError) {
      console.error("Error creating community:", communityError.message);
      throw new Error(`Failed to create community: ${communityError.message}`);
    }

    if (!community) {
      throw new Error("Failed to create community: No community data returned");
    }

    // Step 2: Add the creator as an admin member
    const { error: creatorMemberError } = await supabase
      .from('community_members')
      .insert({
        community_id: community.id,
        user_id: userId,
        role: 'admin'
      });
    
    if (creatorMemberError) {
      console.error("Error adding creator as member:", creatorMemberError);
      throw new Error(`Failed to add creator as member: ${creatorMemberError.message}`);
    }

    console.log("Creator added as admin member");

    // Step 3: Add selected friends as members
    if (memberIds.length > 0) {
      const membersToAdd = memberIds.map(memberId => ({
        community_id: community.id,
        user_id: memberId,
        role: 'member'
      }));

      const { error: membersError } = await supabase
        .from('community_members')
        .insert(membersToAdd);
      
      if (membersError) {
        console.error("Error adding members:", membersError);
        throw new Error("Community created, but there was an error adding some members");
      } else {
        console.log("Added friends as members:", memberIds.length);
      }
    }

    return community;
  } catch (error: any) {
    console.error("Error in createCommunity service:", error);
    throw error;
  }
}
