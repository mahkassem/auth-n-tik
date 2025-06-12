import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import UserInfoGrid from "./UserInfoGrid";
import SessionInfo from "./SessionInfo";

interface WelcomeCardProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function WelcomeCard({ userName, userEmail }: WelcomeCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome back, {userName}! 👋</CardTitle>
        <CardDescription>
          You are successfully signed in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UserInfoGrid email={userEmail} name={userName} />
          <SessionInfo />
        </div>
      </CardContent>
    </Card>
  );
}
