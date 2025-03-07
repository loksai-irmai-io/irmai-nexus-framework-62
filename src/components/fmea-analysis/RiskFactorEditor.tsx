
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  BrainCircuit, 
  Info,
  AlertTriangle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskFactorEditorProps {
  factor: {
    id: string;
    name: string;
    description: string;
    severity: number;
    likelihood: number;
    detectability: number;
    isAiSuggested?: boolean;
  };
  onSave: (factorId: string, updatedValues: any) => void;
  onCancel: () => void;
}

const RiskFactorEditor: React.FC<RiskFactorEditorProps> = ({ factor, onSave, onCancel }) => {
  const [severity, setSeverity] = useState<number>(factor.severity);
  const [likelihood, setLikelihood] = useState<number>(factor.likelihood);
  const [detectability, setDetectability] = useState<number>(factor.detectability);
  const [justification, setJustification] = useState<string>("");
  
  const rpn = severity * likelihood * detectability;
  const originalRpn = factor.severity * factor.likelihood * factor.detectability;
  const hasChanges = severity !== factor.severity || likelihood !== factor.likelihood || detectability !== factor.detectability;
  
  const getFactorDescription = (type: string, value: number) => {
    if (type === 'severity') {
      if (value === 1) return 'Negligible - No impact on system performance';
      if (value === 2) return 'Minor - Slight system performance degradation';
      if (value === 3) return 'Moderate - Partial loss of system functionality';
      if (value === 4) return 'Major - Significant system performance degradation';
      if (value === 5) return 'Critical - Complete system failure';
    } else if (type === 'likelihood') {
      if (value === 1) return 'Remote - Unlikely to occur (once in 5+ years)';
      if (value === 2) return 'Low - Infrequent occurrence (once in 2-5 years)';
      if (value === 3) return 'Moderate - Occasional occurrence (annually)';
      if (value === 4) return 'High - Frequent occurrence (monthly)';
      if (value === 5) return 'Very High - Constant occurrence (weekly)';
    } else if (type === 'detectability') {
      if (value === 1) return 'Very High - Controls will always detect the failure';
      if (value === 2) return 'High - Controls have a high chance of detection';
      if (value === 3) return 'Moderate - Controls might detect the failure';
      if (value === 4) return 'Low - Controls have a low chance of detection';
      if (value === 5) return 'Remote - No controls or ineffective detection';
    }
    return '';
  };
  
  const getRpnSeverity = (rpn: number) => {
    if (rpn > 60) return { color: 'text-red-600', label: 'Critical' };
    if (rpn > 30) return { color: 'text-amber-600', label: 'Significant' };
    return { color: 'text-green-600', label: 'Acceptable' };
  };
  
  const handleSave = () => {
    onSave(factor.id, {
      severity,
      likelihood,
      detectability,
      justification
    });
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Risk Factor</span>
            {factor.isAiSuggested && (
              <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                <BrainCircuit className="h-3 w-3" />
                AI Suggested
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h3 className="text-sm font-medium mb-1">{factor.name}</h3>
            <p className="text-sm text-muted-foreground">{factor.description}</p>
          </div>
          
          <div className="space-y-4 pt-2 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium">Severity (S)</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-xs">
                          Severity measures the impact or consequence of the failure mode
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm font-medium">{severity}/5</div>
              </div>
              <Slider 
                min={1} 
                max={5} 
                step={1} 
                value={[severity]} 
                onValueChange={(value) => setSeverity(value[0])} 
                className={
                  severity > 4 ? 'bg-red-100' : 
                  severity > 2 ? 'bg-amber-100' : 
                  'bg-green-100'
                }
              />
              <p className="text-xs text-muted-foreground">{getFactorDescription('severity', severity)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium">Likelihood (L)</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-xs">
                          Likelihood measures how frequently the failure mode is expected to occur
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm font-medium">{likelihood}/5</div>
              </div>
              <Slider 
                min={1} 
                max={5} 
                step={1} 
                value={[likelihood]} 
                onValueChange={(value) => setLikelihood(value[0])} 
                className={
                  likelihood > 4 ? 'bg-red-100' : 
                  likelihood > 2 ? 'bg-amber-100' : 
                  'bg-green-100'
                }
              />
              <p className="text-xs text-muted-foreground">{getFactorDescription('likelihood', likelihood)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium">Detectability (D)</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground ml-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs text-xs">
                          Detectability measures the ability to detect the failure before it impacts the system (higher score = harder to detect)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm font-medium">{detectability}/5</div>
              </div>
              <Slider 
                min={1} 
                max={5} 
                step={1} 
                value={[detectability]} 
                onValueChange={(value) => setDetectability(value[0])} 
                className={
                  detectability > 4 ? 'bg-red-100' : 
                  detectability > 2 ? 'bg-amber-100' : 
                  'bg-green-100'
                }
              />
              <p className="text-xs text-muted-foreground">{getFactorDescription('detectability', detectability)}</p>
            </div>
          </div>
          
          <div className="p-3 border rounded-md bg-slate-50">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Risk Priority Number (RPN)</h4>
                <p className="text-xs text-muted-foreground">S × L × D = RPN</p>
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold ${getRpnSeverity(rpn).color}`}>{rpn}</span>
                <p className="text-xs text-muted-foreground">{getRpnSeverity(rpn).label} Risk</p>
              </div>
            </div>
            
            {hasChanges && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <span className="text-xs">Original RPN:</span>
                <span className={`text-xs font-medium ${getRpnSeverity(originalRpn).color}`}>{originalRpn}</span>
              </div>
            )}
          </div>
          
          {hasChanges && (
            <div className="space-y-2">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-medium">Justification for Changes</h4>
              </div>
              <textarea 
                className="w-full min-h-[80px] p-2 text-sm border rounded"
                placeholder="Please explain the reason for changing the AI-suggested risk factors..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={hasChanges && !justification}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RiskFactorEditor;
