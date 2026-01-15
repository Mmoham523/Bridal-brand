import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.stock === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
      image: product.images[0],
    });

    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your bag.`,
    });
  };

  return (
    <Link to={`/shop/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-foreground text-background px-4 py-2 text-sm font-medium tracking-wide">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-primary-hover"
            >
              Quick Add
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <h3 className="font-heading text-lg font-medium text-primary">
          {product.name}
        </h3>
        <p className="text-muted-foreground mt-1">
          £{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
