"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  defaultLanguage: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  siteName: "LegalMY",
  siteDescription: "专业法律咨询平台",
  contactEmail: "support@legalmy.com",
  contactPhone: "+60 3-1234 5678",
  defaultLanguage: "zh",
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "site")
        .single();

      if (error) {
        console.error("❌ 加载网站设置失败:", error);
        return;
      }

      if (data && data.value) {
        const newSettings = {
          siteName: data.value.siteName || defaultSettings.siteName,
          siteDescription: data.value.siteDescription || defaultSettings.siteDescription,
          contactEmail: data.value.contactEmail || defaultSettings.contactEmail,
          contactPhone: data.value.contactPhone || defaultSettings.contactPhone,
          defaultLanguage: data.value.defaultLanguage || defaultSettings.defaultLanguage,
        };
        setSettings(newSettings);
        console.log("✅ 网站设置已加载:", newSettings);
      }
    } catch (error) {
      console.error("❌ 加载网站设置异常:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    setLoading(true);
    await loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return context;
}
