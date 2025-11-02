import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 * Defines the shape of a Booking in the database
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking schema definition
 * References Event model and includes email validation
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries on eventId
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string): boolean {
          // Email validation regex pattern
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook: Verify that the referenced event exists
 * Prevents orphaned bookings by ensuring eventId points to a valid Event
 * Throws an error if the event does not exist
 */
bookingSchema.pre('save', async function (next) {
  try {
    // Check if eventId has been modified or is new
    if (this.isModified('eventId') || this.isNew) {
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        const error = new mongoose.Error.ValidationError(
          new mongoose.Error(`Event with ID ${this.eventId} does not exist`)
        );
        return next(error);
      }
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create index on eventId for faster queries when filtering bookings by event
bookingSchema.index({ eventId: 1 });

/**
 * Booking model exported for use throughout the application
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
