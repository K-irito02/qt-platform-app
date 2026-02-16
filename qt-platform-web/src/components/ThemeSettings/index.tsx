import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Image, Video, Type, Palette, Save, RotateCcw } from 'lucide-react';
import { Drawer, Slider, Input, Switch, Button, ColorPicker } from 'antd';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUserConfig, setSystemConfig, resetTheme, ThemeConfig } from '@/store/slices/themeSlice';
import { adminApi, userApi } from '@/utils/api'; // Assuming userApi exists for saving user preference
import { GlassButton } from '@/components/ui/GlassButton';

interface ThemeSettingsProps {
  open: boolean;
  onClose: () => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentTheme, userConfig } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  
  const isAdmin = user?.roles?.some((r: string) => ['ADMIN', 'SUPER_ADMIN'].includes(r));
  const [activeTab, setActiveTab] = useState<'background' | 'appearance'>('background');

  const handleBackgroundChange = (key: keyof ThemeConfig['background'], value: any) => {
    const newConfig = {
      ...userConfig,
      background: {
        ...currentTheme.background,
        ...userConfig?.background,
        [key]: value
      }
    };
    dispatch(setUserConfig(newConfig));
  };

  const handleAppearanceChange = (key: keyof ThemeConfig['appearance'], value: any) => {
    const newConfig = {
      ...userConfig,
      appearance: {
        ...currentTheme.appearance,
        ...userConfig?.appearance,
        [key]: value
      }
    };
    dispatch(setUserConfig(newConfig));
  };

  const handleSave = async () => {
    try {
        // Save to backend
        // Assuming there is an API to save user theme config
        // await userApi.updateTheme(userConfig);
        console.log("Saving user theme:", userConfig);
    } catch (error) {
        console.error("Failed to save theme", error);
    }
  };

  const handleSaveSystem = async () => {
      if (!isAdmin) return;
      try {
          // await adminApi.updateSystemTheme(currentTheme);
          dispatch(setSystemConfig(currentTheme));
          console.log("Saving system theme:", currentTheme);
      } catch (error) {
          console.error("Failed to save system theme", error);
      }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 text-slate-800">
          <Settings size={20} />
          <span className="font-bold">Theme Customization</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      className="glass-drawer"
      styles={{
        body: { padding: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' },
        header: { background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(255,255,255,0.3)' }
      }}
    >
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex p-4 gap-2 border-b border-white/20 bg-white/40">
            <GlassButton 
                variant={activeTab === 'background' ? 'primary' : 'ghost'} 
                onClick={() => setActiveTab('background')}
                className="flex-1"
            >
                <Image size={16} className="mr-2" /> Background
            </GlassButton>
            <GlassButton 
                variant={activeTab === 'appearance' ? 'primary' : 'ghost'} 
                onClick={() => setActiveTab('appearance')}
                className="flex-1"
            >
                <Palette size={16} className="mr-2" /> Appearance
            </GlassButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            {activeTab === 'background' && (
                <div className="space-y-6">
                    {/* Type Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Background Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleBackgroundChange('type', 'image')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${currentTheme.background.type === 'image' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                            >
                                <Image size={24} />
                                <span className="text-sm font-medium">Image</span>
                            </button>
                            <button 
                                onClick={() => handleBackgroundChange('type', 'video')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${currentTheme.background.type === 'video' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
                            >
                                <Video size={24} />
                                <span className="text-sm font-medium">Video</span>
                            </button>
                        </div>
                    </div>

                    {/* URL Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Media URL</label>
                        <Input 
                            placeholder="https://..." 
                            value={currentTheme.background.url} 
                            onChange={(e) => handleBackgroundChange('url', e.target.value)}
                            className="rounded-lg bg-white/50 border-slate-200"
                        />
                        <p className="text-xs text-slate-500">Supports MP4, WebM for video. JPG, PNG, WebP for images.</p>
                    </div>

                    {/* Opacity Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-700">Glass Opacity</label>
                            <span className="text-xs text-slate-500">{currentTheme.background.opacity}</span>
                        </div>
                        <Slider 
                            min={0} max={1} step={0.05} 
                            value={currentTheme.background.opacity}
                            onChange={(val) => handleBackgroundChange('opacity', val)}
                        />
                    </div>

                    {/* Blur Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-700">Backdrop Blur</label>
                            <span className="text-xs text-slate-500">{currentTheme.background.blur}px</span>
                        </div>
                        <Slider 
                            min={0} max={40} 
                            value={currentTheme.background.blur}
                            onChange={(val) => handleBackgroundChange('blur', val)}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'appearance' && (
                <div className="space-y-6">
                    {/* Primary Color */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Primary Color</label>
                        <ColorPicker 
                            showText
                            value={currentTheme.appearance.primaryColor}
                            onChange={(color) => handleAppearanceChange('primaryColor', color.toHexString())}
                            className="w-full"
                        />
                    </div>

                    {/* Font Family */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Font Family</label>
                        <select 
                            className="w-full p-2 rounded-lg bg-white/50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            value={currentTheme.appearance.fontFamily}
                            onChange={(e) => handleAppearanceChange('fontFamily', e.target.value)}
                        >
                            <option value="Inter, system-ui, sans-serif">Inter (Default)</option>
                            <option value="'Noto Serif SC', serif">Noto Serif (Elegant)</option>
                            <option value="'JetBrains Mono', monospace">Monospace (Code)</option>
                            <option value="system-ui, -apple-system, sans-serif">System UI</option>
                        </select>
                    </div>

                    {/* Mode */}
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/40">
                        <span className="text-sm font-medium text-slate-700">Dark Mode</span>
                        <Switch 
                            checked={currentTheme.appearance.mode === 'dark'}
                            onChange={(checked) => handleAppearanceChange('mode', checked ? 'dark' : 'light')}
                        />
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/60 backdrop-blur-md flex flex-col gap-3">
            <div className="flex gap-3">
                <GlassButton variant="primary" className="flex-1" onClick={handleSave}>
                    <Save size={16} className="mr-2" /> Save Changes
                </GlassButton>
                <GlassButton variant="ghost" onClick={() => dispatch(resetTheme())}>
                    <RotateCcw size={16} />
                </GlassButton>
            </div>
            
            {isAdmin && (
                <Button type="dashed" block onClick={handleSaveSystem} className="text-xs text-slate-500 hover:text-primary border-slate-300">
                    Set as System Default
                </Button>
            )}
        </div>
      </div>
    </Drawer>
  );
};
