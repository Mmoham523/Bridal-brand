import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const collections = {
  safaa: { name: 'Safaa Collection', without: 395, with: 450 },
  bilqees: { name: 'Bilqees Collection', without: 395, with: 450 },
  ayah: { name: 'Ayah Collection', without: 375, with: 430 },
} as const;

type CollectionKey = keyof typeof collections;

interface QuickQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickQuoteModal({ open, onOpenChange }: QuickQuoteModalProps) {
  const [selectedCollection, setSelectedCollection] = useState<CollectionKey | null>(null);
  const [tailoring, setTailoring] = useState<'with' | 'without' | null>(null);

  const calculatePrice = (): number | null => {
    if (!selectedCollection || tailoring === null) return null;
    return collections[selectedCollection][tailoring];
  };

  const price = calculatePrice();

  const handleReset = () => {
    setSelectedCollection(null);
    setTailoring(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Quick Quote
          </DialogTitle>
          <DialogDescription>
            Select a collection and tailoring option to get an instant price quote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Collection Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Collection</label>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(collections) as CollectionKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCollection(key);
                    if (tailoring === null) setTailoring('without');
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedCollection === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{collections[key].name}</span>
                    {selectedCollection === key && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tailoring Selection */}
          {selectedCollection && (
            <div>
              <label className="block text-sm font-medium mb-3">Tailoring Option</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTailoring('without')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tailoring === 'without'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-medium mb-1">Without Tailoring</p>
                    <p className="text-sm text-muted-foreground">
                      £{collections[selectedCollection].without}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setTailoring('with')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tailoring === 'with'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-medium mb-1">With Tailoring</p>
                    <p className="text-sm text-muted-foreground">
                      £{collections[selectedCollection].with}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Price Display */}
          {price !== null && (
            <div className="bg-secondary/50 rounded-lg p-6 text-center border border-border">
              <p className="text-sm text-muted-foreground mb-2">Estimated Price</p>
              <p className="text-4xl font-heading font-bold text-primary">
                £{price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                *This is an estimate. Final pricing may vary.
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="hero"
              className="flex-1"
              asChild
              onClick={() => onOpenChange(false)}
            >
              <Link to="/consultation">Book Consultation</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              asChild
              onClick={() => onOpenChange(false)}
            >
              <Link to="/shop">View Shop</Link>
            </Button>
          </div>

          {/* Reset Button */}
          {selectedCollection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="w-full"
            >
              Reset Selection
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

