import React from 'react'
import { SignIn } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const demoCredentials = [
    { email: "test@email.com", password: "ExploreNow!2025" },
    { email: "sam@gmail.com", password: "TalentPortal@2025" },
    { email: "view@example.com", password: "TryThisDemo!88" }
  ];

  return (
    <div className="flex flex-col items-center pt-0 pb-8 px-4 space-y-12">
      <SignIn />
      
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-lg">Demo Credentials</CardTitle>
          <CardDescription>
            Use these credentials to test the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoCredentials.map((credential, index) => (
              <div key={index} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    Demo {index + 1}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Email:</span>
                    <div className="p-2 bg-background rounded border font-mono text-xs break-all">
                      {credential.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Password:</span>
                    <div className="p-2 bg-background rounded border font-mono text-xs break-all">
                      {credential.password}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
