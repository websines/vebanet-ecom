import { Review, ReviewSummary } from '@/types';

// Mock reviews for products
export const reviews: Review[] = [
  // Reviews for NVIDIA RTX 4090
  {
    id: 'review-1',
    productId: 'prod-1',
    userId: 'user-2',
    userName: 'TechEnthusiast',
    rating: 5,
    title: 'Absolutely incredible performance!',
    content:
      'This GPU is a beast. Running everything at 4K ultra with ease. The ray tracing performance is unmatched. Yes, it\'s expensive, but you get what you pay for. Highly recommend for serious gamers and content creators.',
    isVerifiedPurchase: true,
    helpfulCount: 45,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'review-2',
    productId: 'prod-1',
    userId: 'user-3',
    userName: 'GameMaster2024',
    rating: 5,
    title: 'The king of GPUs',
    content:
      'After upgrading from a 3080, the difference is night and day. DLSS 3 with frame generation is a game changer. Make sure you have adequate cooling and a good PSU though.',
    isVerifiedPurchase: true,
    helpfulCount: 32,
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: 'review-3',
    productId: 'prod-1',
    userId: 'user-4',
    userName: 'ContentCreator',
    rating: 4,
    title: 'Great for video editing',
    content:
      'Perfect for my 4K video editing workflow. CUDA acceleration makes Premiere and DaVinci fly. Only knock is the size - it barely fits in my case.',
    isVerifiedPurchase: true,
    helpfulCount: 18,
    createdAt: '2024-01-05T09:15:00Z',
  },

  // Reviews for AMD Ryzen 9 7950X
  {
    id: 'review-4',
    productId: 'prod-2',
    userId: 'user-5',
    userName: 'PCBuilder',
    rating: 5,
    title: 'Productivity monster',
    content:
      'Compiling code has never been faster. The multi-threaded performance is incredible. Running VMs, Docker containers, and still gaming without breaking a sweat.',
    isVerifiedPurchase: true,
    helpfulCount: 67,
    createdAt: '2024-01-12T16:45:00Z',
  },
  {
    id: 'review-5',
    productId: 'prod-2',
    userId: 'user-6',
    userName: 'TechReviewer',
    rating: 4,
    title: 'Excellent but runs warm',
    content:
      'Top-tier performance but you\'ll need a good cooler. The 170W TDP is no joke. Amazing for productivity workloads. Gaming performance is solid too.',
    isVerifiedPurchase: true,
    helpfulCount: 41,
    createdAt: '2024-01-08T11:30:00Z',
  },

  // Reviews for MacBook Pro 16
  {
    id: 'review-6',
    productId: 'prod-7',
    userId: 'user-7',
    userName: 'Developer',
    rating: 5,
    title: 'Best laptop for development',
    content:
      'The M3 Max chip handles everything I throw at it. Multiple IDEs, Docker, and Kubernetes all running smoothly. Battery life is insane - I can code all day without charging.',
    isVerifiedPurchase: true,
    helpfulCount: 89,
    createdAt: '2024-01-14T08:00:00Z',
  },
  {
    id: 'review-7',
    productId: 'prod-7',
    userId: 'user-8',
    userName: 'VideoEditor',
    rating: 5,
    title: 'Video editing powerhouse',
    content:
      'Editing 8K footage with zero lag. The display is gorgeous and accurate for color grading. Export times have been cut in half compared to my old Intel Mac.',
    isVerifiedPurchase: true,
    helpfulCount: 56,
    createdAt: '2024-01-11T13:20:00Z',
  },

  // Reviews for Logitech MX Master 3S
  {
    id: 'review-8',
    productId: 'prod-11',
    userId: 'user-9',
    userName: 'ProductivityPro',
    rating: 5,
    title: 'The perfect productivity mouse',
    content:
      'Ergonomic design, precise tracking, and the MagSpeed wheel is addictive. Multi-device connectivity works flawlessly. Using it with my Mac and PC simultaneously.',
    isVerifiedPurchase: true,
    helpfulCount: 124,
    createdAt: '2024-01-13T10:45:00Z',
  },
  {
    id: 'review-9',
    productId: 'prod-11',
    userId: 'user-10',
    userName: 'DesignerDave',
    rating: 4,
    title: 'Great mouse, minor issues',
    content:
      'Excellent for design work. The gesture button is useful in Photoshop. Only complaint is the Bluetooth connection can be finicky sometimes.',
    isVerifiedPurchase: true,
    helpfulCount: 38,
    createdAt: '2024-01-06T15:30:00Z',
  },

  // Reviews for PS5 Console
  {
    id: 'review-10',
    productId: 'prod-15',
    userId: 'user-11',
    userName: 'ConsoleGamer',
    rating: 5,
    title: 'Next-gen gaming is here',
    content:
      'The DualSense controller alone is worth the upgrade. Haptic feedback and adaptive triggers add so much immersion. Load times are basically non-existent with the SSD.',
    isVerifiedPurchase: true,
    helpfulCount: 203,
    createdAt: '2024-01-09T19:00:00Z',
  },
  {
    id: 'review-11',
    productId: 'prod-15',
    userId: 'user-12',
    userName: 'CasualPlayer',
    rating: 4,
    title: 'Amazing but limited storage',
    content:
      'Games look incredible in 4K. The 825GB fills up fast though - already had to add an NVMe expansion. Game library is building up nicely.',
    isVerifiedPurchase: true,
    helpfulCount: 87,
    createdAt: '2024-01-04T21:15:00Z',
  },

  // Reviews for iPhone 15 Pro Max
  {
    id: 'review-12',
    productId: 'prod-19',
    userId: 'user-13',
    userName: 'AppleFan',
    rating: 5,
    title: 'The best iPhone yet',
    content:
      'The titanium frame is lighter than expected. Camera improvements are substantial - the 5x zoom is incredible. USB-C finally! Action button is super useful.',
    isVerifiedPurchase: true,
    helpfulCount: 156,
    createdAt: '2024-01-07T12:00:00Z',
  },
  {
    id: 'review-13',
    productId: 'prod-19',
    userId: 'user-14',
    userName: 'Photographer',
    rating: 5,
    title: 'Professional camera in your pocket',
    content:
      'The ProRAW photos are stunning. Video capabilities rival dedicated cameras. Night mode is incredible. This is the phone I use for my professional work now.',
    isVerifiedPurchase: true,
    helpfulCount: 98,
    createdAt: '2024-01-02T17:30:00Z',
  },

  // Reviews for LG C3 OLED
  {
    id: 'review-14',
    productId: 'prod-23',
    userId: 'user-15',
    userName: 'HomeTheater',
    rating: 5,
    title: 'Cinema quality at home',
    content:
      'The perfect blacks of OLED still amaze me. HDR content looks unbelievable. Gaming at 4K 120Hz is buttery smooth. Worth every penny for movie lovers.',
    isVerifiedPurchase: true,
    helpfulCount: 178,
    createdAt: '2024-01-11T20:00:00Z',
  },
  {
    id: 'review-15',
    productId: 'prod-23',
    userId: 'user-16',
    userName: 'Gamer123',
    rating: 5,
    title: 'Best gaming TV hands down',
    content:
      'G-Sync and FreeSync support, low input lag, instant response time. Perfect for competitive gaming. The webOS is smooth and has all the apps I need.',
    isVerifiedPurchase: true,
    helpfulCount: 134,
    createdAt: '2024-01-08T22:45:00Z',
  },

  // Reviews for Sony WH-1000XM5
  {
    id: 'review-16',
    productId: 'prod-33',
    userId: 'user-17',
    userName: 'AudioPhile',
    rating: 5,
    title: 'Best noise cancelling ever',
    content:
      'The ANC on these is phenomenal. Can\'t hear anything on flights now. Sound quality is excellent - warm and detailed. Multipoint connection is super useful.',
    isVerifiedPurchase: true,
    helpfulCount: 245,
    createdAt: '2024-01-13T09:30:00Z',
  },
  {
    id: 'review-17',
    productId: 'prod-33',
    userId: 'user-18',
    userName: 'CommutePro',
    rating: 4,
    title: 'Great headphones, minor gripes',
    content:
      'Amazing sound and ANC. My only complaints: they don\'t fold like the XM4s and touch controls can be too sensitive. But comfort is top-notch for long sessions.',
    isVerifiedPurchase: true,
    helpfulCount: 89,
    createdAt: '2024-01-06T14:15:00Z',
  },

  // Reviews for Apple Watch Ultra 2
  {
    id: 'review-18',
    productId: 'prod-37',
    userId: 'user-19',
    userName: 'FitnessTracker',
    rating: 5,
    title: 'The ultimate fitness companion',
    content:
      'Tracking is incredibly accurate. Battery easily lasts 2+ days with heavy use. The brighter display is visible even in direct sunlight. Built like a tank.',
    isVerifiedPurchase: true,
    helpfulCount: 167,
    createdAt: '2024-01-10T07:00:00Z',
  },
  {
    id: 'review-19',
    productId: 'prod-37',
    userId: 'user-20',
    userName: 'Adventurer',
    rating: 5,
    title: 'Perfect for outdoor activities',
    content:
      'Used it for hiking, diving, and mountain biking. GPS is precise, and the action button is great for quick workout starts. Love the emergency siren feature.',
    isVerifiedPurchase: true,
    helpfulCount: 112,
    createdAt: '2024-01-03T16:00:00Z',
  },
];

// Generate review summaries from reviews
export function getReviewSummary(productId: string): ReviewSummary {
  const productReviews = reviews.filter((r) => r.productId === productId);

  if (productReviews.length === 0) {
    return {
      productId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  productReviews.forEach((review) => {
    distribution[review.rating as keyof typeof distribution]++;
    totalRating += review.rating;
  });

  return {
    productId,
    averageRating: Math.round((totalRating / productReviews.length) * 10) / 10,
    totalReviews: productReviews.length,
    ratingDistribution: distribution,
  };
}

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
