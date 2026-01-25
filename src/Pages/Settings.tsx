import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import {
  Bell,
  Shield,
  Monitor,
  Globe,
  KeyRound,
  Database,
  Trash2,
  CloudDownload,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

// Animation wrapper
const Section = ({ children }: any) => {
  return (
    <div
      className="animate-slideFade bg-[#071018] border border-cyan-500/20 rounded-2xl shadow-[0_0_18px_rgba(0,255,255,0.06)] p-6"
      style={{
        animationDuration: "0.5s",
        animationTimingFunction: "ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default function Settings() {
  const [theme, setTheme] = useState("Dark");
  const [timeoutValue, setTimeoutValue] = useState("30");

  return (
    <div className="space-y-10 pb-20 ml-5 mr-2 mt-5 overflow-x-auto">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-cyan-300 tracking-wide">
          Settings
        </h1>
        <p className="text-gray-400 text-lg mt-1">
          Configure application preferences
        </p>
      </div>

      {/* NOTIFICATIONS */}
      <Section bgColor="black">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-3 bg-[#0e2030] text-cyan-300 rounded-xl shadow-inner">
            <Bell size={22} />
          </div>
          <CardTitle className="text-cyan-300 text-2xl font-semibold">
            Notifications
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-gray-300">
          <SettingRow
            title="Email Notifications"
            sub="Receive order updates via email"
          />

          <SettingRow
            title="Push Notifications"
            sub="Get real-time alerts on your device"
          />

          <SettingRow
            title="Order Updates"
            sub="Notifications for order status changes"
          />

          <SettingRow
            title="Marketing Emails"
            sub="Receive promotional offers and news"
          />

          <SettingRow
            title="Sound Alerts"
            sub="Play sounds for new notifications"
          />
        </CardContent>
      </Section>

      {/* SECURITY */}
      <Section>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-3 bg-[#0e2030] text-cyan-300 rounded-xl shadow-inner">
            <Shield size={22} />
          </div>
          <CardTitle className="text-cyan-300 text-2xl font-semibold">
            Security
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-gray-300">
          <SettingRow
            title="Two-Factor Authentication"
            sub="Add extra security to your account"
          />

          <SettingRow
            title="Login Alerts"
            sub="Get notified of new login attempts"
          />

          {/* TIMEOUT DROPDOWN */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                Session Timeout (minutes)
              </p>
              <p className="text-gray-500 text-sm">
                Auto logout after inactivity
              </p>
            </div>

            <Select
              defaultValue={timeoutValue}
              onValueChange={(v) => setTimeoutValue(v)}
            >
              <SelectTrigger className="w-18 bg-[#0a1929] text-white border border-cyan-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1929] text-white">
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Section>

      {/* APPEARANCE */}
      <Section>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-3 bg-[#0e2030] text-cyan-300 rounded-xl shadow-inner">
            <Monitor size={22} />
          </div>
          <CardTitle className="text-cyan-300 text-2xl font-semibold">
            Appearance
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-300 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-gray-500 text-sm">
                Choose your preferred theme
              </p>
            </div>
            <div className="flex gap-4 mt-3">
              <ThemeButton
                label={<Sun className="w-4 h-4" />}
                theme={theme}
                setTheme={setTheme}
              >
                Light
              </ThemeButton>
              <ThemeButton
                label={<Moon className="w-4 h-4" />}
                theme={theme}
                setTheme={setTheme}
              >
                Dark
              </ThemeButton>
              <ThemeButton
                label={<Laptop className="w-4 h-4" />}
                theme={theme}
                setTheme={setTheme}
              >
                System
              </ThemeButton>
            </div>{" "}
          </div>
        </CardContent>
      </Section>

      {/* REGIONAL */}
      <Section>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-3 bg-[#0e2030] text-cyan-300 rounded-xl shadow-inner">
            <Globe size={22} />
          </div>
          <CardTitle className="text-cyan-300 text-2xl font-semibold">
            Regional
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-300 space-y-6">
          <DropdownRow
            label="Language"
            defaultValue="English"
            options={["English", "Hindi", "Marathi"]}
          />
          <DropdownRow
            label="Currency"
            defaultValue="INR (₹)"
            options={["INR (₹)"]}
          />
          <DropdownRow
            label="Timezone"
            defaultValue="Asia/Kolkata"
            options={["Asia/Kolkata"]}
          />
        </CardContent>
      </Section>

      {/* CHANGE PASSWORD */}
      <Section>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-3 bg-[#0e2030] text-cyan-300 rounded-xl shadow-inner">
            <KeyRound size={22} />
          </div>
          <CardTitle className="text-cyan-300 text-2xl font-semibold">
            Change Password
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-300 space-y-4">
          <InputRow
            label="Current Password"
            placeholder="Enter current password"
            hasEye
          />
          <InputRow label="New Password" placeholder="Enter new password" />
          <InputRow
            label="Confirm New Password"
            placeholder="Confirm password"
          />

          <Button className="mt-4 w-40 bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)]">
            Update Password
          </Button>
        </CardContent>
      </Section>

      {/* DATA MANAGEMENT */}
      <Section>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="p-3 bg-[#0e2030] text-cyan-300 rounded-xl shadow-inner">
            <Database size={22} />
          </div>
          <CardTitle className="text-cyan-300 text-2xl font-semibold">
            Data Management
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-300 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Export Data</p>
              <p className="text-gray-500 text-sm">Download your data as CSV</p>
            </div>

            <Button className="bg-[#0e2030] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20">
              <CloudDownload size={16} className="mr-2" />
              Export
            </Button>
          </div>

          <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-red-300 font-medium">Delete Account</p>
              <p className="text-red-400 text-sm">
                Permanently delete your account and data
              </p>
            </div>

            <Button variant="destructive" className="px-6">
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REUSABLE COMPONENTS
────────────────────────────────────────────── */

// --- Neon Toggle + Setting Row ---

// NEON SWITCH COMPONENT
const NeonToggle = ({ defaultOn = true }) => {
  const [on, setOn] = useState(defaultOn);

  return (
    <div
      onClick={() => setOn(!on)}
      className={`
        relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300 
        ${
          on
            ? "bg-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.7)]"
            : "bg-[#0d1625] border border-cyan-500/30 shadow-[0_0_0px_rgba(0,255,255,0.3)]"
        }
      `}
    >
      <div
        className={`
          absolute top-[3px] h-6 w-6 rounded-full bg-slate-800 
          transition-all duration-300
          ${on ? "left-[32px]" : "left-[2px]"}
        `}
      ></div>
    </div>
  );
};

interface RowProps {
  title: string;
  sub?: string;
}

const SettingRow = ({ title, sub }: any) => (
  <div className="w-full flex items-center justify-between py-3">
    <div>
      <p className="text-gray-200 font-medium">{title}</p>
      <p className="text-gray-500 text-sm">{sub}</p>
    </div>

    <NeonToggle />
  </div>
);

const ThemeButton = ({ label, children, theme, setTheme }: any) => {
  const isActive = theme === children; // children = "Light" | "Dark" | "System"

  return (
    <button
      onClick={() => {
        setTheme(children);
        toast.success(`Theme changed to ${children}`, {
          style: {
            background: "#071018",
            border: "1px solid rgba(0,255,255,0.3)",
            color: "#00eaff",
            boxShadow: "0 0 20px rgba(0,255,255,0.3)",
          },
        });
      }}
      className={`
        flex items-center gap-2 px-5 py-2 rounded-xl border text-sm
        transition-all duration-300
        ${
          isActive
            ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] scale-[1.05]"
            : "border-cyan-500/30 text-gray-300 hover:bg-cyan-500/20 hover:border-cyan-400"
        }
      `}
    >
      {label} {/* ICON */}
      <span>{children}</span> {/* TEXT */}
    </button>
  );
};

const DropdownRow = ({ label, defaultValue, options }: any) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-white font-medium">{label}</p>
      <p className="text-gray-500 text-sm">Select your {label.toLowerCase()}</p>
    </div>

    <Select defaultValue={defaultValue}>
      <SelectTrigger className="w-40 bg-[#0a1929] text-white border border-cyan-500/30">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#0a1929] text-white">
        {options.map((o: string, i: number) => (
          <SelectItem key={i} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const InputRow = ({ label, placeholder, hasEye }: any) => (
  <div className="space-y-1">
    <p className="text-white font-medium">{label}</p>
    <div className="relative">
      <input
        type="password"
        placeholder={placeholder}
        className="w-full bg-[#0a1929] border border-cyan-500/30 text-white rounded-xl px-4 py-3"
      />
      {hasEye && (
        <span className="absolute right-4 top-3 text-gray-400 cursor-pointer">
          👁
        </span>
      )}
    </div>
  </div>
);
