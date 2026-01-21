import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'components',
    name: 'Components',
    slug: 'components',
    description: 'PC components including GPUs, CPUs, motherboards, RAM, storage, and more',
    icon: 'Cpu',
    productCount: 45,
  },
  {
    id: 'computers',
    name: 'Computers',
    slug: 'computers',
    description: 'Desktops, laptops, mini PCs, workstations, and all-in-one systems',
    icon: 'Monitor',
    productCount: 32,
  },
  {
    id: 'peripherals',
    name: 'Peripherals',
    slug: 'peripherals',
    description: 'Keyboards, mice, monitors, webcams, and headsets',
    icon: 'Keyboard',
    productCount: 56,
  },
  {
    id: 'gaming',
    name: 'Consoles & Gaming',
    slug: 'gaming',
    description: 'Gaming consoles, controllers, VR headsets, and gaming accessories',
    icon: 'Gamepad2',
    productCount: 28,
  },
  {
    id: 'smartphones',
    name: 'Smartphones & Tablets',
    slug: 'smartphones',
    description: 'Mobile phones, tablets, and accessories',
    icon: 'Smartphone',
    productCount: 41,
  },
  {
    id: 'tvs',
    name: 'TVs',
    slug: 'tvs',
    description: 'Smart TVs, OLED, QLED, and monitors for entertainment',
    icon: 'Tv',
    productCount: 24,
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    slug: 'appliances',
    description: 'Kitchen appliances, home electronics, and small appliances',
    icon: 'Refrigerator',
    productCount: 38,
  },
  {
    id: 'smarthome',
    name: 'Smart Home',
    slug: 'smarthome',
    description: 'Smart speakers, cameras, lighting, hubs, and automation',
    icon: 'Home',
    productCount: 29,
  },
  {
    id: 'audio',
    name: 'Audio',
    slug: 'audio',
    description: 'Headphones, speakers, soundbars, and microphones',
    icon: 'Headphones',
    productCount: 47,
  },
  {
    id: 'wearables',
    name: 'Smartwatches & Wearables',
    slug: 'wearables',
    description: 'Smartwatches, fitness trackers, and wearable tech',
    icon: 'Watch',
    productCount: 22,
  },
  {
    id: 'photography',
    name: 'Photography',
    slug: 'photography',
    description: 'Cameras, lenses, drones, and photography accessories',
    icon: 'Camera',
    productCount: 31,
  },
  {
    id: 'networking',
    name: 'Networking',
    slug: 'networking',
    description: 'Routers, switches, mesh systems, and network accessories',
    icon: 'Wifi',
    productCount: 19,
  },
  {
    id: 'mobility',
    name: 'Urban Mobility',
    slug: 'mobility',
    description: 'Electric scooters, e-bikes, and personal transportation',
    icon: 'Bike',
    productCount: 15,
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    slug: 'toys',
    description: 'Electronic toys, educational kits, and games',
    icon: 'Sparkles',
    productCount: 26,
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};
