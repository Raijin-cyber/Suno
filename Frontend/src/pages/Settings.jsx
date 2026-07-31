import { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    readReceipts: true,
    onlineStatus: true,
    autoDownload: false,
    soundEffects: true,
    biometricLock: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const Toggle = ({ enabled, onClick }) => (
    <button
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
        enabled ? "bg-[#aa336a]" : "bg-black/30"
      }`}
    >
      <span
        className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white ease-in-out transition-all duration-300 ${
          enabled ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );

  const SettingRow = ({ title, subtitle, action }) => (
    <div className="flex items-center justify-between py-4 border-b border-black/30">
      <div>
        <h3 className="text-gray-900 font-medium">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );

  return (
    <div className="min-h-screen">
        {/* Header */}
        <div className="sticky flex items-center justify-between top-0 px-6 py-5 z-10">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <img className="transition-all duration-150 hover:bg-black/20 active:bg-black/20 rounded-full p-1" src="assets/icons/close.svg" />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6 space-y-8">
            {/* Profile Section */}
            <div className="shadow-[5px_5px_18px_#ed8ba5,-10px_-10px_18px_#ff9dba] rounded-2xl p-5 ">
            <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-4">
                Profile
            </h2>

            <SettingRow
                title="Profile"
                subtitle="View and edit your profile details"
                action={
                <button className="text-pink-500 font-medium hover:text-pink-600">
                    Edit
                </button>
                }
            />

            <SettingRow
                title="Edit Profile Picture"
                subtitle="Change your avatar"
                action={
                <button className="text-pink-500 font-medium hover:text-pink-600">
                    Change
                </button>
                }
            />
        </div>

        {/* Appearance */}
        <div className="shadow-[5px_5px_18px_#ed8ba5,-10px_-10px_18px_#ff9dba] rounded-2xl p-5 ">
            <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-4">
            Appearance
            </h2>

            <SettingRow
            title="Dark Mode"
            subtitle="Use a darker interface"
            action={
                <Toggle
                enabled={settings.darkMode}
                onClick={() => toggleSetting("darkMode")}
                />
            }
            />

            <SettingRow
                title="Change Language"
                subtitle="English (India)"
                action={
                <button className="text-pink-500 font-medium hover:text-pink-600">
                    Select
                </button>
                }
            />
        </div>

        {/* Notifications */}
        <div className="shadow-[5px_5px_18px_#ed8ba5,-10px_-10px_18px_#ff9dba] rounded-2xl p-5 ">
            <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-4">
            Notifications
            </h2>

            <SettingRow
                title="Push Notifications"
                subtitle="Receive message notifications"
                action={
                <Toggle
                    enabled={settings.notifications}
                    onClick={() => toggleSetting("notifications")}
                />
                }
            />

            <SettingRow
                title="Sound Effects"
                subtitle="Play sounds for messages and actions"
                action={
                <Toggle
                    enabled={settings.soundEffects}
                    onClick={() => toggleSetting("soundEffects")}
                />
                }
            />
            </div>

        {/* Privacy */}
        <div className="shadow-[5px_5px_18px_#ed8ba5,-10px_-10px_18px_#ff9dba] rounded-2xl p-5 ">
                <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-4">
                    Privacy & Security
                </h2>

            <SettingRow
                title="Read Receipts"
                subtitle="Let others know when you’ve seen messages"
                action={
                <Toggle
                    enabled={settings.readReceipts}
                    onClick={() => toggleSetting("readReceipts")}
                />
                }
            />

            <SettingRow
                title="Online Status"
                subtitle="Show when you’re online"
                action={
                <Toggle
                    enabled={settings.onlineStatus}
                    onClick={() => toggleSetting("onlineStatus")}
                />
                }
            />

          <SettingRow
                title="Biometric Lock"
                subtitle="Lock the app with fingerprint or face unlock"
                action={
                <Toggle
                    enabled={settings.biometricLock}
                    onClick={() => toggleSetting("biometricLock")}
                />
                }
            />
        </div>

        {/* Storage */}
        <div className="shadow-[5px_5px_18px_#ed8ba5,-10px_-10px_18px_#ff9dba] rounded-2xl p-5 ">
            <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-4">
                Storage
            </h2>

            <SettingRow
                title="Auto Download Media"
                subtitle="Download images and files automatically"
                action={
                <Toggle
                    enabled={settings.autoDownload}
                    onClick={() => toggleSetting("autoDownload")}
                />
                }
            />

            <SettingRow
                title="Clear Cache"
                subtitle="Free up storage space"
                action={
                <button className="px-4 py-2 rounded-lg bg-pink-100 text-pink-600 font-medium hover:bg-pink-200 transition">
                    Clear
                </button>
                }
            />
            </div>

            {/* General */}
            <div className="shadow-[5px_5px_18px_#ed8ba5,-10px_-10px_18px_#ff9dba] rounded-2xl p-5 ">
            <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-4">
                General
            </h2>

            <SettingRow
                title="Help & Support"
                subtitle="Get help with ORBI"
                action={
                <button className="text-pink-500 font-medium hover:text-pink-600">
                    Open
                </button>
                }
            />

            <SettingRow
                title="Terms & Privacy Policy"
                subtitle="Read our policies"
                action={
                <button className="text-pink-500 font-medium hover:text-pink-600">
                    View
                </button>
                }
            />

            <SettingRow
                title="About ORBI"
                subtitle="Version 1.0.0"
                action={
                <button className="text-pink-500 font-medium hover:text-pink-600">
                    Info
                </button>
                }
            />
        </div>

        {/* Logout */}
        <button className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition">
            Log Out
        </button>

        {/* Delete Account */}
        <button className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition">
            Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;