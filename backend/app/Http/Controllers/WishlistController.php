<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id() ?? $request->header('X-User-Id');

        if (!$userId) {
            return response()->json([], 200);
        }

        $items = Wishlist::with(['product.images', 'product.category'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json($items);
    }

    public function toggle(Request $request, $productId)
    {
        $userId = Auth::id() ?? $request->header('X-User-Id');

        if (!$userId) {
            return response()->json(['message' => 'يرجى تسجيل الدخول أولاً'], 401);
        }

        $wishlist = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json([
                'status' => 'removed',
                'message' => 'تمت الإزالة من المفضلة',
                'product_id' => (int) $productId,
            ]);
        }

        Wishlist::create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);

        return response()->json([
            'status' => 'added',
            'message' => 'تمت الإضافة إلى المفضلة',
            'product_id' => (int) $productId,
        ]);
    }
}