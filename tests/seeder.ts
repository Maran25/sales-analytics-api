import { Product } from "../src/models/product.model";
import { Customer } from "../src/models/customer.model";
import { Order } from "../src/models/order.model";

export const seedDatabase = async () => {
  await Product.deleteMany({});
  await Customer.deleteMany({});
  await Order.deleteMany({});

  const products = [
    { id: "P123", name: "UltraBoost Running Shoes", category: "Shoes", unitPrice: 180.0 },
    { id: "P456", name: "iPhone 15 Pro", category: "Electronics", unitPrice: 1299.0 },
    { id: "P789", name: "Levi's 501 Jeans", category: "Clothing", unitPrice: 59.99 },
    { id: "P234", name: "Sony WH-1000XM5 Headphones", category: "Electronics", unitPrice: 349.99 },
  ];

  const customers = [
    { id: "C456", name: "John Smith", email: "johnsmith@email.com", address: "123 Main St, Anytown, CA 12345" },
    { id: "C789", name: "Emily Davis", email: "emilydavis@email.com", address: "456 Elm St, Otherville, NY 54321" },
    { id: "C101", name: "Sarah Johnson", email: "sarahjohnson@email.com", address: "789 Oak St, New City, TX 75024" },
  ];

  const orders = [
    { id: "1001", productId: "P123", customerId: "C456", region: "North America", dateOfSale: new Date("2023-12-15"), quantitySold: 2, discount: 0.1, shippingCost: 10.0, paymentMethod: "Credit Card", unitPrice: 180.0 },
    { id: "1002", productId: "P456", customerId: "C789", region: "Europe", dateOfSale: new Date("2024-01-03"), quantitySold: 1, discount: 0.0, shippingCost: 15.0, paymentMethod: "PayPal", unitPrice: 1299.0 },
    { id: "1003", productId: "P789", customerId: "C456", region: "Asia", dateOfSale: new Date("2024-02-28"), quantitySold: 3, discount: 0.2, shippingCost: 5.0, paymentMethod: "Debit Card", unitPrice: 59.99 },
    { id: "1004", productId: "P123", customerId: "C101", region: "South America", dateOfSale: new Date("2024-03-10"), quantitySold: 1, discount: 0.0, shippingCost: 8.0, paymentMethod: "Credit Card", unitPrice: 180.0 },
    { id: "1005", productId: "P234", customerId: "C789", region: "North America", dateOfSale: new Date("2024-04-22"), quantitySold: 1, discount: 0.15, shippingCost: 12.0, paymentMethod: "PayPal", unitPrice: 349.99 },
    { id: "1006", productId: "P456", customerId: "C101", region: "Asia", dateOfSale: new Date("2024-05-18"), quantitySold: 2, discount: 0.05, shippingCost: 20.0, paymentMethod: "Debit Card", unitPrice: 1299.0 },
  ];
  

  const productRes = await Product.insertMany(products);
  console.log('productRes', productRes)
  const customerRes = await Customer.insertMany(customers);
  console.log('customerRes', customerRes)
  const orderRes = await Order.insertMany(orders);
  console.log('orderRes', orderRes)
};
