"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";

interface ScreenSizeControllerProps {
  width: number;
  onWidthChange: (width: number) => void;
  onResponsiveModeChange?: (isResponsive: boolean) => void;
  isResponsiveMode?: boolean;
}

export const RESPONSIVE_PRESETS = [
  { label: "Desktop", value: "desktop", description: ">= 1280px" },
  { label: "Laptop", value: "laptop", description: "1024px to 1279px" },
  { label: "Tablet", value: "tablet", description: "640px to 767px" },
  { label: "Mobile", value: "mobile", description: "0 to 639px" },
];

const RESPONSIVE_OPTION = { label: "Responsive", value: "responsive", description: "Customizable screen width" };

export function ScreenSizeController({
  width,
  onWidthChange,
  onResponsiveModeChange,
  isResponsiveMode = false,
}: ScreenSizeControllerProps) {
  const getCurrentPreset = () => {
    // If in responsive mode, always return "responsive"
    if (isResponsiveMode) {
      return "responsive";
    }
    
    // Check breakpoint ranges (only if not in responsive mode)
    // Desktop: >= 1280px (includes 9999 which represents full width)
    if (width >= 1280 || width >= 9999) {
      return "desktop";
    }
    if (width >= 1024 && width <= 1279) {
      return "laptop";
    }
    if (width >= 640 && width <= 767) {
      return "tablet";
    }
    if (width >= 0 && width <= 639) {
      return "mobile";
    }
    
    // Default to responsive if no match
    return "responsive";
  };

  const handleResponsiveChange = (value: string) => {
    const isResponsive = value === "responsive";
    onResponsiveModeChange?.(isResponsive);
    
    if (isResponsive) {
      // When switching to responsive, set to full page width by default
      onWidthChange(9999); // Full width
      return;
    }
    
    if (value === "desktop") {
      // Desktop takes full width - use a very large value or calculate from container
      onWidthChange(9999); // Will be constrained by max-width: 100%
      onResponsiveModeChange?.(false);
      return;
    }
    
    // Set width based on breakpoint (use middle of range)
    if (value === "laptop") {
      onWidthChange(1152); // Middle of 1024-1279
      onResponsiveModeChange?.(false);
      return;
    }
    if (value === "tablet") {
      onWidthChange(704); // Middle of 640-767
      onResponsiveModeChange?.(false);
      return;
    }
    if (value === "mobile") {
      onWidthChange(320); // Middle of 0-639
      onResponsiveModeChange?.(false);
      return;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Select value={getCurrentPreset()} onValueChange={handleResponsiveChange}>
        <SelectTrigger className="h-8 bg-white border-gray-200 text-sm min-w-[180px]">
          <SelectValue>
            {getCurrentPreset() === "responsive" 
              ? RESPONSIVE_OPTION.label 
              : RESPONSIVE_PRESETS.find(p => p.value === getCurrentPreset())?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-[200px]">
          {RESPONSIVE_PRESETS.map((preset) => (
            <SelectItem key={preset.value} value={preset.value} className="py-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{preset.label}</span>
                <span className="text-xs text-muted-foreground">{preset.description}</span>
              </div>
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem key={RESPONSIVE_OPTION.value} value={RESPONSIVE_OPTION.value} className="py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{RESPONSIVE_OPTION.label}</span>
              <span className="text-xs text-muted-foreground">{RESPONSIVE_OPTION.description}</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

