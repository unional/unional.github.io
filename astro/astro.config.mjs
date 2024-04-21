import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'unional',
			favicon: './src/assets/logo.svg',
			logo: {
				light: './src/assets/logo.svg',
				dark: './src/assets/logo.svg',
				replacesTitle: true,
			},
			social: {
				discord: 'https://discord.gg/5amXyarNHR',
				github: 'https://github.com/unionalds',
				'x.com': 'https://x.com/Unional',
			},
			sidebar: [
				{
					label: 'About Me',
					autogenerate: { directory: 'about_me' },
				},
				{
					label: 'Architecture',
					autogenerate: { directory: 'architecture' },
					// items: [
					// 	// Each item here is one entry in the navigation menu.
					// 	{ label: 'Example Guide', link: '/guides/example/' },
					// ],
				},
				{
					label: 'My Projects',
					autogenerate: { directory: 'projects' },
				},
				{
					label: 'TypeScript',
					autogenerate: { directory: 'typescript' },
				},
			],
			editLink: {
				baseUrl: 'https://github.com/unional/unional.github.io/edit/main/astro/',
			},
		}),
	],
	site: 'https://unional.github.io/',
})
