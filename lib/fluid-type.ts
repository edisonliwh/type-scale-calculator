export interface FluidTypeConfig {
  // Viewport Settings
  minWidth: number;
  maxWidth: number;
  
  // Typography Settings - Mobile/Base
  minFontSize: number;
  minRatio: number | "shadcn";
  
  // Typography Settings - Desktop/Max
  maxFontSize: number;
  maxRatio: number | "shadcn";
  
  // Body Font Settings
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number; // in em
  color: string;
  backgroundColor: string;

  // Heading Font Settings
  headingFontFamily: string; // "inherit" or specific font
  headingFontWeight: number; // "inherit" or specific weight
  headingLineHeight: number;
  headingLetterSpacing: number;
  headingColor: string; // "inherit" or specific color
  
  // Configuration
  steps: string[];
  baseStep: string;
  prefix: string;
  decimals: number;
  useRems: boolean;
  remValue: number;
  useContainerWidth: boolean;
  includeFallbacks: boolean;
  
  // Preview Mode
  previewMode: 'blog' | 'landing';
}

export interface TypeStep {
  name: string;
  minSize: number; // in pixels
  maxSize: number; // in pixels
  clamp: string;
  fallbacks?: string[];
}

const round = (value: number, decimals: number) => {
  return Number(value.toFixed(decimals));
};

export const calculateFluidType = (config: FluidTypeConfig): TypeStep[] => {
  const {
    minWidth,
    maxWidth,
    minFontSize,
    maxFontSize,
    minRatio,
    maxRatio,
    steps,
    baseStep,
    remValue,
    decimals,
    useRems,
    useContainerWidth,
    includeFallbacks,
  } = config;

  // If using Shadcn preset, return empty array (handled in component)
  if (minRatio === "shadcn" || maxRatio === "shadcn") {
    return [];
  }

  const baseIndex = steps.indexOf(baseStep);
  
  // For headings, use the old base (16px) to keep them unchanged
  // For body text, use the new base (minFontSize/maxFontSize which is 0.88rem)
  const headingBaseSize = 16; // Keep headings at original size
  
  return steps.map((step, index) => {
    const power = index - baseIndex;
    const isHeading = step.startsWith("heading-");
    const isBody = step.startsWith("body");
    
    // Calculate min and max font sizes for this step
    // Use headingBaseSize for headings, minFontSize/maxFontSize for body
    const baseMinSize = isHeading ? headingBaseSize : minFontSize;
    const baseMaxSize = isHeading ? headingBaseSize : maxFontSize;
    const minSizePx = baseMinSize * Math.pow(minRatio, power);
    const maxSizePx = baseMaxSize * Math.pow(maxRatio, power);
    
    // Linear interpolation: y = mx + b
    const slope = (maxSizePx - minSizePx) / (maxWidth - minWidth);
    const yIntercept = minSizePx - slope * minWidth;
    
    // Convert to appropriate units
    const formatValue = (px: number) => 
      useRems ? `${round(px / remValue, decimals)}rem` : `${round(px, decimals)}px`;
      
    const yInterceptVal = useRems ? yIntercept / remValue : yIntercept;
    const yInterceptStr = `${round(yInterceptVal, decimals)}${useRems ? 'rem' : 'px'}`;
    
    const slopeVal = round(slope * 100, decimals);
    const unit = useContainerWidth ? 'cqi' : 'vw';
    
    // Ensure proper clamp ordering (min < max)
    const sortedParams = [minSizePx, maxSizePx].sort((a, b) => a - b);
    
    const minStr = formatValue(sortedParams[0]);
    const maxStr = formatValue(sortedParams[1]);
    
    const preferred = `${yInterceptStr} + ${slopeVal}${unit}`;
    const clamp = `clamp(${minStr}, ${preferred}, ${maxStr})`;

    const result: TypeStep = {
      name: step,
      minSize: minSizePx,
      maxSize: maxSizePx,
      clamp,
    };

    if (includeFallbacks) {
        result.fallbacks = [
            `font-size: ${formatValue(minSizePx)};`
        ];
    }

    return result;
  });
};
