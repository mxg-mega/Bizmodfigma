import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Helper function to get user ID from access token
async function getUserId(accessToken: string | undefined): Promise<string | null> {
  if (!accessToken) return null;
  
  // Handle demo mode - both default demo token and dynamically generated tokens
  if (accessToken === "demo-token") {
    return "demo-user-id";
  }
  
  // Handle dynamically created demo users (tokens start with "token-user-")
  if (accessToken.startsWith("token-user-")) {
    // Extract user ID from token
    return accessToken.replace("token-", "");
  }
  
  // Handle real Supabase auth
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  return user?.id || null;
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6451509a/health", (c) => {
  return c.json({ status: "ok" });
});

// ====== BUSINESS MANAGEMENT ROUTES ======

// Get all businesses for a user
app.get("/make-server-6451509a/businesses", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businesses = await kv.getByPrefix(`business:${userId}:`);
    return c.json({ businesses: businesses || [] });
  } catch (error) {
    console.log("Error fetching businesses:", error);
    return c.json({ error: "Failed to fetch businesses" }, 500);
  }
});

// Create a new business
app.post("/make-server-6451509a/businesses", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const businessId = crypto.randomUUID();
    const business = {
      id: businessId,
      userId: userId,
      name: body.name,
      industry: body.industry,
      currency: body.currency || "NGN",
      locations: body.locations || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`business:${userId}:${businessId}`, business);
    return c.json({ business });
  } catch (error) {
    console.log("Error creating business:", error);
    return c.json({ error: "Failed to create business" }, 500);
  }
});

// ====== LOCATION MANAGEMENT ROUTES ======

// Get all locations for a business
app.get("/make-server-6451509a/locations/:businessId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const locations = await kv.getByPrefix(`location:${businessId}:`);
    return c.json({ locations: locations || [] });
  } catch (error) {
    console.log("Error fetching locations:", error);
    return c.json({ error: "Failed to fetch locations" }, 500);
  }
});

// Create a new location
app.post("/make-server-6451509a/locations/:businessId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const body = await c.req.json();
    const locationId = crypto.randomUUID();
    const location = {
      id: locationId,
      businessId,
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country || "Nigeria",
      isDefault: body.isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`location:${businessId}:${locationId}`, location);
    return c.json({ location });
  } catch (error) {
    console.log("Error creating location:", error);
    return c.json({ error: "Failed to create location" }, 500);
  }
});

// ====== INVENTORY MANAGEMENT ROUTES ======

// Get all products for a business
app.get("/make-server-6451509a/products/:businessId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const products = await kv.getByPrefix(`product:${businessId}:`);
    return c.json({ products: products || [] });
  } catch (error) {
    console.log("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Create a new product
app.post("/make-server-6451509a/products/:businessId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const body = await c.req.json();
    const productId = crypto.randomUUID();
    const product = {
      id: productId,
      businessId,
      name: body.name,
      description: body.description || "",
      sku: body.sku || "",
      category: body.category || "General",
      unitType: body.unitType || "piece", // piece, kg, g, liter, ml, meter, cm
      price: body.price || 0,
      costPrice: body.costPrice || 0,
      trackInventory: body.trackInventory !== false,
      stockByLocation: body.stockByLocation || {}, // { locationId: quantity }
      minStockLevel: body.minStockLevel || 0,
      maxStockLevel: body.maxStockLevel || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${businessId}:${productId}`, product);
    return c.json({ product });
  } catch (error) {
    console.log("Error creating product:", error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

// Update product
app.put("/make-server-6451509a/products/:businessId/:productId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const productId = c.req.param("productId");
    const body = await c.req.json();

    const existing = await kv.get(`product:${businessId}:${productId}`);
    if (!existing) {
      return c.json({ error: "Product not found" }, 404);
    }

    const product = {
      ...existing,
      ...body,
      id: productId,
      businessId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${businessId}:${productId}`, product);
    return c.json({ product });
  } catch (error) {
    console.log("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete product
app.delete("/make-server-6451509a/products/:businessId/:productId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const productId = c.req.param("productId");

    await kv.del(`product:${businessId}:${productId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// Update stock for a product at a location
app.post("/make-server-6451509a/products/:businessId/:productId/stock", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const productId = c.req.param("productId");
    const body = await c.req.json();

    const product = await kv.get(`product:${businessId}:${productId}`);
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    const stockByLocation = product.stockByLocation || {};
    const locationId = body.locationId;
    const adjustment = body.adjustment; // positive for add, negative for subtract
    const newQuantity = body.newQuantity;

    if (newQuantity !== undefined) {
      stockByLocation[locationId] = newQuantity;
    } else if (adjustment !== undefined) {
      stockByLocation[locationId] = (stockByLocation[locationId] || 0) + adjustment;
    }

    product.stockByLocation = stockByLocation;
    product.updatedAt = new Date().toISOString();

    await kv.set(`product:${businessId}:${productId}`, product);

    // Log stock movement
    const movementId = crypto.randomUUID();
    const movement = {
      id: movementId,
      businessId,
      productId,
      locationId,
      type: adjustment > 0 ? "in" : adjustment < 0 ? "out" : "adjust",
      quantity: adjustment || newQuantity,
      reason: body.reason || "Manual adjustment",
      createdAt: new Date().toISOString(),
    };
    await kv.set(`stock-movement:${businessId}:${movementId}`, movement);

    return c.json({ product });
  } catch (error) {
    console.log("Error updating stock:", error);
    return c.json({ error: "Failed to update stock" }, 500);
  }
});

// ====== SALES MANAGEMENT ROUTES ======

// Get all sales for a business
app.get("/make-server-6451509a/sales/:businessId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const sales = await kv.getByPrefix(`sale:${businessId}:`);
    return c.json({ sales: sales || [] });
  } catch (error) {
    console.log("Error fetching sales:", error);
    return c.json({ error: "Failed to fetch sales" }, 500);
  }
});

// Create a new sale
app.post("/make-server-6451509a/sales/:businessId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const body = await c.req.json();
    const saleId = crypto.randomUUID();
    
    // Calculate totals
    let subtotal = 0;
    const items = body.items.map((item: any) => {
      const lineTotal = item.quantity * item.price;
      subtotal += lineTotal;
      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitType: item.unitType,
        price: item.price,
        lineTotal,
      };
    });

    const discount = body.discount || 0;
    const tax = body.tax || 0;
    const total = subtotal - discount + tax;

    const sale = {
      id: saleId,
      businessId,
      locationId: body.locationId,
      customerName: body.customerName || "",
      customerPhone: body.customerPhone || "",
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: body.paymentMethod || "cash",
      status: body.status || "completed",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    // Update stock for each item
    for (const item of items) {
      const product = await kv.get(`product:${businessId}:${item.productId}`);
      if (product && product.trackInventory) {
        const stockByLocation = product.stockByLocation || {};
        stockByLocation[body.locationId] = (stockByLocation[body.locationId] || 0) - item.quantity;
        product.stockByLocation = stockByLocation;
        product.updatedAt = new Date().toISOString();
        await kv.set(`product:${businessId}:${item.productId}`, product);

        // Log stock movement
        const movementId = crypto.randomUUID();
        const movement = {
          id: movementId,
          businessId,
          productId: item.productId,
          locationId: body.locationId,
          type: "sale",
          quantity: -item.quantity,
          reason: `Sale #${saleId}`,
          saleId,
          createdAt: new Date().toISOString(),
        };
        await kv.set(`stock-movement:${businessId}:${movementId}`, movement);
      }
    }

    await kv.set(`sale:${businessId}:${saleId}`, sale);
    return c.json({ sale });
  } catch (error) {
    console.log("Error creating sale:", error);
    return c.json({ error: "Failed to create sale" }, 500);
  }
});

// Get sales metrics for a business
app.get("/make-server-6451509a/sales/:businessId/metrics", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const businessId = c.req.param("businessId");
    const sales = await kv.getByPrefix(`sale:${businessId}:`);

    if (!sales || sales.length === 0) {
      return c.json({
        totalSales: 0,
        totalRevenue: 0,
        averageSaleValue: 0,
        salesByDay: [],
        topProducts: [],
      });
    }

    let totalRevenue = 0;
    const salesByDay: any = {};
    const productSales: any = {};

    sales.forEach((sale: any) => {
      totalRevenue += sale.total;
      
      // Group by day
      const date = sale.createdAt.split("T")[0];
      if (!salesByDay[date]) {
        salesByDay[date] = { date, count: 0, revenue: 0 };
      }
      salesByDay[date].count += 1;
      salesByDay[date].revenue += sale.total;

      // Track product sales
      sale.items.forEach((item: any) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.lineTotal;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    return c.json({
      totalSales: sales.length,
      totalRevenue,
      averageSaleValue: totalRevenue / sales.length,
      salesByDay: Object.values(salesByDay),
      topProducts,
    });
  } catch (error) {
    console.log("Error fetching sales metrics:", error);
    return c.json({ error: "Failed to fetch sales metrics" }, 500);
  }
});

// ====== USER PREFERENCES & ONBOARDING ======

// Sign up a new user
app.post("/make-server-6451509a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      user_metadata: { name: name.trim() },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log("Error creating user:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log("User created successfully:", data.user?.id);
    return c.json({ 
      user: data.user,
      message: "User created successfully. You can now sign in."
    });
  } catch (error) {
    console.log("Error in signup endpoint:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get user preferences (including onboarding status)
app.get("/make-server-6451509a/user/preferences", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const preferences = await kv.get(`user:${userId}:preferences`);
    return c.json({ preferences: preferences || { onboardingCompleted: false } });
  } catch (error) {
    console.log("Error fetching user preferences:", error);
    return c.json({ error: "Failed to fetch preferences" }, 500);
  }
});

// Update user preferences (including onboarding status)
app.post("/make-server-6451509a/user/preferences", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const userId = await getUserId(accessToken);
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    
    // Get existing preferences or create new
    const existing = await kv.get(`user:${userId}:preferences`) || {};
    const preferences = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}:preferences`, preferences);
    return c.json({ preferences });
  } catch (error) {
    console.log("Error updating user preferences:", error);
    return c.json({ error: "Failed to update preferences" }, 500);
  }
});

Deno.serve(app.fetch);