"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Verify admin role
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized - Admin access required");
  }

  return supabase;
}

// Product CRUD
export async function createProduct(formData: {
  name: string;
  slug: string;
  description?: string;
  meat_type?: string;
  age_group?: string;
  specials?: string;
  ean?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_on_sale?: boolean;
  bestseller?: boolean;
  feeding_recommendation?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}) {
  try {
    const supabase = await verifyAdmin();

    const { data, error } = await supabase
      .from("products")
      .insert([formData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/products");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(
  productId: string,
  formData: {
    name?: string;
    slug?: string;
    description?: string;
    meat_type?: string;
    age_group?: string;
    specials?: string;
    ean?: number;
    is_featured?: boolean;
    is_new?: boolean;
    is_on_sale?: boolean;
    bestseller?: boolean;
    feeding_recommendation?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  }
) {
  try {
    const supabase = await verifyAdmin();

    const { data, error } = await supabase
      .from("products")
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await verifyAdmin();

    // Delete in order: images, ingredients, variants, related_products, then product
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase
      .from("product_ingredients")
      .delete()
      .eq("product_id", productId);
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId);
    await supabase
      .from("related_products")
      .delete()
      .eq("product_id", productId);
    await supabase
      .from("related_products")
      .delete()
      .eq("related_product_id", productId);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

// Product Images CRUD
export async function addProductImage(imageData: {
  product_id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}) {
  try {
    const supabase = await verifyAdmin();

    // If this is primary, unset other primary images for this product
    if (imageData.is_primary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", imageData.product_id);
    }

    const { data, error } = await supabase
      .from("product_images")
      .insert([imageData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${imageData.product_id}/edit`);
    return { success: true, data };
  } catch (error) {
    console.error("Error adding product image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add product image",
    };
  }
}

export async function updateProductImage(
  imageId: string,
  productId: string,
  imageData: {
    image_url?: string;
    alt_text?: string;
    display_order?: number;
    is_primary?: boolean;
  }
) {
  try {
    const supabase = await verifyAdmin();

    // If setting as primary, unset other primary images for this product
    if (imageData.is_primary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    const { data, error } = await supabase
      .from("product_images")
      .update({ ...imageData, updated_at: new Date().toISOString() })
      .eq("id", imageId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating product image:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update product image",
    };
  }
}

export async function deleteProductImage(imageId: string, productId: string) {
  try {
    const supabase = await verifyAdmin();

    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product image:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete product image",
    };
  }
}

// Product Variants CRUD
export async function addProductVariant(variantData: {
  product_id: string;
  name: string;
  price: number;
  weight_grams: number;
  stock_quantity?: number;
  compare_at_price?: number;
  cost_price?: number;
  is_active?: boolean;
}) {
  try {
    const supabase = await verifyAdmin();

    const { data, error } = await supabase
      .from("product_variants")
      .insert([variantData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${variantData.product_id}/edit`);
    return { success: true, data };
  } catch (error) {
    console.error("Error adding product variant:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to add product variant",
    };
  }
}

export async function updateProductVariant(
  variantId: string,
  productId: string,
  variantData: {
    name?: string;
    price?: number;
    weight_grams?: number;
    stock_quantity?: number;
    compare_at_price?: number;
    cost_price?: number;
    is_active?: boolean;
  }
) {
  try {
    const supabase = await verifyAdmin();

    const { data, error } = await supabase
      .from("product_variants")
      .update({ ...variantData, updated_at: new Date().toISOString() })
      .eq("id", variantId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating product variant:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update product variant",
    };
  }
}

export async function deleteProductVariant(
  variantId: string,
  productId: string
) {
  try {
    const supabase = await verifyAdmin();

    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", variantId);

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product variant:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete product variant",
    };
  }
}

// Product Ingredients
export async function updateProductIngredients(
  productId: string,
  ingredients: {
    ingredient_id: string;
    percentage?: number;
    display_order: number;
  }[]
) {
  try {
    const supabase = await verifyAdmin();

    // Delete existing ingredients
    await supabase
      .from("product_ingredients")
      .delete()
      .eq("product_id", productId);

    // Insert new ingredients
    if (ingredients.length > 0) {
      const { error } = await supabase.from("product_ingredients").insert(
        ingredients.map((ing) => ({
          product_id: productId,
          ...ing,
        }))
      );

      if (error) throw error;
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error updating product ingredients:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update product ingredients",
    };
  }
}
