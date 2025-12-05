"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Settings, 
  Monitor, 
  Smartphone, 
  Type, 
  Code, 
  Copy, 
  Check, 
  RefreshCcw,
  LayoutTemplate,
  MoreHorizontal,
  Palette,
  Maximize,
  Minimize,
  Eye,
  ChevronDown,
  ChevronUp,
  Github,
  MoveHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateFluidType, FluidTypeConfig } from "@/lib/fluid-type";
import { FontPicker, loadGoogleFont } from "@/components/font-picker";
import { cn } from "@/lib/utils";
import { ExamplesPreview } from "@/components/previews/examples-preview";
import { DashboardPreview } from "@/components/previews/dashboard-preview";
import { TasksPreview } from "@/components/previews/tasks-preview";
import { SnakeBackground } from "@/components/snake-background";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StyleMappingPanel, StyleMappings, TextElementId } from "@/components/style-mapping-panel";
import { ScreenSizeController, RESPONSIVE_PRESETS } from "@/components/screen-size-controller";

// ... existing code ...

// Shadcn Design System Text Styles
const SHADCN_TEXT_STYLES = [
  // Headings
  { name: "heading-1", fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: -0.025, category: "heading" },
  { name: "heading-2", fontSize: 30, fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.025, category: "heading" },
  { name: "heading-3", fontSize: 24, fontWeight: 600, lineHeight: 1.333, letterSpacing: -0.025, category: "heading" },
  { name: "heading-4", fontSize: 20, fontWeight: 600, lineHeight: 1.4, letterSpacing: -0.025, category: "heading" },
  { name: "heading-5", fontSize: 18, fontWeight: 600, lineHeight: 1.5, letterSpacing: -0.025, category: "heading" },
  { name: "heading-6", fontSize: 16, fontWeight: 600, lineHeight: 1.5, letterSpacing: -0.025, category: "heading" },
  // Body - body is 14px (0.88rem), body-sm and body-lg scaled using ratio 1.125
  { name: "body", fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0, category: "body" },
  { name: "body-sm", fontSize: 12.44, fontWeight: 400, lineHeight: 1.25, letterSpacing: 0, category: "body" }, // 14 / 1.125
  { name: "body-lg", fontSize: 15.75, fontWeight: 400, lineHeight: 1.75, letterSpacing: 0, category: "body" }, // 14 * 1.125
];

// Default configuration
const defaultConfig: FluidTypeConfig = {
  minWidth: 375,
  maxWidth: 1440,
  minFontSize: 14, // 14px (0.88rem)
  maxFontSize: 14, // 14px (0.88rem)
  minRatio: 1.125,
  maxRatio: 1.125,
  steps: ["body-sm", "body", "body-lg", "heading-6", "heading-5", "heading-4", "heading-3", "heading-2", "heading-1"],
  baseStep: "body",
  remValue: 16,
  prefix: "fs",
  decimals: 3,
  useRems: true,
  useContainerWidth: false,
  includeFallbacks: false,
  
  // Body Font Settings
  fontFamily: "Inter",
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  color: "#2d2d2d", // Converted from oklch(21.6% 0.006 56.043)
  backgroundColor: "#ffffff",

  // Heading Font Settings
  headingFontFamily: "Inter",
  headingFontWeight: 600,
  headingLineHeight: 1.1,
  headingLetterSpacing: -0.02,
  headingColor: "inherit",
  
  previewMode: 'blog',
};

const RATIOS = [
  { name: "Minor Second", value: 1.067 },
  { name: "Major Second", value: 1.125 },
  { name: "Minor Third", value: 1.2 },
  { name: "Major Third", value: 1.25 },
  { name: "Perfect Fourth", value: 1.333 },
  { name: "Augmented Fourth", value: 1.414 },
  { name: "Perfect Fifth", value: 1.5 },
  { name: "Golden Ratio", value: 1.618 },
  { name: "Shadcn Type", value: "shadcn" },
];

const WEIGHTS = [
    { label: "Thin 100", value: 100 },
    { label: "Extra Light 200", value: 200 },
    { label: "Light 300", value: 300 },
    { label: "Regular 400", value: 400 },
    { label: "Medium 500", value: 500 },
    { label: "Semi Bold 600", value: 600 },
    { label: "Bold 700", value: 700 },
    { label: "Extra Bold 800", value: 800 },
    { label: "Black 900", value: 900 },
];

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

export function FluidTypeCalculator() {
  const [config, setConfig] = useState<FluidTypeConfig>(defaultConfig);
  const [isCopied, setIsCopied] = useState(false);
  const [crabEnabled, setCrabEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [typeCategory, setTypeCategory] = useState<'all' | 'heading' | 'body'>('all');
  const [previewTab, setPreviewTab] = useState<'examples' | 'dashboard' | 'landing' | 'article'>('examples');
  const [styleMappings, setStyleMappings] = useState<StyleMappings>({});
  const [showStyleMappingPanel, setShowStyleMappingPanel] = useState(false);
  const [roundToWholeNumber, setRoundToWholeNumber] = useState(true);
  const [roundLineHeightToMultipleOf4, setRoundLineHeightToMultipleOf4] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [previewWidth, setPreviewWidth] = useState(9999); // Start with Desktop (full width)
  const [isResponsiveMode, setIsResponsiveMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null);
  const previewContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mainContentRef = React.useRef<HTMLElement | null>(null);
  const [containerTop, setContainerTop] = React.useState(0);
  const [containerLeft, setContainerLeft] = React.useState(0);
  const [containerRight, setContainerRight] = React.useState(0);

  useEffect(() => {
    loadGoogleFont(config.fontFamily);
    if (config.headingFontFamily && config.headingFontFamily !== "inherit") {
        loadGoogleFont(config.headingFontFamily);
    }
  }, [config.fontFamily, config.headingFontFamily]);



  // Toggle dots pattern on body when crab is enabled
  useEffect(() => {
    if (crabEnabled) {
      document.body.classList.add('dots-pattern');
    } else {
      document.body.classList.remove('dots-pattern');
    }
    return () => {
      document.body.classList.remove('dots-pattern');
    };
  }, [crabEnabled]);

  // Show countdown when toggle is turned on
  useEffect(() => {
    if (crabEnabled) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [crabEnabled]);

  // Handle resize drag
  useEffect(() => {
    if (!isDragging || !dragSide) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      let newWidth: number;
      
      if (dragSide === 'left') {
        // Left handle: dragging left (negative deltaX) increases width, dragging right decreases
        newWidth = dragStartWidth - deltaX * 2;
      } else {
        // Right handle: dragging right (positive deltaX) increases width, dragging left decreases
        newWidth = dragStartWidth + deltaX * 2;
      }
      
      newWidth = Math.max(200, Math.min(3000, newWidth));
      setPreviewWidth(Math.round(newWidth));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragSide(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, dragStartWidth, dragSide]);

  const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragSide(side);
    setDragStartX(e.clientX);
    // If starting from full width (9999), use the actual container width
    const startWidth = previewWidth >= 9999 && previewContainerRef.current 
      ? previewContainerRef.current.offsetWidth 
      : previewWidth;
    setDragStartWidth(startWidth);
    // Automatically switch to responsive mode when dragging
    if (!isResponsiveMode) {
      setIsResponsiveMode(true);
    }
  };

  // Calculate steps - use Shadcn styles if selected, otherwise use fluid calculation
  // When previewWidth >= minWidth, use responsive settings (minFontSize, minRatio) for fixed sizes
  const steps = useMemo(() => {
    if (config.maxRatio === "shadcn" || config.minRatio === "shadcn") {
      // Return Shadcn text styles as steps
      return SHADCN_TEXT_STYLES.map(style => ({
        name: style.name,
        minSize: style.fontSize,
        maxSize: style.fontSize,
        clamp: `${style.fontSize}px`,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        category: style.category,
      }));
    }
    
    // When preview width is at or below minWidth, apply responsive settings (minFontSize and minRatio)
    // This is the breakpoint where mobile/responsive typography settings take effect
    if (previewWidth <= config.minWidth) {
      const baseIndex = config.steps.indexOf(config.baseStep);
      const ratio = typeof config.minRatio === "number" ? config.minRatio : 1.125;
      
      return config.steps.map((step, index) => {
        const power = index - baseIndex;
        const isHeading = step.startsWith("heading-");
        const isBody = step.startsWith("body");
        
        // Use headingBaseSize for headings, minFontSize for body
        const headingBaseSize = 16;
        const baseSize = isHeading ? headingBaseSize : config.minFontSize;
        const fontSize = baseSize * Math.pow(ratio, power);
        
        return {
          name: step,
          minSize: fontSize,
          maxSize: fontSize,
          clamp: config.useRems 
            ? `${(fontSize / config.remValue).toFixed(config.decimals)}rem`
            : `${fontSize.toFixed(config.decimals)}px`,
        };
      });
    }
    
    // When preview width is above minWidth, use fluid calculation that scales between min and max
    return calculateFluidType(config);
  }, [config, previewWidth]);

  // Generate CSS string
  const cssOutput = useMemo(() => {
    let output = `:root {\n`;
    
    // Type Scale
    steps.forEach((step) => {
        output += `  --${config.prefix}-${step.name}: ${step.clamp};\n`;
    });

    output += `\n  /* Typography Settings */\n`;
    output += `  --font-body: '${config.fontFamily}', sans-serif;\n`;
    output += `  --font-heading: ${config.headingFontFamily === 'inherit' ? 'var(--font-body)' : `'${config.headingFontFamily}', sans-serif`};\n`;
    
    output += `}`;

    return output;
  }, [steps, config]);

  const handleInputChange = (field: keyof FluidTypeConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleMappingChange = (elementId: TextElementId, stepName: string) => {
    setStyleMappings((prev) => ({ ...prev, [elementId]: stepName }));
  };

  const handleRestoreDefaults = () => {
    // Clear all style mappings for the current active tab
    const tabPrefix = previewTab === 'examples' ? 'examples' 
      : previewTab === 'dashboard' ? 'dashboard' 
      : previewTab === 'landing' ? 'landing'
      : 'article';
    setStyleMappings((prev) => {
      const newMappings = { ...prev };
      // Remove all mappings that start with the current tab prefix
      Object.keys(newMappings).forEach((key) => {
        if (key.startsWith(tabPrefix)) {
          delete newMappings[key as TextElementId];
        }
      });
      return newMappings;
    });
  };

  // Get available step names
  const availableStepNames = useMemo(() => {
    return steps.map((step) => step.name);
  }, [steps]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Check if config matches default
  const isConfigDefault = useMemo(() => {
    // Compare config excluding previewMode since switching views shouldn't enable the button
    const { previewMode: _, ...configWithoutPreviewMode } = config;
    const { previewMode: __, ...defaultConfigWithoutPreviewMode } = defaultConfig;
    const configMatches = JSON.stringify(configWithoutPreviewMode) === JSON.stringify(defaultConfigWithoutPreviewMode);
    const togglesMatch = roundToWholeNumber === true && roundLineHeightToMultipleOf4 === true;
    return configMatches && togglesMatch;
  }, [config, roundToWholeNumber, roundLineHeightToMultipleOf4]);

  // Helper for scale select items to handle custom values if needed (simplified for now)
  const renderScaleOptions = () => {
      return RATIOS.map((r, index) => {
        const isShadcn = r.value === "shadcn";
        const isLastBeforeShadcn = index > 0 && RATIOS[index - 1].value !== "shadcn" && isShadcn;
        
        return (
          <React.Fragment key={r.name}>
            {isLastBeforeShadcn && <SelectSeparator />}
            <SelectItem value={r.value.toString()}>
                {typeof r.value === 'number' ? `${r.value.toFixed(3)} – ${r.name}` : r.name}
            </SelectItem>
          </React.Fragment>
        );
      });
  };

  return (
    <div 
      className="relative flex flex-col h-screen font-sans text-foreground overflow-hidden"
    >
      {/* Snake game will be rendered inside the main content area */}
      <div className="flex flex-row flex-1 p-3 gap-3 min-h-0 overflow-hidden">
      {/* View Switcher - Stamp Style - Right Edge of Sidebar (Outside) */}
      <div className="absolute left-[290px] top-[84px] z-20 flex flex-col">
          <button
              onClick={() => handleInputChange('previewMode', 'blog')}
              className={cn(
                  "relative rounded-tr-sm transition-all cursor-pointer flex items-center justify-center group",
                  config.previewMode === 'blog'
                      ? "z-10 rounded-br-sm backdrop-blur-sm"
                      : "z-0 rounded-br-0"
              )}
              style={{
                  width: '40px',
                  height: '110px',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  borderStyle: config.previewMode === 'blog' ? 'solid' : 'dashed',
                  backgroundColor: config.previewMode === 'blog' 
                      ? 'rgba(238, 242, 255, 0.9)' // indigo-50 with 90% opacity when active
                      : 'rgba(238, 242, 255, 0.6)', // indigo-50 with 60% opacity when inactive
                  boxShadow: config.previewMode === 'blog' 
                      ? "rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) 0px 1px 3px 0px"
                      : "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px"
              }}
          >
              <span 
                  className={cn(
                  "font-title font-bold text-xs uppercase tracking-wider transform rotate-90 whitespace-nowrap",
                  config.previewMode === 'blog' ? "text-indigo-700" : "text-indigo-600"
                  )}
                  style={{
                      opacity: config.previewMode === 'blog' ? 1 : 0.7 // 70% opacity when inactive
                  }}
              >
                  TYPE
              </span>
          </button>
          <button
              onClick={() => handleInputChange('previewMode', 'landing')}
              className={cn(
                  "relative rounded-br-sm transition-all cursor-pointer flex items-center justify-center group -mt-[3px]",
                  config.previewMode === 'landing'
                      ? "z-10 rounded-tr-sm backdrop-blur-sm"
                      : "z-0 rounded-tr-0"
              )}
              style={{
                  width: '40px',
                  height: '110px',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  borderStyle: config.previewMode === 'landing' ? 'solid' : 'dashed',
                  backgroundColor: config.previewMode === 'landing' 
                      ? 'rgba(247, 254, 231, 0.9)' // lime-50 with 90% opacity when active
                      : 'rgba(247, 254, 231, 0.6)', // lime-50 with 60% opacity when inactive
                  boxShadow: config.previewMode === 'landing' 
                      ? "rgba(0, 0, 0, 0.1) 0px 2px 8px 0px, rgba(0, 0, 0, 0.05) 0px 1px 3px 0px"
                      : "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px"
              }}
          >
              <span 
                  className={cn(
                  "font-title font-bold text-xs uppercase tracking-wider transform rotate-90 whitespace-nowrap",
                  config.previewMode === 'landing' ? "text-lime-700" : "text-lime-600"
                  )}
                  style={{
                      opacity: config.previewMode === 'landing' ? 1 : 0.7 // 70% opacity when inactive
                  }}
              >
                  PREVIEW
              </span>
          </button>
      </div>
      
      {/* LEFT SIDEBAR: CONTROLS - MacOS Style */}
      <aside className="relative z-30 w-[280px] flex-shrink-0 rounded-2xl backdrop-blur-xl flex flex-col h-full overflow-hidden transition-all bg-white/80" style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
        
        {/* Header */}
        <div className="p-5 border-b border-black/5 flex items-center gap-3 shrink-0">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <Type className="w-5 h-5" />
             </div>
             <span className="font-semibold text-base text-gray-900 type-scale-animated" style={{ textShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 15px' }}>
                 {"TYPE SCALE".split("").map((char, i) => (
                     <span key={`${config.previewMode}-${i}`} className="type-scale-char" style={{ animationDelay: `${i * 0.03}s` }}>
                         {char === " " ? "\u00A0" : char}
                     </span>
                 ))}
             </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          
          {/* SECTION: BASE SETTINGS (Top) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex justify-between items-center" style={{ color: 'oklch(0.708 0 0)' }}>
              <span>Base</span>
              <span className="normal-case font-normal">1rem=16px</span>
            </h3>
             <div className="grid gap-3">
                <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-start">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0 flex items-center h-9">Font-size</Label>
                    <div className="flex-1 min-w-0">
                        <div className="relative flex-1 min-w-0">
                            <Input 
                                type="number" 
                                value={config.maxFontSize}
                                onChange={(e) => handleInputChange("maxFontSize", Number(e.target.value))}
                                className="bg-white border-gray-200 pr-8 h-9 focus-visible:ring-gray-400 w-full"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">px</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">{Number((config.maxFontSize / config.remValue).toFixed(3))}rem</p>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0">Scale</Label>
                    <div className="flex-1 min-w-0">
                        <Select
                            value={config.maxRatio === "shadcn" ? "shadcn" : config.maxRatio.toString()}
                            onValueChange={(val) => {
                                if (val === "shadcn") {
                                    // Apply Shadcn preset
                                    setConfig((prev) => ({
                                        ...prev,
                                        maxRatio: "shadcn" as any,
                                        minRatio: "shadcn" as any,
                                        steps: SHADCN_TEXT_STYLES.map(s => s.name),
                                        baseStep: "body",
                                    }));
                                } else {
                                    // Switch to fluid type - reset to default steps
                                    const newRatio = Number(val);
                                    setConfig((prev) => ({
                                        ...prev,
                                        maxRatio: newRatio,
                                        minRatio: prev.minRatio === "shadcn" ? newRatio : (typeof prev.minRatio === "number" ? prev.minRatio : newRatio),
                                        steps: prev.steps.some(s => SHADCN_TEXT_STYLES.some(sh => sh.name === s)) 
                                            ? ["body-sm", "body", "body-lg", "heading-6", "heading-5", "heading-4", "heading-3", "heading-2", "heading-1"]
                                            : prev.steps,
                                        baseStep: prev.baseStep === "body" ? "body" : prev.baseStep,
                                    }));
                                }
                            }}
                        >
                            <SelectTrigger className="w-full bg-white border-gray-200 h-9 focus:ring-gray-400 min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                 {renderScaleOptions()}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: HEADINGS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.708 0 0)' }}>Headings</h3>
            
            <div className="grid gap-3">
                <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Font</Label>
                    <div className="w-full min-w-0 flex-1">
                         {/* Simplified Font Picker for Heading - Reuse component but handle "inherit" */}
                         <div className="relative">
                             <FontPicker 
                                value={config.headingFontFamily === 'inherit' ? config.fontFamily : config.headingFontFamily} 
                                onValueChange={(val) => handleInputChange("headingFontFamily", val)} 
                            />
                            {config.headingFontFamily === 'inherit' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 pointer-events-none">
                                    <span className="text-xs text-gray-600 italic">inherit</span>
                                </div>
                            )}
                         </div>
                    </div>
                </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Weight</Label>
                    <div className="flex-1 min-w-0">
                        <Select
                            value={config.headingFontWeight.toString()}
                            onValueChange={(val) => handleInputChange("headingFontWeight", Number(val))}
                        >
                            <SelectTrigger className="w-full bg-white border-gray-200 h-9 focus:ring-gray-400 min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WEIGHTS.map((w) => (
                                    <SelectItem key={w.value} value={w.value.toString()}>{w.value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Line-height</Label>
                    <div className="flex-1 min-w-0">
                        <Input 
                            type="number" 
                            step="0.05"
                            value={config.headingLineHeight}
                            onChange={(e) => handleInputChange("headingLineHeight", Number(e.target.value))}
                            className="bg-white border-gray-200 h-9 focus-visible:ring-gray-400 w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0 whitespace-nowrap">Letter-spacing</Label>
                     <div className="relative flex-1 min-w-0">
                        <Input 
                            type="number" 
                            step="0.01"
                            value={config.headingLetterSpacing}
                            onChange={(e) => handleInputChange("headingLetterSpacing", Number(e.target.value))}
                            className="bg-white border-gray-200 pr-8 h-9 focus-visible:ring-gray-400 w-full"
                        />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">em</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: BODY */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.708 0 0)' }}>Body</h3>
            
            <div className="grid gap-3">
                <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0">Font</Label>
                    <div className="w-full min-w-0 flex-1">
                         <FontPicker 
                            value={config.fontFamily} 
                            onValueChange={(val) => handleInputChange("fontFamily", val)} 
                        />
                    </div>
                </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0">Weight</Label>
                    <div className="flex-1 min-w-0">
                        <Select
                            value={config.fontWeight.toString()}
                            onValueChange={(val) => handleInputChange("fontWeight", Number(val))}
                        >
                            <SelectTrigger className="w-full bg-white border-gray-200 h-9 focus:ring-gray-400 min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WEIGHTS.map((w) => (
                                    <SelectItem key={w.value} value={w.value.toString()}>{w.value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0">Line-height</Label>
                    <div className="flex-1 min-w-0">
                        <Input 
                            type="number" 
                            step="0.05"
                            value={config.lineHeight}
                            onChange={(e) => handleInputChange("lineHeight", Number(e.target.value))}
                            className="bg-white border-gray-200 h-9 focus-visible:ring-gray-400 w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0 whitespace-nowrap">Letter-spacing</Label>
                    <div className="relative flex-1 min-w-0">
                        <Input 
                            type="number" 
                            step="0.01"
                            value={config.letterSpacing}
                            onChange={(e) => handleInputChange("letterSpacing", Number(e.target.value))}
                            className="bg-white border-gray-200 pr-8 h-9 focus-visible:ring-gray-400 w-full"
                        />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">em</span>
                    </div>
                </div>
                    </div>
                </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: RESPONSIVE */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.708 0 0)' }}>Responsive</h3>
            
            <div className="grid gap-3">
                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Min-width</Label>
                    <div className="relative flex-1 min-w-0 flex items-center gap-1">
                        <Input 
                            type="number" 
                            value={config.minWidth}
                            onChange={(e) => handleInputChange("minWidth", Number(e.target.value))}
                            className="bg-white border-gray-200 pr-8 h-9 focus-visible:ring-gray-400 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                        />
                        <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">px</span>
                        <div className="flex flex-col shrink-0">
                            <button
                                type="button"
                                onClick={() => handleInputChange("minWidth", config.minWidth + 5)}
                                className="h-4 w-6 flex items-center justify-center border border-gray-200 rounded-t hover:bg-gray-50 transition-colors"
                                aria-label="Increase by 5px"
                            >
                                <ChevronUp className="h-3 w-3 text-gray-600" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleInputChange("minWidth", Math.max(0, config.minWidth - 5))}
                                className="h-4 w-6 flex items-center justify-center border border-gray-200 border-t-0 rounded-b hover:bg-gray-50 transition-colors"
                                aria-label="Decrease by 5px"
                            >
                                <ChevronDown className="h-3 w-3 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Font-size</Label>
                    <div className="relative flex-1 min-w-0">
                        <Input 
                            type="number" 
                            value={config.minFontSize}
                            onChange={(e) => handleInputChange("minFontSize", Number(e.target.value))}
                            className="bg-white border-gray-200 pr-8 h-9 focus-visible:ring-gray-400 w-full"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">px</span>
                             </div>
                        </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Scale</Label>
                    <div className="flex-1 min-w-0">
                        <Select
                            value={config.minRatio === "shadcn" ? "shadcn" : config.minRatio.toString()}
                            onValueChange={(val) => {
                                if (val === "shadcn") {
                                    // Apply Shadcn preset
                                    setConfig((prev) => ({
                                        ...prev,
                                        maxRatio: "shadcn" as any,
                                        minRatio: "shadcn" as any,
                                        steps: SHADCN_TEXT_STYLES.map(s => s.name),
                                        baseStep: "body",
                                    }));
                                } else {
                                    // Switch to fluid type - reset to default steps
                                    const newRatio = Number(val);
                                    setConfig((prev) => ({
                                        ...prev,
                                        minRatio: newRatio,
                                        maxRatio: prev.maxRatio === "shadcn" ? newRatio : (typeof prev.maxRatio === "number" ? prev.maxRatio : newRatio),
                                        steps: prev.steps.some(s => SHADCN_TEXT_STYLES.some(sh => sh.name === s)) 
                                            ? ["body-sm", "body", "body-lg", "heading-6", "heading-5", "heading-4", "heading-3", "heading-2", "heading-1"]
                                            : prev.steps,
                                        baseStep: prev.baseStep === "body" ? "body" : prev.baseStep,
                                    }));
                                }
                            }}
                        >
                            <SelectTrigger className="w-full bg-white border-gray-200 h-9 focus:ring-gray-400 min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                 {renderScaleOptions()}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* SECTION: ROUND RULE */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'oklch(0.708 0 0)' }}>Round rule</h3>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <Label 
                        htmlFor="round-to-whole" 
                        className="text-sm font-normal text-gray-700 cursor-pointer flex-1"
                    >
                        Round to whole number
                    </Label>
                    <Switch 
                        id="round-to-whole"
                        checked={roundToWholeNumber}
                        onCheckedChange={(checked) => setRoundToWholeNumber(checked === true)}
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Label 
                        htmlFor="round-line-height" 
                        className="text-sm font-normal text-gray-700 cursor-pointer flex-1"
                    >
                        Round line-height to the nearest multiple of 4
                    </Label>
                    <Switch 
                        id="round-line-height"
                        checked={roundLineHeightToMultipleOf4}
                        onCheckedChange={(checked) => setRoundLineHeightToMultipleOf4(checked === true)}
                    />
                </div>
            </div>
          </div>

        </div>

        {/* Footer with Restore Default Button */}
        <div className="border-t border-black/5 p-5 shrink-0">
          <Button
            onClick={() => {
              setConfig({ ...defaultConfig });
              setRoundToWholeNumber(true);
              setRoundLineHeightToMultipleOf4(true);
            }}
            variant="outline"
            className="w-full"
            disabled={isConfigDefault}
          >
            Restore default
          </Button>
        </div>
      </aside>

      {/* RIGHT MAIN: PREVIEW */}
      <main ref={mainContentRef} className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Countdown Timer - Show when toggle is on */}
        {countdown !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="text-9xl font-bold text-gray-900/20 select-none font-title">
              {countdown}
            </div>
          </div>
        )}
        {/* Snake Background - Only in main content area */}
        <SnakeBackground containerRef={mainContentRef} enabled={crabEnabled} onToggle={setCrabEnabled} hideToggle={showStyleMappingPanel} />
         {/* Content Area */}
         <div className="flex-1 relative z-10 flex flex-col h-full w-full min-h-0">
             
             <div className="flex-1 flex flex-col w-full min-h-0 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-y-auto transition-colors duration-300 custom-scrollbar"
                    style={{ color: config.color, scrollbarGutter: 'stable' }}
                >
                     <div 
                        className={cn(
                            "max-w-[1400px] mx-auto transition-all duration-300 ease-out"
                        )}
                        style={{
                            paddingTop: '56px',
                            paddingBottom: '40px',
                            paddingLeft: '80px',
                            paddingRight: '80px',
                            minWidth: '375px',
                            fontFamily: `"${config.fontFamily}", sans-serif`,
                            fontWeight: config.fontWeight,
                            lineHeight: config.lineHeight,
                            letterSpacing: `${config.letterSpacing}em`,
                        }}
                    >
                         {config.previewMode === 'blog' ? (
                             <>
                                 <div className="mb-12">
                                     <Tabs value={typeCategory} onValueChange={(value) => setTypeCategory(value as 'all' | 'heading' | 'body')} className="w-full">
                                         <TabsList className="bg-transparent p-0 gap-6">
                                             <TabsTrigger 
                                                 value="all" 
                                                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" 
                                                 style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}
                                             >
                                                 All Styles
                                             </TabsTrigger>
                                             <TabsTrigger 
                                                 value="heading" 
                                                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" 
                                                 style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}
                                             >
                                                 Headings
                                             </TabsTrigger>
                                             <TabsTrigger 
                                                 value="body" 
                                                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" 
                                                 style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}
                                             >
                                                 Body
                                             </TabsTrigger>
                                         </TabsList>
                                     </Tabs>
                                 </div>
                                 <HeadingPreview 
                                     steps={steps} 
                                     config={config} 
                                     viewMode={viewMode}
                                     roundToWholeNumber={roundToWholeNumber}
                                     roundLineHeightToMultipleOf4={roundLineHeightToMultipleOf4}
                                     categoryFilter={typeCategory}
                                 />
                             </>
                         ) : (
                             <Tabs defaultValue="examples" className="w-full h-full" onValueChange={(value) => {
                                 if (value === 'examples' || value === 'dashboard' || value === 'landing' || value === 'article') {
                                     setPreviewTab(value as 'examples' | 'dashboard' | 'landing' | 'article');
                                 }
                             }}>
                                <div className="mb-12">
                                    <div className="flex items-center justify-between gap-4">
                                        <TabsList className="bg-transparent p-0 gap-6">
                                            <TabsTrigger value="examples" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Cards</TabsTrigger>
                                            <TabsTrigger value="dashboard" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Dashboard</TabsTrigger>
                                            <TabsTrigger value="landing" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Landing</TabsTrigger>
                                            <TabsTrigger value="article" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Article</TabsTrigger>
                                        </TabsList>
                                        {(previewTab === 'examples' || previewTab === 'dashboard' || previewTab === 'landing' || previewTab === 'article') && (
                                            <div className="flex items-center gap-2">
                                                <ScreenSizeController
                                                    width={previewWidth}
                                                    onWidthChange={(newWidth) => {
                                                      setPreviewWidth(newWidth);
                                                      // When in responsive mode, stay in responsive mode even if width matches a breakpoint
                                                      // Only switch out of responsive mode if explicitly selecting a preset
                                                      // (This is handled in handleResponsiveChange, not here)
                                                    }}
                                                    onResponsiveModeChange={setIsResponsiveMode}
                                                    isResponsiveMode={isResponsiveMode}
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="icon" aria-label="More options" className="bg-white">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setShowStyleMappingPanel(!showStyleMappingPanel)}>
                                                            Customize text style mapping
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="pb-20 relative">
                                    <div 
                                        ref={previewContainerRef}
                                        className="relative"
                                        style={{ 
                                            width: previewWidth >= 9999 ? '100%' : `${previewWidth}px`,
                                            maxWidth: previewWidth >= 9999 ? '1400px' : '100%',
                                            margin: '0 auto',
                                        }}
                                    >
                                        {isResponsiveMode && (previewTab === 'examples' || previewTab === 'dashboard' || previewTab === 'landing' || previewTab === 'article') && (
                                            <>
                                                {/* Left resize handle */}
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleResizeStart(e, 'left');
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    className="absolute -left-5 w-10 h-10 rounded-full border shadow-md hover:shadow-lg cursor-ew-resize z-[100] flex items-center justify-center transition-all group"
                                                    style={{ 
                                                        cursor: 'ew-resize',
                                                        backgroundColor: 'rgba(247, 254, 231, 0.9)',
                                                        borderColor: 'rgba(0, 0, 0, 0.15)',
                                                        pointerEvents: 'auto',
                                                        top: '400px',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(217, 249, 157, 0.9)';
                                                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(247, 254, 231, 0.9)';
                                                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                                                    }}
                                                    aria-label="Resize left"
                                                >
                                                    <MoveHorizontal className="h-5 w-5 text-lime-700 group-hover:text-lime-800 pointer-events-none" />
                                                </button>
                                                {/* Right resize handle */}
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleResizeStart(e, 'right');
                                                    }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    className="absolute -right-5 w-10 h-10 rounded-full border shadow-md hover:shadow-lg cursor-ew-resize z-[100] flex items-center justify-center transition-all group"
                                                    style={{ 
                                                        cursor: 'ew-resize',
                                                        backgroundColor: 'rgba(247, 254, 231, 0.9)',
                                                        borderColor: 'rgba(0, 0, 0, 0.15)',
                                                        pointerEvents: 'auto',
                                                        top: '400px',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(217, 249, 157, 0.9)';
                                                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(247, 254, 231, 0.9)';
                                                        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                                                    }}
                                                    aria-label="Resize right"
                                                >
                                                    <MoveHorizontal className="h-5 w-5 text-lime-700 group-hover:text-lime-800 pointer-events-none" />
                                                </button>
                                            </>
                                        )}
                                    <TabsContent value="examples" className="mt-0 border-none p-0 outline-none">
                                            <ExamplesPreview steps={steps} config={config} styleMappings={styleMappings} containerWidth={previewWidth} />
                                    </TabsContent>
                                    <TabsContent value="dashboard" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                    <DashboardPreview steps={steps} config={config} styleMappings={styleMappings} containerWidth={previewWidth} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="landing" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                    <LandingPreview steps={steps} config={config} styleMappings={styleMappings} containerWidth={previewWidth} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="article" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                    <ArticlePreview steps={steps} config={config} styleMappings={styleMappings} containerWidth={previewWidth} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    </div>
                                </div>
                             </Tabs>
                         )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer with Reference Links */}
        <footer className="sticky bottom-0 px-6 shrink-0 border-t border-gray-100 z-20" style={{ paddingTop: '12px' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <span style={{ color: 'oklch(55.6% 0 0)' }}>Reference:</span>
              <a
                href="https://spencermortensen.com/articles/typographic-scale/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: 'oklch(55.6% 0 0)' }}
              >
                The typographic scale
              </a>
              <a
                href="https://24ways.org/2011/composing-the-new-canon"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: 'oklch(55.6% 0 0)' }}
              >
                Composing the New Canon
              </a>
              <a
                href="https://typescale.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: 'oklch(55.6% 0 0)' }}
              >
                Type Scale
              </a>
              <a
                href="https://www.layoutgridcalculator.com/type-scale/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: 'oklch(55.6% 0 0)' }}
              >
                Layout Grid Calculator - Type Scale
              </a>
              <a
                href="https://www.a11yproject.com/posts/how-to-accessible-heading-structure/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
                style={{ color: 'oklch(55.6% 0 0)' }}
              >
                How to Create Accessible Heading Structure
              </a>
              <span style={{ color: 'oklch(55.6% 0 0)' }}>|</span>
              <a
                href="https://github.com/edisonliwh/type-scale-calculator"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80 flex items-center gap-1"
                style={{ color: 'oklch(55.6% 0 0)' }}
              >
                <svg width="14" height="14" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'oklch(55.6% 0 0)' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* RIGHT SIDEBAR: STYLE MAPPING - Only show when button is clicked */}
      {config.previewMode === 'landing' && showStyleMappingPanel && (previewTab === 'examples' || previewTab === 'dashboard' || previewTab === 'landing' || previewTab === 'article') && (
        <StyleMappingPanel
          styleMappings={styleMappings}
          onStyleMappingChange={handleStyleMappingChange}
          onRestoreDefaults={handleRestoreDefaults}
          availableSteps={availableStepNames}
          activeTab={previewTab}
          onClose={() => setShowStyleMappingPanel(false)}
        />
      )}
      </div>
    </div>
  );
}

// ... HeadingPreview and LandingPreview remain unchanged ...
function HeadingPreview({ 
    steps, 
    config, 
    viewMode = 'desktop',
    roundToWholeNumber = false,
    roundLineHeightToMultipleOf4 = false,
    categoryFilter = 'all'
}: { 
    steps: any[], 
    config: FluidTypeConfig, 
    viewMode?: 'desktop' | 'mobile',
    roundToWholeNumber?: boolean,
    roundLineHeightToMultipleOf4?: boolean,
    categoryFilter?: 'all' | 'heading' | 'body'
}) {
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    
    // Helper function to determine category for a step
    const getStepCategory = (stepName: string): string => {
        if (stepName.startsWith('heading-')) return 'heading';
        if (stepName.startsWith('body')) return 'body';
        // For old names, map them
        if (['display', 'xxxl', 'xxl', 'xl', 'lg', 'md'].includes(stepName)) return 'heading';
        if (['base', 'sm'].includes(stepName)) return 'body';
        return 'other';
    };
    
    // Sort steps - for Shadcn, show by category (body, heading), then by size
    // For regular fluid type, group by category, then reverse to show largest first
    const categoryOrder = { heading: 1, body: 0 };
    
    const sortedSteps = isShadcn
        ? [...steps].sort((a, b) => {
            const catDiff = (categoryOrder[a.category as keyof typeof categoryOrder] || 999) - 
                           (categoryOrder[b.category as keyof typeof categoryOrder] || 999);
            if (catDiff !== 0) return catDiff;
            return (b.fontSize || b.minSize) - (a.fontSize || a.minSize); // Largest first within category
          })
        : [...steps].sort((a, b) => {
            const aCat = getStepCategory(a.name);
            const bCat = getStepCategory(b.name);
            const catDiff = (categoryOrder[aCat as keyof typeof categoryOrder] || 999) - 
                           (categoryOrder[bCat as keyof typeof categoryOrder] || 999);
            if (catDiff !== 0) return catDiff;
            return (b.minSize || 0) - (a.minSize || 0); // Largest first within category
          });
    
    const getHeadingStyle = (step: any) => {
        // If using Shadcn preset, use the step's own properties
        if (isShadcn) {
            return {
                fontWeight: step.fontWeight || config.fontWeight,
                lineHeight: step.lineHeight || config.lineHeight,
                letterSpacing: `${step.letterSpacing || 0}em`,
            };
        }
        
        const isBody = step.name === config.baseStep || step.name === 'body' || step.name === 'body-sm' || step.name === 'body-lg';
        if (isBody) return {}; // Use inherited body styles

        return {
            fontFamily: config.headingFontFamily === 'inherit' ? 'inherit' : `"${config.headingFontFamily}", sans-serif`,
            fontWeight: config.headingFontWeight,
            lineHeight: config.headingLineHeight,
            letterSpacing: `${config.headingLetterSpacing}em`,
            color: config.headingColor === 'inherit' ? 'inherit' : config.headingColor,
        };
    };
    
    // Group steps by category for both Shadcn and fluid type, excluding labels
    const groupedSteps = sortedSteps.reduce((acc, step) => {
        const category = isShadcn 
            ? (step.category || 'other')
            : getStepCategory(step.name);
        // Filter out label category
        if (category === 'label') return acc;
        if (!acc[category]) acc[category] = [];
        acc[category].push(step);
        return acc;
    }, {} as Record<string, typeof sortedSteps>);
    
    // Sort the grouped steps by category order to ensure heading is first
    const sortedGroupedSteps = Object.entries(groupedSteps).sort(([aCat], [bCat]) => {
        const aOrder = categoryOrder[aCat as keyof typeof categoryOrder] ?? 999;
        const bOrder = categoryOrder[bCat as keyof typeof categoryOrder] ?? 999;
        return aOrder - bOrder;
    });

    const categoryLabels: Record<string, string> = {
        heading: "heading",
        body: "body"
    };

    const styleDescriptions: Record<string, string> = {
        "heading-1": "Primary page title for marketing surfaces. Used on standalone marketing content such as upsell flows, feature promotions, or campaign landing pages.",
        "heading-2": "Used as the largest attention-grabbing heading on product pages, such as welcome states and onboarding.",
        "heading-3": "Default page title for core product pages. Establishes the main context of a screen within the app.",
        "heading-4": "Default card title on product pages. Used to label content sections and data groups for quick visual scanning.",
        "heading-5": "Default title for overlays and guided experiences such as modals, popups, and side panels. Frames the intent of the user flow.",
        "heading-6": "Section or group title within dense interfaces. Used to separate clusters of related elements and reinforce visual hierarchy for scannability.",
        "body": "Primary text style for standard UI content. Used across most components for labels, descriptions, and general reading.",
        "body-sm": "Supporting text for secondary information. Used for helper text, captions, metadata, and components with limited space.",
        "body-lg": "Emphasized body text for content that requires attention. Used for highlights, callouts, and important inline messages."
    };

    // Filter grouped steps based on categoryFilter
    const filteredGroupedSteps = categoryFilter === 'all' 
        ? sortedGroupedSteps
        : sortedGroupedSteps.filter(([category]) => category === categoryFilter);

    return (
        <div 
            className="space-y-12"
            style={viewMode === 'mobile' ? { maxWidth: `${config.minWidth}px` } : {}}
        >
            {filteredGroupedSteps.map(([category, categorySteps]) => (
                <div key={category} className="space-y-8">
                    {categoryLabels[category] && (
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'oklch(70.8% 0 0)' }}>
                                {categoryLabels[category]}
                            </h3>
                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
                        </div>
                    )}
                    {(() => {
                        const typedCategorySteps = categorySteps as typeof sortedSteps;
                        return typedCategorySteps.map((step: any, i: number) => (
                            <div key={step.name}>
                                <div className="group relative">
                                    <div className="flex flex-col gap-2">
                                         <div className="flex items-center gap-3 text-xs font-mono select-none text-gray-600">
                                             <span className="uppercase tracking-wider font-bold transition-colors group-hover:text-[oklch(70.5%_0.213_47.604)]">{step.name}</span>
                                             <span>•</span>
                                             <span className="flex items-center gap-1.5">
                                                {isShadcn
                                                    ? (() => {
                                                        const fontSizePx = step.fontSize;
                                                        const fontSizeRem = Number((step.fontSize / config.remValue).toFixed(3));
                                                        const lineHeightValue = step.lineHeight || config.lineHeight;
                                                        const lineHeightPx = step.fontSize * lineHeightValue;
                                                        const fontSizePxDisplay = roundToWholeNumber ? Math.round(fontSizePx).toString() : Number(fontSizePx.toFixed(3));
                                                        let lineHeightPxDisplay;
                                                        if (roundLineHeightToMultipleOf4) {
                                                            lineHeightPxDisplay = Math.round(lineHeightPx / 4) * 4;
                                                        } else if (roundToWholeNumber) {
                                                            lineHeightPxDisplay = Math.round(lineHeightPx).toString();
                                                        } else {
                                                            lineHeightPxDisplay = Number(lineHeightPx.toFixed(3));
                                                        }
                                                        return (
                                                            <>
                                                                <svg width="16" height="16" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7476 11.2629C18.3663 9.91744 20.3476 9.96407 20.8755 11.3979L23.9421 19.7089C24.1213 20.1975 23.8709 20.7401 23.3823 20.9218C22.8937 21.101 22.3511 20.8506 22.1719 20.362L21.4697 18.4593H17.0994L16.3997 20.362C16.218 20.8506 15.6755 21.101 15.1868 20.9218C14.6983 20.7401 14.4478 20.1975 14.6295 19.7089L17.6936 11.3979L17.7476 11.2629ZM17.7942 16.5734H20.7749L19.2846 12.5273L17.7942 16.5734Z" fill="currentColor"/>
                                                                    <path d="M7.15816 5.45841C7.85299 3.51386 10.6028 3.51386 11.3 5.45841L13.8878 12.689C14.0621 13.18 13.8068 13.7202 13.3182 13.8945C12.8272 14.0688 12.287 13.8135 12.1127 13.3249L9.52491 6.09432C9.42425 5.81443 9.03142 5.81443 8.93321 6.09432L5.62853 15.3261H11.742C12.2625 15.3261 12.6848 15.7484 12.6848 16.2689C12.6848 16.7894 12.2625 17.2117 11.742 17.2117H4.95324L3.83119 20.3519C3.65442 20.8405 3.11429 21.0958 2.62322 20.9215C2.13464 20.7447 1.87929 20.2046 2.05607 19.716L7.15816 5.45841Z" fill="currentColor"/>
                                                                </svg>
                                                                <span>{fontSizePxDisplay}px/{fontSizeRem}rem;</span>
                                                                <svg width="16" height="16" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                    <path d="M21.8974 22.3077C22.3646 22.3077 22.7436 22.6867 22.7436 23.1538C22.7436 23.621 22.3646 24 21.8974 24H3.84615C3.37901 24 3 23.621 3 23.1538C3 22.6867 3.37901 22.3077 3.84615 22.3077H21.8974Z" fill="currentColor"/>
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.0255 7.64104C11.6667 5.93553 14.0796 5.93553 14.7208 7.64104L18.74 18.3438C18.9053 18.7823 18.6849 19.2692 18.2464 19.4323C17.8079 19.5976 17.321 19.3772 17.1579 18.9387L16.0914 16.1028H9.65272L8.58623 18.9387C8.42317 19.3772 7.93621 19.5976 7.49768 19.4323C7.05918 19.2692 6.83881 18.7823 7.00409 18.3438L11.0255 7.64104ZM13.1364 8.2382C13.0439 7.99361 12.7001 7.99361 12.6076 8.2382L10.2873 14.41H15.4568L13.1364 8.2382Z" fill="currentColor"/>
                                                                    <path d="M21.8974 2C22.3646 2 22.7436 2.37901 22.7436 2.84615C22.7436 3.3133 22.3646 3.69231 21.8974 3.69231H3.84615C3.37901 3.69231 3 3.3133 3 2.84615C3 2.37901 3.37901 2 3.84615 2H21.8974Z" fill="currentColor"/>
                                                                </svg>
                                                                <span>{Number(lineHeightValue.toFixed(3))}/{lineHeightPxDisplay}px</span>
                                                            </>
                                                        );
                                                    })()
                                                    : (() => {
                                                        const size = viewMode === 'desktop' ? step.maxSize : step.minSize;
                                                        const fontSizePx = size;
                                                        const fontSizeRem = Number((size / config.remValue).toFixed(3));
                                                        const isHeading = step.name.startsWith('heading-');
                                                        const lineHeightValue = isHeading ? config.headingLineHeight : config.lineHeight;
                                                        const lineHeightPx = size * lineHeightValue;
                                                        const fontSizePxDisplay = roundToWholeNumber ? Math.round(fontSizePx).toString() : Number(fontSizePx.toFixed(3));
                                                        let lineHeightPxDisplay;
                                                        if (roundLineHeightToMultipleOf4) {
                                                            lineHeightPxDisplay = Math.round(lineHeightPx / 4) * 4;
                                                        } else if (roundToWholeNumber) {
                                                            lineHeightPxDisplay = Math.round(lineHeightPx).toString();
                                                        } else {
                                                            lineHeightPxDisplay = Number(lineHeightPx.toFixed(3));
                                                        }
                                                        return (
                                                            <>
                                                                <svg width="16" height="16" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7476 11.2629C18.3663 9.91744 20.3476 9.96407 20.8755 11.3979L23.9421 19.7089C24.1213 20.1975 23.8709 20.7401 23.3823 20.9218C22.8937 21.101 22.3511 20.8506 22.1719 20.362L21.4697 18.4593H17.0994L16.3997 20.362C16.218 20.8506 15.6755 21.101 15.1868 20.9218C14.6983 20.7401 14.4478 20.1975 14.6295 19.7089L17.6936 11.3979L17.7476 11.2629ZM17.7942 16.5734H20.7749L19.2846 12.5273L17.7942 16.5734Z" fill="currentColor"/>
                                                                    <path d="M7.15816 5.45841C7.85299 3.51386 10.6028 3.51386 11.3 5.45841L13.8878 12.689C14.0621 13.18 13.8068 13.7202 13.3182 13.8945C12.8272 14.0688 12.287 13.8135 12.1127 13.3249L9.52491 6.09432C9.42425 5.81443 9.03142 5.81443 8.93321 6.09432L5.62853 15.3261H11.742C12.2625 15.3261 12.6848 15.7484 12.6848 16.2689C12.6848 16.7894 12.2625 17.2117 11.742 17.2117H4.95324L3.83119 20.3519C3.65442 20.8405 3.11429 21.0958 2.62322 20.9215C2.13464 20.7447 1.87929 20.2046 2.05607 19.716L7.15816 5.45841Z" fill="currentColor"/>
                                                                </svg>
                                                                <span>{fontSizePxDisplay}px/{fontSizeRem}rem;</span>
                                                                <svg width="16" height="16" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                    <path d="M21.8974 22.3077C22.3646 22.3077 22.7436 22.6867 22.7436 23.1538C22.7436 23.621 22.3646 24 21.8974 24H3.84615C3.37901 24 3 23.621 3 23.1538C3 22.6867 3.37901 22.3077 3.84615 22.3077H21.8974Z" fill="currentColor"/>
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.0255 7.64104C11.6667 5.93553 14.0796 5.93553 14.7208 7.64104L18.74 18.3438C18.9053 18.7823 18.6849 19.2692 18.2464 19.4323C17.8079 19.5976 17.321 19.3772 17.1579 18.9387L16.0914 16.1028H9.65272L8.58623 18.9387C8.42317 19.3772 7.93621 19.5976 7.49768 19.4323C7.05918 19.2692 6.83881 18.7823 7.00409 18.3438L11.0255 7.64104ZM13.1364 8.2382C13.0439 7.99361 12.7001 7.99361 12.6076 8.2382L10.2873 14.41H15.4568L13.1364 8.2382Z" fill="currentColor"/>
                                                                    <path d="M21.8974 2C22.3646 2 22.7436 2.37901 22.7436 2.84615C22.7436 3.3133 22.3646 3.69231 21.8974 3.69231H3.84615C3.37901 3.69231 3 3.3133 3 2.84615C3 2.37901 3.37901 2 3.84615 2H21.8974Z" fill="currentColor"/>
                                                                </svg>
                                                                <span>{Number(lineHeightValue.toFixed(3))}/{lineHeightPxDisplay}px</span>
                                                            </>
                                                        );
                                                    })()
                                                }
                                             </span>
                                         </div>
                                         
                                        {styleDescriptions[step.name] && (
                                            <p 
                                                className="text-gray-600 font-mono"
                                                style={{ 
                                                    fontSize: '11px',
                                                    lineHeight: '1.5',
                                                    opacity: 0.9
                                                }}
                                            >
                                                {styleDescriptions[step.name]}
                                            </p>
                                        )}
                                         
                                         <p 
                                            contentEditable
                                            suppressContentEditableWarning
                                            className="outline-none empty:before:content-['Type_something...'] empty:before:text-gray-600"
                                            style={{ 
                                                fontSize: (() => {
                                                    // For mobile view, always use minSize calculated from responsive settings
                                                    if (viewMode === 'mobile') {
                                                        // For Shadcn, minSize equals fontSize (fixed), but we still use it
                                                        if (step.minSize !== undefined) {
                                                            return config.useRems 
                                                                ? `${(step.minSize / config.remValue).toFixed(config.decimals)}rem`
                                                                : `${step.minSize.toFixed(config.decimals)}px`;
                                                        }
                                                        // Fallback for Shadcn if minSize not set
                                                        if (isShadcn && step.fontSize) {
                                                            return `${step.fontSize}px`;
                                                        }
                                                    }
                                                    // For desktop view, use clamp for fluid scaling
                                                    return step.clamp;
                                                })(),
                                                maxWidth: '25ch',
                                                marginTop: '12px',
                                                ...getHeadingStyle(step)
                                            }}
                                        >
                                             {i === 0 ? "The quick brown fox jumps over the lazy dog" : 
                                              i === 1 ? "Visual hierarchy is crucial for readability" :
                                              i === 2 ? "Fluid typography scales gracefully" :
                                              "Almost before we knew it, we had left the ground."}
                                        </p>
                                    </div>
                                </div>
                                {i < typedCategorySteps.length - 1 && (
                                    <div className="h-px my-8" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
                                )}
                            </div>
                        ));
                    })()}
                </div>
            ))}
        </div>
    );
}

function ArticlePreview({ steps, config, styleMappings = {}, containerWidth = 1440 }: { steps: any[], config: FluidTypeConfig, styleMappings?: StyleMappings, containerWidth?: number }) {
  const isBelowMd = containerWidth < 768; // md breakpoint
    // Helper to get step name for an element, using mapping or default
    const getStepName = (elementId: string, defaultStep: string) => {
        return (styleMappings[elementId as keyof StyleMappings] as string) || defaultStep;
    };
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    
    const getStyle = (stepName: string) => {
        const mappedStepName = isShadcn && STEP_NAME_MAP[stepName] ? STEP_NAME_MAP[stepName] : stepName;
        const step = steps.find(s => s.name === mappedStepName);
        if (!step) return {};

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

    return (
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            <div className="space-y-8 px-8 pt-10 pb-12 max-w-3xl mx-auto">
                <article>
                    <TextWithTooltip stepName={getStepName("article-title", "heading-1")} as="h1" style={getStyle(getStepName("article-title", "heading-1"))} className="mb-4">
                        The silent symphony of type and sound
                    </TextWithTooltip>

                    <div className="mb-8 pb-6 border-b border-gray-200" style={getStyle(getStepName("article-meta", "body-sm"))}>
                        <TextWithTooltip stepName={getStepName("article-meta", "body-sm")} as="p" className="text-gray-600">
                            By <span className="font-medium text-gray-900">Owen Gregory</span> • Source: <a href="https://24ways.org/2011/composing-the-new-canon" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">24 ways: Composing the New Canon</a>
                        </TextWithTooltip>
                    </div>

                    <TextWithTooltip stepName={getStepName("article-heading-2", "heading-3")} as="h2" style={getStyle(getStepName("article-heading-2", "heading-3"))} className="mb-6">
                        A world where letters breathe like music
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        The page as a musical staff
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        In a quiet atelier where letters live like notes on a staff, the realm of typography hums with invisible music. Every lowercase "a," every bold headline and tiny footnote is a single tone, waiting to be woven into a chord. In this world, the text on the page is the melody, and the layout is its harmony.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Margins as rests and breath
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        Margins are not emptiness. They are the pauses between phrases. Just as a musician must breathe between measures, a reader needs silence between blocks of meaning. Left margins steady the rhythm. Bottom margins let the final note linger.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Line length as melodic phrasing
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-8">
                        A short line cuts like staccato. A long line stretches like legato. The measure of a paragraph determines whether the eye dances quickly or glides slowly. Good line length does not shout. It sings.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-2", "heading-3")} as="h2" style={getStyle(getStepName("article-heading-2", "heading-3"))} className="mb-6">
                        Harmony through proportion
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Ratios as musical intervals
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        In this atelier, designers do not choose font size or margin at random. They reach into the lineage of music: ratios like 2:3, 3:4, 3:5, 1:2. They treat these not as abstract numbers, but as living intervals.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Type scale as chord progression
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        When body text breathes at a 2:3 rhythm, it becomes a perfect fifth. A heading that doubles in size becomes an octave. A caption at three-quarters of the base size becomes a perfect fourth. The typographic scale stops being mechanical and starts behaving like harmony in motion.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Vertical rhythm as time signature
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-8">
                        Line height, spacing between paragraphs, and spacing between sections form a time signature for the page. Too tight and the music rushes. Too loose and the song loses tension. Good rhythm makes time feel natural.
                    </TextWithTooltip>

                    <blockquote className="my-8 pl-6 border-l-4 border-gray-300">
                        <TextWithTooltip stepName={getStepName("article-blockquote", "body-lg")} as="p" style={getStyle(getStepName("article-blockquote", "body-lg"))} className="mb-2 italic">
                            "Proportion is not decoration. It is structure that the eye can hear."
                        </TextWithTooltip>
                        <TextWithTooltip stepName={getStepName("article-meta", "body-sm")} as="p" style={getStyle(getStepName("article-meta", "body-sm"))} className="text-gray-600">
                            anonymous designer
                        </TextWithTooltip>
                    </blockquote>

                    <TextWithTooltip stepName={getStepName("article-heading-2", "heading-3")} as="h2" style={getStyle(getStepName("article-heading-2", "heading-3"))} className="mb-6">
                        Devices as instruments
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Screen size as resonance chamber
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        A narrow phone compresses the sound. A wide desktop lets it expand. The same composition vibrates differently inside different physical containers, just like the same melody played in a small room versus a cathedral.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Orientation as key change
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        Portrait and landscape are not just rotations. They are modulations. The same content shifts emotional weight when the axis changes. What felt intimate becomes expansive. What felt commanding becomes personal.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Responsive design as changing tempo
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-8">
                        Breakpoints are tempo changes. The rhythm tightens on small screens and relaxes on larger ones. The challenge is not to freeze the design, but to let it breathe without breaking the song.
                    </TextWithTooltip>

                    <blockquote className="my-8 pl-6 border-l-4 border-gray-300">
                        <TextWithTooltip stepName={getStepName("article-blockquote", "body-lg")} as="p" style={getStyle(getStepName("article-blockquote", "body-lg"))} className="mb-2 italic">
                            "A good composition survives the change of instruments."
                        </TextWithTooltip>
                        <TextWithTooltip stepName={getStepName("article-meta", "body-sm")} as="p" style={getStyle(getStepName("article-meta", "body-sm"))} className="text-gray-600">
                            adapted from musical theory
                        </TextWithTooltip>
                    </blockquote>

                    <TextWithTooltip stepName={getStepName("article-heading-2", "heading-3")} as="h2" style={getStyle(getStepName("article-heading-2", "heading-3"))} className="mb-6">
                        Dissonance and emotional gravity
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        When layout becomes noise
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        A cramped line height becomes a rushed tempo. A headline pressed too close to body text becomes a collision of sounds. The layout still functions, but it no longer flows. The page begins to shout instead of speak.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Visual clutter as harmonic distortion
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        Too many weights, too many sizes, too many colors collapse into visual distortion. The eye cannot separate voices. The melody disappears into static.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Tuned silence as emotional control
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-8">
                        White space calibrated with care becomes emotional gravity. It slows the reader without force. It gives seriousness weight and gives lightness air. Silence, once tuned, becomes expressive.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-2", "heading-3")} as="h2" style={getStyle(getStepName("article-heading-2", "heading-3"))} className="mb-6">
                        The reader as the final listener
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Perception without awareness
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        The reader never measures ratios. The reader never names intervals. They only feel balance. They scroll. They pause. They breathe between sections without realizing the layout is guiding them.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Reading as a temporal act
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-6">
                        Typography unfolds in time, not space. Meaning is not consumed all at once. It is played. The reader passes through introduction, tension, resolution, and release just like a listener moves through movements in a piece of music.
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-heading-3", "heading-6")} as="h5" style={getStyle(getStepName("article-heading-3", "heading-6"))} className="mb-4">
                        Memory as the echo of design
                    </TextWithTooltip>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-8">
                        When the page is closed, something remains. Not the text. Not the pixels. But the sensation of ease, clarity, or strain. The emotional residue of rhythm.
                    </TextWithTooltip>

                    <blockquote className="my-8 pl-6 border-l-4 border-gray-300">
                        <TextWithTooltip stepName={getStepName("article-blockquote", "body-lg")} as="p" style={getStyle(getStepName("article-blockquote", "body-lg"))} className="mb-2 italic">
                            "The reader hears with their eyes."
                        </TextWithTooltip>
                        <TextWithTooltip stepName={getStepName("article-meta", "body-sm")} as="p" style={getStyle(getStepName("article-meta", "body-sm"))} className="text-gray-600">
                            typographic folklore
                        </TextWithTooltip>
                    </blockquote>

                    <TextWithTooltip stepName={getStepName("article-body", "body")} as="p" style={getStyle(getStepName("article-body", "body"))} className="mb-8">
                        The tab closes. The sound stops. But something lingers — a faint afterimage of rhythm, a soft memory of harmony. The page is gone, yet its resonance remains.
                    </TextWithTooltip>
                </article>
            </div>
        </TooltipProvider>
    );
}

function LandingPreview({ steps, config, styleMappings = {}, containerWidth = 1440 }: { steps: any[], config: FluidTypeConfig, styleMappings?: StyleMappings, containerWidth?: number }) {
  const isBelowMd = containerWidth < 768; // md breakpoint
    // Helper to get step name for an element, using mapping or default
    const getStepName = (elementId: string, defaultStep: string) => {
        return (styleMappings[elementId as keyof StyleMappings] as string) || defaultStep;
    };
    const isShadcn = config.maxRatio === "shadcn" || config.minRatio === "shadcn";
    
    const getStyle = (stepName: string) => {
        const mappedStepName = isShadcn && STEP_NAME_MAP[stepName] ? STEP_NAME_MAP[stepName] : stepName;
        const step = steps.find(s => s.name === mappedStepName);
        if (!step) return {};

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

    return (
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            <div className="space-y-24 px-8 pt-4 pb-12">
                 <section className="space-y-6">
                     <TextWithTooltip stepName={getStepName("landing-badge", "body-sm")} style={getStyle(getStepName("landing-badge", "body-sm"))} className="uppercase tracking-widest font-bold text-gray-600">
                         Introducing Fluid Scale
                     </TextWithTooltip>
                     <TextWithTooltip stepName={getStepName("landing-heading", "heading-1")} as="h1" style={{ ...getStyle(getStepName("landing-heading", "heading-1")), fontWeight: config.headingFontWeight }}>
                         Typography that adapts to every device.
                     </TextWithTooltip>
                     <TextWithTooltip stepName={getStepName("landing-description", "body-lg")} as="p" style={{ ...getStyle(getStepName("landing-description", "body-lg")), maxWidth: '45ch', opacity: 0.8 }}>
                         Create beautiful, responsive type scales that work seamlessly across mobile, tablet, and desktop screens without a single media query.
                     </TextWithTooltip>
                     <div className="flex flex-wrap gap-4 pt-4">
                         <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-gray-800" style={getStyle(getStepName("landing-button-primary", "body"))}>
                             <TextWithTooltip stepName={getStepName("landing-button-primary", "body")}>Get Started</TextWithTooltip>
                         </Button>
                         <Button size="lg" variant="outline" className="rounded-full px-8 border-gray-300 text-gray-700" style={getStyle(getStepName("landing-button-secondary", "body"))}>
                             <TextWithTooltip stepName={getStepName("landing-button-secondary", "body")}>View Documentation</TextWithTooltip>
                         </Button>
                     </div>
                 </section>

             <section className={`grid ${isBelowMd ? 'grid-cols-1' : 'md:grid-cols-3'} gap-12`}>
                 {[
                     { title: "Responsive", icon: Monitor, text: "Set your minimum and maximum font sizes, and let CSS clamp() handle the math. Your text will scale perfectly." },
                     { title: "Modular", icon: Type, text: "Choose from standard musical scales like Minor Third or Golden Ratio to ensure harmonious relationships." },
                     { title: "Export Ready", icon: Code, text: "Copy the generated CSS variables and paste them straight into your project. Zero dependencies." }
                 ].map((feature) => (
                     <div key={feature.title} className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                             <feature.icon className="w-6 h-6 text-gray-900" />
                         </div>
                         <TextWithTooltip stepName={getStepName("landing-feature-title", "heading-5")} as="h3" style={getStyle(getStepName("landing-feature-title", "heading-5"))}>
                             {feature.title}
                         </TextWithTooltip>
                         <TextWithTooltip stepName={getStepName("landing-feature-description", "body")} as="p" style={getStyle(getStepName("landing-feature-description", "body"))} className="text-gray-600 leading-relaxed">
                             {feature.text}
                         </TextWithTooltip>
                     </div>
                 ))}
             </section>
             
             <section className="border-t border-gray-200/50 pt-24">
                 <div className={`grid ${isBelowMd ? 'grid-cols-1' : 'md:grid-cols-2'} gap-16`}>
                     <div className="space-y-6">
                        <TextWithTooltip stepName={getStepName("landing-heading-2", "heading-2")} as="h2" style={getStyle(getStepName("landing-heading-2", "heading-2"))}>
                            Stop fighting with breakpoints
                        </TextWithTooltip>
                         <TextWithTooltip stepName={getStepName("landing-description", "body")} as="p" style={getStyle(getStepName("landing-description", "body"))} className="text-gray-600 leading-relaxed">
                             Traditional responsive typography requires manually setting font sizes at multiple breakpoints. This is tedious and often results in "jumpy" resizing. Fluid typography uses mathematical interpolation to scale smoothly.
                         </TextWithTooltip>
                         <ul className="space-y-3 pt-4">
                             {[
                                 "Smooth scaling between viewports",
                                 "No complex media queries",
                                 "Accessible and user-friendly",
                                 "Works with any design system"
                             ].map(item => (
                                 <li key={item} className="flex items-center gap-3" style={getStyle(getStepName("landing-feature-description", "body-sm"))}>
                                     <Check className="w-5 h-5 text-green-600 shrink-0" />
                                     <TextWithTooltip stepName={getStepName("landing-feature-description", "body-sm")} className="text-gray-700">
                                         {item}
                                     </TextWithTooltip>
                                 </li>
                             ))}
                         </ul>
                     </div>
                     <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center border-2 border-dashed border-gray-200">
                         <TextWithTooltip stepName={getStepName("landing-description", "body-sm")} style={getStyle(getStepName("landing-description", "body-sm"))} className="text-gray-600 font-mono">
                             Visual Placeholder
                         </TextWithTooltip>
                     </div>
                 </div>
             </section>
         </div>
        </TooltipProvider>
    );
}
