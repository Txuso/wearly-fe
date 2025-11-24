import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterPanelProps {
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  selectedSizes: string[];
  onSizeToggle: (size: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const AVAILABLE_COLORS = ["Blue", "Black", "White", "Red", "Green", "Gray", "Brown"];
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const AVAILABLE_CATEGORIES = ["Pants", "Jackets", "Shirts", "Shoes", "Accessories"];

export const FilterPanel = ({
  maxPrice,
  onMaxPriceChange,
  selectedColors,
  onColorToggle,
  selectedSizes,
  onSizeToggle,
  selectedCategories,
  onCategoryToggle,
}: FilterPanelProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label>Max Price: €{maxPrice}</Label>
          <Slider
            value={[maxPrice]}
            onValueChange={(values) => onMaxPriceChange(values[0])}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <Label>Colors</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <Badge
                key={color}
                variant={selectedColors.includes(color) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => onColorToggle(color)}
              >
                {color}
                {selectedColors.includes(color) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <Label>Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <Badge
                key={size}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => onSizeToggle(size)}
              >
                {size}
                {selectedSizes.includes(size) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => onCategoryToggle(category)}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
