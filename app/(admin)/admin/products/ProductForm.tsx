"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Edit2,
  Check,
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
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<ProductImage>({
    image_url: "",
    alt_text: "",
    display_order: existingImages.length,
    is_primary: false,
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
      // If this is the first image, make it primary
      const isFirstImage = images.length === 0;
      setImages([...images, { ...newImage, is_primary: isFirstImage }]);
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
      // If this is the first image, make it primary
      const isFirstImage = images.length === 0;
      const result = await addProductImage({
        product_id: product.id!,
        ...newImage,
        is_primary: isFirstImage,
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
      // The server action now handles unsetting all other primaries and setting this one
      const result = await updateProductImage(imageId, product.id!, {
        is_primary: true,
      });

      if (result.success) {
        setImages(
          images.map((img, i) => ({ ...img, is_primary: i === index }))
        );
      } else {
        console.error("Failed to set primary image:", result.error);
        alert(
          "Fehler beim Setzen des Hauptbildes: " +
            (result.error || "Unbekannter Fehler")
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

  const handleEditImage = (imageId: string) => {
    setEditingImageId(imageId);
  };

  const handleSaveImageEdit = async (imageId: string) => {
    const imageToUpdate = images.find((img) => img.id === imageId);
    if (!imageToUpdate || !product?.id) return;

    startTransition(async () => {
      const result = await updateProductImage(imageId, product.id!, {
        image_url: imageToUpdate.image_url,
        alt_text: imageToUpdate.alt_text,
        display_order: imageToUpdate.display_order,
      });

      if (result.success) {
        setEditingImageId(null);
      } else {
        alert(
          "Fehler beim Aktualisieren des Bildes: " +
            (result.error || "Unbekannter Fehler")
        );
      }
    });
  };

  const handleCancelImageEdit = () => {
    // Reset to original values
    setImages(existingImages);
    setEditingImageId(null);
  };

  const handleImageFieldChange = (
    imageId: string,
    field: keyof ProductImage,
    value: string | number
  ) => {
    setImages(
      images.map((img) =>
        img.id === imageId ? { ...img, [field]: value } : img
      )
    );
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
          Produktinformationen
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Produktname <span className="text-[#a90329]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="z.B. Rind Adult Classic"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-xs text-primary">
              Der Name wird automatisch in eine URL umgewandelt
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              URL-Pfad (Slug) <span className="text-[#a90329]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="rind-adult-classic"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-xs text-primary">
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
            <p className="mt-1 text-xs text-primary">
              Diese Beschreibung wird auf der Produktseite angezeigt
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Fleischsorte
            </label>
            <select
              value={formData.meat_type}
              onChange={(e) =>
                setFormData({ ...formData, meat_type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-accent px-3 py-2 focus:border-accent focus:outline-none cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23C87C28%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-size-[1.5em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10"
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
            <p className="mt-1 text-xs text-primary">
              Hauptfleischsorte des Produkts
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary">
              Altersgruppe
            </label>
            <select
              value={formData.age_group}
              onChange={(e) =>
                setFormData({ ...formData, age_group: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-accent px-3 py-2 focus:border-accent focus:outline-none cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23C87C28%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-size-[1.5em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10"
            >
              <option value="">Bitte wählen...</option>
              <option value="JUNIOR">Junior (Welpen)</option>
              <option value="ADULT">Adult (Erwachsene)</option>
              <option value="SENIOR">Senior (Ältere)</option>
            </select>
            <p className="mt-1 text-xs text-primary">
              Für welche Altersgruppe ist das Futter geeignet?
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Spezialfutter
            </label>
            <select
              value={formData.specials}
              onChange={(e) =>
                setFormData({ ...formData, specials: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-accent px-3 py-2 focus:border-accent focus:outline-none cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23C87C28%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-size-[1.5em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10"
            >
              <option value="">Kein Spezialfutter</option>
              <option value="DIAT">Diät</option>
              <option value="HYPOALLERGEN">Hypoallergen</option>
              <option value="DARM">Darm</option>
              <option value="GELENK">Gelenk</option>
            </select>
            <p className="mt-1 text-xs text-primary">
              Falls das Produkt eine spezielle Funktion hat (optional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              EAN-Nummer
            </label>
            <input
              type="number"
              value={formData.ean}
              onChange={(e) =>
                setFormData({ ...formData, ean: e.target.value })
              }
              placeholder="4260123456789"
              className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-xs text-primary">
              Barcode-Nummer (optional, meist 13-stellig)
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-gray-700 font-bold">
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
            <p className="mt-2 text-xs text-primary">
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
          <div className="mb-6 space-y-3">
            {images.map((img, index) => {
              const isEditing = editingImageId === img.id;

              return (
                <div
                  key={img.id || index}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  {/* Image Preview */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-gray-300 bg-white">
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || "Produktbild"}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/80x80?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Bild-URL
                          </label>
                          <input
                            type="url"
                            value={img.image_url}
                            onChange={(e) =>
                              handleImageFieldChange(
                                img.id!,
                                "image_url",
                                e.target.value
                              )
                            }
                            className="block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Bildbeschreibung
                          </label>
                          <input
                            type="text"
                            value={img.alt_text || ""}
                            onChange={(e) =>
                              handleImageFieldChange(
                                img.id!,
                                "alt_text",
                                e.target.value
                              )
                            }
                            className="block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Anzeigereihenfolge
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={img.display_order}
                            onChange={(e) =>
                              handleImageFieldChange(
                                img.id!,
                                "display_order",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="block w-24 rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {img.alt_text || "Kein Titel"}
                          </p>
                          <p className="text-xs text-primary truncate mt-1">
                            {img.image_url}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                              Position: {img.display_order}
                            </span>
                            {img.is_primary && (
                              <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                <Star className="h-3 w-3 fill-yellow-600" />
                                Hauptbild
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveImageEdit(img.id!)}
                          className="rounded border border-accent bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 cursor-pointer transition-colors disabled:opacity-50"
                          disabled={isPending}
                        >
                          <Check className="h-4 w-4 inline mr-1" />
                          Speichern
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelImageEdit}
                          className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <X className="h-4 w-4 inline mr-1 cursor-pointer" />
                          Abbrechen
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit button */}
                        <button
                          type="button"
                          onClick={() => handleEditImage(img.id!)}
                          className="cursor-pointer rounded border border-accent bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/80 transition-colors disabled:opacity-50"
                          disabled={isPending}
                          title="Bild bearbeiten"
                        >
                          <Edit2 className="h-4 w-4 inline mr-1" />
                          Bearbeiten
                        </button>

                        {/* Primary Image Controls */}
                        {img.is_primary ? (
                          <button
                            type="button"
                            onClick={async () => {
                              if (!product?.id) return;
                              startTransition(async () => {
                                const result = await updateProductImage(
                                  img.id!,
                                  product.id!,
                                  {
                                    is_primary: false,
                                  }
                                );
                                if (result.success) {
                                  setImages(
                                    images.map((i) =>
                                      i.id === img.id
                                        ? { ...i, is_primary: false }
                                        : i
                                    )
                                  );
                                } else {
                                  alert(
                                    "Fehler: " +
                                      (result.error || "Unbekannter Fehler")
                                  );
                                }
                              });
                            }}
                            className="cursor-pointer rounded border border-accent bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-yellow-100 transition-colors disabled:opacity-50"
                            disabled={isPending}
                            title="Hauptbild entfernen"
                          >
                            <Star className="h-4 w-4 inline mr-1 fill-accent" />
                            Nicht mehr Hauptbild
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img.id!, index)}
                            className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={isPending}
                            title="Als Hauptbild setzen"
                          >
                            <Star className="h-4 w-4 inline mr-1" />
                            Hauptbild
                          </button>
                        )}

                        {/* Move buttons */}
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(index, "up")}
                            disabled={index === 0 || isPending}
                            className="cursor-pointer rounded border border-primary bg-white p-1.5 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Nach oben"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, "down")}
                            disabled={index === images.length - 1 || isPending}
                            className="cursor-pointer rounded border border-primary bg-white p-1.5 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Nach unten"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id!, index)}
                          className="cursor-pointer rounded border border-black bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                          disabled={isPending}
                          title="Bild löschen"
                        >
                          <Trash2 className="h-4 w-4 inline mr-1" />
                          Löschen
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add New Image */}
        <div className="space-y-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">
              Neues Bild hinzufügen
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bild-URL <span className="text-[#a90329]">*</span>
              </label>
              <input
                type="url"
                value={newImage.image_url}
                onChange={(e) =>
                  setNewImage({ ...newImage, image_url: e.target.value })
                }
                placeholder="https://beispiel.de/bilder/produkt.jpg"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-primary">
                Vollständige URL des Bildes (muss mit https:// beginnen)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bildbeschreibung
              </label>
              <input
                type="text"
                value={newImage.alt_text}
                onChange={(e) =>
                  setNewImage({ ...newImage, alt_text: e.target.value })
                }
                placeholder="z.B. Rind Adult Classic - Hauptbild"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-primary">
                Beschreibung für Barrierefreiheit (optional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anzeigereihenfolge
              </label>
              <input
                type="number"
                min="0"
                value={newImage.display_order}
                onChange={(e) =>
                  setNewImage({
                    ...newImage,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-primary">
                Position in der Bildergalerie (0 = Standard, 1 = 3kg, 2 = 6kg)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddImage}
            disabled={!newImage.image_url || isPending}
            className="flex items-center gap-2 rounded-(--app-radius) bg-primary/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="cursor-pointer text-[#a90329] hover:text-[#8a0222]"
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
                Variant Name <span className="text-[#a90329]">*</span>
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
              <p className="mt-1 text-xs text-primary">Die Packungsgröße</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verkaufspreis (€) <span className="text-[#a90329]">*</span>
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
              <p className="mt-1 text-xs text-primary">
                Punkt als Dezimaltrennzeichen (z.B. 19.99)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gewicht (g) <span className="text-[#a90329]">*</span>
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
              <p className="mt-1 text-xs text-primary">
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
              <p className="mt-1 text-xs text-primary">
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
              <p className="mt-1 text-xs text-primary">
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
              <p className="mt-1 text-xs text-primary">
                Ihr Einkaufspreis für Gewinnberechnung (optional)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            disabled={!newVariant.name || isPending}
            className="cursor-pointer flex items-center gap-2 rounded-(--app-radius) bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/80 disabled:opacity-50"
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
            <p className="mt-1 text-xs text-primary">
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
            <p className="mt-1 text-xs text-primary">
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
            <p className="mt-1 text-xs text-primary">
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
            <p className="mt-1 text-xs text-primary">
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
          className="flex items-center gap-2 rounded-sm border cursor-pointer border-black px-4 py-2 text-accent hover:bg-accent hover:text-white hover:border-accent"
          disabled={isPending}
        >
          <X className=" text-black h-4 w-4" />
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-(--app-radius) bg-accent px-6 py-2 font-medium text-white cursor-pointer hover:bg-accent/90 disabled:opacity-50"
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
