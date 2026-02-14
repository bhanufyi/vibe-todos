'use client';

import { Sliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/lib/use-settings';

export default function SettingsPage() {
	const { settings, updateSetting, resetSettings } = useSettings();

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-semibold">Settings</h1>
				<p className="text-sm text-muted-foreground">
					Tune the typing experience to your workflow.
				</p>
			</div>

			<div className="grid gap-4" data-testid="settings-form">
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<p className="font-semibold">Stop on error</p>
							<p className="text-sm text-muted-foreground">
								Pause on mistakes to reinforce accuracy.
							</p>
						</div>
						<Switch
							checked={settings.stopOnError}
							onCheckedChange={(value) => updateSetting('stopOnError', value)}
							aria-label="Stop on error"
						/>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<p className="font-semibold">Error sound</p>
							<p className="text-sm text-muted-foreground">Subtle beep on incorrect keystrokes.</p>
						</div>
						<Switch
							checked={settings.soundEnabled}
							onCheckedChange={(value) => updateSetting('soundEnabled', value)}
							aria-label="Error sound"
						/>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="font-semibold">Font size</p>
							<p className="text-sm text-muted-foreground">Adjust code scale in the typing view.</p>
						</div>
						<select
							className="rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm"
							value={settings.fontSize}
							onChange={(event) =>
								updateSetting('fontSize', event.target.value as typeof settings.fontSize)
							}
							data-testid="settings-fontsize"
						>
							<option value="sm">Small</option>
							<option value="md">Medium</option>
							<option value="lg">Large</option>
							<option value="xl">Extra large</option>
						</select>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<p className="font-semibold">Theme</p>
							<p className="text-sm text-muted-foreground">
								Switch between dark and light surfaces.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant={settings.theme === 'dark' ? 'secondary' : 'ghost'}
								size="sm"
								onClick={() => updateSetting('theme', 'dark')}
							>
								Dark
							</Button>
							<Button
								variant={settings.theme === 'light' ? 'secondary' : 'ghost'}
								size="sm"
								onClick={() => updateSetting('theme', 'light')}
							>
								Light
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-6">
				<div className="flex items-center gap-3 text-sm">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
						<Sliders className="h-5 w-5" />
					</span>
					<div>
						<p className="font-semibold">Reset defaults</p>
						<p className="text-xs text-muted-foreground">
							Return to the base tuning for this device.
						</p>
					</div>
				</div>
				<Button variant="outline" onClick={resetSettings}>
					Reset
				</Button>
			</div>
		</div>
	);
}
