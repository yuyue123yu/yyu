import Link from "next/link";
import { ArrowRight, Sparkles, Phone, Mail } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm mb-6 border border-accent-400/30">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span className="font-medium">限时优惠：首次咨询完全免费</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
            准备好解决您的
            <br />
            法律问题了吗？
          </h2>
          
          <p className="text-lg mb-8 text-blue-100">
            3 分钟内匹配专业律师，立即获得法律建议
            <br />
            <span className="text-base mt-2 inline-block">✓ 无需注册 ✓ 完全免费 ✓ 信息保密 ✓ 满意付款</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/consultation" 
              className="group inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-10 py-4 rounded-xl font-bold transition-all text-lg shadow-2xl hover:shadow-accent-500/50"
            >
              开始免费咨询
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all text-lg border-2 border-white/30"
            >
              联系客服
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full">
              <Phone className="h-4 w-4 text-accent-400" />
              <span>紧急热线：+60 3-1234 5678</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full">
              <Mail className="h-4 w-4 text-accent-400" />
              <span>info@legalmy.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
