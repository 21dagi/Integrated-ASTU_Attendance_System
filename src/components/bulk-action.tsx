import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type BulkAction = {
  label: string;
  action: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
  onAction: (action: string) => Promise<void>;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  actions,
  onAction,
}: BulkActionBarProps) {
  const [selectedAction, setSelectedAction] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleActionChange = (value: string) => {
    setSelectedAction(value);
  };

  const handleApplyAction = async () => {
    if (!selectedAction) return;

    setIsLoading(true);
    try {
      await onAction(selectedAction);
    } catch (error) {
      console.error("Error applying bulk action:", error);
    } finally {
      setIsLoading(false);
      setSelectedAction("");
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "row" : "rows"} selected
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {actions.length > 0 ? (
          <>
            <Select value={selectedAction} onValueChange={handleActionChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.action} value={action.action}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="h-8"
              disabled={!selectedAction || isLoading}
              onClick={handleApplyAction}
            >
              {isLoading ? "Applying..." : "Apply"}
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            No actions available
          </span>
        )}
      </div>
    </div>
  );
}
