
export interface CMSContent {
  id: string;
  key: string;
  type: 'text' | 'image' | 'document' | 'menu' | 'contact' | 'logo';
  value: string;
  label: string;
  description?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CMSMenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
  roles: string[];
}

export interface CMSSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
}
