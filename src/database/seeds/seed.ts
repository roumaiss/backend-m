// src/database/seeds/seed.ts — populates demo makeup catalog data. Run with `npm run seed`.
import { existsSync } from 'fs';
import { join } from 'path';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import dataSource from '../data-source';
import { brand as Brand } from '../../modules/brand/brand.entity';
import { Category } from '../../modules/category/category.entity';
import { Subcategory } from '../../modules/subcategory/subcategory.entity';
import { Product } from '../../modules/products/product.entity';
import { ProductType } from '../../modules/products/product-type.enum';
import { ProductVariant } from '../../modules/product-variants/product-variant.entity';

const CATEGORY_TREE: Record<string, string[]> = {
  Face: [
    'Foundation',
    'Concealer',
    'Primer',
    'Blush',
    'Bronzer',
    'Contour',
    'Highlighter',
    'Setting Powder',
    'Setting Spray',
  ],
  Eyes: ['Eyeshadow Palette', 'Eyeliner', 'Mascara', 'Eyebrow', 'Lashes'],
  Lips: ['Lipstick', 'Lip Liner', 'Lip Gloss', 'Liquid Lipstick'],
};

interface VariantSeed {
  shade?: string;
  color?: string;
  volume?: string;
  price: number;
  stockQuantity: number;
}

interface ProductSeed {
  name: string;
  description: string;
  subcategory: string;
  type: ProductType;
  variants: VariantSeed[];
}

const PRODUCTS: ProductSeed[] = [
  {
    name: 'Sheglam Complexion Pro Long-Lasting Breathable Matte Foundation',
    description:
      'A buildable, breathable matte foundation with 24hr wear and a soft-focus finish.',
    subcategory: 'Foundation',
    type: ProductType.LIQUID,
    variants: [
      { shade: 'Sand', volume: '30ml', price: 9.0, stockQuantity: 40 },
      { shade: 'Butterscotch', volume: '30ml', price: 9.0, stockQuantity: 25 },
      { shade: 'Golden', volume: '30ml', price: 9.0, stockQuantity: 0 },
      { shade: 'Acorn', volume: '30ml', price: 9.0, stockQuantity: 15 },
      { shade: 'Porcelain', volume: '30ml', price: 9.0, stockQuantity: 33 },
      { shade: 'Honey', volume: '30ml', price: 9.0, stockQuantity: 8 },
    ],
  },
  {
    name: 'Sheglam Skin-Focus Full Coverage Powder Foundation',
    description:
      'A full-coverage pressed powder foundation that blurs pores and controls shine.',
    subcategory: 'Foundation',
    type: ProductType.POWDER,
    variants: [
      { shade: 'Butterscotch', volume: '9g', price: 8.0, stockQuantity: 20 },
      { shade: 'Sand', volume: '9g', price: 8.0, stockQuantity: 30 },
      { shade: 'Acorn', volume: '9g', price: 8.0, stockQuantity: 14 },
    ],
  },
  {
    name: 'Sheglam 12HR Full Coverage Concealer',
    description:
      'A creamy, crease-resistant concealer stick with 12-hour full coverage.',
    subcategory: 'Concealer',
    type: ProductType.STICK,
    variants: [
      { shade: 'Acorn', volume: '4g', price: 6.0, stockQuantity: 18 },
      { shade: 'Sand', volume: '4g', price: 6.0, stockQuantity: 22 },
      { shade: 'Butterscotch', volume: '4g', price: 6.0, stockQuantity: 10 },
    ],
  },
  {
    name: 'Sheglam All In One Pore Blur Primer',
    description:
      'A silky gel primer that blurs pores and fine lines for a smooth makeup base.',
    subcategory: 'Primer',
    type: ProductType.GEL,
    variants: [
      { shade: 'Universal', volume: '15ml', price: 4.5, stockQuantity: 30 },
      { shade: 'Universal', volume: '30ml', price: 7.0, stockQuantity: 50 },
    ],
  },
  {
    name: 'Sheglam Liquid Blush',
    description:
      'A weightless, blendable liquid blush for a natural flushed finish.',
    subcategory: 'Blush',
    type: ProductType.LIQUID,
    variants: [
      { shade: 'Dusky Rose', volume: '6ml', price: 8.0, stockQuantity: 25 },
      { shade: 'Sunny Nude', volume: '6ml', price: 8.0, stockQuantity: 12 },
      { shade: 'Coral Kiss', volume: '6ml', price: 8.0, stockQuantity: 19 },
      { shade: 'Berry Bliss', volume: '6ml', price: 8.0, stockQuantity: 7 },
    ],
  },
  {
    name: 'Sheglam Sculpt & Snatch Bronzer',
    description:
      'A finely-milled pressed bronzer for natural, sun-kissed warmth.',
    subcategory: 'Bronzer',
    type: ProductType.POWDER,
    variants: [
      { shade: 'Light Bronze', volume: '9g', price: 9.0, stockQuantity: 20 },
      { shade: 'Medium Bronze', volume: '9g', price: 9.0, stockQuantity: 15 },
      { shade: 'Deep Bronze', volume: '9g', price: 9.0, stockQuantity: 5 },
    ],
  },
  {
    name: 'Sheglam Sculpt & Snatch Cream Contour Stick',
    description:
      'A blendable cream contour stick for effortless sculpting on the go.',
    subcategory: 'Contour',
    type: ProductType.STICK,
    variants: [
      { shade: 'Fair', volume: '8g', price: 7.5, stockQuantity: 22 },
      { shade: 'Medium', volume: '8g', price: 7.5, stockQuantity: 17 },
      { shade: 'Tan', volume: '8g', price: 7.5, stockQuantity: 9 },
    ],
  },
  {
    name: 'Sheglam Glow Getter Liquid Highlighter',
    description:
      'A liquid highlighter that melts into skin for a lit-from-within glow.',
    subcategory: 'Highlighter',
    type: ProductType.LIQUID,
    variants: [
      { shade: 'Moonlight', volume: '15ml', price: 8.5, stockQuantity: 26 },
      { shade: 'Sunkissed', volume: '15ml', price: 8.5, stockQuantity: 13 },
    ],
  },
  {
    name: 'Sheglam Baking & Setting Loose Powder',
    description:
      'An ultra-fine loose powder for baking and all-day makeup setting.',
    subcategory: 'Setting Powder',
    type: ProductType.POWDER,
    variants: [
      { shade: 'Translucent', volume: '25g', price: 7.0, stockQuantity: 40 },
      { shade: 'Banana', volume: '25g', price: 7.0, stockQuantity: 18 },
    ],
  },
  {
    name: 'Sheglam All Set Matte Finish Setting Spray',
    description:
      'A lightweight setting spray that locks in makeup with a matte finish.',
    subcategory: 'Setting Spray',
    type: ProductType.SPRAY,
    variants: [
      { shade: 'Universal', volume: '100ml', price: 8.0, stockQuantity: 60 },
    ],
  },
  {
    name: 'Sheglam Berry Palette Eyeshadow',
    description:
      '12-shade matte, satin, and metallic eyeshadow palette in berry tones.',
    subcategory: 'Eyeshadow Palette',
    type: ProductType.PALETTE,
    variants: [{ shade: 'Berry (12 shades)', price: 10.0, stockQuantity: 35 }],
  },
  {
    name: 'Sheglam Line & Snatch Waterproof Eyeliner Pencil',
    description: 'A smudge-proof, waterproof eyeliner pencil with a fine tip.',
    subcategory: 'Eyeliner',
    type: ProductType.PENCIL,
    variants: [
      { shade: 'Jet Black', volume: '1.2g', price: 5.0, stockQuantity: 45 },
      {
        shade: 'Espresso Brown',
        volume: '1.2g',
        price: 5.0,
        stockQuantity: 20,
      },
    ],
  },
  {
    name: 'Sheglam Bombshell Volumizing Mascara',
    description: 'A clump-free volumizing mascara for bold, fluttery lashes.',
    subcategory: 'Mascara',
    type: ProductType.CREAM,
    variants: [
      { shade: 'Blackest Black', volume: '8ml', price: 9.0, stockQuantity: 38 },
      { shade: 'Brown Black', volume: '8ml', price: 9.0, stockQuantity: 16 },
    ],
  },
  {
    name: 'Sheglam Brow Snatched Tinted Gel',
    description:
      'A tinted, flexible-hold brow gel that shapes and sets brows all day.',
    subcategory: 'Eyebrow',
    type: ProductType.GEL,
    variants: [
      { shade: 'Ash Brown', volume: '3ml', price: 6.5, stockQuantity: 24 },
      { shade: 'Chocolate', volume: '3ml', price: 6.5, stockQuantity: 11 },
      { shade: 'Black', volume: '3ml', price: 6.5, stockQuantity: 6 },
    ],
  },
  {
    name: 'Sheglam Fluffy Wispy False Lashes',
    description:
      'Lightweight, reusable false lashes with a natural wispy finish.',
    subcategory: 'Lashes',
    // No enum value fits a physical accessory like lashes — closest fit kept for now.
    type: ProductType.STICK,
    variants: [
      {
        shade: 'Wispy Natural',
        volume: '1 pair',
        price: 4.5,
        stockQuantity: 30,
      },
      {
        shade: 'Dramatic Volume',
        volume: '1 pair',
        price: 4.5,
        stockQuantity: 18,
      },
    ],
  },
  {
    name: 'Sheglam Matte Me Up Lipstick',
    description:
      'A creamy matte lipstick with full-pigment, one-swipe color payoff.',
    subcategory: 'Lipstick',
    type: ProductType.STICK,
    variants: [
      { shade: 'Rosewood', volume: '3.5g', price: 6.0, stockQuantity: 28 },
      { shade: 'Cherry Red', volume: '3.5g', price: 6.0, stockQuantity: 19 },
      { shade: 'Nude Blush', volume: '3.5g', price: 6.0, stockQuantity: 8 },
    ],
  },
  {
    name: 'Sheglam Line & Snatch Lip Liner',
    description: 'A creamy, precise lip liner that glides on without tugging.',
    subcategory: 'Lip Liner',
    type: ProductType.PENCIL,
    variants: [
      { shade: 'Rosewood', volume: '1.2g', price: 4.0, stockQuantity: 33 },
      { shade: 'Cherry Red', volume: '1.2g', price: 4.0, stockQuantity: 21 },
    ],
  },
  {
    name: 'Sheglam Gloss Me Up High Shine Lip Gloss',
    description: 'A non-sticky, high-shine lip gloss with a plumping finish.',
    subcategory: 'Lip Gloss',
    type: ProductType.LIQUID,
    variants: [
      { shade: 'Clear Shine', volume: '5ml', price: 5.5, stockQuantity: 40 },
      { shade: 'Pink Flush', volume: '5ml', price: 5.5, stockQuantity: 25 },
      { shade: 'Coral Pop', volume: '5ml', price: 5.5, stockQuantity: 12 },
    ],
  },
  {
    name: 'Sheglam Vivid Matte Liquid Lipstick',
    description: 'A long-wearing liquid lipstick with a vivid matte finish.',
    subcategory: 'Liquid Lipstick',
    type: ProductType.LIQUID,
    variants: [
      { shade: 'Berry Bold', volume: '4ml', price: 6.5, stockQuantity: 22 },
      { shade: 'True Red', volume: '4ml', price: 6.5, stockQuantity: 17 },
      { shade: 'Mauve On', volume: '4ml', price: 6.5, stockQuantity: 9 },
    ],
  },
];

async function findOrCreate<T extends ObjectLiteral>(
  repo: Repository<T>,
  where: FindOptionsWhere<T>,
  data: DeepPartial<T>,
): Promise<T> {
  const existing = await repo.findOne({ where });
  if (existing) return existing;
  return repo.save(repo.create(data));
}

const UPLOADS_DIR = join(__dirname, '..', '..', '..', 'uploads');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/** Looks for uploads/<subdir>/<slug>.<ext> on disk, trying each known image
 * extension, so any format works and no extension is baked in until it's
 * actually been placed there. Falls back to a placeholder until it is. */
function findUploadedImage(
  subdir: 'brands' | 'products',
  slug: string,
): string {
  for (const ext of IMAGE_EXTENSIONS) {
    const fileName = `${slug}${ext}`;
    if (existsSync(join(UPLOADS_DIR, subdir, fileName))) {
      return `/uploads/${subdir}/${fileName}`;
    }
  }
  return `https://placehold.co/600x600?text=${encodeURIComponent(slug)}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seed() {
  await dataSource.initialize();

  const brandRepo = dataSource.getRepository(Brand);
  const categoryRepo = dataSource.getRepository(Category);
  const subcategoryRepo = dataSource.getRepository(Subcategory);
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const sheglamImage = findUploadedImage('brands', 'sheglam');
  const sheglam = await findOrCreate(
    brandRepo,
    { name: 'Sheglam' },
    { name: 'Sheglam', image: sheglamImage },
  );
  if (sheglam.image !== sheglamImage) {
    sheglam.image = sheglamImage;
    await brandRepo.save(sheglam);
  }

  const categoryIds: Record<string, string> = {};
  for (const categoryName of Object.keys(CATEGORY_TREE)) {
    const category = await findOrCreate(
      categoryRepo,
      { name: categoryName },
      { name: categoryName },
    );
    categoryIds[categoryName] = category.id;
  }

  const subcategoryIds: Record<string, string> = {};
  for (const [categoryName, subNames] of Object.entries(CATEGORY_TREE)) {
    for (const subName of subNames) {
      const subcategory = await findOrCreate(
        subcategoryRepo,
        { name: subName, categoryId: categoryIds[categoryName] },
        { name: subName, categoryId: categoryIds[categoryName] },
      );
      subcategoryIds[subName] = subcategory.id;
    }
  }

  for (const seedProduct of PRODUCTS) {
    const primaryImage = findUploadedImage(
      'products',
      slugify(seedProduct.name),
    );

    let product = await productRepo.findOne({
      where: { name: seedProduct.name },
    });
    if (!product) {
      product = productRepo.create({
        name: seedProduct.name,
        description: seedProduct.description,
        images: [primaryImage],
        primaryImage,
        type: seedProduct.type,
        brandId: sheglam.id,
        subcategoryId: subcategoryIds[seedProduct.subcategory],
      });
    } else {
      Object.assign(product, {
        description: seedProduct.description,
        images: [primaryImage],
        primaryImage,
        type: seedProduct.type,
        brandId: sheglam.id,
        subcategoryId: subcategoryIds[seedProduct.subcategory],
      });
    }
    product = await productRepo.save(product);

    // reseed variants from scratch to keep re-runs idempotent
    await variantRepo.delete({ productId: product.id });
    const variants = seedProduct.variants.map((variant) =>
      variantRepo.create({ ...variant, productId: product.id }),
    );
    await variantRepo.save(variants);

    console.log(`Seeded: ${product.name} (${variants.length} variants)`);
  }

  await dataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
