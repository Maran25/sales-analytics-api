import { Schema, model, Document } from "mongoose";

export interface ICustomer extends Document {
    id: string;
    name: string;
    email: string;
    address: string;
  }
  
  // Customer Schema
  const CustomerSchema = new Schema<ICustomer>(
    {
      id: { type: String, unique: true, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  export const Customer = model<ICustomer>("Customer", CustomerSchema);
  