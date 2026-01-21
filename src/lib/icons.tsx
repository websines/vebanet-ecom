import {
  Cpu,
  Monitor,
  Keyboard,
  Gamepad2,
  Smartphone,
  Tv,
  Refrigerator,
  Home,
  Headphones,
  Watch,
  Camera,
  Wifi,
  Bike,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Cpu,
  Monitor,
  Keyboard,
  Gamepad2,
  Smartphone,
  Tv,
  Refrigerator,
  Home,
  Headphones,
  Watch,
  Camera,
  Wifi,
  Bike,
  Sparkles,
};

export function getIconComponent(iconName: string): LucideIcon | null {
  return iconMap[iconName] || null;
}

export function renderIcon(iconName: string, className?: string) {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className={className} /> : null;
}
