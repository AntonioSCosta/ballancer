
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import type { FriendRequest } from "@/hooks/useFriends";
import { UseMutationResult } from "@tanstack/react-query";

interface FriendRequestsProps {
  requests: FriendRequest[] | undefined;
  isLoading: boolean;
  onSelectUser: (userId: string) => void;
  acceptRequest: UseMutationResult<void, Error, string>;
  declineRequest: UseMutationResult<void, Error, string>;
}

export const FriendRequests = ({
  requests,
  isLoading,
  onSelectUser,
  acceptRequest,
  declineRequest,
}: FriendRequestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {requests?.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <button
                  className="font-medium hover:underline"
                  onClick={() => onSelectUser(request.sender.id)}
                >
                  {request.sender.username}
                </button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => acceptRequest.mutate(request.id)}
                    disabled={acceptRequest.isPending}
                  >
                    {acceptRequest.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => declineRequest.mutate(request.id)}
                    disabled={declineRequest.isPending}
                  >
                    {declineRequest.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {!requests?.length && (
              <p className="text-muted-foreground text-center py-8">
                No pending friend requests.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
