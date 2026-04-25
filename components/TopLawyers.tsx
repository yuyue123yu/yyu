import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

const lawyers = [
  {
    id: 1,
    name: "陈美玲律师",
    specialty: "婚姻家庭法专家",
    location: "吉隆坡",
    rating: 4.9,
    reviews: 287,
    experience: 15,
    languages: ["中文", "英语", "马来语"],
    rate: "RM 350/小时",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Ahmad bin Hassan",
    specialty: "公司商业法专家",
    location: "槟城",
    rating: 4.8,
    reviews: 342,
    experience: 18,
    languages: ["马来语", "英语"],
    rate: "RM 400/小时",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Sarah Lim",
    specialty: "房地产与产业法专家",
    location: "新山",
    rating: 4.9,
    reviews: 256,
    experience: 12,
    languages: ["英语", "中文"],
    rate: "RM 320/小时",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Raj Kumar",
    specialty: "劳工雇佣法专家",
    location: "吉隆坡",
    rating: 4.7,
    reviews: 198,
    experience: 14,
    languages: ["英语", "淡米尔语", "中文"],
    rate: "RM 300/小时",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
];

export default function TopLawyers() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            推荐律师
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            经验丰富、评价优秀的持牌律师
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="card overflow-hidden">
              <div className="relative h-40 bg-gray-200">
                <Image
                  src={lawyer.image}
                  alt={lawyer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {lawyer.name}
                </h3>
                <p className="text-primary-600 font-medium text-sm mb-3">
                  {lawyer.specialty}
                </p>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary-600 text-xs" />
                    {lawyer.location}
                  </div>
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-primary-600 text-xs" />
                    {lawyer.experience} 年经验
                  </div>
                  <div className="flex items-center">
                    <FaStar className="mr-2 text-gold-500 text-xs" />
                    {lawyer.rating} ({lawyer.reviews} 评价)
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {lawyer.languages.map((lang, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">{lawyer.rate}</span>
                  <Link href={`/lawyers/${lawyer.id}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    详情 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/lawyers" className="btn-primary">
            查看所有律师
          </Link>
        </div>
      </div>
    </section>
  );
}
