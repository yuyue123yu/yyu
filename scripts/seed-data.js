// 添加示例数据脚本
// 运行: node scripts/seed-data.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ovtrvzbftinsfwytzgwy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dHJ2emJmdGluc2Z3eXR6Z3d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc5NDcwOCwiZXhwIjoyMDkzMzcwNzA4fQ.VmaReeo6bcuIAtdnTbQFG4JshTg7roVrVGCJq8BqbXg';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 律师数据
const lawyers = [
  {
    name: '陈建国律师',
    specialty: ['合同法', '公司法', '商业纠纷'],
    experience: 15,
    rating: 4.9,
    reviews: 128,
    price_range: 'RM 500-800/小时',
    location: '吉隆坡',
    languages: ['中文', 'English', 'Bahasa Malaysia'],
    bio: '拥有15年执业经验，专注于商业法律事务，曾处理多起重大商业纠纷案件。',
    education: '马来亚大学法学学士，英国伦敦大学法学硕士',
    certification: '马来西亚律师公会会员',
    available: true,
    response_time: '2小时',
    success_rate: 95,
    sold_count: 156,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen'
  },
  {
    name: '李美玲律师',
    specialty: ['劳动法', '雇佣纠纷', '工伤赔偿'],
    experience: 10,
    rating: 4.8,
    reviews: 95,
    price_range: 'RM 400-600/小时',
    location: '槟城',
    languages: ['中文', 'English'],
    bio: '专注于劳动法领域，为众多企业和个人提供专业的劳动法律咨询服务。',
    education: '新加坡国立大学法学学士',
    certification: '马来西亚律师公会会员',
    available: true,
    response_time: '1小时',
    success_rate: 92,
    sold_count: 89,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li'
  },
  {
    name: '王志强律师',
    specialty: ['房产法', '土地纠纷', '物业管理'],
    experience: 12,
    rating: 4.7,
    reviews: 76,
    price_range: 'RM 450-700/小时',
    location: '新山',
    languages: ['中文', 'Bahasa Malaysia'],
    bio: '房产法专家，处理过数百起房产买卖和土地纠纷案件。',
    education: '马来西亚国民大学法学学士',
    certification: '马来西亚律师公会会员',
    available: true,
    response_time: '3小时',
    success_rate: 90,
    sold_count: 67,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang'
  },
  {
    name: 'Ahmad bin Hassan',
    specialty: ['刑事辩护', '交通事故', '人身伤害'],
    experience: 18,
    rating: 4.9,
    reviews: 142,
    price_range: 'RM 600-1000/小时',
    location: '吉隆坡',
    languages: ['Bahasa Malaysia', 'English'],
    bio: 'Experienced criminal defense lawyer with a strong track record in traffic and personal injury cases.',
    education: 'University of Malaya LLB, UK Bar Qualification',
    certification: 'Malaysian Bar Council Member',
    available: true,
    response_time: '2小时',
    success_rate: 94,
    sold_count: 178,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad'
  },
  {
    name: 'Sarah Tan',
    specialty: ['家庭法', '离婚诉讼', '子女抚养'],
    experience: 8,
    rating: 4.8,
    reviews: 63,
    price_range: 'RM 350-550/小时',
    location: '怡保',
    languages: ['English', '中文', 'Bahasa Malaysia'],
    bio: 'Compassionate family law attorney specializing in divorce and child custody matters.',
    education: 'National University of Singapore LLB',
    certification: 'Malaysian Bar Council Member',
    available: true,
    response_time: '4小时',
    success_rate: 88,
    sold_count: 54,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  }
];

// 服务项目
const services = [
  {
    category: '合同法',
    name_zh: '合同起草与审查',
    name_en: 'Contract Drafting & Review',
    name_ms: 'Penggubalan & Semakan Kontrak',
    description_zh: '专业的合同起草和审查服务，确保您的权益得到保护',
    description_en: 'Professional contract drafting and review services to protect your interests',
    description_ms: 'Perkhidmatan penggubalan dan semakan kontrak profesional untuk melindungi kepentingan anda',
    price_range: 'RM 500-2000',
    estimated_time: '3-5个工作日',
    icon: '📄'
  },
  {
    category: '劳动法',
    name_zh: '劳动纠纷咨询',
    name_en: 'Employment Dispute Consultation',
    name_ms: 'Perundingan Pertikaian Pekerjaan',
    description_zh: '处理雇佣合同、解雇、工资纠纷等劳动法问题',
    description_en: 'Handle employment contracts, termination, wage disputes and other labor law issues',
    description_ms: 'Mengendalikan kontrak pekerjaan, penamatan, pertikaian gaji dan isu undang-undang buruh lain',
    price_range: 'RM 400-1500',
    estimated_time: '1-3个工作日',
    icon: '👔'
  },
  {
    category: '房产法',
    name_zh: '房产买卖法律服务',
    name_en: 'Property Transaction Legal Services',
    name_ms: 'Perkhidmatan Undang-undang Transaksi Hartanah',
    description_zh: '提供房产买卖、租赁、产权转让等全方位法律服务',
    description_en: 'Comprehensive legal services for property sales, leasing, and title transfers',
    description_ms: 'Perkhidmatan undang-undang komprehensif untuk jualan hartanah, pajakan, dan pemindahan hak milik',
    price_range: 'RM 800-3000',
    estimated_time: '5-10个工作日',
    icon: '🏠'
  },
  {
    category: '家庭法',
    name_zh: '离婚诉讼代理',
    name_en: 'Divorce Litigation Representation',
    name_ms: 'Perwakilan Litigasi Perceraian',
    description_zh: '专业处理离婚、财产分割、子女抚养权等家庭法律事务',
    description_en: 'Professional handling of divorce, property division, child custody and other family law matters',
    description_ms: 'Pengendalian profesional perceraian, pembahagian harta, hak penjagaan anak dan perkara undang-undang keluarga lain',
    price_range: 'RM 1000-5000',
    estimated_time: '根据案件复杂度',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    category: '刑事辩护',
    name_zh: '刑事案件辩护',
    name_en: 'Criminal Defense',
    name_ms: 'Pembelaan Jenayah',
    description_zh: '为刑事案件被告提供专业的法律辩护服务',
    description_en: 'Professional legal defense services for criminal defendants',
    description_ms: 'Perkhidmatan pembelaan undang-undang profesional untuk defendan jenayah',
    price_range: 'RM 2000-10000',
    estimated_time: '根据案件进展',
    icon: '⚖️'
  }
];

// 模板数据
const templates = [
  {
    category: '合同模板',
    title_zh: '租赁合同模板',
    title_en: 'Tenancy Agreement Template',
    title_ms: 'Templat Perjanjian Sewa',
    description_zh: '标准房屋租赁合同模板，包含所有必要条款',
    description_en: 'Standard tenancy agreement template with all necessary clauses',
    description_ms: 'Templat perjanjian sewa standard dengan semua klausa yang diperlukan',
    file_url: 'https://example.com/templates/tenancy-agreement.pdf',
    file_size: '2.5 MB',
    language: 'ms',
    downloads: 245,
    is_free: true,
    price: 0
  },
  {
    category: '合同模板',
    title_zh: '雇佣合同模板',
    title_en: 'Employment Contract Template',
    title_ms: 'Templat Kontrak Pekerjaan',
    description_zh: '标准雇佣合同模板，符合马来西亚劳动法规定',
    description_en: 'Standard employment contract template compliant with Malaysian labor laws',
    description_ms: 'Templat kontrak pekerjaan standard yang mematuhi undang-undang buruh Malaysia',
    file_url: 'https://example.com/templates/employment-contract.pdf',
    file_size: '1.8 MB',
    language: 'ms',
    downloads: 189,
    is_free: true,
    price: 0
  },
  {
    category: '法律文书',
    title_zh: '授权委托书模板',
    title_en: 'Power of Attorney Template',
    title_ms: 'Templat Surat Kuasa Wakil',
    description_zh: '通用授权委托书模板，可用于各种法律事务',
    description_en: 'General power of attorney template for various legal matters',
    description_ms: 'Templat surat kuasa wakil am untuk pelbagai perkara undang-undang',
    file_url: 'https://example.com/templates/power-of-attorney.pdf',
    file_size: '1.2 MB',
    language: 'ms',
    downloads: 156,
    is_free: false,
    price: 29.90
  },
  {
    category: '商业文书',
    title_zh: '保密协议模板',
    title_en: 'Non-Disclosure Agreement Template',
    title_ms: 'Templat Perjanjian Tidak Mendedahkan',
    description_zh: '商业保密协议模板，保护您的商业机密',
    description_en: 'Business NDA template to protect your trade secrets',
    description_ms: 'Templat NDA perniagaan untuk melindungi rahsia perdagangan anda',
    file_url: 'https://example.com/templates/nda.pdf',
    file_size: '1.5 MB',
    language: 'en',
    downloads: 134,
    is_free: false,
    price: 39.90
  }
];

// 文章数据
const articles = [
  {
    category: '合同法',
    title_zh: '如何避免租赁合同纠纷',
    title_en: 'How to Avoid Tenancy Agreement Disputes',
    title_ms: 'Cara Mengelakkan Pertikaian Perjanjian Sewa',
    content_zh: '租赁合同是房东和租客之间的重要法律文件。本文将详细介绍如何起草一份完善的租赁合同，避免日后产生纠纷。\n\n首先，合同应明确规定租金金额、支付方式和时间。其次，要详细列明双方的权利和义务...',
    content_en: 'A tenancy agreement is an important legal document between landlord and tenant. This article explains how to draft a comprehensive tenancy agreement to avoid future disputes...',
    content_ms: 'Perjanjian sewa adalah dokumen undang-undang penting antara tuan tanah dan penyewa. Artikel ini menerangkan cara merangka perjanjian sewa yang komprehensif untuk mengelakkan pertikaian masa depan...',
    excerpt_zh: '了解如何起草完善的租赁合同，保护您的权益',
    excerpt_en: 'Learn how to draft a comprehensive tenancy agreement to protect your rights',
    excerpt_ms: 'Ketahui cara merangka perjanjian sewa yang komprehensif untuk melindungi hak anda',
    author: '陈建国律师',
    read_time: 8,
    views: 1245,
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    published: true
  },
  {
    category: '劳动法',
    title_zh: '员工被无故解雇怎么办？',
    title_en: 'What to Do If You Are Unfairly Dismissed?',
    title_ms: 'Apa Yang Perlu Dilakukan Jika Anda Diberhentikan Secara Tidak Adil?',
    content_zh: '在马来西亚，员工如果被无故解雇，可以向劳工法庭提出申诉。本文将介绍相关的法律程序和维权途径。\n\n根据1955年劳工法令，雇主必须有正当理由才能解雇员工...',
    content_en: 'In Malaysia, employees who are unfairly dismissed can file a complaint with the Industrial Court. This article explains the legal procedures and remedies available...',
    content_ms: 'Di Malaysia, pekerja yang diberhentikan secara tidak adil boleh memfailkan aduan ke Mahkamah Perusahaan. Artikel ini menerangkan prosedur undang-undang dan remedi yang tersedia...',
    excerpt_zh: '了解您在被无故解雇时的法律权利和救济途径',
    excerpt_en: 'Understand your legal rights and remedies when unfairly dismissed',
    excerpt_ms: 'Fahami hak undang-undang dan remedi anda apabila diberhentikan secara tidak adil',
    author: '李美玲律师',
    read_time: 10,
    views: 987,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    published: true
  },
  {
    category: '房产法',
    title_zh: '购买二手房需要注意的法律问题',
    title_en: 'Legal Issues to Consider When Buying Resale Property',
    title_ms: 'Isu Undang-undang Yang Perlu Dipertimbangkan Semasa Membeli Hartanah Jualan Semula',
    content_zh: '购买二手房涉及多个法律环节，买家需要特别注意产权调查、贷款审批、买卖合约等事项。\n\n首先，务必进行彻底的产权调查，确保卖家拥有合法的产权...',
    content_en: 'Buying resale property involves multiple legal steps. Buyers need to pay attention to title searches, loan approvals, and sale agreements...',
    content_ms: 'Membeli hartanah jualan semula melibatkan beberapa langkah undang-undang. Pembeli perlu memberi perhatian kepada carian hak milik, kelulusan pinjaman, dan perjanjian jualan...',
    excerpt_zh: '购买二手房前必须了解的重要法律事项',
    excerpt_en: 'Important legal matters to understand before buying resale property',
    excerpt_ms: 'Perkara undang-undang penting yang perlu difahami sebelum membeli hartanah jualan semula',
    author: '王志强律师',
    read_time: 12,
    views: 1567,
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    published: true
  },
  {
    category: '家庭法',
    title_zh: '离婚后子女抚养权如何判定',
    title_en: 'How Child Custody is Determined After Divorce',
    title_ms: 'Bagaimana Hak Penjagaan Anak Ditentukan Selepas Perceraian',
    content_zh: '在离婚案件中，子女抚养权的判定是最重要也最敏感的问题之一。法院在判定抚养权时，会以子女的最佳利益为首要考虑。\n\n法院会考虑多个因素，包括父母的经济能力、居住环境、子女的意愿等...',
    content_en: 'In divorce cases, child custody determination is one of the most important and sensitive issues. Courts prioritize the best interests of the child...',
    content_ms: 'Dalam kes perceraian, penentuan hak penjagaan anak adalah salah satu isu yang paling penting dan sensitif. Mahkamah mengutamakan kepentingan terbaik kanak-kanak...',
    excerpt_zh: '了解法院如何判定离婚后的子女抚养权',
    excerpt_en: 'Understand how courts determine child custody after divorce',
    excerpt_ms: 'Fahami bagaimana mahkamah menentukan hak penjagaan anak selepas perceraian',
    author: 'Sarah Tan',
    read_time: 15,
    views: 2134,
    image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
    published: true
  }
];

async function seedData() {
  console.log('🌱 开始添加示例数据...\n');

  try {
    // 1. 添加律师
    console.log('📝 添加律师数据...');
    const { data: lawyersData, error: lawyersError } = await supabase
      .from('lawyers')
      .insert(lawyers)
      .select();

    if (lawyersError) {
      console.error('❌ 律师数据添加失败:', lawyersError);
    } else {
      console.log(`✅ 成功添加 ${lawyersData.length} 位律师\n`);
    }

    // 2. 添加服务项目
    console.log('📝 添加服务项目...');
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .insert(services)
      .select();

    if (servicesError) {
      console.error('❌ 服务项目添加失败:', servicesError);
    } else {
      console.log(`✅ 成功添加 ${servicesData.length} 个服务项目\n`);
    }

    // 3. 添加模板
    console.log('📝 添加文档模板...');
    const { data: templatesData, error: templatesError } = await supabase
      .from('templates')
      .insert(templates)
      .select();

    if (templatesError) {
      console.error('❌ 模板添加失败:', templatesError);
    } else {
      console.log(`✅ 成功添加 ${templatesData.length} 个模板\n`);
    }

    // 4. 添加文章
    console.log('📝 添加法律文章...');
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .insert(articles)
      .select();

    if (articlesError) {
      console.error('❌ 文章添加失败:', articlesError);
    } else {
      console.log(`✅ 成功添加 ${articlesData.length} 篇文章\n`);
    }

    // 5. 添加示例咨询（使用测试用户）
    console.log('📝 添加示例咨询...');
    const testUserId = '4d1be5e4-b929-47bf-97d6-15c09a1a589a'; // 测试用户ID
    
    if (lawyersData && lawyersData.length > 0) {
      const consultations = [
        {
          client_id: testUserId,
          lawyer_id: lawyersData[0].id,
          name: '测试用户',
          email: 'test@example.com',
          phone: '+60123456789',
          consultation_type: '在线咨询',
          preferred_date: '2025-05-10',
          preferred_time: '14:00',
          case_description: '我想咨询关于租赁合同的问题，房东要求提前解约但不退还押金。',
          status: 'pending'
        },
        {
          client_id: testUserId,
          lawyer_id: lawyersData[1].id,
          name: '测试用户',
          email: 'test@example.com',
          phone: '+60123456789',
          consultation_type: '电话咨询',
          preferred_date: '2025-05-12',
          preferred_time: '10:00',
          case_description: '公司突然通知我被解雇，但没有给出任何理由，我该怎么办？',
          status: 'confirmed'
        }
      ];

      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .insert(consultations)
        .select();

      if (consultationsError) {
        console.error('❌ 咨询记录添加失败:', consultationsError);
      } else {
        console.log(`✅ 成功添加 ${consultationsData.length} 条咨询记录\n`);
      }
    }

    console.log('🎉 所有示例数据添加完成！\n');
    console.log('📊 数据统计：');
    console.log(`   - 律师: ${lawyersData?.length || 0} 位`);
    console.log(`   - 服务项目: ${servicesData?.length || 0} 个`);
    console.log(`   - 模板: ${templatesData?.length || 0} 个`);
    console.log(`   - 文章: ${articlesData?.length || 0} 篇`);
    console.log('\n✨ 现在可以访问管理后台查看数据了！');
    console.log('   管理后台: http://localhost:3000/admin');
    console.log('   用户端: http://localhost:3000');

  } catch (error) {
    console.error('❌ 发生错误:', error);
  }
}

seedData();
