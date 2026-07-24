import { notFound } from 'next/navigation';
import { products as staticProducts, Product, ProductCategory } from '../products';
import { getProductBySlug } from '@/app/lib/firebase/products';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ from?: string; page?: string; variant?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  const staticProduct = staticProducts.find((p) => p.slug === slug);
  if (staticProduct) {
    return {
      title: `${staticProduct.name} — PemaFarm`,
      description: `Artisanal ${staticProduct.name} sourced directly from our fields.`,
    };
  }
  
  const dynamicProduct = await getProductBySlug(slug);
  if (dynamicProduct) {
    return {
      title: `${dynamicProduct.name} — PemaFarm`,
      description: `Artisanal ${dynamicProduct.name} sourced directly from our fields.`,
    };
  }

  return { title: 'Product Not Found' };
}

export async function generateStaticParams() {
  const staticParams = staticProducts.map((product) => ({
    slug: product.slug,
  }));
  
  try {
    const { getDynamicProductsAll } = await import('@/app/lib/firebase/products');
    const dynamicProducts = await getDynamicProductsAll(false);
    const dynamicParams = dynamicProducts.map((product) => ({
      slug: product.slug,
    }));
    
    const allParams = [...staticParams];
    const existingSlugs = new Set(staticParams.map(p => p.slug));
    
    for (const param of dynamicParams) {
      if (!existingSlugs.has(param.slug)) {
        allParams.push(param);
      }
    }
    
    return allParams;
  } catch (error) {
    console.warn('Could not fetch dynamic products for static params:', error);
    return staticParams;
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const from = resolvedSearchParams?.from;
  const page = resolvedSearchParams?.page;
  const variantSize = resolvedSearchParams?.variant;
  
  // Check static products first
  const staticProduct = staticProducts.find((p) => p.slug === slug);
  
  // If not found in static, check Firebase
  let product: Product | undefined = staticProduct;
  
  if (!product) {
    const firebaseProduct = await getProductBySlug(slug);
    if (firebaseProduct) {
      // Convert Firebase product to static Product type
      product = {
        id: firebaseProduct.id,
        name: firebaseProduct.name,
        slug: firebaseProduct.slug,
        category: firebaseProduct.category as ProductCategory,
        price: firebaseProduct.price,
        unit: firebaseProduct.unit,
        image: firebaseProduct.image,
        isStatic: false,
        variants: undefined,
        description: undefined,
      };
    }
  }

  if (!product) notFound();

  // Determine back href: use full 'from' URL if present, else fallback
  let backHref = '/shop';
  if (from) {
    backHref = from;  // from already contains the full path + query
  } else if (page) {
    backHref = `/shop?page=${page}`;
  }

  // Find selected variant if variant param exists
  let selectedVariant = null;
  if (variantSize && product.variants && product.variants.length > 0) {
    selectedVariant = product.variants.find(v => v.size === variantSize) || null;
  }

  // Convert to client-safe product
  const clientProduct: Product = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    unit: product.unit,
    image: product.image,
    isStatic: product.isStatic,
    variants: product.variants,
    description: product.description,
  };

  return <ProductDetailClient product={clientProduct} backHref={backHref} selectedVariant={selectedVariant} />;
}