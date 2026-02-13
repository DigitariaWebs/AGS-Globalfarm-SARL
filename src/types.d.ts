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
  isNewProduct?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PaydunyaCartItem = {
  quantity: number;
  price: number;
  _id?: string;
  id?: number;
  title?: string;
  name?: string;
  category?: string;
} & Record<string, unknown>;

export interface PaydunyaInvoice {
  token?: string;
  total_amount: number;
  description?: string;
}

export interface PaydunyaActions {
  cancel_url?: string;
  return_url?: string;
  callback_url?: string;
}

export interface PaydunyaCustomer {
  name?: string;
  email?: string;
  phone?: string;
}

export interface PaydunyaCustomData {
  userId: string;
  cart: any[];
  address?: Address;
}

export interface PaydunyaCallbackData {
  response_code?: string;
  response_text?: string;
  hash: string;
  invoice: PaydunyaInvoice;
  custom_data: PaydunyaCustomData;
  actions?: PaydunyaActions;
  mode?: string;
  status: string;
  customer?: PaydunyaCustomer;
  receipt_url?: string;
  fail_reason?: string;
  errors?: {
    message?: string;
    description?: string;
  };
}

export type Lesson = {
  id: number;
  title: string;
  content?: string;
};

export type Section = {
  id: number;
  title: string;
  description?: string;
  lessons: Lesson[];
};

export type TimeFrame = {
  from: string;
  to: string;
  name: string;
  description?: string;
};

export type Day = {
  name: string;
  timeFrames: TimeFrame[];
};

export type FormationSession = {
  id: number;
  startDate: Date;
  endDate: Date;
  location: string;
  availableSpots: number;
  participants?: string[];
  reservedSpots?: number;
  owned?: boolean;
  status: "open" | "ongoing" | "done";
};

export type OnlineFormation = {
  _id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  level: string;
  price: number;
  category: string;
  type: "online";
  sections?: Section[];
  icon: string;
  owners?: string[];
  owned?: boolean;
  stats?: {
    totalSections: number;
    totalLessons: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type PresentialFormation = {
  _id: string;
  title: string;
  description: string;
  image: string;
  durationDays: number;
  level: string;
  price: number;
  category: string;
  type: "presentiel";
  program: Day[];
  sessions: FormationSession[];
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  icon: string;
  maxParticipants?: number;
  owned?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Formation = OnlineFormation | PresentialFormation;

export type CartItem = (Product | OnlineFormation | PresentialFormation) & {
  quantity: number;
  selectedSessionId?: number; // For presentiel formations with multiple sessions
};

// User form data type for registration
export type UserFormData = {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone?: string;
  address?: Address;
  password: string;
  confirmPassword: string;
};

// Address type
export type Address = {
  id?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

// Better Auth types
export type User = {
  id: string;
  email: string;
  name?: string;
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  addresses?: Address[];
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

export type OrderItem = CartItem & { sessionId?: number; id?: number };

export type Order = {
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  paymentMethod?: string;
  address?: Address;
  paydunyaToken?: string;
  paydunyaStatus?: string;
  paydunyaReceiptUrl?: string;
  paydunyaCustomer?: PaydunyaCustomer;
  paydunyaFailReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type FormationProgress = {
  _id?: string;
  userId: string;
  formationId: number;
  completedLessons: string[]; // Format: "sectionId-lessonId"
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of the correct option
};

export type QuizResult = {
  _id?: string;
  userId: string;
  formationId: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  certificateSentAt?: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CertificateData = {
  userName: string;
  formationTitle: string;
  completionDate: Date;
};

export type EmailAttachment = {
  filename: string;
  content: Buffer | Uint8Array;
  contentType?: string;
};
