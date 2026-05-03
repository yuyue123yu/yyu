"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CartPage() {
  const { t, language } = useLanguage();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Ahmad Abdullah - 商业法咨询", price: 299, quantity: 1, type: "consultation" },
    { id: 2, name: "合同审核服务", price: 399, quantity: 1, type: "review" },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">{t('cart.title')}</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-16 text-center">
              <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-neutral-300" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t('cart.emptyCart')}</h2>
              <p className="text-neutral-600 mb-8">{t('cart.emptyCartDesc')}</p>
              <Link
                href="/services"
                className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
              >
                {t('cart.browseServices')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.name}</h3>
                        <p className="text-sm text-neutral-600 mb-4">
                          {item.type === 'consultation' ? t('cart.consultationService') : t('cart.reviewService')}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border border-neutral-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-neutral-100 transition-all"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-neutral-100 transition-all"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            {t('cart.remove')}
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          RM {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">{t('cart.orderSummary')}</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">{t('cart.subtotal')}</span>
                      <span className="font-medium">RM {total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">{t('cart.serviceFee')}</span>
                      <span className="font-medium">RM 0</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">{t('cart.total')}</span>
                        <span className="text-2xl font-bold text-primary-600">RM {total}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-all mb-4">
                    {t('cart.checkout')}
                  </button>
                  <Link
                    href="/services"
                    className="block w-full text-center border border-primary-600 text-primary-600 hover:bg-primary-50 py-3 rounded-lg font-semibold transition-all"
                  >
                    {t('cart.continueBrowsing')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
