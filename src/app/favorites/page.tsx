"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Heart, Star, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FavoritesPage() {
  const { t, language } = useLanguage();
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Ahmad Abdullah",
      specialty: "商业法",
      rating: 4.9,
      reviews: 156,
      location: "Kuala Lumpur",
      priceRange: "RM 500-1000",
    },
    {
      id: 2,
      name: "Sarah Wong",
      specialty: "家庭法",
      rating: 4.8,
      reviews: 203,
      location: "Penang",
      priceRange: "RM 400-800",
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favs => favs.filter(fav => fav.id !== id));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">{t('favorites.title')}</h1>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-16 text-center">
              <Heart className="h-24 w-24 mx-auto mb-6 text-neutral-300" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t('favorites.emptyFavorites')}</h2>
              <p className="text-neutral-600 mb-8">{t('favorites.emptyFavoritesDesc')}</p>
              <Link
                href="/lawyers"
                className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
              >
                {t('favorites.browseLawyers')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(lawyer => (
                <div key={lawyer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                  {/* Avatar */}
                  <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-32 flex items-center justify-center text-5xl">
                    👨‍⚖️
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">{lawyer.name}</h3>
                        <p className="text-sm text-primary-600 font-medium">{lawyer.specialty}</p>
                      </div>
                      <button
                        onClick={() => removeFavorite(lawyer.id)}
                        className="text-red-500 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{lawyer.rating}</span>
                      <span className="text-sm text-neutral-600">({lawyer.reviews} {t('common.reviews')})</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{lawyer.location}</span>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-bold text-primary-600 mb-4">{lawyer.priceRange}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/lawyers/${lawyer.id}`}
                        className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-all"
                      >
                        {t('favorites.viewDetails')}
                      </Link>
                      <Link
                        href="/consultation"
                        className="flex-1 text-center border border-primary-600 text-primary-600 hover:bg-primary-50 py-2 rounded-lg font-medium transition-all"
                      >
                        {t('favorites.consult')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
