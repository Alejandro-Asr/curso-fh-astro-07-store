import { ImageUpload } from '@/utils/image-upload';
import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { db, eq, ProductImage } from 'astro:db';
import { getSession } from 'auth-astro/server';

export const deleteProductImage = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (imageId, { request }) => {
    const session = await getSession(request);
    const user = session?.user;

    if (!user) {
      throw new Error('Unauthorized');
    }

    const [producImage] = await db
      .select()
      .from(ProductImage)
      .where(eq(ProductImage.id, imageId));

    if (!producImage) {
      throw new Error(`Image with id ${imageId} not found`);
    }

    const deleted = await db
      .delete(ProductImage)
      .where(eq(ProductImage.id, imageId));

    if (producImage.image.includes('http')) {
      await ImageUpload.delete(producImage.image);
    }

    return { ok: true };
  },
});
