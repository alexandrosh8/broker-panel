import React, { useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useThemeStore } from '../stores/themeStore'
import { useAuthStore } from '../stores/authStore'

export default function Settings() {
  const { theme, setTheme } = useThemeStore()
  const { user } = useAuthStore()
  const [settings, setSettings] = useState({
    currency: 'USD',
    language: 'en',
    notifications: true,
    autoSave: true,
    defaultStake: '100',
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // TODO: Save settings to API
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Settings
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Customize your betting calculator experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>

            <Select
              label="Language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </Select>

            <Select
              label="Currency"
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </Select>
          </CardBody>
        </Card>

        {/* Calculator Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Calculator Defaults</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Default Stake Amount"
              type="number"
              value={settings.defaultStake}
              onChange={(e) => handleSettingChange('defaultStake', e.target.value)}
              step="0.01"
              min="0"
            />

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                  Auto-save calculations
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                  Enable notifications
                </span>
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Name"
              value={user?.name || 'Admin User'}
              disabled
            />
            <Input
              label="Email"
              value={user?.email || 'admin@example.com'}
              disabled
            />
            <Input
              label="Role"
              value={user?.role || 'Administrator'}
              disabled
            />
            <Button variant="ghost" className="w-full">
              Change Password
            </Button>
          </CardBody>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary">
                Export Data
              </Button>
              <Button variant="ghost">
                Import Data
              </Button>
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Danger Zone
              </h4>
              <Button variant="accent" className="w-full">
                Clear All Data
              </Button>
              <p className="text-xs text-neutral-500 mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  )
}