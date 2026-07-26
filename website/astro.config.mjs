import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	// posts that moved out of architecture/ when categories were split up.
	// keep these forever; the old URLs have been linked to since 2021.
	redirects: {
		'/architecture/2021-04-10-structural-type-and-function-overload':
			'/typescript/2021-04-10-structural-type-and-function-overload',
	},
	integrations: [
		starlight({
			title: 'unional blog',
			favicon: './src/assets/uni.ico',
			logo: {
				light: './src/assets/uni.png',
				dark: './src/assets/uni.png',
				replacesTitle: true,
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
					label: 'Agents',
					items: [{ autogenerate: { directory: 'agents' } }],
				},
				{
					label: 'Architecture',
					items: [{ autogenerate: { directory: 'architecture' } }],
				},
				{
					label: 'TypeScript',
					items: [{ autogenerate: { directory: 'typescript' } }],
				},
			],
		}),
	],
})
