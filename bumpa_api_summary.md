# Bumpa API Specification Summary

## Order > Get orders
**Method:** GET
**URL:** {{url}}/api/commerce/v1/orders?location_id=4047

**Example Response (200 OK):**
```json
{
    "success": true,
    "orders": {
        "current_page": 1,
        "data": [
            {
                "id": 3166,
                "cart_id": null,
                "store_id": 6858,
                "order_number": "02550",
                "customer_id": null,
                "channel": "WEB",
                "origin": "walk-in",
                "invoice_id": null,
                "status": "COMPLETED",
                "payment_status": "PAID",
                "shipping_status": null,
                "is_guest": 0,
                "taxes": null,
                "customer_details": "",
                "shipping_details": "",
                "shipping_option": null,
                "items": [
                    {
                        "id": 1127638,
                        "tax": null,
                        "url": "https://kristenkicks.bumpa.xyz/products/school-bag/1127638",
                        "name": "School Bag",
                        "unit": "pc",
                        "price": "9000.00",
                        "total": 27000,
                        "variant": null,
                        "discount": null,
                        "quantity": 3,
                        "description": null,
                        "discount_val": null,
                        "discount_type": null,
                        "thumbnail_url": "https://salescabal.s3.eu-west-3.amazonaws.com/default.png"
                    }
                ],
                "meta": null,
                "currency_code": "NGN",
                "total": "27000.00",
                "sub_total": "27000.00",
                "note": null,
                "notes": null,
                "coupon_code": null,
                "total_discount": "0.00",
                "discount_per_item": false,
                "discount_type": "fixed",
                "discount": "0.00",
                "discount_value": "0.00",
                "tax_per_item": false,
                "tax": "0.00",
       
... (truncated)
```

---

## Order > Update order shipping status
**Method:** POST
**URL:** {{url}}/api/commerce/v1/orders/:order/shipping?location_id=4047

**Request Body:**
```json
{
    "shipping_status": "SHIPPED"
}
```

**Example Response (200 OK):**
```json
{
    "order": {
        "id": 2872,
        "cart_id": null,
        "store_id": 6858,
        "order_number": "02318",
        "customer_id": 24,
        "channel": "WEB",
        "origin": "website",
        "invoice_id": null,
        "status": "COMPLETED",
        "payment_status": "PARTIALLY_PAID",
        "shipping_status": "SHIPPED",
        "is_guest": 0,
        "taxes": [
            {
                "id": 274,
                "name": "postgegh",
                "flags": {
                    "pos_apply": true,
                    "storefront_apply": false
                },
                "percent": 10,
                "store_id": 6858,
                "created_at": "2024-04-25T16:49:21.000000Z",
                "updated_at": "2024-04-25T16:49:21.000000Z",
                "description": null,
                "compound_tax": 0,
                "collective_tax": 0
            }
        ],
        "customer_details": {
            "zip": "",
            "city": "California",
            "type": "SHIPPING",
            "phone": "8074600406",
            "state": "Abia",
            "street": "333 Fremont street, san francisco",
            "company": "",
            "country": "Nigeria",
            "default": "",
            "last_name": "cole",
            "first_name": "precious"
        },
        "shipping_details": {
            "zip": "",
            "city": "California",
            "type": "SHIPPING",
            "phone": "8074600406",
            "state": "Abia",
            "street": "333 Fremont street, san francisco",
            "company": "",
            "country": "Nigeria",
            "default": "",
            "last_name": "cole",
            "first_name": "precious"
        },
        "shipping_option": {
            "id": 828,
            "name": "test 3",
            "price": "3300.00",
            "status": 1,
            "is_free": 0,
            "visible": 1,
            "store_id": 6858,
            "conditions": null,
           
... (truncated)
```

---

## Order > Retry order shipping
**Method:** POST
**URL:** {{url}}/api/commerce/v1/orders/:order/shipping/retry?location_id=4047

**Example Response (200 OK):**
```json
{
    "message": "Shipping booking retry has been queued",
    "success": true
}
```

---

## Analytics > Sales > Get Sales Overview
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/sales?dataset=overview&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": [
        {
            "title": "Total Sales",
            "value": "Γéª0.00"
        },
        {
            "title": "Offline Sales",
            "value": "Γéª0.00"
        },
        {
            "title": "Total Settled",
            "value": "Γéª0.00"
        },
        {
            "title": "Total Owed",
            "value": "Γéª0.00"
        }
    ]
}
```

---

## Analytics > Sales > Get Total Sales
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/sales?dataset=total_sales&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": {
        "summary": {
            "title": "Total Sales",
            "value": "Γéª0.00",
            "progress": 0,
            "progress_text": "0% from last month"
        },
        "chart": {
            "current_period": {
                "range": [
                    "2026-04-01T23:00:00.000000Z",
                    "2026-04-15T22:59:59.999999Z"
                ],
                "data": [
                    {
                        "index": 1,
                        "value": 0,
                        "dateLabel": "Apr 02-02"
                    },
                    {
                        "index": 2,
                        "value": 0,
                        "dateLabel": " 03-03"
                    },
                    {
                        "index": 3,
                        "value": 0,
                        "dateLabel": " 04-04"
                    },
                    {
                        "index": 4,
                        "value": 0,
                        "dateLabel": " 05-05"
                    },
                    {
                        "index": 5,
                        "value": 0,
                        "dateLabel": " 06-06"
                    },
                    {
                        "index": 6,
                        "value": 0,
                        "dateLabel": " 07-07"
                    },
                    {
                        "index": 7,
                        "value": 0,
                        "dateLabel": " 08-08"
                    },
                    {
                        "index": 8,
                        "value": 0,
                        "dateLabel": " 09-09"
                    },
                    {
                        "index": 9,
                        "value": 0,
                        "dateLabel": " 10-10"
                    },

... (truncated)
```

---

## Analytics > Sales > Get Net Profit
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/sales?dataset=net_profit&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "error": "Net profit cannot be calculated for this store"
}
```

---

## Analytics > Sales > Get Gross Profit
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/sales?dataset=gross_profit&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "error": "Gross profit cannot be calculated for this store"
}
```

---

## Analytics > Products > Get Products Analytics Overview
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/products?dataset=overview&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": {
        "total_products": {
            "title": "Total Products",
            "value": 33
        },
        "total_stock": {
            "title": "Total Stock Qty",
            "value": "331"
        },
        "inventory_value": {
            "title": "Total Inventory Value",
            "value": 210049323
        },
        "total_products_chart": {
            "range": [
                "2026-04-01T23:00:00.000000Z",
                "2026-04-15T22:59:59.999999Z"
            ],
            "data": [
                {
                    "index": 1,
                    "value": 33,
                    "dateLabel": "Apr 02-02"
                },
                {
                    "index": 2,
                    "value": 33,
                    "dateLabel": " 03-03"
                },
                {
                    "index": 3,
                    "value": 33,
                    "dateLabel": " 04-04"
                },
                {
                    "index": 4,
                    "value": 33,
                    "dateLabel": " 05-05"
                },
                {
                    "index": 5,
                    "value": 33,
                    "dateLabel": " 06-06"
                },
                {
                    "index": 6,
                    "value": 33,
                    "dateLabel": " 07-07"
                },
                {
                    "index": 7,
                    "value": 33,
                    "dateLabel": " 08-08"
                },
                {
                    "index": 8,
                    "value": 33,
                    "dateLabel": " 09-09"
                },
                {
                    "index": 9,
                    "value": 33,
                    "dateLabel": " 10-10"
                },
                {
                    "index": 10,
            
... (truncated)
```

---

## Analytics > Products > Get Products Sold
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/products?dataset=products_sold&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": {
        "summary": {
            "title": "Products Sold",
            "value": 0,
            "progress": 0,
            "progress_text": "0% from last month"
        },
        "chart": {
            "current_period": {
                "range": [
                    "2026-04-01T23:00:00.000000Z",
                    "2026-04-15T22:59:59.999999Z"
                ],
                "data": [
                    {
                        "index": 1,
                        "value": 0,
                        "dateLabel": "Apr 02-02"
                    },
                    {
                        "index": 2,
                        "value": 0,
                        "dateLabel": " 03-03"
                    },
                    {
                        "index": 3,
                        "value": 0,
                        "dateLabel": " 04-04"
                    },
                    {
                        "index": 4,
                        "value": 0,
                        "dateLabel": " 05-05"
                    },
                    {
                        "index": 5,
                        "value": 0,
                        "dateLabel": " 06-06"
                    },
                    {
                        "index": 6,
                        "value": 0,
                        "dateLabel": " 07-07"
                    },
                    {
                        "index": 7,
                        "value": 0,
                        "dateLabel": " 08-08"
                    },
                    {
                        "index": 8,
                        "value": 0,
                        "dateLabel": " 09-09"
                    },
                    {
                        "index": 9,
                        "value": 0,
                        "dateLabel": " 10-10"
                    },
      
... (truncated)
```

---

## Analytics > Products > Get Top Selling Products
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/products?dataset=top_selling_products&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": [
        {
            "title": "Top 5 performing products by order count",
            "data": []
        }
    ]
}
```

---

## Analytics > Products > Get Least Selling Products
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/products?dataset=least_selling_products&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": [
        {
            "title": "Least performing products by order count",
            "data": [
                {
                    "label": "samsung airpods",
                    "value": 0,
                    "id": 1127696
                },
                {
                    "label": "Jalamia",
                    "value": 0,
                    "id": 1127318
                },
                {
                    "label": "samsung airpods",
                    "value": 0,
                    "id": 2788693
                },
                {
                    "label": "New Product With Variations",
                    "value": 0,
                    "id": 2788692
                },
                {
                    "label": "d",
                    "value": 0,
                    "id": 1127491
                }
            ]
        }
    ]
}
```

---

## Analytics > Customers > Get Customers Analytics Overview
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/customers?dataset=overview&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": [
        {
            "title": "Total Customers",
            "value": 170
        },
        {
            "title": "New Customers",
            "value": 0
        },
        {
            "title": "Returning Customers",
            "value": 0
        },
        {
            "title": "Avg. Spend / Customer",
            "value": "Γéª0.00"
        }
    ]
}
```

---

## Analytics > Customers > Get Top Customers
**Method:** GET
**URL:** {{url}}/api/commerce/v1/analytics/customers?dataset=top_customers_order&location_id=5217&from=2026-04-02&to=2026-04-15

**Example Response (200 OK):**
```json
{
    "range": {
        "from": "2026-04-01T23:00:00.000000Z",
        "to": "2026-04-15T22:59:59.999999Z"
    },
    "data": {
        "summary": {
            "title": "Top customers by number of orders",
            "data": []
        }
    }
}
```

---

