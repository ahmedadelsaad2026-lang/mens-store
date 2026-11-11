<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // جميع الطلبات للوحة الأدمن
    public function index()
    {
        $orders = Order::with('items')->latest()->get();
        return response()->json($orders);
    }

    // جلب طلبات المستخدم الحالي
    public function userOrders(Request $request)
    {
        $userId = Auth::id() ?? $request->header('X-User-Id');
        $phone =$request->query('phone');

        $query = Order::with('items');

        if ($userId) {
            $query->where('user_id',$userId);
        } elseif ($phone) {
            $query->where('customer_phone',$phone);
        } else {
            return response()->json([]);
        }

        return response()->json($query->latest()->get());
    }

    // حفظ طلب جديد
    public function store(Request $request)
    {
        $userId = Auth::id() ?? $request->header('X-User-Id');

        $validated =$request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'total_price' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.selectedSize' => 'nullable|string',
            'items.*.price' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated, $userId) {$order = Order::create([
                'user_id' => $userId,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'total_price' => $validated['total_price'],
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {$finalPrice = isset($item['discount_price']) &&$item['discount_price'] > 0
                    ? $item['discount_price']
                    : $item['price'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $finalPrice,
                    'size' => $item['selectedSize'] ?? 'Standard',
                ]);
            }

            return response()->json([
                'message' => 'تم استلام طلبك بنجاح',
                'order_id' => $order->id,
            ], 201);
        });
    }

    // تحديث الحالة
    public function updateStatus(Request $request,$id)
    {
        $validated =$request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' =>$validated['status']]);

        return response()->json([
            'message' => 'تم تحديث حالة الطلب بنجاح',
            'order' => $order,
        ]);
    }
}