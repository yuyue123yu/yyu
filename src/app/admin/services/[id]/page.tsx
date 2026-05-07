'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ServiceFormData {
  // 基本信息
  name_zh: string;
  name_en: string;
  name_tc: string;
  name_ms: string;
  description_zh: string;
  description_en: string;
  description_tc: string;
  description_ms: string;
  category: string;
  icon_name: string;
  
  // 價格設置
  base_price: number;
  currency: string;
  
  // 顯示設置
  case_count: number;
  is_active: boolean;
  is_featured: boolean;
  badge: string;
  display_order: number;
  
  // SEO 設置
  meta_title_zh: string;
  meta_title_en: string;
  meta_title_tc: string;
  meta_title_ms: string;
  meta_description_zh: string;
  meta_description_en: string;
  meta_description_tc: string;
  meta_description_ms: string;
  slug: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'price' | 'display' | 'seo'>('basic');
  const [formData, setFormData] = useState<ServiceFormData>({
    name_zh: '',
    name_en: '',
    name_tc: '',
    name_ms: '',
    description_zh: '',
    description_en: '',
    description_tc: '',
    description_ms: '',
    category: '',
    icon_name: 'Briefcase',
    base_price: 0,
    currency: 'MYR',
    case_count: 0,
    is_active: true,
    is_featured: false,
    badge: '',
    display_order: 0,
    meta_title_zh: '',
    meta_title_en: '',
    meta_title_tc: '',
    meta_title_ms: '',
    meta_description_zh: '',
    meta_description_en: '',
    meta_description_tc: '',
    meta_description_ms: '',
    slug: '',
  });

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data.service);
      }
    } catch (error) {
      console.error('獲取服務失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('保存成功！');
        router.push('/admin/services');
      } else {
        alert('保存失敗');
      }
    } catch (error) {
      console.error('保存失敗:', error);
      alert('保存失敗');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">編輯服務</h1>
            <p className="text-gray-600 mt-1">管理服務的所有信息和設置</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              保存更改
            </>
          )}
        </button>
      </div>

      {/* 標籤頁 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab('price')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'price'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              價格設置
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'display'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              顯示設置
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'seo'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              SEO 設置
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* 基本信息 */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服務名稱（繁體中文）*
                  </label>
                  <input
                    type="text"
                    value={formData.name_tc}
                    onChange={(e) => updateField('name_tc', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服務名稱（簡體中文）
                  </label>
                  <input
                    type="text"
                    value={formData.name_zh}
                    onChange={(e) => updateField('name_zh', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => updateField('name_en', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perkhidmatan (Malay)
                  </label>
                  <input
                    type="text"
                    value={formData.name_ms}
                    onChange={(e) => updateField('name_ms', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服務描述（繁體中文）*
                  </label>
                  <textarea
                    value={formData.description_tc}
                    onChange={(e) => updateField('description_tc', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服務描述（簡體中文）
                  </label>
                  <textarea
                    value={formData.description_zh}
                    onChange={(e) => updateField('description_zh', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => updateField('description_en', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penerangan (Malay)
                  </label>
                  <textarea
                    value={formData.description_ms}
                    onChange={(e) => updateField('description_ms', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分類標識 *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="例如: debt, family, business"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    圖標名稱
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) => updateField('icon_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Scale">Scale (天平)</option>
                    <option value="Users">Users (用戶)</option>
                    <option value="Briefcase">Briefcase (公文包)</option>
                    <option value="Home">Home (房屋)</option>
                    <option value="Shield">Shield (盾牌)</option>
                    <option value="TrendingUp">TrendingUp (趨勢)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 價格設置 */}
          {activeTab === 'price' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    基礎價格 *
                  </label>
                  <input
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => updateField('base_price', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">此價格將顯示在前台服務卡片上</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    貨幣 *
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="MYR">MYR (馬來西亞令吉)</option>
                    <option value="USD">USD (美元)</option>
                    <option value="SGD">SGD (新加坡元)</option>
                    <option value="CNY">CNY (人民幣)</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">💡 價格設置說明</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 基礎價格會顯示在前台服務卡片上</li>
                  <li>• 用戶點擊服務後可以看到詳細的價格說明</li>
                  <li>• 您可以隨時修改價格，前台會立即更新</li>
                </ul>
              </div>
            </div>
          )}

          {/* 顯示設置 */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    案件數量
                  </label>
                  <input
                    type="number"
                    value={formData.case_count}
                    onChange={(e) => updateField('case_count', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">顯示為 "XXX+ 案件"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    顯示順序
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">數字越小越靠前</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  徽章標籤
                </label>
                <select
                  value={formData.badge}
                  onChange={(e) => updateField('badge', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">無徽章</option>
                  <option value="hot">🔥 熱門</option>
                  <option value="recommended">⭐ 推薦</option>
                  <option value="new">✨ 新品</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => updateField('is_active', e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    啟用此服務（前台可見）
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => updateField('is_featured', e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                    設為推薦服務
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SEO 設置 */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="例如: debt-collection"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL: /services/{formData.slug || 'your-slug'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta 標題（繁體中文）
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title_tc}
                    onChange={(e) => updateField('meta_title_tc', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">建議 50-60 字符</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title_en}
                    onChange={(e) => updateField('meta_title_en', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    maxLength={60}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta 描述（繁體中文）
                  </label>
                  <textarea
                    value={formData.meta_description_tc}
                    onChange={(e) => updateField('meta_description_tc', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">建議 150-160 字符</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description (English)
                  </label>
                  <textarea
                    value={formData.meta_description_en}
                    onChange={(e) => updateField('meta_description_en', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    maxLength={160}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
