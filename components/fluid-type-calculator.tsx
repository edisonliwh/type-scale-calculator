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
  Github
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
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
  decimals: 2,
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
  const mainContentRef = React.useRef<HTMLElement | null>(null);

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


  // Calculate steps - use Shadcn styles if selected, otherwise use fluid calculation
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
    return calculateFluidType(config);
  }, [config]);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper for scale select items to handle custom values if needed (simplified for now)
  const renderScaleOptions = () => {
      return RATIOS.map((r) => (
        <SelectItem key={r.name} value={r.value.toString()}>
            {typeof r.value === 'number' ? `${r.value.toFixed(3)} – ${r.name}` : r.name}
        </SelectItem>
      ));
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
              <span className={cn(
                  "font-title font-bold text-xs uppercase tracking-wider transform rotate-90 whitespace-nowrap",
                  config.previewMode === 'blog' ? "text-indigo-700" : "text-indigo-600"
              )}>
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
              <span className={cn(
                  "font-title font-bold text-xs uppercase tracking-wider transform rotate-90 whitespace-nowrap",
                  config.previewMode === 'landing' ? "text-lime-700" : "text-lime-600"
              )}>
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
             <span className="font-semibold text-base text-gray-900 font-title type-scale-animated" style={{ textShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 15px' }}>
                 {"TYPE SCALE".split("").map((char, i) => (
                     <span key={`${config.previewMode}-${i}`} className="type-scale-char" style={{ animationDelay: `${i * 0.03}s` }}>
                         {char === " " ? "\u00A0" : char}
                     </span>
                 ))}
             </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
          
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
                        <p className="text-xs text-gray-500 mt-1 text-right">{(config.maxFontSize / config.remValue).toFixed(2)}rem</p>
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

          {/* SECTION: RESPONSIVE */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'oklch(0.708 0 0)' }}>Responsive</h3>
            
            <div className="grid gap-3">
                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Min-width</Label>
                    <div className="relative flex-1 min-w-0">
                        <Input 
                            type="number" 
                            value={config.minWidth}
                            onChange={(e) => handleInputChange("minWidth", Number(e.target.value))}
                            className="bg-white border-gray-200 pr-8 h-9 focus-visible:ring-gray-400 w-full"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">px</span>
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

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0">Color</Label>
                    <div className="flex gap-2 h-9 flex-1 min-w-0">
                        <div className="w-full relative bg-white border border-gray-200 rounded-md overflow-hidden flex items-center px-2 min-w-0 shadow-xs">
                             <span className="text-xs font-mono truncate flex-1 text-gray-600 min-w-0">{config.color}</span>
                             <div className="w-5 h-5 border rounded-full overflow-hidden shrink-0 ml-2 relative shadow-inner">
                                <input 
                                    type="color" 
                                    value={config.color}
                                    onChange={(e) => handleInputChange("color", e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: config.color }} />
                             </div>
                        </div>
                    </div>
                </div>

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm font-medium text-gray-700 w-[100px] shrink-0">Background</Label>
                     <div className="flex gap-2 h-9 flex-1 min-w-0">
                        <div className="w-full relative bg-white border border-gray-200 rounded-md overflow-hidden flex items-center px-2 min-w-0 shadow-xs">
                             <span className="text-xs font-mono truncate flex-1 text-gray-600 min-w-0">{config.backgroundColor}</span>
                             <div className="w-5 h-5 border rounded-full overflow-hidden shrink-0 ml-2 relative shadow-inner">
                                <input 
                                    type="color" 
                                    value={config.backgroundColor}
                                    onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: config.backgroundColor }} />
                             </div>
                        </div>
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

                 <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-3 items-center">
                    <Label className="text-sm text-gray-600 w-[100px] shrink-0">Color</Label>
                    <div className="flex gap-2 h-9 flex-1 min-w-0">
                        <div className="w-full relative bg-white border border-gray-200 rounded-md overflow-hidden flex items-center px-2 min-w-0 shadow-xs">
                             <span className="text-xs font-mono truncate flex-1 text-gray-600 min-w-0">
                                 {config.headingColor === 'inherit' ? 'inherit' : config.headingColor}
                             </span>
                             <div className="w-5 h-5 border rounded-full overflow-hidden shrink-0 ml-2 relative shadow-inner">
                                <input 
                                    type="color" 
                                    value={config.headingColor === 'inherit' ? '#000000' : config.headingColor}
                                    onChange={(e) => handleInputChange("headingColor", e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="w-full h-full" style={{ backgroundColor: config.headingColor === 'inherit' ? 'transparent' : config.headingColor }} />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </aside>

      {/* RIGHT MAIN: PREVIEW */}
      <main ref={mainContentRef} className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Snake Background - Only in main content area */}
        <SnakeBackground containerRef={mainContentRef} enabled={crabEnabled} onToggle={setCrabEnabled} />
         {/* Content Area */}
         <div className="flex-1 relative z-10 flex flex-col h-full w-full min-h-0">
             
             <div className="flex-1 flex flex-col w-full min-h-0 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-y-auto transition-colors duration-300 custom-scrollbar"
                    style={{ color: config.color, scrollbarGutter: 'stable' }}
                >
                     <div 
                        className={cn(
                            "max-w-[1200px] mx-auto transition-all duration-300 ease-out",
                            "p-5"
                        )}
                        style={{
                            fontFamily: `"${config.fontFamily}", sans-serif`,
                            fontWeight: config.fontWeight,
                            lineHeight: config.lineHeight,
                            letterSpacing: `${config.letterSpacing}em`,
                        }}
                    >
                         {config.previewMode === 'blog' ? (
                             <>
                                 <div className="mb-12">
                                     <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'desktop' | 'mobile')} className="w-full">
                                         <TabsList className="bg-transparent p-0 gap-6">
                                             <TabsTrigger 
                                                 value="desktop" 
                                                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" 
                                                 style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}
                                             >
                                                 Desktop
                                             </TabsTrigger>
                                             <TabsTrigger 
                                                 value="mobile" 
                                                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" 
                                                 style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}
                                             >
                                                 Mobile
                                             </TabsTrigger>
                                         </TabsList>
                                     </Tabs>
                                 </div>
                                 <HeadingPreview steps={steps} config={config} viewMode={viewMode} />
                             </>
                         ) : (
                             <Tabs defaultValue="examples" className="w-full h-full">
                                <div className="mb-12">
                                    <div className="flex items-center justify-between space-y-2">
                                        <TabsList className="bg-transparent p-0 gap-6">
                                            <TabsTrigger value="examples" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Cards</TabsTrigger>
                                            <TabsTrigger value="dashboard" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Dashboard</TabsTrigger>
                                            <TabsTrigger value="tasks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Tasks</TabsTrigger>
                                            <TabsTrigger value="landing" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Landing</TabsTrigger>
                                            <TabsTrigger value="article" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none p-0 font-medium text-base transition-none hover:text-foreground font-title" style={{ textShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px' }}>Article</TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>
                                <div className="pb-20">
                                    <TabsContent value="examples" className="mt-0 border-none p-0 outline-none">
                                        <ExamplesPreview steps={steps} config={config} />
                                    </TabsContent>
                                    <TabsContent value="dashboard" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                <DashboardPreview steps={steps} config={config} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="tasks" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                <TasksPreview steps={steps} config={config} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="landing" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                <LandingPreview steps={steps} config={config} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="article" className="mt-0 border-none p-0 outline-none">
                                        <Card>
                                            <CardContent className="p-0">
                                                <ArticlePreview steps={steps} config={config} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </div>
                             </Tabs>
                         )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer with Reference Links */}
        <footer className="sticky bottom-0 px-6 shrink-0 border-t border-gray-100 z-20" style={{ paddingTop: '12px' }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <span style={{ color: 'oklch(55.6% 0 0)' }}>Reference links:</span>
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
      </div>
    </div>
  );
}

// ... HeadingPreview and LandingPreview remain unchanged ...
function HeadingPreview({ steps, config, viewMode = 'desktop' }: { steps: any[], config: FluidTypeConfig, viewMode?: 'desktop' | 'mobile' }) {
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
    
    // Sort steps - for Shadcn, show by category (heading, body), then by size
    // For regular fluid type, group by category, then reverse to show largest first
    const categoryOrder = { heading: 0, body: 1 };
    
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

    return (
        <div className={`space-y-12 ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
            {sortedGroupedSteps.map(([category, categorySteps]) => (
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
                                         <div className="flex items-baseline gap-3 text-xs font-mono select-none text-gray-600">
                                             <span className="uppercase tracking-wider font-bold transition-colors group-hover:text-[oklch(70.5%_0.213_47.604)]">{step.name}</span>
                                             <span>•</span>
                                             <span>{isShadcn
                                                    ? `${(step.fontSize / config.remValue).toFixed(2)}rem / ${step.fontSize.toFixed(2)}px`
                                                    : (() => {
                                                        const size = viewMode === 'desktop' ? step.maxSize : step.minSize;
                                                        return config.useRems 
                                                            ? `${(size / config.remValue).toFixed(2)}rem / ${size.toFixed(2)}px`
                                                            : `${size.toFixed(0)}px`;
                                                    })()
                                             }</span>
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
                                                fontSize: step.clamp,
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

function ArticlePreview({ steps, config }: { steps: any[], config: FluidTypeConfig }) {
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

    return (
        <div className="space-y-8 px-8 py-12 max-w-3xl mx-auto">
            <article>
                <h1 style={getStyle('heading-1')} className="mb-4">
                    The silent symphony of type and sound
                </h1>

                <div className="mb-8 pb-6 border-b border-gray-200" style={getStyle('body-sm')}>
                    <p className="text-gray-600">
                        By <span className="font-medium text-gray-900">Owen Gregory</span> • Source: <a href="https://24ways.org/2011/composing-the-new-canon" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">24 ways: Composing the New Canon</a>
                    </p>
                </div>

                <h2 style={getStyle('heading-2')} className="mb-6">
                    A world where letters breathe like music
                </h2>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    The page as a musical staff
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    In a quiet atelier where letters live like notes on a staff, the realm of typography hums with invisible music. Every lowercase "a," every bold headline and tiny footnote is a single tone, waiting to be woven into a chord. In this world, the text on the page is the melody, and the layout is its harmony.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Margins as rests and breath
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    Margins are not emptiness. They are the pauses between phrases. Just as a musician must breathe between measures, a reader needs silence between blocks of meaning. Left margins steady the rhythm. Bottom margins let the final note linger.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Line length as melodic phrasing
                </h5>

                <p style={getStyle('body')} className="mb-8">
                    A short line cuts like staccato. A long line stretches like legato. The measure of a paragraph determines whether the eye dances quickly or glides slowly. Good line length does not shout. It sings.
                </p>

                <h2 style={getStyle('heading-2')} className="mb-6">
                    Harmony through proportion
                </h2>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Ratios as musical intervals
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    In this atelier, designers do not choose font size or margin at random. They reach into the lineage of music: ratios like 2:3, 3:4, 3:5, 1:2. They treat these not as abstract numbers, but as living intervals.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Type scale as chord progression
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    When body text breathes at a 2:3 rhythm, it becomes a perfect fifth. A heading that doubles in size becomes an octave. A caption at three-quarters of the base size becomes a perfect fourth. The typographic scale stops being mechanical and starts behaving like harmony in motion.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Vertical rhythm as time signature
                </h5>

                <p style={getStyle('body')} className="mb-8">
                    Line height, spacing between paragraphs, and spacing between sections form a time signature for the page. Too tight and the music rushes. Too loose and the song loses tension. Good rhythm makes time feel natural.
                </p>

                <blockquote className="my-8 pl-6 border-l-4 border-gray-300">
                    <p style={getStyle('body-lg')} className="mb-2 italic">
                        "Proportion is not decoration. It is structure that the eye can hear."
                    </p>
                    <p style={getStyle('body-sm')} className="text-gray-600">
                        anonymous designer
                    </p>
                </blockquote>

                <h2 style={getStyle('heading-2')} className="mb-6">
                    Devices as instruments
                </h2>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Screen size as resonance chamber
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    A narrow phone compresses the sound. A wide desktop lets it expand. The same composition vibrates differently inside different physical containers, just like the same melody played in a small room versus a cathedral.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Orientation as key change
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    Portrait and landscape are not just rotations. They are modulations. The same content shifts emotional weight when the axis changes. What felt intimate becomes expansive. What felt commanding becomes personal.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Responsive design as changing tempo
                </h5>

                <p style={getStyle('body')} className="mb-8">
                    Breakpoints are tempo changes. The rhythm tightens on small screens and relaxes on larger ones. The challenge is not to freeze the design, but to let it breathe without breaking the song.
                </p>

                <blockquote className="my-8 pl-6 border-l-4 border-gray-300">
                    <p style={getStyle('body-lg')} className="mb-2 italic">
                        "A good composition survives the change of instruments."
                    </p>
                    <p style={getStyle('body-sm')} className="text-gray-600">
                        adapted from musical theory
                    </p>
                </blockquote>

                <h2 style={getStyle('heading-2')} className="mb-6">
                    Dissonance and emotional gravity
                </h2>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    When layout becomes noise
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    A cramped line height becomes a rushed tempo. A headline pressed too close to body text becomes a collision of sounds. The layout still functions, but it no longer flows. The page begins to shout instead of speak.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Visual clutter as harmonic distortion
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    Too many weights, too many sizes, too many colors collapse into visual distortion. The eye cannot separate voices. The melody disappears into static.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Tuned silence as emotional control
                </h5>

                <p style={getStyle('body')} className="mb-8">
                    White space calibrated with care becomes emotional gravity. It slows the reader without force. It gives seriousness weight and gives lightness air. Silence, once tuned, becomes expressive.
                </p>

                <h2 style={getStyle('heading-2')} className="mb-6">
                    The reader as the final listener
                </h2>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Perception without awareness
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    The reader never measures ratios. The reader never names intervals. They only feel balance. They scroll. They pause. They breathe between sections without realizing the layout is guiding them.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Reading as a temporal act
                </h5>

                <p style={getStyle('body')} className="mb-6">
                    Typography unfolds in time, not space. Meaning is not consumed all at once. It is played. The reader passes through introduction, tension, resolution, and release just like a listener moves through movements in a piece of music.
                </p>

                <h5 style={getStyle('heading-5')} className="mb-4">
                    Memory as the echo of design
                </h5>

                <p style={getStyle('body')} className="mb-8">
                    When the page is closed, something remains. Not the text. Not the pixels. But the sensation of ease, clarity, or strain. The emotional residue of rhythm.
                </p>

                <blockquote className="my-8 pl-6 border-l-4 border-gray-300">
                    <p style={getStyle('body-lg')} className="mb-2 italic">
                        "The reader hears with their eyes."
                    </p>
                    <p style={getStyle('body-sm')} className="text-gray-600">
                        typographic folklore
                    </p>
                </blockquote>

                <p style={getStyle('body')} className="mb-8">
                    The tab closes. The sound stops. But something lingers — a faint afterimage of rhythm, a soft memory of harmony. The page is gone, yet its resonance remains.
                </p>
            </article>
        </div>
    );
}

function LandingPreview({ steps, config }: { steps: any[], config: FluidTypeConfig }) {
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

    return (
        <div className="space-y-24 px-8 py-12">
             <section className="space-y-6">
                 <span style={getStyle('body-sm')} className="uppercase tracking-widest font-bold text-gray-600">Introducing Fluid Scale</span>
                 <h1 style={{ ...getStyle('heading-1'), fontWeight: config.headingFontWeight }}>
                     Typography that adapts to every device.
                 </h1>
                 <p style={{ ...getStyle('body-lg'), maxWidth: '45ch', opacity: 0.8 }}>
                     Create beautiful, responsive type scales that work seamlessly across mobile, tablet, and desktop screens without a single media query.
                 </p>
                 <div className="flex gap-4 pt-4">
                     <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-gray-800" style={getStyle('body')}>Get Started</Button>
                     <Button size="lg" variant="outline" className="rounded-full px-8 border-gray-300 text-gray-700" style={getStyle('body')}>View Documentation</Button>
                 </div>
             </section>

             <section className="grid md:grid-cols-3 gap-12">
                 {[
                     { title: "Responsive", icon: Monitor, text: "Set your minimum and maximum font sizes, and let CSS clamp() handle the math. Your text will scale perfectly." },
                     { title: "Modular", icon: Type, text: "Choose from standard musical scales like Minor Third or Golden Ratio to ensure harmonious relationships." },
                     { title: "Export Ready", icon: Code, text: "Copy the generated CSS variables and paste them straight into your project. Zero dependencies." }
                 ].map((feature) => (
                     <div key={feature.title} className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                             <feature.icon className="w-6 h-6 text-gray-900" />
                         </div>
                         <h3 style={getStyle('heading-5')}>{feature.title}</h3>
                         <p style={getStyle('body')} className="text-gray-600 leading-relaxed">
                             {feature.text}
                         </p>
                     </div>
                 ))}
             </section>
             
             <section className="border-t border-gray-200/50 pt-24">
                 <div className="grid md:grid-cols-2 gap-16">
                     <div className="space-y-6">
                         <h2 style={getStyle('heading-2')}>Stop fighting with breakpoints</h2>
                         <p style={getStyle('body')} className="text-gray-600 leading-relaxed">
                             Traditional responsive typography requires manually setting font sizes at multiple breakpoints. This is tedious and often results in "jumpy" resizing. Fluid typography uses mathematical interpolation to scale smoothly.
                         </p>
                         <ul className="space-y-3 pt-4">
                             {[
                                 "Smooth scaling between viewports",
                                 "No complex media queries",
                                 "Accessible and user-friendly",
                                 "Works with any design system"
                             ].map(item => (
                                 <li key={item} className="flex items-center gap-3" style={getStyle('body-sm')}>
                                     <Check className="w-5 h-5 text-green-600 shrink-0" />
                                     <span className="text-gray-700">{item}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                     <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center border-2 border-dashed border-gray-200">
                         <span style={getStyle('body-sm')} className="text-gray-600 font-mono">Visual Placeholder</span>
                     </div>
                 </div>
             </section>
         </div>
    );
}
