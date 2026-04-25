import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 bg-primary-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          需要法律帮助？
        </h2>
        <p className="text-lg mb-8 text-primary-100 max-w-2xl mx-auto">
          立即注册，与专业律师建立联系
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
            免费注册
          </Link>
          <Link href="/lawyers" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            浏览律师
          </Link>
        </div>
      </div>
    </section>
  );
}
