<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WishlistController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| المسارات العامة والكتالوج
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{identifier}', [ProductController::class, 'show']);

// إنشاء الطلبات واسترجاع طلبات المستخدم
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/user/orders', [OrderController::class, 'userOrders']);

// مسارات المفضلة
Route::get('/wishlist', [WishlistController::class, 'index']);
Route::post('/wishlist/toggle/{productId}', [WishlistController::class, 'toggle']);

/*
|--------------------------------------------------------------------------
| المسارات المحمية للمستخدمين المسجلين
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'profile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | مسارات لوحة التحكم (مخصصة لرتبة admin فقط)
    |--------------------------------------------------------------------------
    */
    Route::middleware(EnsureUserIsAdmin::class)->prefix('admin')->group(function () {
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });
});