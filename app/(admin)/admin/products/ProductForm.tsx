"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  addProductImage,
  updateProductImage,
  deleteProductImage,
  addProductVariant,
  deleteProductVariant,
} from "./actions";
import {
  Plus,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type ProductImage = {
  id?: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
};

type ProductVariant = {
  id?: string;
  name: string;
  price: number;
  weight_grams: number;
  stock_quantity: number;
  compare_at_price?: number;
  cost_price?: number;
  is_active: boolean;
};

type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  meat_type: string;
  age_group: string;
  specials: string;
  ean: string;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  bestseller: boolean;
  feeding_recommendation: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

type Props = {
  product?: ProductFormData;
  existingImages?: ProductImage[];
  existingVariants?: ProductVariant[];
};

export function ProductForm({
  product,
  existingImages = [],
  existingVariants = [],
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Basic product info
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    meat_type: product?.meat_type || "",
    age_group: product?.age_group || "",
    specials: product?.specials || "",
    ean: product?.ean || "",
    is_featured: product?.is_featured || false,
    is_new: product?.is_new || false,
    is_on_sale: product?.is_on_sale || false,
    bestseller: product?.bestseller || false,
    feeding_recommendation: product?.feeding_recommendation || "",
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
    meta_keywords: product?.meta_keywords || "",
  });

  // Images state
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [newImage, setNewImage] = useState<ProductImage>({
    image_url: "",
    alt_text: "",
    display_order: existingImages.length,
    is_primary: existingImages.length === 0,
  });

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>(existingVariants);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    name: "",
    price: 0,
    weight_grams: 0,
    stock_quantity: 0,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      if (product?.id) {
        // Update existing product
        const result = await updateProduct(product.id, {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          meat_type: formData.meat_type || undefined,
          age_group: formData.age_group || undefined,
          specials: formData.specials || undefined,
          ean: formData.ean ? Number(formData.ean) : undefined,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          is_on_sale: formData.is_on_sale,
          bestseller: formData.bestseller,
          feeding_recommendation: formData.feeding_recommendation || undefined,
          meta_title: formData.meta_title || undefined,
          meta_description: formData.meta_description || undefined,
          meta_keywords: formData.meta_keywords || undefined,
        });

        if (result.success) {
          router.push("/admin/products");
        }
      } else {
        // Create new product with images and variants
        const productResult = await createProduct({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          meat_type: formData.meat_type || undefined,
          age_group: formData.age_group || undefined,
          specials: formData.specials || undefined,
          ean: formData.ean ? Number(formData.ean) : undefined,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          is_on_sale: formData.is_on_sale,
          bestseller: formData.bestseller,
          feeding_recommendation: formData.feeding_recommendation || undefined,
          meta_title: formData.meta_title || undefined,
          meta_description: formData.meta_description || undefined,
          meta_keywords: formData.meta_keywords || undefined,
        });

        if (productResult.success && productResult.data) {
          const newProductId = productResult.data.id;

          // Add images if any
          for (const img of images) {
            await addProductImage({
              product_id: newProductId,
              image_url: img.image_url,
              alt_text: img.alt_text,
              display_order: img.display_order,
              is_primary: img.is_primary,
            });
          }

          // Add variants if any
          for (const variant of variants) {
            await addProductVariant({
              product_id: newProductId,
              name: variant.name,
              price: variant.price,
              weight_grams: variant.weight_grams,
              stock_quantity: variant.stock_quantity,
              compare_at_price: variant.compare_at_price,
              cost_price: variant.cost_price,
              is_active: variant.is_active,
            });
          }

          router.push("/admin/products");
        }
      }
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  };

  // Image management
  const handleAddImage = () => {
    if (!newImage.image_url) return;

    // For new products, just add to local state
    if (!product?.id) {
      setImages([...images, { ...newImage }]);
      setNewImage({
        image_url: "",
        alt_text: "",
        display_order: images.length + 1,
        is_primary: false,
      });
      return;
    }

    // For existing products, save to database
    startTransition(async () => {
      const result = await addProductImage({
        product_id: product.id!,
        ...newImage,
      });

      if (result.success && result.data) {
        setImages([...images, result.data]);
        setNewImage({
          image_url: "",
          alt_text: "",
          display_order: images.length + 1,
          is_primary: false,
        });
      }
    });
  };

  const handleDeleteImage = async (imageId: string, index: number) => {
    if (!product?.id) {
      setImages(images.filter((_, i) => i !== index));
      return;
    }

    startTransition(async () => {
      const result = await deleteProductImage(imageId, product.id!);
      if (result.success) {
        setImages(images.filter((_, i) => i !== index));
      }
    });
  };

  const handleSetPrimary = async (imageId: string, index: number) => {
    if (!product?.id) {
      setImages(images.map((img, i) => ({ ...img, is_primary: i === index })));
      return;
    }

    startTransition(async () => {
      const result = await updateProductImage(imageId, product.id!, {
        is_primary: true,
      });
      if (result.success) {
        setImages(
          images.map((img, i) => ({ ...img, is_primary: i === index }))
        );
      }
    });
  };

  const moveImage = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];

    // Update display_order for both
    newImages[index].display_order = index;
    newImages[newIndex].display_order = newIndex;

    setImages(newImages);

    if (product?.id) {
      startTransition(async () => {
        await updateProductImage(newImages[index].id!, product.id!, {
          display_order: index,
        });
        await updateProductImage(newImages[newIndex].id!, product.id!, {
          display_order: newIndex,
        });
      });
    }
  };

  // Variant management
  const handleAddVariant = () => {
    if (!newVariant.name) return;

    // For new products, just add to local state
    if (!product?.id) {
      setVariants([...variants, { ...newVariant }]);
      setNewVariant({
        name: "",
        price: 0,
        weight_grams: 0,
        stock_quantity: 0,
        is_active: true,
      });
      return;
    }

    // For existing products, save to database
    startTransition(async () => {
      const result = await addProductVariant({
        product_id: product.id!,
        ...newVariant,
      });

      if (result.success && result.data) {
        setVariants([...variants, result.data]);
        setNewVariant({
          name: "",
          price: 0,
          weight_grams: 0,
          stock_quantity: 0,
          is_active: true,
        });
      }
    });
  };

  const handleDeleteVariant = async (variantId: string, index: number) => {
    if (!product?.id) {
      setVariants(variants.filter((_, i) => i !== index));
      return;
    }

    startTransition(async () => {
      const result = await deleteProductVariant(variantId, product.id!);
      if (result.success) {
        setVariants(variants.filter((_, i) => i !== index));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Grundinformationen
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Produktname *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="z.B. Rind Adult Classic"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Der Name wird automatisch in eine URL umgewandelt
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              URL-Pfad (Slug) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="rind-adult-classic"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Wird automatisch generiert, nur Kleinbuchstaben und Bindestriche
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Produktbeschreibung
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Beschreiben Sie das Produkt, Zutaten, Vorteile..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Diese Beschreibung wird auf der Produktseite angezeigt
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fleischsorte
            </label>
            <select
              value={formData.meat_type}
              onChange={(e) =>
                setFormData({ ...formData, meat_type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Bitte wählen...</option>
              <option value="ENTE">Ente</option>
              <option value="RIND">Rind</option>
              <option value="KANINCHEN">Kaninchen</option>
              <option value="LAMM">Lamm</option>
              <option value="PFERD">Pferd</option>
              <option value="WILD">Wild</option>
              <option value="LACHS">Lachs</option>
              <option value="HUHN">Huhn</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hauptfleischsorte des Produkts
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Altersgruppe
            </label>
            <select
              value={formData.age_group}
              onChange={(e) =>
                setFormData({ ...formData, age_group: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Bitte wählen...</option>
              <option value="JUNIOR">Junior (Welpen)</option>
              <option value="ADULT">Adult (Erwachsene)</option>
              <option value="SENIOR">Senior (Ältere)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Für welche Altersgruppe ist das Futter geeignet?
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spezialfutter
            </label>
            <select
              value={formData.specials}
              onChange={(e) =>
                setFormData({ ...formData, specials: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Kein Spezialfutter</option>
              <option value="DIAT">Diät</option>
              <option value="HYPOALLERGEN">Hypoallergen</option>
              <option value="DARM">Darm</option>
              <option value="GELENK">Gelenk</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Falls das Produkt eine spezielle Funktion hat (optional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              EAN-Nummer
            </label>
            <input
              type="number"
              value={formData.ean}
              onChange={(e) =>
                setFormData({ ...formData, ean: e.target.value })
              }
              placeholder="4260123456789"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Barcode-Nummer (optional, meist 13-stellig)
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Produktkennzeichnungen
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Hervorgehoben</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) =>
                    setFormData({ ...formData, is_new: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Neu im Sortiment</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_on_sale}
                  onChange={(e) =>
                    setFormData({ ...formData, is_on_sale: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Im Angebot</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.bestseller}
                  onChange={(e) =>
                    setFormData({ ...formData, bestseller: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Bestseller</span>
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Diese Kennzeichnungen werden auf der Website angezeigt
            </p>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Produktbilder
        </h2>

        {/* Existing Images */}
        {images.length > 0 && (
          <div className="mb-4 space-y-2">
            {images.map((img, index) => (
              <div
                key={img.id || index}
                className="flex items-center gap-3 rounded border border-gray-200 p-3"
              >
                <ImageIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {img.image_url}
                  </p>
                  <p className="text-xs text-gray-500">
                    Order: {img.display_order} | Alt: {img.alt_text || "None"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {img.is_primary && (
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Primary
                    </span>
                  )}
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id!, index)}
                      className="text-gray-400 hover:text-yellow-600"
                      disabled={isPending}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0 || isPending}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === images.length - 1 || isPending}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id!, index)}
                    className="text-red-600 hover:text-red-700"
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Image */}
        <div className="space-y-3 rounded border-2 border-dashed border-gray-300 p-4">
          <h3 className="text-sm font-medium text-gray-700">
            Neues Bild hinzufügen
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Bild-URL *
              </label>
              <input
                type="url"
                value={newImage.image_url}
                onChange={(e) =>
                  setNewImage({ ...newImage, image_url: e.target.value })
                }
                placeholder="https://beispiel.de/bilder/produkt.jpg"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Vollständige URL des Bildes (muss mit https:// beginnen)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bildbeschreibung
              </label>
              <input
                type="text"
                value={newImage.alt_text}
                onChange={(e) =>
                  setNewImage({ ...newImage, alt_text: e.target.value })
                }
                placeholder="z.B. Rind Adult Classic - Hauptbild"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Beschreibung für Barrierefreiheit (optional)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reihenfolge
              </label>
              <input
                type="number"
                min="0"
                value={newImage.display_order}
                onChange={(e) =>
                  setNewImage({
                    ...newImage,
                    display_order: parseInt(e.target.value),
                  })
                }
                placeholder="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Position in der Bildergalerie (0 = erstes Bild)
              </p>
            </div>
            <div className="flex items-end md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newImage.is_primary}
                  onChange={(e) =>
                    setNewImage({ ...newImage, is_primary: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Als Hauptbild festlegen
                </span>
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            disabled={!newImage.image_url || isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Bild hinzufügen
          </button>
        </div>
      </div>

      {/* Product Variants */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Produktvarianten
        </h2>

        {/* Existing Variants */}
        {variants.length > 0 && (
          <div className="mb-4 space-y-2">
            {variants.map((variant, index) => (
              <div
                key={variant.id || index}
                className="flex items-center gap-3 rounded border border-gray-200 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {variant.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    €{variant.price} | {variant.weight_grams}g | Stock:{" "}
                    {variant.stock_quantity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(variant.id!, index)}
                  className="text-red-600 hover:text-red-700"
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Variant */}
        <div className="space-y-3 rounded border-2 border-dashed border-gray-300 p-4">
          <h3 className="text-sm font-medium text-gray-700">
            Neue Variante hinzufügen
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Variant Name *
              </label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, name: e.target.value })
                }
                placeholder="z.B. 500g, 1kg, 2kg"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Die Packungsgröße</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verkaufspreis (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newVariant.price || ""}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    price: e.target.value ? parseFloat(e.target.value) : 0,
                  })
                }
                placeholder="19.99"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Punkt als Dezimaltrennzeichen (z.B. 19.99)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gewicht (g) *
              </label>
              <input
                type="number"
                min="0"
                value={newVariant.weight_grams || ""}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    weight_grams: e.target.value ? parseInt(e.target.value) : 0,
                  })
                }
                placeholder="500"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nur Gramm (500g = 500, 1kg = 1000)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lagerbestand
              </label>
              <input
                type="number"
                min="0"
                value={newVariant.stock_quantity || ""}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    stock_quantity: e.target.value
                      ? parseInt(e.target.value)
                      : 0,
                  })
                }
                placeholder="100"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Anzahl verfügbarer Stücke
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Streichpreis (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newVariant.compare_at_price || ""}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    compare_at_price: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="24.99"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Alter Preis für Rabatt-Anzeige (optional)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Einkaufspreis (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newVariant.cost_price || ""}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    cost_price: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="12.50"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ihr Einkaufspreis für Gewinnberechnung (optional)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            disabled={!newVariant.name || isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Variante hinzufügen
          </button>
        </div>
      </div>

      {/* SEO & Additional Info */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          SEO & Zusätzliche Informationen
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fütterungsempfehlung
            </label>
            <textarea
              rows={3}
              value={formData.feeding_recommendation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  feeding_recommendation: e.target.value,
                })
              }
              placeholder="z.B. 200-300g täglich für einen 10kg Hund"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Empfohlene Füttermenge und Hinweise (optional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Titel
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) =>
                setFormData({ ...formData, meta_title: e.target.value })
              }
              placeholder="z.B. Rind Adult Classic - Premium Hundefutter"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Titel für Suchmaschinen (50-60 Zeichen empfohlen, optional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Beschreibung
            </label>
            <textarea
              rows={2}
              value={formData.meta_description}
              onChange={(e) =>
                setFormData({ ...formData, meta_description: e.target.value })
              }
              placeholder="Kurze Beschreibung des Produkts für Google & Co."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Beschreibung für Suchmaschinen (150-160 Zeichen empfohlen,
              optional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Schlüsselwörter
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) =>
                setFormData({ ...formData, meta_keywords: e.target.value })
              }
              placeholder="hundefutter, rind, adult, premium, getreidefrei"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Wichtige Begriffe durch Komma getrennt (optional)
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          disabled={isPending}
        >
          <X className="h-4 w-4" />
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending
            ? "Wird gespeichert..."
            : product?.id
            ? "Produkt aktualisieren"
            : "Produkt erstellen"}
        </button>
      </div>
    </form>
  );
}
