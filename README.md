# Sales Analytics API
This API provides sales analytics functionality, including features for uploading and processing CSV files, refreshing data, and retrieving sales insights such as top products. It supports the following features:

CSV Upload & Data Processing: Upload a CSV file, process it in the background, and trigger data refreshes.

Sales Analytics: Retrieve top products based on different parameters like overall, category, and region.

Data Refresh: Refresh data based on the most recent uploaded CSV file.

Table of Contents
Features

API Routes

POST /api/csv/upload

POST /api/csv/refresh

GET /api/sales-analytics/top-products/overall

GET /api/sales-analytics/top-products/category

GET /api/sales-analytics/top-products/region

Setup

Background Jobs & Queues

Testing

License

Features
CSV Upload: Upload a CSV file containing sales data for processing.

Data Refresh: Trigger a refresh of data based on the most recent uploaded CSV file.

Sales Analytics: Retrieve analytics like top N products overall, by category, or by region.

Background Processing: File upload and data processing are handled asynchronously via background jobs using Redis queues.

# API Routes
### 1. POST /api/csv/upload
This route allows you to upload a CSV file. The file will be processed in the background after upload.

Request
Content-Type: multipart/form-data

Body:

file: The CSV file to be uploaded (required).

Response
Status 200: { "message": "File uploaded. Processing in the background." }

Status 400: { "message": "No file uploaded" } (If no file is provided).

Status 500: { "message": "Error uploading file", "error": <error details> } (If any error occurs during file processing).

Example
POST /api/csv/upload
Content-Type: multipart/form-data
file: <CSV File>
### 2. POST /api/csv/refresh
This route triggers a data refresh process using the most recently uploaded CSV file.

Request
Content-Type: application/json

No body is required for the request.

Response
Status 200: { "message": "Data refresh started using the last uploaded CSV." }

Status 404: { "message": "No recent CSV file found." } (If no file has been uploaded yet).

Status 500: { "message": "Error triggering refresh", "error": <error details> } (If any error occurs during the refresh process).

Example
POST /api/csv/refresh
Content-Type: application/json
### 3. GET /api/sales-analytics/top-products/overall
This route retrieves the top N products overall based on quantity sold within a specified date range.

Request
Query Params:

N: Number of top products to retrieve (required, must be a number).

startDate: The start date of the range (required).

endDate: The end date of the range (required).

Response
Status 200: Returns an array of top products with properties: productId, productName, totalQuantitySold.

Status 400: Validation errors for missing or invalid query parameters.

### 4. GET /api/sales-analytics/top-products/category
This route retrieves the top N products for a specific category based on quantity sold within a date range.

Request
Query Params:

N: Number of top products to retrieve (required, must be a number).

category: Category to filter products by (required).

startDate: The start date of the range (required).

endDate: The end date of the range (required).

Response
Status 200: Returns an array of top products filtered by category.

Status 400: Validation errors for missing or invalid query parameters.

### 5. GET /api/sales-analytics/top-products/region
This route retrieves the top N products for a specific region based on quantity sold within a date range.

Request
Query Params:

N: Number of top products to retrieve (required, must be a number).

region: Region to filter products by (required).

startDate: The start date of the range (required).

endDate: The end date of the range (required).

Response
Status 200: Returns an array of top products filtered by region.

Status 400: Validation errors for missing or invalid query parameters.

## Setup
### 1. Clone the repository
git clone https://github.com/Maran25/sales-analytics-api.git
cd [<repo-directory>](https://github.com/Maran25/sales-analytics-api.git)

### 2. Install dependencies

npm install
### 3. Set environment variables
Create a .env file in the root of the project and configure the necessary environment variables (e.g., MongoDB URI, Redis URL, etc.).

### 4. Start the application

npm run start
For local development, the application runs on http://localhost:8080.

# Background Jobs & Queues

This API utilizes Redis for background job processing. The following queues are used:

CSV Processing Queue (csvQueue): Handles the background processing of uploaded CSV files.

Data Refresh Queue (refreshQueue): Handles the background refresh of data based on the most recent uploaded CSV file.

# Testing
Running Tests
You can run the tests for the API using Jest and Supertest. To run the tests:

Set up a test environment (Make sure to configure test MongoDB and Redis).

## Run the tests:

npm test

This will run all the test cases, including those for uploading CSV files and triggering data refresh.

# License
This project is licensed under the MIT License.