
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportFormat: 'csv' | 'pdf';
  onExportFormatChange: (format: 'csv' | 'pdf') => void;
  exportMetrics: string[];
  onExportMetricsChange: (metrics: string[]) => void;
  onExport: () => void;
}

export default function ExportModal({
  open,
  onOpenChange,
  exportFormat,
  onExportFormatChange,
  exportMetrics,
  onExportMetricsChange,
  onExport,
}: ExportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Analytics Data</DialogTitle>
          <DialogDescription>Choose your export format and metrics</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={onExportFormatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Include Metrics</Label>
            <div className="space-y-2">
              <Checkbox
                checked={exportMetrics.includes('all')}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onExportMetricsChange(['all']);
                  } else {
                    onExportMetricsChange([]);
                  }
                }}
              />
              <span className="ml-2">All Metrics</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onExport}>Export</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
