"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, Star, CheckCircle, Clock, Award, Briefcase, MapPin, Phone, Mail, Calendar, ShoppingCart, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchLawyerById, type Lawyer } from "@/lib/api/lawyers";

export default function LawyerDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLawyer = async () => {
      const id = params?.id as string;
      if (id) {
        setLoading(true);
        const data = await fetchLawyerById(id);
        setLawyer(data);
        setLoading(false);
      }
    };
    loadLawyer();
  }, [params]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">{t('pages.loading')}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!lawyer) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">{t('pages.notFound')}</h1>
            <Link href="/lawyers" className="text-primary-600 hover:text-primary-700">
              {t('pages.backToLawyers')}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <Link href="/lawyers" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4" />
              {t('pages.backToLawyers')}
            </Link>
          </div>
        </section>

        {/* Lawyer Profile */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Lawyer Info */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Header */}
                    <div className="flex items-start gap-6 mb-6 pb-6 border-b">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center text-5xl flex-shrink-0">
                        👨‍⚖️
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-3xl font-bold text-neutral-900">{lawyer.name}</h1>
                          {lawyer.available && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                              {t('lawyers.available')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xl font-bold text-neutral-900">{lawyer.rating}</span>
                            <span className="text-neutral-600">({lawyer.reviews} {t('common.reviews')})</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-600">
                            <Briefcase className="h-4 w-4" />
                            <span>{lawyer.experience} {t('lawyers.yearsExp')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {lawyer.specialty.map((spec, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">{lawyer.soldCount}+</div>
                        <div className="text-sm text-neutral-600">{t('lawyers.casesHandled')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">{lawyer.responseTime}</div>
                        <div className="text-sm text-neutral-600">{t('lawyers.responseTime')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">{lawyer.successRate}%</div>
                        <div className="text-sm text-neutral-600">{t('lawyers.successRate')}</div>
                      </div>
                    </div>

                    {/* About */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-neutral-900 mb-3">{t('lawyers.about')}</h2>
                      <p className="text-neutral-700 leading-relaxed">
                        {lawyer.bio || `${lawyer.name} is an experienced lawyer specializing in ${lawyer.specialty.join(', ')}. With ${lawyer.experience} years of experience, they have successfully handled over ${lawyer.soldCount} cases with a ${lawyer.successRate}% success rate.`}
                      </p>
                    </div>

                    {/* Education & Certifications */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-neutral-900 mb-3">{t('lawyers.qualifications')}</h2>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                          <div>
                            <div className="font-semibold text-neutral-900">{t('lawyers.education')}</div>
                            <div className="text-neutral-600">University of Malaya - LLB (Hons)</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <div className="font-semibold text-neutral-900">{t('lawyers.certification')}</div>
                            <div className="text-neutral-600">Malaysian Bar Council Certified</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                          <div>
                            <div className="font-semibold text-neutral-900">{t('lawyers.location')}</div>
                            <div className="text-neutral-600">{lawyer.location}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900 mb-3">{t('lawyers.languages')}</h2>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.languages.map((lang, idx) => (
                          <span key={idx} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-lg">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Booking Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                    <div className="mb-6">
                      <div className="text-sm text-neutral-600 mb-1">{t('lawyers.consultationFee')}</div>
                      <div className="text-3xl font-bold text-primary-600">{lawyer.priceRange}</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="h-4 w-4" />
                        <span>{t('lawyers.responseTime')}: {lawyer.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="h-4 w-4" />
                        <span>{t('lawyers.availableNow')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Phone className="h-4 w-4" />
                        <span>{t('lawyers.phoneConsult')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Mail className="h-4 w-4" />
                        <span>{t('lawyers.emailConsult')}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href="/consultation"
                        className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold text-center transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {t('home.consultNow')}
                      </Link>
                      <button className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                        <Heart className="h-5 w-5" />
                        {t('common.addToFavorites')}
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="text-sm text-neutral-600 text-center">
                        {t('lawyers.satisfactionGuarantee')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('lawyers.clientReviews')}</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-neutral-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg">
                        👤
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">Client {i}</div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-700">
                      Excellent service! Very professional and responsive. Highly recommended.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
