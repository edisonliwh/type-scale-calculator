import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const POPULAR_FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Oswald", label: "Oswald" },
  { value: "Raleway", label: "Raleway" },
  { value: "Nunito", label: "Nunito" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Rubik", label: "Rubik" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Fira Sans", label: "Fira Sans" },
  { value: "Kanit", label: "Kanit" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Karla", label: "Karla" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Syne", label: "Syne" },
  { value: "Urbanist", label: "Urbanist" },
  { value: "Manrope", label: "Manrope" },
  { value: "Outfit", label: "Outfit" },
  { value: "Cabin", label: "Cabin" },
  { value: "Bitter", label: "Bitter" },
  { value: "Crimson Pro", label: "Crimson Pro" },
  { value: "Libre Baskerville", label: "Libre Baskerville" },
  { value: "Lora", label: "Lora" },
  { value: "PT Serif", label: "PT Serif" },
  { value: "Playwrite DE Grund", label: "Playwrite DE Grund" }, // From user list
  { value: "Geist", label: "Geist" }, // Default Next.js
]

interface FontPickerProps {
  value: string
  onValueChange: (value: string) => void
}

export function FontPicker({ value, onValueChange }: FontPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {value || "Select font..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search font..." />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup>
              {POPULAR_FONTS.map((font) => (
                <CommandItem
                  key={font.value}
                  value={font.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {font.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function loadGoogleFont(font: string) {
  if (!font || font === "Geist") return;
  
  const linkId = `font-${font.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@100..900&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
