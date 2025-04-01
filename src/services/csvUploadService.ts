import fs from "fs";
import Joi from "joi";
import csvParser from "csv-parser";
import { Product } from "../models/product.model";
import { Customer } from "../models/customer.model";
import { Order } from "../models/order.model";

const BATCH_SIZE = 10000;

class CsvUploadService {
  async processCsvFile(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      const productOps: any[] = [];
      const customerOps: any[] = [];
      const orderOps: any[] = [];
      const seenProducts = new Set();
      const seenCustomers = new Set();
      const invalidRows: any[] = [];

      let counter = 0;

      const stream = fs
        .createReadStream(filePath)
        .pipe(csvParser())
        .on("data", async (row: any) => {
          counter++;

          const { error, value: validatedRow } = this.validateRow(row);
          if (error) {
            invalidRows.push({ row, error: error.details });
            return; // Skipping the invalid row
          }

          const {
            orderId,
            productId,
            customerId,
            productName,
            category,
            region,
            dateOfSale,
            quantitySold,
            unitPrice,
            discount,
            shippingCost,
            paymentMethod,
            customerName,
            customerEmail,
            customerAddress,
          } = validatedRow;

          if (!seenProducts.has(productId)) {
            productOps.push({
              updateOne: {
                filter: { productId },
                update: {
                  $setOnInsert: { productId, name: productName, category },
                },
                upsert: true,
              },
            });
            seenProducts.add(productId);
          }

          if (!seenCustomers.has(customerId)) {
            customerOps.push({
              updateOne: {
                filter: { customerId },
                update: {
                  $setOnInsert: {
                    customerId,
                    name: customerName,
                    email: customerEmail,
                    address: customerAddress,
                  },
                },
                upsert: true,
              },
            });
            seenCustomers.add(customerId);
          }

          orderOps.push({
            updateOne: {
              filter: { orderId },
              update: {
                $setOnInsert: {
                  orderId,
                  productId,
                  customerId,
                  region,
                  dateOfSale: new Date(dateOfSale),
                  quantitySold: Number(quantitySold),
                  unitPrice: Number(unitPrice),
                  discount: Number(discount),
                  shippingCost: Number(shippingCost),
                  paymentMethod,
                },
              },
              upsert: true,
            },
          });

          // Process in batches
          if (counter % BATCH_SIZE === 0) {
            stream.pause();
            await this.insertBatch(productOps, customerOps, orderOps);
            stream.resume();
          }
        })
        .on("end", async () => {
          // Insert any remaining records
          await this.insertBatch(productOps, customerOps, orderOps);
          resolve();
        })
        .on("error", (error: Error) => reject(error));
    });
  }

  /**
   * Inserting data batch by batch to avoid bottle necks
   */
  private async insertBatch(products: any[], customers: any[], orders: any[]) {
    if (products.length > 0) await Product.bulkWrite(products);
    if (customers.length > 0) await Customer.bulkWrite(customers);
    if (orders.length > 0) await Order.bulkWrite(orders);

    products.length = 0;
    customers.length = 0;
    orders.length = 0;
  }

  /**
   * Validate and transform CSV row data using Joi
   */
  private validateRow(row: any) {
    const schema = Joi.object({
      orderId: Joi.string().trim().required(),
      productId: Joi.string().trim().required(),
      customerId: Joi.string().trim().required(),
      productName: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
      region: Joi.string().trim().required(),
      dateOfSale: Joi.date().iso().required(),
      quantitySold: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().precision(2).min(0).required(),
      discount: Joi.number().precision(2).min(0).required(),
      shippingCost: Joi.number().precision(2).min(0).required(),
      paymentMethod: Joi.string()
        .trim()
        .valid("Credit Card", "Debit Card", "PayPal", "Cash", "Bank Transfer")
        .required(),
      customerName: Joi.string().trim().required(),
      customerEmail: Joi.string().email().required(),
      customerAddress: Joi.string().trim().required(),
    });

    return schema.validate({
      orderId: String(row["Order ID"]).trim(),
      productId: String(row["Product ID"]).trim(),
      customerId: String(row["Customer ID"]).trim(),
      productName: String(row["Product Name"]).trim(),
      category: String(row["Category"]).trim(),
      region: String(row["Region"]).trim(),
      dateOfSale: row["Date of Sale"],
      quantitySold: Number(row["Quantity Sold"]),
      unitPrice: Number(row["Unit Price"]),
      discount: Number(row["Discount"]),
      shippingCost: Number(row["Shipping Cost"]),
      paymentMethod: String(row["Payment Method"]).trim(),
      customerName: String(row["Customer Name"]).trim(),
      customerEmail: String(row["Customer Email"]).trim(),
      customerAddress: String(row["Customer Address"]).trim(),
    });
  }
}

export default new CsvUploadService();
