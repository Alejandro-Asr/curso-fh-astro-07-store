import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { db, eq, Product, ProductImage } from 'astro:db';

export const getProductBySlug = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (slug) => {
    const newProduct = {
      id: '',
      description: 'Nueva Descripcion',
      gender: 'men',
      price: 100,
      sizes: 'XS,S,M',
      slug: 'nuevo-producto',
      stock: 5,
      tags: 'shirts,men,nuevo',
      title: 'Nuevo Producto',
      type: 'shirts',
    };
    if (slug === 'new') {
      return {
        product: newProduct,
        images: [],
      };
    }
    const [product] = await db
      .select()
      .from(Product)
      .where(eq(Product.slug, slug));
    if (!product) {
      throw new Error('Product not found');
    }
    const images = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.productId, product.id));

    // if (!images || images.length === 0) {
    //   throw new Error('Product not found');
    // }
    return {
      product: product,
      images: images,
      //images: images.map((i) => i.image)
    };
  },
});
