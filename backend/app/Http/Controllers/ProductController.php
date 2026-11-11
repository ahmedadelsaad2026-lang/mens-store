<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['images', 'category', 'variants'])->latest()->get();
        return response()->json($products);
    }

    public function show($identifier)
    {
        $product = Product::with(['images', 'category', 'variants'])
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated =$request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'required|url',
        ]);

        $slug = Str::slug($validated['name']) . '-' . rand(100, 999);

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'image' => $validated['image'],
        ]);

        // حفظ الصورة في جدول الصور التابع
        ProductImage::create([
            'product_id' => $product->id,
            'image_url' => $validated['image'],
            'is_primary' => true,
        ]);

        // إنشاء مقاسات قياسية افتراضية
        $sizes = ['M', 'L', 'XL'];
        foreach ($sizes as$size) {
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => $size,
                'color' => 'Standard',
                'stock' => 15,
            ]);
        }

        return response()->json($product->load(['images', 'category', 'variants']), 201);
    }

    // تعديل السعر وسعر الخصم والمخزون
    public function update(Request $request,$id)
    {
        $product = Product::findOrFail($id);

        $validated =$request->validate([
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'name' => 'sometimes|required|string|max:255',
        ]);

        $product->update([
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
        ]);

        if (!empty($validated['name'])) {
            $product->update(['name' =>$validated['name']]);
        }

        return response()->json([
            'message' => 'تم تعديل المنتج بنجاح',
            'product' => $product->load(['images', 'category', 'variants']),
        ]);
    }

    // حذف المنتج نهائياً من المتجر
    public function destroy($id)
    {
        $product = Product::findOrFail($id);$product->delete();

        return response()->json([
            'message' => 'تم حذف المنتج بنجاح',
            'id' => (int) $id,
        ]);
    }
}