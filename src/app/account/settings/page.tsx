'use client';

import { useState } from 'react';
import { Bell, Moon, Globe, Shield, Loader2 } from 'lucide-react';
import { useNotificationStore } from '@/store/useStore';

export default function SettingsPage() {
  const { addNotification } = useNotificationStore();
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    darkMode: true,
    language: 'en',
    twoFactor: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    addNotification({
      type: 'success',
      title: 'Settings saved',
      message: 'Your preferences have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Bell className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <p className="text-gray-400 text-sm">
              Manage how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-gray-500 text-sm">
                Receive notifications via email
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({ ...settings, emailNotifications: e.target.checked })
              }
              className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Order Updates</p>
              <p className="text-gray-500 text-sm">
                Get notified about order status changes
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderUpdates}
              onChange={(e) =>
                setSettings({ ...settings, orderUpdates: e.target.checked })
              }
              className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Promotional Emails</p>
              <p className="text-gray-500 text-sm">
                Receive special offers and discounts
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.promotions}
              onChange={(e) =>
                setSettings({ ...settings, promotions: e.target.checked })
              }
              className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Newsletter</p>
              <p className="text-gray-500 text-sm">
                Weekly tech news and updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.newsletter}
              onChange={(e) =>
                setSettings({ ...settings, newsletter: e.target.checked })
              }
              className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Moon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            <p className="text-gray-400 text-sm">
              Customize how the app looks
            </p>
          </div>
        </div>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-white font-medium">Dark Mode</p>
            <p className="text-gray-500 text-sm">
              Use dark theme throughout the app
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) =>
              setSettings({ ...settings, darkMode: e.target.checked })
            }
            className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
          />
        </label>
      </div>

      {/* Language */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Language</h3>
            <p className="text-gray-400 text-sm">
              Select your preferred language
            </p>
          </div>
        </div>

        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {/* Security */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Security</h3>
            <p className="text-gray-400 text-sm">
              Manage your security settings
            </p>
          </div>
        </div>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-white font-medium">Two-Factor Authentication</p>
            <p className="text-gray-500 text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.twoFactor}
            onChange={(e) =>
              setSettings({ ...settings, twoFactor: e.target.checked })
            }
            className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
          />
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-gray-400 text-sm mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-4 py-2 rounded-lg transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
