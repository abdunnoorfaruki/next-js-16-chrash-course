import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * TypeScript interface for Event document
 * Defines the shape of an Event in the database
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date format (YYYY-MM-DD)
  time: string; // Consistent time format (HH:MM)
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event schema definition with all required fields
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title must be less than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [100, 'Slug must be less than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Description must be less than 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
      maxlength: [1000, 'Overview must be less than 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
      maxlength: [1000, 'Image must be less than 1000 characters'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Event audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Generate a URL-friendly slug from the title
 * Converts to lowercase, replaces spaces/special chars with hyphens, removes duplicates
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize date string to ISO format (YYYY-MM-DD)
 * Handles various input formats and converts to standard ISO date
 */
function normalizeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD part
  } catch (error) {
    // If parsing fails, return original string and let validation handle it
    return dateStr;
  }
}

/**
 * Normalize time string to consistent format (HH:MM)
 * Converts various time formats to 24-hour HH:MM format
 */
function normalizeTime(timeStr: string): string {
  // Remove whitespace
  const cleaned = timeStr.trim().toLowerCase();
  
  // Check if it's already in HH:MM or HH:MM:SS format
  const time24Pattern = /^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(am|pm))?$/i;
  const match = cleaned.match(time24Pattern);
  
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3]?.toLowerCase();
    
    // Handle 12-hour format
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    // Validate hours and minutes
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
  
  // If format is invalid, return original (validation will catch it)
  return timeStr;
}

/**
 * Validate that all required string fields are non-empty
 * Throws validation error if any required field is empty
 */
function validateRequiredFields(doc: IEvent): void {
  const requiredFields: (keyof IEvent)[] = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'audience',
    'organizer',
  ];

  for (const field of requiredFields) {
    const value = doc[field];
    if (typeof value === 'string' && value.trim() === '') {
      throw new mongoose.Error.ValidationError(
        new mongoose.Error(`Field '${field}' cannot be empty`)
      );
    }
  }
}

/**
 * Pre-save hook: Automatically generate slug, normalize date/time, and validate fields
 * Only regenerates slug if title has changed (to preserve existing slugs)
 */
eventSchema.pre('save', function (next) {
  // Generate slug only if title changed or slug doesn't exist
  if (this.isModified('title') || !this.slug) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format
  if (this.isModified('date')) {
    this.date = normalizeDate(this.date);
  }

  // Normalize time to consistent format
  if (this.isModified('time')) {
    this.time = normalizeTime(this.time);
  }

  // Validate all required fields are non-empty
  validateRequiredFields(this);

  next();
});

// Create unique index on slug for fast lookups and uniqueness enforcement
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model exported for use throughout the application
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
