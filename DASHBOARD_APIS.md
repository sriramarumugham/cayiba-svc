# Dashboard APIs

This document describes the new dashboard APIs that provide statistics and graph data for the admin dashboard.

## Authentication

All dashboard APIs require admin authentication. Use the `Authorization` header with a Bearer token.

## APIs

### 1. Get Dashboard Statistics

**Endpoint:** `GET /admin/dashboard/stats`

**Description:** Returns total counts for advertisements by status and inventory status.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Dashboard Statistics!",
  "data": {
    "totalAdvertisements": 150,
    "activeAdvertisements": 120,
    "deletedAdvertisements": 20,
    "blockedAdvertisements": 10,
    "availableInventory": 100,
    "soldInventory": 30,
    "unlistedInventory": 20
  }
}
```

### 2. Get Dashboard Graph Data

**Endpoint:** `GET /admin/dashboard/graph`

**Description:** Returns daily advertisement creation counts for chart visualization.

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `period` (optional): Time period for the graph data
  - `7d`: Last 7 days
  - `30d`: Last 30 days (default)
  - `90d`: Last 90 days
  - `1y`: Last 1 year

**Example Request:**

```
GET /admin/dashboard/graph?period=30d
```

**Response:**

```json
{
  "success": true,
  "message": "Dashboard Graph Data!",
  "data": {
    "data": [
      {
        "date": "2024-01-01",
        "count": 5
      },
      {
        "date": "2024-01-02",
        "count": 3
      },
      {
        "date": "2024-01-03",
        "count": 7
      }
    ]
  }
}
```

## Implementation Details

### Folder Structure

```
src/
├── domain/
│   └── dashboard/
│       ├── dashboard.request-schema.ts  # API schemas
│       └── dashboard.usecase.ts         # Business logic
└── entrypoints/http/routes/admin/
    └── index.ts                         # Route definitions
```

### Key Features

1. **Admin Authentication**: All APIs use the `isAdmin` function to verify admin privileges
2. **Status Counts**: Provides counts for all advertisement statuses (ACTIVE, DELETED, BLOCKED)
3. **Inventory Counts**: Provides counts for all inventory statuses (AVAILABLE, SOLD, UNLIST)
4. **Time-based Graph**: Supports multiple time periods for trend analysis
5. **Data Completeness**: Graph API fills missing dates with zero counts for complete data

### Error Handling

All APIs follow the standard error handling pattern:

- Returns appropriate HTTP status codes
- Provides descriptive error messages
- Handles authentication failures gracefully

### Usage Examples

#### Frontend Integration

```javascript
// Get dashboard statistics
const stats = await fetch("/admin/dashboard/stats", {
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
});

// Get graph data for last 30 days
const graphData = await fetch("/admin/dashboard/graph?period=30d", {
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
});
```

#### Chart Integration

The graph data is designed to work with popular charting libraries:

```javascript
// For Chart.js
const chartData = {
  labels: graphData.data.map((item) => item.date),
  datasets: [
    {
      label: "Advertisements Created",
      data: graphData.data.map((item) => item.count),
    },
  ],
};
```
