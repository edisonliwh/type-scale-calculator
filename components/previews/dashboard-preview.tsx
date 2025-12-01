import React from "react";
import { FluidTypeConfig } from "@/lib/fluid-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, CreditCard, DollarSign, Users, ArrowUpRight } from "lucide-react";

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

interface DashboardPreviewProps {
  steps: any[];
  config: FluidTypeConfig;
}

export function DashboardPreview({ steps, config }: DashboardPreviewProps) {
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
    const isBody = ["body-sm", "body", "body-lg"].includes(stepName);

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
    <div className="flex-1 space-y-4 px-8 py-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-bold tracking-tight font-title" style={getStyle("heading-3")}>Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button style={getStyle("body-sm")}>Download</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" style={getStyle("body-sm")}>Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled style={getStyle("body-sm")}>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled style={getStyle("body-sm")}>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled style={getStyle("body-sm")}>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium" style={getStyle("heading-6")}>
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold" style={getStyle("heading-3")}>$45,231.89</div>
                <p className="text-muted-foreground" style={getStyle("body-sm")}>
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium" style={getStyle("heading-6")}>
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold" style={getStyle("heading-3")}>+2350</div>
                <p className="text-muted-foreground" style={getStyle("body-sm")}>
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium" style={getStyle("heading-6")}>
                  Sales
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold" style={getStyle("heading-3")}>+12,234</div>
                <p className="text-muted-foreground" style={getStyle("body-sm")}>
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium" style={getStyle("heading-6")}>
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold" style={getStyle("heading-3")}>+573</div>
                <p className="text-muted-foreground" style={getStyle("body-sm")}>
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 shadow-none">
              <CardHeader>
                <CardTitle style={getStyle("heading-5")}>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
                      <p className="text-muted-foreground" style={getStyle("body-sm")}>Chart Placeholder</p>
                  </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 shadow-none">
              <CardHeader>
                <CardTitle style={getStyle("heading-5")}>Recent Sales</CardTitle>
                <CardDescription style={getStyle("body-sm")}>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                    {[
                        { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
                        { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
                        { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
                        { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
                        { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" }
                    ].map((sale, i) => (
                         <div className="flex items-center" key={i}>
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{sale.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="font-medium leading-none" style={getStyle("body")}>{sale.name}</p>
                                <p className="text-muted-foreground" style={getStyle("body-sm")}>
                                    {sale.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium" style={getStyle("body")}>{sale.amount}</div>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

