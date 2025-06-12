import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export default function AuthActions() {
  return (
    <div className="text-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link href="/login" className="block">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
