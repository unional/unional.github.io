import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'unional blog',
			favicon: './src/assets/uni.ico',
			logo: {
				light: './src/assets/uni.png',
				dark: './src/assets/uni.png',
				// replacesTitle: true,
			},
			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/9uYE4NRrg4' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/unional' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/Unional' },
			],
			sidebar: [
				{
					label: 'About Me',
					items: [{ autogenerate: { directory: 'about_me' } }],
				},
				{
					label: 'Architecture',
					items: [{ autogenerate: { directory: 'architecture' } }],
				},
			],
		}),
	],
})
