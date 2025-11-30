import React from "react";
import { FluidTypeConfig } from "@/lib/fluid-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreHorizontal, Check, CreditCard, Apple, Command } from "lucide-react";

// Step name mapping for preview components (old names -> new names)
const STEP_NAME_MAP: Record<string, string> = {
  "display": "heading-1",
  "xxxl": "heading-2",
  "xxl": "heading-3",
  "xl": "heading-4",
  "lg": "heading-5",
  "md": "heading-6",
  "base": "body",
  "sm": "body-sm",
};

interface ExamplesPreviewProps {
  steps: any[];
  config: FluidTypeConfig;
}

export function ExamplesPreview({ steps, config }: ExamplesPreviewProps) {
  const getStyle = (stepName: string) => {
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    // Map old step names to Shadcn names if using Shadcn
    const mappedStepName = isShadcn && STEP_NAME_MAP[stepName] ? STEP_NAME_MAP[stepName] : stepName;
    const step = steps.find((s) => s.name === mappedStepName);
    if (!step) return {};
    
    // For Shadcn styles, use the step's own properties
    if (isShadcn && step.fontSize) {
      const isBody = step.category === "body";
      return {
        fontSize: `${step.fontSize}px`,
        fontWeight: step.fontWeight || config.fontWeight,
        lineHeight: step.lineHeight || config.lineHeight,
        letterSpacing: `${step.letterSpacing || 0}em`,
        ...(isBody ? {} : {
          fontFamily: config.headingFontFamily === "inherit" ? "inherit" : `"${config.headingFontFamily}", sans-serif`,
          color: config.headingColor === "inherit" ? "inherit" : config.headingColor,
        }),
      };
    }
    
    // For regular fluid type
    const isBody = ["sm", "base", "md", "lg", "body", "body-sm", "body-lg"].includes(stepName);

    const headingStyle = isBody
      ? {}
      : {
          fontFamily:
            config.headingFontFamily === "inherit"
              ? "inherit"
              : `"${config.headingFontFamily}", sans-serif`,
          fontWeight: config.headingFontWeight,
          lineHeight: config.headingLineHeight,
          letterSpacing: `${config.headingLetterSpacing}em`,
          color: config.headingColor === "inherit" ? "inherit" : config.headingColor,
        };

    return {
      fontSize: step?.clamp,
      ...headingStyle,
    };
  };

  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 p-1 pb-20">
      {/* Card 1: Payment Method */}
      <Card className="break-inside-avoid shadow-sm">
        <CardHeader>
          <CardTitle style={getStyle("heading-4")}>Payment Method</CardTitle>
          <CardDescription style={getStyle("body-sm")}>
            Add a new payment method to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                <span style={getStyle("body-sm")}>Card</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="mb-3 h-6 w-6 flex items-center justify-center font-bold">P</span>
                <span style={getStyle("body-sm")}>Paypal</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
              <Label
                htmlFor="apple"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Apple className="mb-3 h-6 w-6" />
                <span style={getStyle("body-sm")}>Apple</span>
              </Label>
            </div>
          </RadioGroup>
          <div className="grid gap-2">
            <Label htmlFor="name" style={getStyle("body-sm")}>Name</Label>
            <Input id="name" placeholder="First Last" style={getStyle("body")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number" style={getStyle("body-sm")}>Card number</Label>
            <Input id="number" placeholder="" style={getStyle("body")} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="month" style={getStyle("body-sm")}>Expires</Label>
              <Select>
                <SelectTrigger id="month" style={getStyle("body")}>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  {/* ... */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year" style={getStyle("body-sm")}>Year</Label>
              <Select>
                <SelectTrigger id="year" style={getStyle("body")}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  {/* ... */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc" style={getStyle("body-sm")}>CVC</Label>
              <Input id="cvc" placeholder="CVC" style={getStyle("body")} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" style={getStyle("body")}>Continue</Button>
        </CardFooter>
      </Card>

      {/* Card 2: Team Members */}
      <Card className="break-inside-avoid shadow-sm">
        <CardHeader>
          <CardTitle style={getStyle("heading-4")}>Team Members</CardTitle>
          <CardDescription style={getStyle("body-sm")}>
            Invite your team members to collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none" style={getStyle("body")}>Sofia Davis</p>
                <p className="text-muted-foreground" style={getStyle("body-sm")}>m@example.com</p>
              </div>
            </div>
            <Select defaultValue="owner">
              <SelectTrigger className="ml-auto w-[110px]" style={getStyle("body-sm")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none" style={getStyle("body")}>Jackson Lee</p>
                <p className="text-muted-foreground" style={getStyle("body-sm")}>p@example.com</p>
              </div>
            </div>
            <Select defaultValue="member">
              <SelectTrigger className="ml-auto w-[110px]" style={getStyle("body-sm")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Create Account */}
      <Card className="break-inside-avoid shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle style={getStyle("heading-4")}>Create an account</CardTitle>
          <CardDescription style={getStyle("body-sm")}>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline" style={getStyle("body-sm")}>Github</Button>
            <Button variant="outline" style={getStyle("body-sm")}>Google</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" style={getStyle("body-sm")}>Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" style={getStyle("body")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" style={getStyle("body-sm")}>Password</Label>
            <Input id="password" type="password" style={getStyle("body")} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" style={getStyle("body")}>Create account</Button>
        </CardFooter>
      </Card>

       {/* Card 4: Notifications */}
       <Card className="break-inside-avoid shadow-sm">
        <CardHeader>
          <CardTitle style={getStyle("heading-4")}>Notifications</CardTitle>
          <CardDescription style={getStyle("body-sm")}>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-start space-x-4 rounded-md border p-4">
            <Command className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="font-medium leading-none" style={getStyle("body")}>Everything</p>
              <p className="text-muted-foreground" style={getStyle("body-sm")}>
                Email digest, mentions & all activity.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 rounded-md border p-4">
            <div className="mt-px h-5 w-5 rounded-full border-2 border-primary" />
            <div className="space-y-1">
              <p className="font-medium leading-none" style={getStyle("body")}>Available</p>
              <p className="text-muted-foreground" style={getStyle("body-sm")}>
                Only mentions and comments.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 rounded-md border p-4">
             <div className="mt-px h-5 w-5 rounded-full border-2 border-muted" />
            <div className="space-y-1">
              <p className="font-medium leading-none" style={getStyle("body")}>Ignoring</p>
              <p className="text-muted-foreground" style={getStyle("body-sm")}>
                Turn off all notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

       {/* Card 5: Report an issue */}
       <Card className="break-inside-avoid shadow-sm">
        <CardHeader>
          <CardTitle style={getStyle("heading-4")}>Report an issue</CardTitle>
          <CardDescription style={getStyle("body-sm")}>
            What area are you having problems with?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="area" style={getStyle("body-sm")}>Area</Label>
                 <Select defaultValue="billing">
                  <SelectTrigger id="area" style={getStyle("body")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="deployments">Deployments</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="grid gap-2">
                <Label htmlFor="security-level" style={getStyle("body-sm")}>Security Level</Label>
                 <Select defaultValue="2">
                  <SelectTrigger id="security-level" style={getStyle("body")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Severity 1 (Highest)</SelectItem>
                    <SelectItem value="2">Severity 2</SelectItem>
                    <SelectItem value="3">Severity 3</SelectItem>
                    <SelectItem value="4">Severity 4 (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>
          <div className="grid gap-2">
             <Label htmlFor="subject" style={getStyle("body-sm")}>Subject</Label>
             <Input id="subject" placeholder="I need help with..." style={getStyle("body")} />
          </div>
           <div className="grid gap-2">
             <Label htmlFor="description" style={getStyle("body-sm")}>Description</Label>
             <Textarea id="description" placeholder="Please include all information relevant to your issue." style={getStyle("body")} />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
            <Button variant="ghost" style={getStyle("body-sm")}>Cancel</Button>
            <Button style={getStyle("body-sm")}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

