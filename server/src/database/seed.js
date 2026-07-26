import {
  User,
  Category,
  Product,
  Project,
  GalleryItem,
  Blog,
  Testimonial,
  FAQ,
} from '../models/index.js';
import logger from '../config/logger.js';

export const seedDatabase = async () => {
  try {
    // 1. Check if DB is already seeded
    const usersCount = await User.count();
    if (usersCount > 0) {
      logger.info('Database already contains records. Skipping seed process.');
      return;
    }

    logger.info('Starting database seeding...');

    // ========================================================
    // 2. Users
    // ========================================================
    // NOTE: The User model's beforeSave hook auto-hashes passwords,
    // so we pass plain-text passwords here.
    await User.create({
      name: 'Executive Admin',
      email: 'admin@premiummarbles.com',
      password: 'Admin@Marbles2024',
      role: 'Admin',
    });

    await User.create({
      name: 'John Architect',
      email: 'john@builder.com',
      password: 'Customer@123',
      role: 'Customer',
    });

    logger.info('Default accounts seeded. Admin: admin@premiummarbles.com / Admin@Marbles2024');

    // ========================================================
    // 3. Categories
    // ========================================================
    const catItalian = await Category.create({
      name: 'Italian Marble',
      description:
        'Ultra-luxurious natural white and gold marbles direct from Tuscan quarries. Renowned globally for high luster and elegant veining.',
      image:
        'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    });

    const catGranite = await Category.create({
      name: 'Exotic Granite',
      description:
        'Extremely durable igneous rocks displaying unique crystalline textures. Ideal for kitchen countertops and high-traffic flooring.',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    });

    const catOnyx = await Category.create({
      name: 'Translucent Onyx',
      description:
        'Exquisite, light-transmitting banded stones with rich natural hues. Popularly backlit in luxury commercial lobbies and bars.',
      image:
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
    });

    const catQuartzite = await Category.create({
      name: 'Premium Quartzite',
      description:
        'Incredibly hard metamorphic rocks that offer the beauty of marble with the durability of granite. Perfect for heavy-use surfaces.',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    });

    logger.info('Categories seeded: Italian, Granite, Onyx, Quartzite');

    // ========================================================
    // 4. Products (using new rich schema)
    // ========================================================
    await Product.create({
      name: 'Calacatta Gold Supreme',
      description:
        'Calacatta Gold is a distinctive Italian marble of whites and golds. Available in both honed and polished finishes, this luxurious natural stone is the perfect choice to create stunning countertops, waterfall islands, and accent walls. Direct import from Carrara quarries.',
      pricePerSqft: 45.0,
      minOrderQty: 100,
      stockQuantity: 4500.0,
      categoryId: catItalian.id,
      origin: 'Carrara, Italy',
      material: 'Marble',
      finish: 'Polished',
      finishes: ['Polished', 'Honed'],
      thickness: 20,
      slabSize: '3100 x 1850 mm',
      colorFamily: 'White & Gold',
      image:
        'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      metaTitle: 'Calacatta Gold Supreme | Italian Marble Slabs',
      metaDescription:
        'Buy premium Calacatta Gold Supreme Italian marble slabs. Direct quarry import, $45/sq ft. Min 100 sq ft order.',
    });

    await Product.create({
      name: 'Statuario Extra White',
      description:
        'Statuario marble is a more exclusive stone with distinct grey and gold veining and a striking, bold pattern. It is considered one of the major white marbles and features very heavy, bold grey veining mixed with thinner patterns. A timeless choice for luxury interiors.',
      pricePerSqft: 52.0,
      minOrderQty: 80,
      stockQuantity: 3200.0,
      categoryId: catItalian.id,
      origin: 'Tuscany, Italy',
      material: 'Marble',
      finish: 'Polished',
      finishes: ['Polished'],
      thickness: 20,
      slabSize: '2900 x 1750 mm',
      colorFamily: 'White & Grey',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      metaTitle: 'Statuario Extra White Marble | Premium Italian Slabs',
      metaDescription:
        'Premium Statuario marble from Tuscany. Bold grey veining on pure white background. Available polished finish.',
    });

    await Product.create({
      name: 'Royal Blue Onyx',
      description:
        'Boasting a deep ocean blue hue with gold and white calcite waves, Royal Blue Onyx can be backlit to create a dramatic architectural focal point. Highly favored in boutique hotel design, reception desks, and feature walls.',
      pricePerSqft: 68.0,
      minOrderQty: 50,
      stockQuantity: 1200.0,
      categoryId: catOnyx.id,
      origin: 'Yazd, Iran',
      material: 'Onyx',
      finish: 'Polished',
      finishes: ['Polished', 'Leathered'],
      thickness: 16,
      slabSize: '2700 x 1600 mm',
      colorFamily: 'Blue & Gold',
      image:
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      metaTitle: 'Royal Blue Onyx Slabs | Translucent Backlit Stone',
      metaDescription:
        'Dramatic Royal Blue Onyx slabs from Iran. Perfect for backlit feature walls and luxury hotel lobbies.',
    });

    await Product.create({
      name: 'Black Cosmic Granite',
      description:
        'Cosmic Black granite features a dark black background with waves and crystals of golden-white quartz. Perfect for custom countertops, outdoor barbecue units, and heavy commercial flooring. Extremely resistant to heat and scratches.',
      pricePerSqft: 28.0,
      minOrderQty: 150,
      stockQuantity: 7500.0,
      categoryId: catGranite.id,
      origin: 'Espírito Santo, Brazil',
      material: 'Granite',
      finish: 'Polished',
      finishes: ['Polished', 'Honed', 'Brushed'],
      thickness: 20,
      slabSize: '3200 x 1950 mm',
      colorFamily: 'Black & Gold',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false,
    });

    await Product.create({
      name: 'Super White Quartzite',
      description:
        'Super White Quartzite is a premium quartzite from Brazil offering the soft aesthetics of marble with the hard-wearing properties of granite. Its delicate grey veining on a bright white canvas creates an elegant neutral that pairs beautifully with any interior palette.',
      pricePerSqft: 38.0,
      minOrderQty: 100,
      stockQuantity: 5000.0,
      categoryId: catQuartzite.id,
      origin: 'Minas Gerais, Brazil',
      material: 'Quartzite',
      finish: 'Polished',
      finishes: ['Polished', 'Honed', 'Leathered'],
      thickness: 20,
      slabSize: '3000 x 1800 mm',
      colorFamily: 'White & Grey',
      image:
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
    });

    await Product.create({
      name: 'Honey Onyx Amber',
      description:
        'A warm amber-gold translucent onyx with honey-coloured banding. When backlit with warm LEDs, this stone radiates a mesmerizing amber glow ideal for wine cellars, luxury bar countertops, and high-end residential feature walls.',
      pricePerSqft: 72.0,
      minOrderQty: 30,
      stockQuantity: 800.0,
      categoryId: catOnyx.id,
      origin: 'Pakistan',
      material: 'Onyx',
      finish: 'Polished',
      finishes: ['Polished'],
      thickness: 16,
      slabSize: '2400 x 1400 mm',
      colorFamily: 'Gold & Amber',
      image:
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false,
    });

    logger.info('Products seeded (6 premium slabs).');

    // ========================================================
    // 5. Portfolio Projects
    // ========================================================
    await Project.create({
      name: 'The Ritz Executive Penthouse',
      description:
        'A luxurious kitchen and master bathroom renovation using Calacatta Gold Supreme waterfall slabs and backlit Onyx accent walls.',
      location: 'Manhattan, New York',
      year: 2025,
      image:
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
      client: 'Ritz Properties LLC',
      categoryId: catItalian.id,
    });

    await Project.create({
      name: 'Grand Hyatt Hotel Lobby',
      description:
        'Cladding structural pillars in book-matched Royal Blue Onyx with integrated architectural backlighting across 3,200 sq ft of lobby space.',
      location: 'Dubai, UAE',
      year: 2024,
      image:
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      client: 'Hyatt International Group',
      categoryId: catOnyx.id,
    });

    await Project.create({
      name: 'Oakwood Signature Residences',
      description:
        'Multi-unit high-rise development featuring Super White Quartzite kitchen countertops and Statuario marble master bath suites across 48 units.',
      location: 'London, UK',
      year: 2024,
      image:
        'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
      client: 'Oakwood Developers Ltd',
      categoryId: catQuartzite.id,
    });

    logger.info('Projects portfolio seeded (3 projects).');

    // ========================================================
    // 6. Gallery Items
    // ========================================================
    const galleryItems = [
      {
        title: 'Luxury Marble Chef Kitchen',
        description: 'Calacatta book-match slab matching island countertops.',
        tag: 'Kitchen',
        image:
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Honed Marble Spa Bathroom',
        description: 'Carrara slab wall cladding and soaking tub deck.',
        tag: 'Bathroom',
        image:
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Backlit Onyx Hotel Reception',
        description: 'Emerald onyx panels backlit in a 5-star hotel reception.',
        tag: 'Commercial',
        image:
          'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Calacatta Gold Fireplace Feature',
        description: 'Floor-to-ceiling fireplace wrapped in Calacatta Gold.',
        tag: 'Living Room',
        image:
          'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Outdoor Granite Terrace',
        description: 'Black Cosmic granite tiling for a luxury outdoor terrace.',
        tag: 'Outdoor',
        image:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Quartzite Restaurant Countertop',
        description: 'Super White Quartzite bar and service counter in a fine dining restaurant.',
        tag: 'Commercial',
        image:
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      },
    ];
    await GalleryItem.bulkCreate(galleryItems);
    logger.info('Gallery items seeded (6 items).');

    // ========================================================
    // 7. Blog Posts
    // ========================================================
    await Blog.create({
      title: 'How to Care for and Protect Your Italian Marble Slabs',
      content:
        'Italian marble is a stunning investment for any property. However, to preserve its lustrous shine, you must clean it using pH-neutral soap, seal it annually, and prevent acid etching from lemons or vinegar immediately...',
      author: 'Premium Marbles Expert',
      image:
        'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
      tags: ['Marble Care', 'Interior Design', 'Maintenance'],
      seoTitle: 'Italian Marble Care Guide | Premium Stone Showroom',
      seoDescription:
        'Expert tips on sealing, polishing, and preventing etching on your Italian marble countertops.',
      status: 'Published',
    });

    await Blog.create({
      title: 'The Rise of Backlit Translucent Onyx in Modern Architecture',
      content:
        'Bespoke designs increasingly leverage natural Onyx to create warm, ambient light emissions. By placing LED panel assemblies behind these translucent stones, architects create glowing centerpieces...',
      author: 'Design Lead',
      image:
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
      tags: ['Onyx', 'Architecture', 'Commercial Design'],
      seoTitle: 'Backlit Onyx Walls: 2025 Architecture Trends',
      seoDescription:
        'How modern hotels and luxury homes use backlit onyx panels for dramatic ambient effects.',
      status: 'Published',
    });

    await Blog.create({
      title: 'Quartzite vs Marble: Which Stone is Right for Your Kitchen?',
      content:
        'Choosing between quartzite and marble for your kitchen is a common design dilemma. While marble offers unmatched beauty with its unique veining, quartzite provides comparable aesthetics with superior scratch and heat resistance...',
      author: 'Stone Specialist',
      image:
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      tags: ['Quartzite', 'Marble', 'Kitchen Design', 'Buying Guide'],
      seoTitle: 'Quartzite vs Marble for Kitchens | Expert Comparison',
      seoDescription:
        'Compare quartzite and marble for kitchen countertops — durability, aesthetics, price, and maintenance.',
      status: 'Published',
    });

    logger.info('Blogs seeded (3 articles).');

    // ========================================================
    // 8. Testimonials
    // ========================================================
    const testimonials = [
      {
        name: 'Samantha Vance',
        designation: 'Lead Architect, Vance Design Labs',
        rating: 5,
        feedback:
          'The Calacatta Gold slabs for our Manhattan project were breathtaking. Perfect book-matching, impeccable finish, and outstanding logistics support.',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Marco Rossi',
        designation: 'Real Estate Developer',
        rating: 5,
        feedback:
          'Premium Marbles is our go-to partner for high-end stone panels. Their Italian import handled with zero delays across three major developments.',
        image:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Priya Kapoor',
        designation: 'Interior Designer, Studio KD',
        rating: 5,
        feedback:
          'The Royal Blue Onyx panels we sourced for our client hotel transformed the lobby beyond imagination. The team guided us through every detail perfectly.',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      },
    ];
    await Testimonial.bulkCreate(testimonials);
    logger.info('Testimonials seeded (3 reviews).');

    // ========================================================
    // 9. FAQs
    // ========================================================
    const faqs = [
      {
        question: 'How often do I need to seal natural marble?',
        answer:
          'We recommend sealing natural marble countertop slabs every 6–12 months depending on usage to shield them from food stain impregnation.',
        category: 'Maintenance',
      },
      {
        question: 'Can I use onyx slabs for kitchen countertops?',
        answer:
          'Onyx is a softer, calcite-based stone. It is highly susceptible to acids and scratches, making it ideal for backlit bars or powder rooms, but less recommended for busy kitchens.',
        category: 'Products',
      },
      {
        question: 'Do you ship marble worldwide?',
        answer:
          'Yes, we crate all slabs in premium heat-treated wooden frames and export worldwide in sea containers with GPS transit monitoring.',
        category: 'Shipping',
      },
      {
        question: 'What is the minimum order quantity?',
        answer:
          'Our minimum order quantities vary by product type, typically starting at 30–150 sq ft. Specific minimums are listed on each product page.',
        category: 'Ordering',
      },
      {
        question: 'Can I request physical samples before ordering?',
        answer:
          'Absolutely. We offer A4-sized sample tiles for most products for a nominal shipping charge. Contact us through the inquiry form or WhatsApp to request samples.',
        category: 'Ordering',
      },
      {
        question: 'What is the difference between polished and honed finish?',
        answer:
          'A polished finish creates a mirror-like, reflective surface that enhances the stone\'s natural colors and veining. Honed finish is matte-smooth, less reflective, and more forgiving with daily use scratches.',
        category: 'Products',
      },
    ];
    await FAQ.bulkCreate(faqs);
    logger.info('FAQs seeded (6 questions).');

    logger.info('✅ Database fully seeded with premium demo data!');
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    logger.error(error.stack);
  }
};
