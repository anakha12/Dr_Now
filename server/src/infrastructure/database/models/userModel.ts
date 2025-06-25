import mongoose,{Schema,Document} from "mongoose";

export interface IUSER extends Document{
    name:string,
    email:string,
    age:string,
    gender:string,
    phone: string;
    dateOfBirth: Date;
    image: string;
    password: string;
    isBlocked: boolean;
    isVerified?: boolean;
    bloodGroup: string;
    address: string;
    role: string; 
    otp?: string;
    otpExpiresAt?: Date;
    uid?: string;
    // profileCompletion: string;
    isDonner: boolean;
    walletBalance?: number;
    walletTransactions?: {
    type: 'credit' | 'debit';
    amount: number;
    reason: string;
    bookingId?: mongoose.Types.ObjectId;
    date?: Date;
    }[];

}

const UserSchema: Schema =new Schema<IUSER>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: { type: String, required: false },
        gender: { type: String, required: false },
        phone: { type: String, required: false },
        dateOfBirth: { type: Date, required: false },
        image: { type: String, required: false },
        password: { type: String, required: false },
        isBlocked: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },    
        bloodGroup: { type: String, required: false },
        address: { type: String, required: false },
        otp: { type: String },
        otpExpiresAt: { type: Date },
        role: { type: String, default: "user" },
        uid: { type: String, required: false, unique: true, sparse: true },

        // profileCompletion: { type: String, default: "false" },
        isDonner: { type: Boolean, default: false },
        walletBalance: { type: Number, default: 0 },
        walletTransactions: [
        {
            type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true,
            },
            amount: { type: Number, required: true },
            reason: { type: String, required: true },
            bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
            date: { type: Date, default: Date.now },
        }
        ],

    },{
        timestamps:true,
    }
)

export default mongoose.model<IUSER>('user',UserSchema);