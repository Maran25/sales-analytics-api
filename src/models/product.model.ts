import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  category: string;
  description?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);
