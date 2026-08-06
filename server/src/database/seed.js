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

export const seedMasterAdmin = async () => {
  try {
    const masterAdminCount = await User.count({ where: { role: 'MASTER_ADMIN' } });
    if (masterAdminCount > 0) {
      logger.info('MASTER_ADMIN user already exists. Skipping master admin creation.');
      return;
    }

    const name     = process.env.MASTER_ADMIN_NAME     || 'Master Admin';
    const email    = process.env.MASTER_ADMIN_EMAIL    || 'masteradmin@marblecraft.com';
    const password = process.env.MASTER_ADMIN_PASSWORD || 'MasterAdmin@Craft2024!';

    await User.create({
      name,
      email,
      password,
      role: 'MASTER_ADMIN',
    });

    logger.info(`✅ Single MASTER_ADMIN created successfully (${email}).`);
  } catch (error) {
    logger.error(`Error creating MASTER_ADMIN: ${error.message}`);
  }
};

export const seedDatabase = async () => {
  try {
    // 1. Ensure MASTER_ADMIN is always seeded if missing
    await seedMasterAdmin();

    // 2. Check if DB is already seeded with products/categories
    const usersCount = await User.count();
    if (usersCount > 1) {
      logger.info('Database already contains seeded records. Skipping full seed process.');
      return;
    }

    logger.info('Starting database seeding...');

    // Default accounts
    await User.create({
      name: 'John Architect',
      email: 'john@builder.com',
      password: 'Customer@123',
      role: 'Customer',
    });

    logger.info('Default accounts seeded.');

    // ========================================================
    // 3. Categories (9 requested marble categories)
    // ========================================================
    const catItalian = await Category.create({
      name: 'Premium Italian Marbles',
      description: 'Ultra-luxurious natural white and gold marbles direct from Tuscan quarries.',
      image: '/images/stone_image_23.jpg',
    });

    const catBlack = await Category.create({
      name: 'Black Marbles',
      description: 'Deep black marble with striking white and gold veins.',
      image: '/images/stone_image_3.jpg',
    });

    const catBeige = await Category.create({
      name: 'Beige & Cream Marbles',
      description: 'Warm cream, ivory, and beige marble for opulent interior spaces.',
      image: '/images/stone_image_5.jpg',
    });

    const catGreen = await Category.create({
      name: 'Green Marbles',
      description: 'Emerald and forest green marble with intricate web-like veining.',
      image: '/images/stone_image_4.jpg',
    });

    const catWhite = await Category.create({
      name: 'White Marbles',
      description: 'Pure snow white and silver veined natural marble slabs.',
      image: '/images/stone_image_13.jpg',
    });

    const catBrown = await Category.create({
      name: 'Brown Marbles',
      description: 'Chocolate, mocha, and bronze brown marble with spiderweb veins.',
      image: '/images/stone_image_28.jpg',
    });

    const catRedPink = await Category.create({
      name: 'Red & Pink Marbles',
      description: 'Cherry red, blush pink, and terracotta natural marble.',
      image: '/images/stone_image_6.jpg',
    });

    const catGrey = await Category.create({
      name: 'Grey Marbles',
      description: 'Charcoal and silver grey marble with sleek pewter linear veins.',
      image: '/images/stone_image_7.jpg',
    });

    const catIndian = await Category.create({
      name: 'Indian Marbles',
      description: 'Heritage white, green, and brown marble quarried in Rajasthan.',
      image: '/images/stone_image_27.jpg',
    });

    const catOnyx = await Category.create({
      name: 'Onyx Marbles',
      description: 'Exotic translucent onyx slabs suitable for backlighting.',
      image: '/images/stone_image_32.jpg',
    });

    const catGranite = await Category.create({
      name: 'Granite & Exotic Stones',
      description: 'Heavy-duty natural granite and quartzite slabs for durable surfaces.',
      image: '/images/stone_image_33.jpg',
    });

    const catQuartzite = await Category.create({
      name: 'Quartzite Slabs',
      description: 'High durability premium quartzite stone with marble aesthetic.',
      image: '/images/stone_image_30.jpg',
    });

    logger.info('Categories seeded successfully.');

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
        '/images/stone_image_29.jpg',
      images: [
        '/images/stone_image_29.jpg',
        '/images/stone_image_30.jpg',
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
        '/images/stone_image_31.jpg',
      images: [
        '/images/stone_image_31.jpg',
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
        '/images/stone_image_32.jpg',
      images: [
        '/images/stone_image_32.jpg',
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
        '/images/stone_image_33.jpg',
      images: [
        '/images/stone_image_33.jpg',
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
        '/images/stone_image_30.jpg',
      images: [
        '/images/stone_image_30.jpg',
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
        '/images/stone_image_32.jpg',
      images: [
        '/images/stone_image_32.jpg',
      ],
      featured: false,
    });

    logger.info('Products seeded (6 premium slabs).');

    // ========================================================
    // 5. Portfolio Projects
    // ========================================================
    await Project.create({
      name: 'The St. Regis Sky Residence',
      description:
        'Ultra-luxury penthouse living room and master suite featuring seamless Italian Calacatta Gold marble flooring with mirror-finish polishing.',
      location: 'Mumbai, Maharashtra',
      year: 2025,
      image: '/images/stone_image_11.jpg',
      client: 'St. Regis Residences',
      categoryId: catItalian.id,
    });

    await Project.create({
      name: 'DLF Cybercity Executive Lounge',
      description:
        'Corporate headquarters atrium featuring high-lustre Nero Marquina marble floor tiling with brass borders and backlit onyx reception panels.',
      location: 'Gurugram, Delhi NCR',
      year: 2024,
      image: '/images/stone_image_12.jpg',
      client: 'DLF Commercial Group',
      categoryId: catOnyx.id,
    });

    await Project.create({
      name: 'Taj Palace Heritage Pavilion',
      description:
        'Bespoke courtyard and grand hallway paved with pure Makrana white marble flooring and hand-carved stone inlay borders.',
      location: 'Udaipur, Rajasthan',
      year: 2024,
      image: '/images/stone_image_27.jpg',
      client: 'Taj Hotels & Resorts',
      categoryId: catItalian.id,
    });

    await Project.create({
      name: 'Jubilee Hills Private Estate',
      description:
        'Sprawling 12,000 sq ft private estate featuring high-gloss Super White Quartzite floor slabs and outdoor granite landscape paving.',
      location: 'Hyderabad, Telangana',
      year: 2025,
      image: '/images/stone_image_33.jpg',
      client: 'Jubilee Luxury Living',
      categoryId: catQuartzite.id,
    });

    await Project.create({
      name: 'The Oberoi Horizon Lobby',
      description:
        '5-star hotel grand lobby featuring customized Honey Onyx marble floor medallions and polished Statuario wall cladding.',
      location: 'Bengaluru, Karnataka',
      year: 2024,
      image: '/images/stone_image_1.jpg',
      client: 'Oberoi Hotels Group',
      categoryId: catOnyx.id,
    });

    await Project.create({
      name: 'Jaipur Royal Heritage Resort',
      description:
        'Luxury heritage resort ballroom displaying traditional Indian emerald green marble flooring with gold-veined Calacatta borders.',
      location: 'Jaipur, Rajasthan',
      year: 2025,
      image: '/images/stone_image_4.jpg',
      client: 'Royal Palace Hotels',
      categoryId: catGranite.id,
    });

    logger.info('Projects portfolio seeded (6 projects).');

    // ========================================================
    // 6. Gallery Items
    // ========================================================
    const galleryItems = [
      {
        title: 'Luxury Marble Chef Kitchen',
        description: 'Calacatta book-match slab matching island countertops.',
        tag: 'Kitchen',
        image:
          '/images/stone_image_30.jpg',
      },
      {
        title: 'Honed Marble Spa Bathroom',
        description: 'Carrara slab wall cladding and soaking tub deck.',
        tag: 'Bathroom',
        image:
          '/images/stone_image_31.jpg',
      },
      {
        title: 'Backlit Onyx Hotel Reception',
        description: 'Emerald onyx panels backlit in a 5-star hotel reception.',
        tag: 'Commercial',
        image:
          '/images/stone_image_32.jpg',
      },
      {
        title: 'Calacatta Gold Fireplace Feature',
        description: 'Floor-to-ceiling fireplace wrapped in Calacatta Gold.',
        tag: 'Living Room',
        image:
          '/images/stone_image_29.jpg',
      },
      {
        title: 'Outdoor Granite Terrace',
        description: 'Black Cosmic granite tiling for a luxury outdoor terrace.',
        tag: 'Outdoor',
        image:
          '/images/stone_image_33.jpg',
      },
      {
        title: 'Quartzite Restaurant Countertop',
        description: 'Super White Quartzite bar and service counter in a fine dining restaurant.',
        tag: 'Commercial',
        image:
          '/images/stone_image_30.jpg',
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
        'Italian marble is a timeless investment for any luxury property. However, preserving its brilliant luster requires proper care and protection.\n\n1. Sealing: Apply a high-grade impregnating sealer every 6 to 12 months.\n2. pH-Neutral Cleaning: Never use acidic cleaners like vinegar or lemon juice. Clean daily using warm water and marble soap.\n3. Spills: Wipe up liquids immediately with a soft cloth.',
      author: 'Marco Rossi (Senior Stone Specialist)',
      image: '/images/stone_image_1.jpg',
      tags: ['Marble Care', 'Maintenance', 'Italian Marble'],
      seoTitle: 'Italian Marble Care Guide | Premium Stone Showroom',
      seoDescription: 'Expert tips on sealing, polishing, and preventing etching on your Italian marble countertops.',
      status: 'Published',
    });

    await Blog.create({
      title: 'Italian Statuario vs Calacatta Gold: The Ultimate Comparison',
      content:
        'Quarried exclusively in Tuscany, Italy, both Statuario and Calacatta Gold are world-renowned white marbles offering distinct aesthetics.\n\nStatuario Extra White features a crisp white surface crossed by bold graphite grey veining. Calacatta Gold offers a warmer cream-white background with golden-honey veining.',
      author: 'Elena Vance (Lead Interior Architect)',
      image: '/images/stone_image_2.jpg',
      tags: ['Buying Guide', 'Design Trends', 'Italian Marble'],
      seoTitle: 'Statuario vs Calacatta Gold Marble Comparison',
      seoDescription: 'Discover the differences between Statuario and Calacatta Gold marble slabs.',
      status: 'Published',
    });

    await Blog.create({
      title: 'The Rise of Backlit Translucent Onyx in Luxury Architecture',
      content:
        'Translucent Onyx stone slabs create mesmerizing visual focal points when illuminated from behind using diffuse LED light panels in hotel lobbies, cocktail bars, and VIP lounges.',
      author: 'Rajesh Sharma (Lighting & Stone Designer)',
      image: '/images/stone_image_3.jpg',
      tags: ['Translucent Onyx', 'Architecture', 'Commercial Design'],
      seoTitle: 'Backlit Onyx Walls: Architecture Trends',
      seoDescription: 'How luxury hotels and homes use backlit onyx panels for dramatic ambient lighting.',
      status: 'Published',
    });

    await Blog.create({
      title: 'Quartzite vs Marble Countertops: Which Stone Fits Your Kitchen?',
      content:
        'Choosing between Quartzite and Marble depends on daily lifestyle and maintenance preference. Quartzite rates 7 on Mohs scale with exceptional scratch resistance, while marble offers unmatched cool elegance.',
      author: 'Samantha Vance (Material Scientist)',
      image: '/images/stone_image_4.jpg',
      tags: ['Quartzite', 'Kitchen Design', 'Comparison'],
      seoTitle: 'Quartzite vs Marble for Kitchens',
      seoDescription: 'Compare quartzite and marble for kitchen countertops durability, price, and maintenance.',
      status: 'Published',
    });

    await Blog.create({
      title: 'How to Book-Match Marble Slabs for Wall Feature Panels',
      content:
        'Book-matching involves slicing consecutive marble slabs from the same block and mirroring their veining patterns side-by-side to create symmetrical butterfly patterns across feature walls.',
      author: 'Vikramaditya Singh (Master Mason)',
      image: '/images/stone_image_5.jpg',
      tags: ['Installation', 'Book-Matching', 'Luxury Interiors'],
      seoTitle: 'Book-Matching Marble Slabs Guide',
      seoDescription: 'Learn how to book-match marble slabs for stunning symmetrical wall features.',
      status: 'Published',
    });

    await Blog.create({
      title: 'Restoring Heritage Indian Marble Flooring to Mirror Polish',
      content:
        'Restoring aged Makrana white or emerald green marble floors involves sequential diamond grit grinding followed by crystallization polishing to reactivate natural calcium luster.',
      author: 'Ananya Patel (Restoration Expert)',
      image: '/images/stone_image_6.jpg',
      tags: ['Restoration', 'Indian Marble', 'Flooring'],
      seoTitle: 'Restoring Indian Marble Flooring',
      seoDescription: 'Guide to diamond grinding and polishing heritage Makrana marble floors.',
      status: 'Published',
    });

    logger.info('Blogs seeded (6 articles).');

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
          '/images/stone_image_34.jpg',
      },
      {
        name: 'Marco Rossi',
        designation: 'Real Estate Developer',
        rating: 5,
        feedback:
          'Premium Marbles is our go-to partner for high-end stone panels. Their Italian import handled with zero delays across three major developments.',
        image:
          '/images/stone_image_35.jpg',
      },
      {
        name: 'Priya Kapoor',
        designation: 'Interior Designer, Studio KD',
        rating: 5,
        feedback:
          'The Royal Blue Onyx panels we sourced for our client hotel transformed the lobby beyond imagination. The team guided us through every detail perfectly.',
        image:
          '/images/stone_image_36.jpg',
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
