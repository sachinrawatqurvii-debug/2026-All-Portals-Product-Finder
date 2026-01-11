Tech Documentation: Product Data Aggregation System

1.  System Overview A centralized system to aggregate product data from
    multiple marketplaces into a unified format for comparison and
    analysis.

Key Features: - Fetch product data from AJIO, TATACLIQ, Shopify, Nykaa,
and Myntra - Store data in MongoDB with unified schema - React-based
dashboard for data visualization - REST API for data operations

## 2. Data Structure

### User Schema
``` javascript
{
    _id:ObjectId,
    username:String,
    employee_id:Number,
    password:String,
    refreshToken:String,
}
```

### Example Document 
```json
{
    "username":"xyz",
    "employee_id":10,
    "password":"kfaslfjadshfasdfasdlklsdfgasd54g2f4gfas2gsdg2adsg2as2gfdsa2g",
    "refreshToken":"hggfasdfjsdkfgkfgsadf54gasd2g13sadg3a23gdfs1g3ag"
}
```


### 2.1 Primary Schema

``` javascript
{
  _id: ObjectId,
  styleNumber: Number,
  marketPlaceDetails: [
    {
      channel: String,
      product_id: String,
      price: Number,
      status: String,
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 Example Document

``` json
{
  "styleNumber": 123456,
  "marketPlaceDetails": [
    {
      "channel": "Myntra",
      "product_id": "MYN-PROD-789",
      "price": 1299,
      "status": "active",
    },
    {
      "channel": "Nykaa",
      "product_id": "NK-PROD-456",
      "price": 1199,
      "status": "active",
    }
  ],
  "createdAt": "2024-01-10T09:00:00Z",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

## 3. API Documentation

Base URL: https://app.example.com/v1

### 3.1 Product Endpoints

#### GET /products

Fetch all products with optional filtering

Query Parameters: - styleNumber - channel - page - limit

Response:

``` json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### GET /products/:styleNumber

``` json
{
  "success": true,
  "data": { "styleNumber": 123456, "marketPlaceDetails": [...] }
}
```

#### POST /products/bulk

``` json
{
  "products": [
    {
      "styleNumber": 123456,
      "marketPlaceDetails": [...]
    }
  ]
}
```

#### PUT /products/:styleNumber/channel/:channel

``` json
{
  "price": 1399,
  "status": "active",
  "metadata": { "discount": 25 }
}
```

### Import Endpoints

(myntra, nykaa, ajio, tata cliq, shopify)

## 4. Database Design

### Collections

``` javascript
{
  styleNumber: Number,
  marketPlaceDetails: [...],
  createdAt: Date,
  updatedAt: Date
}
```

## 5. Project Structure

``` text
product-aggregator/
├── server/
├── client/
└── README.md
```

## 6. Installation & Setup

Backend & frontend setup instructions...

## 7. Core Functions

Myntra import workflow, product aggregation logic...

## 8. React Components

ProductTable.js, ImportPanel.js...

## 9. Environment Variables

.env template...

## 10. Deployment

Security, performance, monitoring...

## 11. API Response Standards
Success & error JSON formats...
