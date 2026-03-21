import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Article from "./models/Article.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Article.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@forgevogue.com",
      password: "admin123",
      isAdmin: true,
    });

    // Create a regular user
    const user = await User.create({
      name: "John Collector",
      email: "john@example.com",
      password: "john123",
      isAdmin: false,
      badge: "Silver",
      totalSpent: 45000,
    });

    // Seed products
    const products = [
      // --- Rare Sneakers ---
      {
        title: "Air Jordan 1 Retro High OG 'Chicago' (1985)",
        description: "The original Air Jordan 1 in the iconic Chicago colorway. One of the most sought-after sneakers in history, this pair is in near-mint condition with original box included.",
        price: 1250000, category: "Rare Sneakers", rarity: "Legendary", condition: "Near Mint", yearOfOrigin: "1985", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_75d0bb88e2.jpg"],
      },
      {
        title: "Nike Air Mag 'Back to the Future' (2016)",
        description: "The self-lacing Nike Air Mag, inspired by Back to the Future II. Limited to only 89 pairs worldwide. Comes with original power-lacing charger.",
        price: 4500000, category: "Rare Sneakers", rarity: "Legendary", condition: "Mint", yearOfOrigin: "2016", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_b71dce9a40.jpg"],
      },
      {
        title: "Off-White x Nike Air Jordan 1 'Chicago' (2017)",
        description: "Virgil Abloh's iconic deconstruction of the Air Jordan 1. Part of 'The Ten' collection. Deadstock with original zip-tie.",
        price: 850000, category: "Rare Sneakers", rarity: "Ultra Rare", condition: "Mint", yearOfOrigin: "2017", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_f2ad6c4e4c.jpg"],
      },
      {
        title: "Nike SB Dunk Low 'Paris' (2003)",
        description: "One of exactly 202 pairs made for the 'White Dunk' exhibition in Paris. Features unique canvas artwork by French painter Bernard Buffet.",
        price: 3200000, category: "Rare Sneakers", rarity: "Legendary", condition: "Good", yearOfOrigin: "2003", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_75d0bb88e2.jpg"],
      },
      {
        title: "Air Jordan 4 Retro 'Eminem Encore' (2005)",
        description: "Only 50 pairs produced for Eminem's friends and family to celebrate the Encore album. Deep blue suede upper with black, grey, and red accents.",
        price: 2800000, category: "Rare Sneakers", rarity: "Legendary", condition: "Excellent", yearOfOrigin: "2005", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_4a526c5230.jpg"],
      },

      // --- Classic Watches ---
      {
        title: "Rolex Daytona 'Paul Newman' Ref. 6239 (1968)",
        description: "The legendary Rolex Daytona 'Paul Newman' dial variant. One of the most valuable watches ever produced. Full provenance documentation available.",
        price: 15000000, category: "Classic Watches", rarity: "Legendary", condition: "Excellent", yearOfOrigin: "1968", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_9ef6ce334c.jpg"],
      },
      {
        title: "Patek Philippe Nautilus Ref. 5711/1A",
        description: "The highly coveted stainless steel Nautilus with blue dial. Discontinued and tremendously rare. Box and original papers included.",
        price: 11000000, category: "Classic Watches", rarity: "Ultra Rare", condition: "Mint", yearOfOrigin: "2018", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_37fcf67723.jpg"],
      },
      {
        title: "Audemars Piguet Royal Oak Jumbo Extra-Thin",
        description: "The iconic Gerald Genta design from 1972, crafted in 18-carat pink gold with a 'Petite Tapisserie' blue dial.",
        price: 8500000, category: "Classic Watches", rarity: "Rare", condition: "Near Mint", yearOfOrigin: "2020", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_3e029f71ea.jpg"],
      },
      {
        title: "Vacheron Constantin Overseas Dual Time",
        description: "A testament to high horology, featuring dual time zone and day/night indication in stainless steel.",
        price: 4200000, category: "Classic Watches", rarity: "Rare", condition: "Mint", yearOfOrigin: "2021", authenticityCertificate: true, countInStock: 2, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_3e029f71ea.jpg"],
      },
      {
        title: "Rolex Submariner 'Comex' Ref. 5514 (1977)",
        description: "Custom built by Rolex for the French diving company COMEX. Features a helium escape valve. Incredibly rare vintage piece.",
        price: 9800000, category: "Classic Watches", rarity: "Legendary", condition: "Good", yearOfOrigin: "1977", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_c1836c2743.jpg"],
      },

      // --- Vintage Books ---
      {
        title: "First Edition 'To Kill a Mockingbird' (1960)",
        description: "Pristine first edition, first printing of Harper Lee's Pulitzer Prize-winning masterpiece with original dust jacket.",
        price: 2800000, category: "Vintage Books", rarity: "Legendary", condition: "Excellent", yearOfOrigin: "1960", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_60bdf213c0.jpg"],
      },
      {
        title: "First Edition 'The Great Gatsby' (1925)",
        description: "Exquisite first edition, first printing of The Great Gatsby in the original green cloth binding. A cornerstone of American literary collecting.",
        price: 4200000, category: "Vintage Books", rarity: "Legendary", condition: "Good", yearOfOrigin: "1925", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_1bfc554064.jpg"],
      },
      {
        title: "J.R.R. Tolkien 'The Hobbit' First Edition (1937)",
        description: "The Holy Grail of fantasy literature. First impression, showing classic green cloth boards with original map endpapers.",
        price: 6500000, category: "Vintage Books", rarity: "Ultra Rare", condition: "Near Mint", yearOfOrigin: "1937", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_1bfc554064.jpg"],
      },
      {
        title: "Signed First Edition 'Harry Potter and the Philosopher's Stone' (1997)",
        description: "One of only 500 hardback first editions printed. Exceedingly rare, signed by J.K. Rowling in 1998.",
        price: 8900000, category: "Vintage Books", rarity: "Legendary", condition: "Excellent", yearOfOrigin: "1997", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_60bdf213c0.jpg"],
      },
      {
        title: "First Folio of William Shakespeare (1623) Pages",
        description: "An incredibly rare single authentic folio leaf from the 1623 First Folio printing of Shakespeare's comedies.",
        price: 1500000, category: "Vintage Books", rarity: "Ultra Rare", condition: "Fair", yearOfOrigin: "1623", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_f4ed78f111.jpg"],
      },

      // --- Limited Edition Art ---
      {
        title: "Banksy 'Girl with Balloon' Signed Screen Print",
        description: "Authenticated signed screen print by Banksy. Edition of 150. Comes with Pest Control certificate of authenticity.",
        price: 9500000, category: "Limited Edition Art", rarity: "Ultra Rare", condition: "Mint", yearOfOrigin: "2004", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_759464213b.jpg"],
      },
      {
        title: "Damien Hirst 'Spot Painting' Original",
        description: "Original household gloss on canvas from Hirst's iconic spot series. Measuring 12x12 inches, signed on reverse.",
        price: 12000000, category: "Limited Edition Art", rarity: "Legendary", condition: "Mint", yearOfOrigin: "1994", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_1f8e847a8d.jpg"],
      },
      {
        title: "Takashi Murakami 'Flowerball' 3D Lithograph",
        description: "Vibrant spherical lithograph from Murakami. Signed and numbered edition of 300. Pristine framing and matting.",
        price: 850000, category: "Limited Edition Art", rarity: "Rare", condition: "Excellent", yearOfOrigin: "2010", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_1a3d639dd4.jpg"],
      },
      {
        title: "Andy Warhol 'Marilyn Monroe' Screenprint",
        description: "Authentic Factory edition screenprint in bright pink and yellow. Signed in pencil on verso by Andy Warhol.",
        price: 14500000, category: "Limited Edition Art", rarity: "Legendary", condition: "Good", yearOfOrigin: "1967", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_1f8e847a8d.jpg"],
      },

      // --- Signed Memorabilia ---
      {
        title: "Michael Jordan Signed Game-Worn Jersey (1996 Finals)",
        description: "An authenticated Michael Jordan game-worn Chicago Bulls jersey from the 1996 NBA Finals. Signed with UDA hologram.",
        price: 22000000, category: "Signed Memorabilia", rarity: "Legendary", condition: "Good", yearOfOrigin: "1996", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_ee100896c9.jpg"],
      },
      {
        title: "Muhammad Ali Signed Boxing Gloves",
        description: "Everlast boxing gloves signed boldly in silver marker by 'The Greatest' Muhammad Ali. Excellent signature strength.",
        price: 1800000, category: "Signed Memorabilia", rarity: "Ultra Rare", condition: "Excellent", yearOfOrigin: "1985", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_7d5d047102.jpg"],
      },
      {
        title: "Lionel Messi Signed FC Barcelona Boot",
        description: "Adidas Nemeziz boot signed by Lionel Messi from his historic 2012 season where he scored 91 goals. Beckett witnessed.",
        price: 1550000, category: "Signed Memorabilia", rarity: "Rare", condition: "Mint", yearOfOrigin: "2012", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_ee100896c9.jpg"],
      },
      {
        title: "Neil Armstrong Signed Apollo 11 Photograph",
        description: "Original 8x10 NASA glossy of the moon walk, inscribed and signed by the first man on the moon, Neil Armstrong.",
        price: 2800000, category: "Signed Memorabilia", rarity: "Ultra Rare", condition: "Near Mint", yearOfOrigin: "1969", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_11e07b54ab.jpg"],
      },

      // --- Vinyl Records ---
      {
        title: "The Beatles — 'White Album' No. 0000005 (1968)",
        description: "An extremely low-numbered pressing of The Beatles' self-titled 'White Album'. Number 0000005 from the first UK pressing.",
        price: 6800000, category: "Vinyl Records", rarity: "Legendary", condition: "Near Mint", yearOfOrigin: "1968", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_3cf18f9a8c.jpg"],
      },
      {
        title: "Pink Floyd — 'The Dark Side of the Moon' First Pressing",
        description: "Original UK first pressing of Pink Floyd's legendary album on Harvest Records with solid blue triangle label.",
        price: 520000, category: "Vinyl Records", rarity: "Ultra Rare", condition: "Near Mint", yearOfOrigin: "1973", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_9e01e3fb89.jpg"],
      },
      {
        title: "Elvis Presley 'My Happiness' Acetate",
        description: "Facsimile reproduction of the incredibly rare first recording by Elvis at Sun Studios in Memphis.",
        price: 320000, category: "Vinyl Records", rarity: "Rare", condition: "Good", yearOfOrigin: "1953", authenticityCertificate: true, countInStock: 3, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_da09624370.jpg"],
      },
      {
        title: "Nirvana 'Bleach' First Pressing White Vinyl",
        description: "One of only 1000 copies of Nirvana's debut album pressed on white vinyl by Sub Pop records.",
        price: 850000, category: "Vinyl Records", rarity: "Ultra Rare", condition: "Excellent", yearOfOrigin: "1989", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_1ebc858a70.jpg"],
      },

      // --- Antique Collectibles ---
      {
        title: "18th Century Japanese Samurai Katana — Edo Period",
        description: "An authentic hand-forged Japanese katana from the Edo period (circa 1750). The blade features beautiful hamon patterns.",
        price: 3400000, category: "Antique Collectibles", rarity: "Ultra Rare", condition: "Excellent", yearOfOrigin: "1750", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_98a4157f9b.jpg"],
      },
      {
        title: "Ming Dynasty Blue and White Porcelain Vase",
        description: "A breathtakingly preserved porcelain vase from the Chinese Ming Dynasty, featuring intricate dragon motifs.",
        price: 21000000, category: "Antique Collectibles", rarity: "Legendary", condition: "Good", yearOfOrigin: "1550", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_d69905a505.jpg"],
      },
      {
        title: "Roman Empire Denarius Silver Coin (Julius Caesar)",
        description: "A well-preserved silver denarius minted around 44 BC featuring the profile of Julius Caesar.",
        price: 680000, category: "Antique Collectibles", rarity: "Ultra Rare", condition: "Fair", yearOfOrigin: "44 BC", authenticityCertificate: true, countInStock: 1, seller: admin._id, status: "verified",
        images: ["/uploads/seed/img_d6b9a49b32.jpg"],
      },
      {
        title: "Victorian Era Ornate Mantle Clock",
        description: "A masterfully crafted 19th-century French mantle clock adorned with gilt-bronze fixtures and hand-painted enamel.",
        price: 450000, category: "Antique Collectibles", rarity: "Rare", condition: "Excellent", yearOfOrigin: "1880", authenticityCertificate: true, countInStock: 1, seller: user._id, status: "verified",
        images: ["/uploads/seed/img_f9914fc0f9.jpg"],
      },
    ];

    for (const p of products) {
      await Product.create(p);
    }

    // Seed Articles (Journal)
    const articles = [
      {
        title: "The Anatomy of a Grail: Why Vintage Sneakers Command Millions",
        slug: "anatomy-of-grail-vintage-sneakers",
        author: "Adrian Locke, Senior Appraiser",
        coverImage: "/uploads/seed/img_e48131aa34.jpg",
        excerpt: "An inside look into the booming secondary market for vintage sneakers, examining provenance, condition, and cultural impact that drive record auction prices.",
        content: "<p>The sneaker market has transformed from a niche subculture to a multi-billion dollar alternative asset class. In this deep dive, we explore what elevates a simple piece of footwear to 'grail' status...</p>",
        readTime: 6,
      },
      {
        title: "Horological Masterpieces: Identifying Genuine Paul Newman Daytonas",
        slug: "identifying-genuine-paul-newman-daytonas",
        author: "Eleanor Vance, Watch Specialist",
        coverImage: "/uploads/seed/img_1d08be8d62.jpg",
        excerpt: "The intricate details that separate authentic Rolex Daytona \"Paul Newman\" dials from the countless forged iterations floating in the grey market.",
        content: "<p>Perhaps no other watch in history carries the sheer mythological weight of the 'Paul Newman' Daytona. We break down the precise dial variations, typeface nuances, and sub-dial tracking...</p>",
        readTime: 12,
      },
      {
        title: "First Edition Fever: Collecting 20th Century Modern Literature",
        slug: "first-edition-fever-modern-literature",
        author: "Julian Cross",
        coverImage: "/uploads/seed/img_42c9b03c46.jpg",
        excerpt: "From 'The Great Gatsby' to 'To Kill a Mockingbird', why early printings with original dust jackets are outperforming traditional equities.",
        content: "<p>Book collecting is no longer confined to dimly lit libraries; it is an aggressive, fast-moving market. A pristine dust jacket can account for 85% of a book's total valuation...</p>",
        readTime: 8,
      },
      {
        title: "The Banksy Effect: Street Art Validation at High-End Auctions",
        slug: "banksy-effect-street-art",
        author: "Sophia Chen",
        coverImage: "/uploads/seed/img_e63e2ca80b.jpg",
        excerpt: "How subversive, impermanent public art became the darling of blue-chip collectors and elite auction houses globally.",
        content: "<p>When Banksy's 'Girl with Balloon' shredded itself moments after the hammer fell at Sotheby's, it didn't destroy the artwork—it instantly doubled its value...</p>",
        readTime: 5,
      },
      {
        title: "Vinyl Resurgence: Pressings that Define Sonic History",
        slug: "vinyl-resurgence-historic-pressings",
        author: "Marcus Vance",
        coverImage: "/uploads/seed/img_3ce481a256.jpg",
        excerpt: "Why audiophiles and historical collectors pay millions for early Beatles pressings, rare acetates, and pristine Blue Note jazz records.",
        content: "<p>The tactile nature of vinyl has seen a massive resurgence. However, true collectors chase the 'first stampers' and 'promo copies' that capture the original analog warmth...</p>",
        readTime: 7,
      },
      {
        title: "Preserving the Edge: Sword Collecting and Samurai Heritage",
        slug: "preserving-edge-samurai-heritage",
        author: "Kaito Tanaka",
        coverImage: "/uploads/seed/img_83df043e05.jpg",
        excerpt: "Tracing the lineage of Edo-period Katana blades, the importance of the Hamon line, and maintaining steel artifacts.",
        content: "<p>The soul of the samurai lies within the Katana. Authenticating an 18th-century blade requires examining the Nakago (tang) signatures and the granular steel folding techniques...</p>",
        readTime: 10,
      },
      {
        title: "The Vault: Secure Storage and Insurance for Ultra-Rare Assets",
        slug: "secure-storage-insurance-rare-assets",
        author: "ForgeVogue Editorial",
        coverImage: "/uploads/seed/img_3ecaea428d.jpg",
        excerpt: "A guide to the logistics of high-value collecting: climate control, security escorts, fine art insurance, and Swiss freeports.",
        content: "<p>Owning a multi-million-dollar asset is only the first step. Proper preservation and security are paramount. We discuss the rise of bespoke vaults and fractional insurance models...</p>",
        readTime: 8,
      },
      {
        title: "Future Heirlooms: Predicting the Next Generation of Grails",
        slug: "future-heirlooms-next-gen-grails",
        author: "Elena Rodriguez",
        coverImage: "/uploads/seed/img_c51a016935.jpg",
        excerpt: "From independent Swiss watchmakers to digital crypto-artifacts, where are the smart collectors hedging their bets for the 2030s?",
        content: "<p>Looking beyond the established 'blue chips', the next frontier of collecting lies in hyper-limited independent artisans and culturally significant prototype electronics...</p>",
        readTime: 14,
      }
    ];

    for (const a of articles) {
      await Article.create(a);
    }

    console.log("✅ Data seeded successfully!");
    console.log(`   Admin: admin@forgevogue.com / admin123`);
    console.log(`   User:  john@example.com / john123`);
    console.log(`   Products: ${products.length} items seeded`);
    console.log(`   Articles: ${articles.length} pieces seeded`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
