import { useState, useEffect } from "react"
import { Globe, Save } from "lucide-react"
import { useToast } from "../../../hooks/useToast"
import { useProfile } from "../../../hooks/useProfile"

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "sw", label: "Swahili" },
  { value: "lg", label: "Luganda" },
]

const TIMEZONES = [
  { value: "Africa/Kampala", label: "Africa/Kampala (EAT, UTC+3)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT, UTC+3)" },
  { value: "UTC", label: "UTC" },
]

export function LanguageRegionSettings() {
  const { toast } = useToast()
  const { profile, loading, updateProfile } = useProfile()
  const [preferred_language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("Africa/Kampala")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setLanguage(profile.preferred_language ?? "en")
      setTimezone(profile.timezone ?? "Africa/Kampala")
    }
  }, [profile])

  const handleSave = async () => {
    setIsSaving(true)
    const success = await updateProfile({ preferred_language, timezone })
    setIsSaving(false)
    if (success) {
      toast({ title: "Settings saved", description: "Your language and region preferences have been updated." })
    } else {
      toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
          <Globe className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
        </div>
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
        <Globe className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
      </div>
      <div className="space-y-4">
        <div className="py-2.5 border-b border-gray-50">
          <p className="text-sm font-medium text-gray-900 mb-1.5">Preferred Language</p>
          <p className="text-xs text-gray-500 mb-2">Choose the language for the portal interface</p>
          <select
            value={preferred_language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="py-2.5">
          <p className="text-sm font-medium text-gray-900 mb-1.5">Timezone</p>
          <p className="text-xs text-gray-500 mb-2">Used for displaying dates and times</p>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {TIMEZONES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  )
}
