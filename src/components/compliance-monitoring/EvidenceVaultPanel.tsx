
import React, { useState } from 'react';
import { EvidenceItem } from './types';
import { 
  FileText, 
  Image, 
  FileCode, 
  FileClock, 
  FileCheck, 
  ExternalLink, 
  Check, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface EvidenceVaultPanelProps {
  evidenceItems: EvidenceItem[];
  onEvidenceClick?: (controlId: string) => void;
}

export const EvidenceVaultPanel: React.FC<EvidenceVaultPanelProps> = ({ 
  evidenceItems,
  onEvidenceClick
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  
  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-10 w-10 text-blue-600" />;
      case 'screenshot':
        return <Image className="h-10 w-10 text-emerald-600" />;
      case 'log':
        return <FileCode className="h-10 w-10 text-amber-600" />;
      case 'report':
        return <FileClock className="h-10 w-10 text-purple-600" />;
      case 'certification':
        return <FileCheck className="h-10 w-10 text-red-600" />;
      default:
        return <FileText className="h-10 w-10 text-gray-600" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-4">
      {evidenceItems.map((evidence) => (
        <Dialog key={evidence.id}>
          <DialogTrigger asChild>
            <div 
              className="flex items-start p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedEvidence(evidence)}
            >
              <div className="mr-3">
                {getEvidenceIcon(evidence.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{evidence.name}</h4>
                    <p className="text-xs text-muted-foreground">Control ID: {evidence.controlId}</p>
                  </div>
                  {getStatusBadge(evidence.status)}
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Uploaded by {evidence.uploadedBy} on {formatDate(evidence.uploadedAt)}
                  </span>
                  <span className="text-blue-600 flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{evidence.name}</DialogTitle>
              <DialogDescription>
                Evidence details for Control ID: {evidence.controlId}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-center items-center p-6 border rounded-lg bg-muted">
                  {getEvidenceIcon(evidence.type)}
                </div>
                
                <dl className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Evidence Type</dt>
                    <dd className="text-sm font-semibold">{evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd>{getStatusBadge(evidence.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Uploaded By</dt>
                    <dd className="text-sm">{evidence.uploadedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Upload Date</dt>
                    <dd className="text-sm">{formatDate(evidence.uploadedAt)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Related Control</dt>
                    <dd className="text-sm underline cursor-pointer" onClick={() => {
                      if (onEvidenceClick) {
                        onEvidenceClick(evidence.controlId);
                      }
                    }}>{evidence.controlId}</dd>
                  </div>
                </dl>
                
                <Separator className="my-2" />
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Evidence Verification</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Automatic verification completed on {formatDate(evidence.uploadedAt)}</span>
                    </div>
                    {evidence.status === 'verified' && (
                      <div className="flex items-center text-xs">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        <span>Manually verified by compliance officer</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                if (onEvidenceClick) {
                  onEvidenceClick(evidence.controlId);
                }
              }}>View Related Control</Button>
              <Button 
                variant={evidence.status === 'pending' ? 'default' : 'outline'}
                disabled={evidence.status === 'verified'}
              >
                {evidence.status === 'pending' ? 'Verify Evidence' : 'Download Evidence'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
