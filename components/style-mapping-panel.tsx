"use client"

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TextElementId = 
  // Dashboard
  | "dashboard-title"
  | "dashboard-download-btn"
  | "dashboard-tabs"
  | "dashboard-card-title"
  | "dashboard-card-value"
  | "dashboard-card-description"
  | "dashboard-section-title"
  | "dashboard-section-description"
  | "dashboard-table-header"
  | "dashboard-table-cell"
  // Examples
  | "examples-card-title"
  | "examples-card-description"
  | "examples-label"
  | "examples-input"
  | "examples-button"
  // Tasks
  | "tasks-title"
  | "tasks-description"
  | "tasks-filter-input"
  | "tasks-filter-button"
  | "tasks-table-header"
  | "tasks-table-cell"
  | "tasks-pagination"
  // Landing
  | "landing-badge"
  | "landing-heading"
  | "landing-heading-2"
  | "landing-description"
  | "landing-button-primary"
  | "landing-button-secondary"
  | "landing-feature-title"
  | "landing-feature-description"
  // Article
  | "article-title"
  | "article-meta"
  | "article-body"
  | "article-heading-2"
  | "article-heading-3"
  | "article-list-item"
  | "article-blockquote";

export type StyleMappings = Partial<Record<TextElementId, string>>;

interface TextElement {
  id: TextElementId;
  label: string;
  category: "dashboard" | "examples" | "tasks" | "landing" | "article";
}

const TEXT_ELEMENTS: TextElement[] = [
  // Dashboard
  { id: "dashboard-title", label: "Dashboard Title", category: "dashboard" },
  { id: "dashboard-download-btn", label: "Download Button", category: "dashboard" },
  { id: "dashboard-tabs", label: "Tab Labels", category: "dashboard" },
  { id: "dashboard-card-title", label: "Card Title", category: "dashboard" },
  { id: "dashboard-card-value", label: "Card Value", category: "dashboard" },
  { id: "dashboard-card-description", label: "Card Description", category: "dashboard" },
  { id: "dashboard-section-title", label: "Section Title", category: "dashboard" },
  { id: "dashboard-section-description", label: "Section Description", category: "dashboard" },
  { id: "dashboard-table-header", label: "Table Header", category: "dashboard" },
  { id: "dashboard-table-cell", label: "Table Cell", category: "dashboard" },
  // Examples
  { id: "examples-card-title", label: "Card Title", category: "examples" },
  { id: "examples-card-description", label: "Card Description", category: "examples" },
  { id: "examples-label", label: "Label", category: "examples" },
  { id: "examples-input", label: "Input", category: "examples" },
  { id: "examples-button", label: "Button", category: "examples" },
  // Tasks
  { id: "tasks-title", label: "Title", category: "tasks" },
  { id: "tasks-description", label: "Description", category: "tasks" },
  { id: "tasks-filter-input", label: "Filter Input", category: "tasks" },
  { id: "tasks-filter-button", label: "Filter Button", category: "tasks" },
  { id: "tasks-table-header", label: "Table Header", category: "tasks" },
  { id: "tasks-table-cell", label: "Table Cell", category: "tasks" },
  { id: "tasks-pagination", label: "Pagination", category: "tasks" },
  // Landing
  { id: "landing-badge", label: "Badge", category: "landing" },
  { id: "landing-heading", label: "Main Heading", category: "landing" },
  { id: "landing-heading-2", label: "Section Heading", category: "landing" },
  { id: "landing-description", label: "Hero Description", category: "landing" },
  { id: "landing-button-primary", label: "Primary Button", category: "landing" },
  { id: "landing-button-secondary", label: "Secondary Button", category: "landing" },
  { id: "landing-feature-title", label: "Feature Title", category: "landing" },
  { id: "landing-feature-description", label: "Feature Description", category: "landing" },
  // Article
  { id: "article-title", label: "Title", category: "article" },
  { id: "article-meta", label: "Meta", category: "article" },
  { id: "article-body", label: "Body", category: "article" },
  { id: "article-heading-2", label: "Heading 2", category: "article" },
  { id: "article-heading-3", label: "Heading 3", category: "article" },
  { id: "article-list-item", label: "List Item", category: "article" },
  { id: "article-blockquote", label: "Blockquote", category: "article" },
];

interface StyleMappingPanelProps {
  styleMappings: StyleMappings;
  onStyleMappingChange: (elementId: TextElementId, stepName: string) => void;
  onRestoreDefaults?: () => void;
  availableSteps: string[];
  activeTab: "examples" | "dashboard" | "tasks" | "landing" | "article";
  onClose?: () => void;
}

export function StyleMappingPanel({
  styleMappings,
  onStyleMappingChange,
  onRestoreDefaults,
  availableSteps,
  activeTab,
  onClose,
}: StyleMappingPanelProps) {
  const filteredElements = TEXT_ELEMENTS.filter(
    (el) => el.category === activeTab
  );

  const getDefaultStepName = (elementId: TextElementId): string => {
    // Default mappings based on element type
    // Order matters: most specific first
    
    // Main titles and headings (specific IDs first)
    if (elementId === "landing-heading" || elementId === "article-title") {
      return "heading-1";
    }
    if (elementId === "landing-heading-2") {
      return "heading-2";
    }
    if (elementId === "dashboard-title" || elementId === "tasks-title") {
      return "heading-3";
    }
    
    // Specific heading levels
    if (elementId.includes("heading-2")) {
      return "heading-2";
    }
    if (elementId.includes("heading-3")) {
      return "heading-3";
    }
    
    // Feature descriptions (more specific than general descriptions)
    if (elementId.includes("feature-description")) {
      return "body";
    }
    
    // Feature titles
    if (elementId.includes("feature-title")) {
      return "heading-5";
    }
    
    // Card titles
    if (elementId.includes("card-title")) {
      return "heading-6";
    }
    
    // Card values
    if (elementId.includes("card-value")) {
      return "heading-3";
    }
    
    // Section titles
    if (elementId.includes("section-title")) {
      return "heading-5";
    }
    
    // Heading keyword (for landing-heading, etc.) - must come after specific checks
    if (elementId.includes("heading") && !elementId.includes("card") && !elementId.includes("feature")) {
      return "heading-1";
    }
    
    // Table headers
    if (elementId.includes("table-header")) {
      return "body-sm";
    }
    
    // Buttons and tabs
    if (elementId.includes("button") || elementId.includes("tabs")) {
      return "body-sm";
    }
    
    // Badge
    if (elementId.includes("badge")) {
      return "body-sm";
    }
    
    // Meta
    if (elementId.includes("meta")) {
      return "body-sm";
    }
    
    // Descriptions (general - comes after feature-description)
    if (elementId.includes("description")) {
      return "body";
    }
    
    // List items
    if (elementId.includes("list-item")) {
      return "body";
    }
    
    // Blockquote
    if (elementId.includes("blockquote")) {
      return "body-lg";
    }
    
    // Inputs
    if (elementId.includes("input")) {
      return "body";
    }
    
    // Labels
    if (elementId.includes("label")) {
      return "body-sm";
    }
    
    // Pagination
    if (elementId.includes("pagination")) {
      return "body-sm";
    }
    
    // Table cells
    if (elementId.includes("table-cell")) {
      return "body";
    }
    
    // Default to body for everything else
    return "body";
  };

  const getPanelTitle = () => {
    switch (activeTab) {
      case "examples":
        return "Text styles for Cards";
      case "dashboard":
        return "Text styles for Dashboard";
      case "tasks":
        return "Text styles for Table";
      case "landing":
        return "Text styles for Landing";
      case "article":
        return "Text styles for Article";
      default:
        return "Text styles";
    }
  };

  return (
    <aside className="relative z-30 w-[280px] flex-shrink-0 rounded-2xl backdrop-blur-xl flex flex-col h-full overflow-hidden transition-all bg-white/80" style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
      {/* Header */}
      <div className="p-5 border-b border-black/5 flex items-center justify-between shrink-0">
        <span className="font-semibold text-base text-gray-900">
          {getPanelTitle()}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close panel"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar flex flex-col">
        {filteredElements.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            No text elements available for this preview.
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            {filteredElements.map((element) => {
              const currentStep = styleMappings[element.id] || getDefaultStepName(element.id);
              return (
                <div key={element.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {element.label}
                  </Label>
                  <Select
                    value={currentStep}
                    onValueChange={(value) => onStyleMappingChange(element.id, value)}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-200 h-9 focus:ring-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSteps.map((step) => (
                        <SelectItem key={step} value={step}>
                          {step}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        )}
        {onRestoreDefaults && filteredElements.length > 0 && (
          <div className="pt-4 border-t border-black/5 mt-auto">
            <Button
              onClick={onRestoreDefaults}
              className="w-full"
            >
              Restore default
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
