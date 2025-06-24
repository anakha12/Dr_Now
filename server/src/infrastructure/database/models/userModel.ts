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
    },{
        timestamps:true,
    }
)

export default mongoose.model<IUSER>('user',UserSchema);