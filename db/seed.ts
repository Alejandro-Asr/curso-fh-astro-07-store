import { db, Role, User, Product, ProductImage } from 'astro:db';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from './seed-data';

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'User' },
    { id: 'super-user', name: 'Super User' },
  ];

  const jonhnDoe = {
    id: 'ABC-123-JOHN', //UUID(),
    name: 'John Doe',
    email: 'john.doe@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'admin',
  };
  const janeDoe = {
    id: 'ABC-123-JANE', // UUID(),
    name: 'Jane Doe',
    email: 'jane.doe@google.com',
    password: bcrypt.hashSync('123456'),
    role: 'user',
  };

  await db.insert(Role).values(roles);
  await db.insert(User).values([jonhnDoe, janeDoe]);

  const queries: any = [];

  seedProducts.forEach((p) => {
    const product = {
      id: UUID(),
      description: p.description,
      stock: p.stock,
      price: p.price,
      sizes: p.sizes.join(','),
      slug: p.slug,
      tags: p.tags.join(','),
      title: p.title,
      type: p.type,
      gender: p.gender,
      user: jonhnDoe.id,
    };

    queries.push(db.insert(Product).values(product));

    p.images.forEach((img) => {
      const image = {
        id: UUID(),
        image: img,
        productId: product.id,
      };
      queries.push(db.insert(ProductImage).values(image));
    });
  });
  await db.batch(queries);
}
