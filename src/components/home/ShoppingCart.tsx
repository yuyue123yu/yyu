import { Trash2, Heart, ShoppingCart as CartIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ShoppingCart() {
  const cartItems = [
    {
      id: 1,
      lawyerName: "Ahmad Abdullah",
      specialty: "商业法",
      price: 3500,
      responseTime: "1小时",
      addedDate: "2024-01-15"
    },
    {
      id: 2,
      lawyerName: "Sarah Wong",
      specialty: "家庭法",
      price: 2800,
      responseTime: "2小时",
      addedDate: "2024-01-14"
    }
  ];

  const favorites = [
    {
      id: 3,
      lawyerName: "Kumar Rajesh",
      specialty: "房产法",
      rating: 4.9,
      reviews: 178,
      priceRange: "¥3,000-6,000"
    },
    {
      id: 4,
      lawyerName: "Tan Mei Ling",
      specialty: "家庭法",
      rating: 4.8,
      reviews: 203,
      priceRange: "¥2,000-4,000"
    }
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 购物车 - 待咨询列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <CartIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">
                咨询记录
              </h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {cartItems.length}
              </span>
            </div>

            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 hover:border-primary-300 transition-all flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-900 mb-1">
                        {item.lawyerName}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium mb-2">
                        {item.specialty}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-600">
                        <span>响应时间: {item.responseTime}</span>
                        <span>添加于: {item.addedDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600 mb-3">
                        ¥{item.price}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-neutral-200 rounded-lg transition-all">
                          <Heart className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                        </button>
                        <button className="p-2 hover:bg-neutral-200 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
                <CartIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 mb-4">您的咨询记录为空</p>
                <Link
                  href="/lawyers"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  浏览律师
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* 侧边栏 - 收藏夹 + 订单总结 */}
          <div className="space-y-6">
            {/* 收藏夹 */}
            <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                我的收藏
              </h3>
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="bg-white rounded-lg p-3 border border-neutral-200 hover:border-primary-300 transition-all"
                    >
                      <p className="font-semibold text-sm text-neutral-900 mb-1">
                        {fav.lawyerName}
                      </p>
                      <p className="text-xs text-primary-600 font-medium mb-2">
                        {fav.specialty}
                      </p>
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>⭐ {fav.rating} ({fav.reviews})</span>
                        <span className="font-bold text-primary-600">
                          {fav.priceRange}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">暂无收藏</p>
              )}
            </div>

            {/* 订单总结 */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-5 border border-primary-200">
              <h3 className="font-bold text-neutral-900 mb-4">订单总结</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">咨询数量</span>
                  <span className="font-bold text-neutral-900">{cartItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">小计</span>
                  <span className="font-bold text-neutral-900">¥{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">优惠券</span>
                  <span className="font-bold text-green-600">-¥0</span>
                </div>
                <div className="border-t border-primary-200 pt-3 flex items-center justify-between">
                  <span className="font-bold text-neutral-900">合计</span>
                  <span className="text-xl font-bold text-primary-600">
                    ¥{totalPrice}
                  </span>
                </div>
              </div>

              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-all mb-2">
                立即咨询
              </button>
              <button className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold py-2 rounded-lg transition-all">
                继续浏览
              </button>
            </div>

            {/* 优惠信息 */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-xs text-amber-900 font-semibold mb-2">
                💡 优惠提示
              </p>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• 满¥500减¥50</li>
                <li>• 新用户领¥100优惠券</li>
                <li>• 每次咨询赚积分</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
