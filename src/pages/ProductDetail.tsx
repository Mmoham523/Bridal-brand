import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, Check, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import productsData from '@/data/products.json';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const productImages = [product1, product2, product3, product4, product5, product6];

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  
  const productIndex = productsData.products.findIndex(p => p.id === id);
  const product = productIndex >= 0 ? {
    ...productsData.products[productIndex],
    images: [productImages[productIndex % productImages.length]]
  } : null;

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="section-container section-spacing text-center">
        <h1 className="heading-lg mb-4">Product Not Found</h1>
        <p className="body-md mb-8">The product you're looking for doesn't exist.</p>
        <Button variant="outline" asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    });

    toast({
      title: "Added to bag",
      description: `${product.name} (${selectedSize}, ${selectedColor}) has been added.`,
    });
  };

  return (
    <div className="section-container py-8 md:py-16">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="heading-lg mb-2">{product.name}</h1>
          <p className="text-2xl font-heading font-medium text-primary mb-6">
            £{product.price.toLocaleString()}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {isOutOfStock ? (
              <span className="text-destructive text-sm font-medium">Out of Stock</span>
            ) : product.stock <= 3 ? (
              <span className="text-amber-600 text-sm font-medium">Only {product.stock} left</span>
            ) : (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <Check className="h-4 w-4" /> In Stock
              </span>
            )}
          </div>

          <p className="body-md mb-8">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Size</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Colour</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                    selectedColor === color
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-border rounded-md hover:bg-accent transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 border border-border rounded-md hover:bg-accent transition-colors"
                aria-label="Increase quantity"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              variant="addToCart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/consultation">Book Sizing Consult</Link>
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Truck className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">Free delivery over £1,500</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <RefreshCw className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">14-day returns</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">Handcrafted quality</span>
            </div>
          </div>

          {/* Accordion Info */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="size-guide">
              <AccordionTrigger>Size Guide</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-4">
                  Our sizes follow UK standard bridal sizing. For the perfect fit, we recommend booking a consultation where our experts can take your precise measurements.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/size-guide">View Full Size Guide</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery & Returns</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-2">
                  Standard delivery: 5-7 business days (£15)
                </p>
                <p className="text-muted-foreground mb-2">
                  Express delivery: 2-3 business days (£25)
                </p>
                <p className="text-muted-foreground">
                  Free delivery on orders over £1,500. Returns accepted within 14 days of delivery for unworn items.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Care Instructions</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{product.care}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
