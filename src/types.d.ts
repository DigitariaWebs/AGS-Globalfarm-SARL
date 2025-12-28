export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  stock: number;
  organic: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
};

export type Formation = {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  participants: string;
  price: number; // Parsed to number
  category: string;
  modules: string[];
  icon: any; // Icon component
};

export type CartItem = (Product | Formation) & { quantity: number };

// User form data type for registration
export type UserFormData = {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Better Auth types
export type User = {
  id: string;
  email: string;
  name?: string;
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other";
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  user: User;
  session: {
    id: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
};
