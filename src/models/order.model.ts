import { Schema, model, Document } from "mongoose";

// Order Interface
export interface IOrder extends Document {
  orderId: string;
  customerId: string;
  productId: string;
  region: string;
  dateOfSale: Date;
  quantitySold: number;
  unitPrice: number;
  discount: number;
  shippingCost: number;
  paymentMethod: "Credit Card" | "PayPal" | "Debit Card";
}

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, unique: true, required: true },
    customerId: { type: String, required: true }, 
    productId: { type: String, required: true }, 
    region: { type: String, required: true },
    dateOfSale: { type: Date, required: true },
    quantitySold: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Credit Card", "PayPal", "Debit Card"],
    },
  },
  { timestamps: true }
);

OrderSchema.index({ dateOfSale: 1 });
OrderSchema.index({ productId: 1 });
OrderSchema.index({ customerId: 1 });

export const Order = model<IOrder>("Order", OrderSchema);
