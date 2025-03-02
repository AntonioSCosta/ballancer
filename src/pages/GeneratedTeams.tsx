import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { TeamsComparison } from "@/components/match/TeamsComparison";
import { Profile } from "@/hooks/useFriends";
import { Loader2 } from "lucide-react";

interface CommunityMember {
  user_id: string;
  role: string;
  profiles: Profile;
}

interface Community {
  id: string;
  name: string;
  description: string | null;
}

interface Team {
  goalkeeper: CommunityMember | null;
  defenders: CommunityMember[];
  midfielders: CommunityMember[];
  forwards: CommunityMember[];
}

const GeneratedTeams = () => {
  const { user } = useAuth();
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch communities for the user
  const { data: communities } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, description")
        .limit(5);

      if (error) {
        toast.error("Failed to load communities.");
        console.error("Supabase error:", error);
        return [];
      }
      return data as Community[];
    },
  });

  useEffect(() => {
    if (communities && communities.length > 0) {
      setCommunityId(communities[0].id);
    }
  }, [communities]);

  const generateTeams = async () => {
    if (!communityId) {
      toast.error("Please select a community first.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-teams", {
        body: {
          community_id: communityId,
        },
      });

      if (error) {
        toast.error("Failed to generate teams.");
        console.error("Function error:", error);
        return;
      }

      setTeams(data);
      toast.success("Teams generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate teams.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Generate Teams</h1>
        <p className="text-gray-500 mt-2">
          Automatically generate balanced teams based on community members.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="community" className="block text-sm font-medium text-gray-700">
          Select Community:
        </label>
        <select
          id="community"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={communityId || ""}
          onChange={(e) => setCommunityId(e.target.value)}
        >
          {communities && communities.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
        <button
          onClick={generateTeams}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              Generating...
              <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Generate Teams"
          )}
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 mt-6">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : teams && teams.length === 2 ? (
          <>
            <TeamsComparison 
              team1={{
                id: "team1",
                name: "Team 1",
                ...teams[0]
              }} 
              team2={{
                id: "team2",
                name: "Team 2",
                ...teams[1]
              }} 
            />
          </>
        ) : (
          <div className="text-center py-4 border rounded-md w-full">
            <p className="text-gray-500">No teams generated yet. Click the button to generate teams.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedTeams;
