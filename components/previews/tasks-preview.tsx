import React from "react";
import { FluidTypeConfig } from "@/lib/fluid-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

interface TasksPreviewProps {
  steps: any[];
  config: FluidTypeConfig;
}

export function TasksPreview({ steps, config }: TasksPreviewProps) {
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

  const getRandomFoodEmoji = () => {
    const foodEmojis = ['🍕', '🍔', '🌮', '🍜', '🍣', '🍱', '🥗', '🍝', '🍲', '🥘', '🍛', '🍙', '🍚', '🍘', '🥟', '🥠', '🥡', '🍤', '🍗', '🍖', '🥩', '🥓', '🍳', '🧀', '🥞', '🧇', '🥯', '🥐', '🥨', '🥖', '🍞', '🥪', '🌭', '🌯', '🥙', '🥫', '🍕', '🍟', '🍿', '🧂', '🥜', '🌰', '🍫', '🍬', '🍭', '🍮', '🍯', '🍰', '🧁', '🍪', '🍩', '🍨', '🍧', '🍦', '🥧', '🍰', '🎂', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🥯', '🥖', '🍞'];
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  };

  const TextWithTooltip = ({ stepName, children, className = "", style, as: Component = "span" }: { stepName: string; children: React.ReactNode; className?: string; style?: React.CSSProperties; as?: keyof JSX.IntrinsicElements }) => {
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    const mappedStepName = isShadcn && STEP_NAME_MAP[stepName] ? STEP_NAME_MAP[stepName] : stepName;
    
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

  const InputWithTooltip = ({ stepName, children, ...props }: { stepName: string; children: React.ReactNode; [key: string]: any }) => {
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    const mappedStepName = isShadcn && STEP_NAME_MAP[stepName] ? STEP_NAME_MAP[stepName] : stepName;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block w-full">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>🦀 {mappedStepName}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const tasks = [
    { id: "TASK-8782", title: "You can't compress the program without quantifying the open-source SSD pixel!", status: "in progress", priority: "medium", label: "documentation" },
    { id: "TASK-7878", title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!", status: "backlog", priority: "low", label: "documentation" },
    { id: "TASK-7839", title: "We need to bypass the neural TCP card!", status: "todo", priority: "high", label: "bug" },
    { id: "TASK-5562", title: "The SAS interface is down, bypass the open-source pixel!", status: "backlog", priority: "medium", label: "feature" },
    { id: "TASK-8686", title: "I'll parse the wireless SSL protocol, that should driver the API panel!", status: "canceled", priority: "medium", label: "feature" },
    { id: "TASK-1280", title: "Use the digital TLS panel, then you can transmit the haptic system!", status: "done", priority: "high", label: "bug" },
    { id: "TASK-7262", title: "The UTF8 application is down, parse the neural bandwidth!", status: "done", priority: "high", label: "feature" },
  ];

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div className="h-full flex-1 flex-col space-y-8 px-8 py-2 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="font-bold tracking-tight font-title" style={getStyle("heading-3")}>
              <TextWithTooltip stepName="heading-3">Welcome back!</TextWithTooltip>
            </h2>
            <p className="text-muted-foreground" style={getStyle("body")}>
              <TextWithTooltip stepName="body">Here&apos;s a list of your tasks for this month!</TextWithTooltip>
            </p>
          </div>
        <div className="flex items-center space-x-2">
           <div className="flex items-center space-x-2 bg-secondary/50 p-1 rounded-md">
             <AvatarUser />
           </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <InputWithTooltip stepName="body-sm">
            <Input
              placeholder="Filter tasks..."
              className="h-8 w-[150px] lg:w-[250px]"
              style={getStyle("body-sm")}
            />
          </InputWithTooltip>
          <Button variant="outline" size="sm" className="h-8 border-dashed" style={getStyle("body-sm")}>
            <TextWithTooltip stepName="body-sm">Status</TextWithTooltip>
          </Button>
          <Button variant="outline" size="sm" className="h-8 border-dashed" style={getStyle("body-sm")}>
            <TextWithTooltip stepName="body-sm">Priority</TextWithTooltip>
          </Button>
        </div>
        <Button size="sm" className="ml-auto h-8 lg:flex" style={getStyle("body-sm")}>
          <TextWithTooltip stepName="body-sm">View</TextWithTooltip>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                  <Checkbox />
              </TableHead>
              <TableHead className="w-[100px]" style={getStyle("body-sm")}>
                <TextWithTooltip stepName="body-sm">Task</TextWithTooltip>
              </TableHead>
              <TableHead style={getStyle("body-sm")}>
                <TextWithTooltip stepName="body-sm">Title</TextWithTooltip>
              </TableHead>
              <TableHead style={getStyle("body-sm")}>
                <TextWithTooltip stepName="body-sm">Status</TextWithTooltip>
              </TableHead>
              <TableHead style={getStyle("body-sm")}>
                <TextWithTooltip stepName="body-sm">Priority</TextWithTooltip>
              </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                    <Checkbox />
                </TableCell>
                <TableCell style={{ ...getStyle("body"), fontWeight: 400 }}>
                  <TextWithTooltip stepName="body">{task.id}</TextWithTooltip>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Badge variant="outline" style={{ ...getStyle("body"), fontWeight: 400 }}>
                      <TextWithTooltip stepName="body">{task.label}</TextWithTooltip>
                    </Badge>
                    <span className="max-w-[500px] truncate" style={{ ...getStyle("body"), fontWeight: 400 }}>
                      <TextWithTooltip stepName="body">{task.title}</TextWithTooltip>
                    </span>
                  </div>
                </TableCell>
                <TableCell style={{ ...getStyle("body"), fontWeight: 400 }}>
                  <TextWithTooltip stepName="body">{task.status}</TextWithTooltip>
                </TableCell>
                <TableCell style={{ ...getStyle("body"), fontWeight: 400 }}>
                  <TextWithTooltip stepName="body">{task.priority}</TextWithTooltip>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Make a copy</DropdownMenuItem>
                            <DropdownMenuItem>Favorite</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" style={getStyle("body-sm")}>
          <TextWithTooltip stepName="body-sm">Previous</TextWithTooltip>
        </Button>
        <Button variant="outline" size="sm" style={getStyle("body-sm")}>
          <TextWithTooltip stepName="body-sm">Next</TextWithTooltip>
        </Button>
      </div>
    </div>
    </TooltipProvider>
  );
}

function AvatarUser() {
    return (
        <div className="h-8 w-8 rounded-full bg-black/10" />
    )
}

