import React, { useState, useRef, useEffect } from "react";
import { FluidTypeConfig } from "@/lib/fluid-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, CreditCard, DollarSign, Users, ArrowUpRight, ChevronDown, TrendingUp, TrendingDown, CheckCircle2, Loader2, GripVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3, Plus } from "lucide-react";
import { StyleMappings } from "@/components/style-mapping-panel";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";

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
  styleMappings?: StyleMappings;
  containerWidth?: number;
}

const chartData = [
  { date: "Apr 5", desktop: 4000, mobile: 2000 },
  { date: "Apr 11", desktop: 3000, mobile: 1500 },
  { date: "Apr 17", desktop: 2000, mobile: 1000 },
  { date: "Apr 23", desktop: 2780, mobile: 1400 },
  { date: "Apr 29", desktop: 1890, mobile: 950 },
  { date: "May 5", desktop: 2390, mobile: 1200 },
  { date: "May 11", desktop: 3200, mobile: 1600 },
  { date: "May 17", desktop: 3500, mobile: 1750 },
  { date: "May 23", desktop: 2800, mobile: 1400 },
  { date: "May 29", desktop: 3100, mobile: 1550 },
  { date: "Jun 4", desktop: 2900, mobile: 1450 },
  { date: "Jun 10", desktop: 2700, mobile: 1350 },
  { date: "Jun 16", desktop: 2500, mobile: 1250 },
  { date: "Jun 22", desktop: 3300, mobile: 1650 },
  { date: "Jun 29", desktop: 3600, mobile: 1800 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DashboardPreview({ steps, config, styleMappings = {}, containerWidth = 1440 }: DashboardPreviewProps) {
  const isBelowMd = containerWidth < 768; // md breakpoint
  const [timeRange, setTimeRange] = useState("3months");

  // Helper to get step name for an element, using mapping or default
  const getStepName = (elementId: string, defaultStep: string) => {
    return (styleMappings[elementId as keyof StyleMappings] as string) || defaultStep;
  };
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

  const getMappedStepName = (stepName: string) => {
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    return isShadcn && STEP_NAME_MAP[stepName] ? STEP_NAME_MAP[stepName] : stepName;
  };

  const getRandomFoodEmoji = () => {
    const foodEmojis = ['🍕', '🍔', '🌮', '🍜', '🍣', '🍱', '🥗', '🍝', '🍲', '🥘', '🍛', '🍙', '🍚', '🍘', '🥟', '🥠', '🥡', '🍤', '🍗', '🍖', '🥩', '🥓', '🍳', '🧀', '🥞', '🧇', '🥯', '🥐', '🥨', '🥖', '🍞', '🥪', '🌭', '🌯', '🥙', '🥫', '🍕', '🍟', '🍿', '🧂', '🥜', '🌰', '🍫', '🍬', '🍭', '🍮', '🍯', '🍰', '🧁', '🍪', '🍩', '🍨', '🍧', '🍦', '🥧', '🍰', '🎂', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🥯', '🥖', '🍞'];
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  };

  const TextWithTooltip = ({ stepName, children, className = "", style, as: Component = "span" }: { stepName: string; children: React.ReactNode; className?: string; style?: React.CSSProperties; as?: React.ElementType }) => {
    const mappedStepName = getMappedStepName(stepName);
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Component className={className} style={style}>{children}</Component>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getRandomFoodEmoji()} {mappedStepName}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const CardTitleWithTooltip = ({ stepName, children, style, className, ...props }: { stepName: string; children: React.ReactNode; style?: React.CSSProperties; className?: string; [key: string]: any }) => {
    const mappedStepName = getMappedStepName(stepName);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <CardTitle style={style} className={className} {...props}>
            {children}
          </CardTitle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getRandomFoodEmoji()} {mappedStepName}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const CardDescriptionWithTooltip = ({ stepName, children, style, ...props }: { stepName: string; children: React.ReactNode; style?: React.CSSProperties; [key: string]: any }) => {
    const mappedStepName = getMappedStepName(stepName);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <CardDescription style={style} {...props}>
            {children}
          </CardDescription>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getRandomFoodEmoji()} {mappedStepName}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="flex-1 space-y-4 px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TextWithTooltip stepName={getStepName("dashboard-title", "heading-3")} as="h2" className="font-bold tracking-tight font-title" style={getStyle(getStepName("dashboard-title", "heading-3"))}>
            Documents
          </TextWithTooltip>
            <Button style={getStyle(getStepName("dashboard-download-btn", "body"))}>
            <TextWithTooltip stepName={getStepName("dashboard-download-btn", "body")}>Quick Create</TextWithTooltip>
            </Button>
        </div>

        <div className={`grid gap-4 ${isBelowMd ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitleWithTooltip stepName={getStepName("dashboard-card-title", "body-lg")} className="font-medium" style={getStyle(getStepName("dashboard-card-title", "body-lg"))}>
                  Total Revenue
                </CardTitleWithTooltip>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <TextWithTooltip stepName={getStepName("dashboard-card-value", "heading-3")} as="div" className="font-bold" style={getStyle(getStepName("dashboard-card-value", "heading-3"))}>
                $1,250.00
              </TextWithTooltip>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")} style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                  +12.5%
                </TextWithTooltip>
              </div>
              <p className="text-muted-foreground text-xs mt-1" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Trending up this month</TextWithTooltip>
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitleWithTooltip stepName={getStepName("dashboard-card-title", "body-lg")} className="font-medium" style={getStyle(getStepName("dashboard-card-title", "body-lg"))}>
                New Customers
                </CardTitleWithTooltip>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <TextWithTooltip stepName={getStepName("dashboard-card-value", "heading-3")} as="div" className="font-bold" style={getStyle(getStepName("dashboard-card-value", "heading-3"))}>
                1,234
              </TextWithTooltip>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")} style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                  -20%
                </TextWithTooltip>
              </div>
              <p className="text-muted-foreground text-xs mt-1" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Down 20% this period</TextWithTooltip>
              </p>
              <p className="text-muted-foreground text-xs mt-0.5" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Acquisition needs attention</TextWithTooltip>
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitleWithTooltip stepName={getStepName("dashboard-card-title", "body-lg")} className="font-medium" style={getStyle(getStepName("dashboard-card-title", "body-lg"))}>
                Active Accounts
                </CardTitleWithTooltip>
              <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <TextWithTooltip stepName={getStepName("dashboard-card-value", "heading-3")} as="div" className="font-bold" style={getStyle(getStepName("dashboard-card-value", "heading-3"))}>
                45,678
              </TextWithTooltip>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")} style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                  +12.5%
                </TextWithTooltip>
              </div>
              <p className="text-muted-foreground text-xs mt-1" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Strong user retention</TextWithTooltip>
              </p>
              <p className="text-muted-foreground text-xs mt-0.5" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Engagement exceed targets</TextWithTooltip>
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitleWithTooltip stepName={getStepName("dashboard-card-title", "body-lg")} className="font-medium" style={getStyle(getStepName("dashboard-card-title", "body-lg"))}>
                Growth Rate
                </CardTitleWithTooltip>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <TextWithTooltip stepName={getStepName("dashboard-card-value", "heading-3")} as="div" className="font-bold" style={getStyle(getStepName("dashboard-card-value", "heading-3"))}>
                4.5%
              </TextWithTooltip>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")} style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                  +4.5%
                </TextWithTooltip>
              </div>
              <p className="text-muted-foreground text-xs mt-1" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Steady performance increase</TextWithTooltip>
              </p>
              <p className="text-muted-foreground text-xs mt-0.5" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Meets growth projections</TextWithTooltip>
                </p>
              </CardContent>
            </Card>
          </div>

        <Card className="shadow-none">
              <CardHeader>
            <div className={`flex ${isBelowMd ? 'flex-col' : 'items-center'} justify-between gap-4`}>
              <div>
                <CardTitleWithTooltip stepName={getStepName("dashboard-section-title", "heading-5")} style={getStyle(getStepName("dashboard-section-title", "heading-5"))}>
                  Total Visitors
                </CardTitleWithTooltip>
                <CardDescriptionWithTooltip stepName={getStepName("dashboard-section-description", "body-sm")} style={getStyle(getStepName("dashboard-section-description", "body-sm"))}>
                  Visitors for the last 3 months
                </CardDescriptionWithTooltip>
              </div>
              <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="3months" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Last 3 months</TextWithTooltip>
                  </TabsTrigger>
                  <TabsTrigger value="30days" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Last 30 days</TextWithTooltip>
                  </TabsTrigger>
                  <TabsTrigger value="7days" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Last 7 days</TextWithTooltip>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
              </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke="var(--color-mobile)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
              </CardContent>
            </Card>

        <Card className="shadow-none">
              <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Tabs defaultValue="outline" className="w-auto">
                <TabsList>
                  <TabsTrigger value="outline" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Outline</TextWithTooltip>
                  </TabsTrigger>
                  <TabsTrigger value="past-performance" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Past Performance</TextWithTooltip>
                  </TabsTrigger>
                  <TabsTrigger value="key-personnel" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Key Personnel</TextWithTooltip>
                  </TabsTrigger>
                  <TabsTrigger value="focus-documents" style={getStyle(getStepName("dashboard-tabs", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-tabs", "body-sm")}>Focus Documents</TextWithTooltip>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" style={getStyle(getStepName("dashboard-download-btn", "body"))}>
                      <Columns3 className="h-4 w-4 mr-1.5" />
                      <TextWithTooltip stepName={getStepName("dashboard-download-btn", "body")}>Customize Columns</TextWithTooltip>
                      <ChevronDown className="h-4 w-4 ml-1.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Column options</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" style={getStyle(getStepName("dashboard-download-btn", "body"))}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  <TextWithTooltip stepName={getStepName("dashboard-download-btn", "body")}>Add Section</TextWithTooltip>
                </Button>
              </div>
            </div>
              </CardHeader>
              <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]" style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>
                      <Checkbox />
                    </TextWithTooltip>
                  </TableHead>
                  <TableHead className="w-[50px]" style={getStyle(getStepName("dashboard-table-header", "body-sm"))}></TableHead>
                  <TableHead style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>Section Name</TextWithTooltip>
                  </TableHead>
                  <TableHead style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>Section Type</TextWithTooltip>
                  </TableHead>
                  <TableHead style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>Status</TextWithTooltip>
                  </TableHead>
                  <TableHead style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>Target</TextWithTooltip>
                  </TableHead>
                  <TableHead style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>Limit</TextWithTooltip>
                  </TableHead>
                  <TableHead style={getStyle(getStepName("dashboard-table-header", "body-sm"))}>
                    <TextWithTooltip stepName={getStepName("dashboard-table-header", "body-sm")}>Reviewer</TextWithTooltip>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { sectionName: "Cover page", sectionType: "Cover page", status: "In Process", target: 18, limit: 5, reviewer: "Eddie Lake" },
                  { sectionName: "Table of contents", sectionType: "Table of contents", status: "Done", target: 29, limit: 24, reviewer: "Eddie Lake" },
                  { sectionName: "Executive summary", sectionType: "Narrative", status: "Done", target: 10, limit: 13, reviewer: "Eddie Lake" },
                  { sectionName: "Technical approach", sectionType: "Narrative", status: "Done", target: 27, limit: 23, reviewer: "Jamik Tashpulatov" },
                  { sectionName: "Design", sectionType: "Narrative", status: "In Process", target: 2, limit: 16, reviewer: "Jamik Tashpulatov" },
                  { sectionName: "Capabilities", sectionType: "Narrative", status: "In Process", target: 20, limit: 8, reviewer: "Jamik Tashpulatov" },
                  { sectionName: "Integration with existing systems", sectionType: "Narrative", status: "In Process", target: 19, limit: 21, reviewer: "Jamik Tashpulatov" },
                  { sectionName: "Innovation and Advantages", sectionType: "Narrative", status: "Done", target: 25, limit: 26, reviewer: "Assign reviewer" },
                  { sectionName: "Overview of EMR's Innovative Solutions", sectionType: "Technical content", status: "Done", target: 7, limit: 23, reviewer: "Assign reviewer" },
                  { sectionName: "Advanced Algorithms and Machine Learning", sectionType: "Narrative", status: "Done", target: 30, limit: 28, reviewer: "Assign reviewer" },
                ].map((row, i) => (
                  <TableRow key={i}>
                    <TableCell style={getStyle(getStepName("dashboard-table-cell", "body-sm"))}>
                      <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body-sm")}>
                        <Checkbox />
                      </TextWithTooltip>
                    </TableCell>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                      <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")}>{row.sectionName}</TextWithTooltip>
                    </TableCell>
                    <TableCell style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                      <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")}>{row.sectionType}</TextWithTooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row.status === "Done" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                        )}
                        <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")} style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                          {row.status}
                        </TextWithTooltip>
                      </div>
                    </TableCell>
                    <TableCell style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                      <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")}>{row.target}</TextWithTooltip>
                    </TableCell>
                    <TableCell style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                      <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")}>{row.limit}</TextWithTooltip>
                    </TableCell>
                    <TableCell style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                      {row.reviewer === "Assign reviewer" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto p-0" style={getStyle(getStepName("dashboard-table-cell", "body"))}>
                              <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")}>{row.reviewer}</TextWithTooltip>
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Assign reviewer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <TextWithTooltip stepName={getStepName("dashboard-table-cell", "body")}>{row.reviewer}</TextWithTooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Open menu</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>0 of 68 row(s) selected.</TextWithTooltip>
              </p>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                      <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Rows per page 10</TextWithTooltip>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>10</DropdownMenuItem>
                    <DropdownMenuItem>20</DropdownMenuItem>
                    <DropdownMenuItem>50</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-sm text-muted-foreground" style={getStyle(getStepName("dashboard-card-description", "body-sm"))}>
                  <TextWithTooltip stepName={getStepName("dashboard-card-description", "body-sm")}>Page 1 of 7</TextWithTooltip>
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                            </div>
                        </div>
                </div>
              </CardContent>
            </Card>
    </div>
    </TooltipProvider>
  );
}
