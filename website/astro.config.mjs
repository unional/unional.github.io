import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
			social: {
				discord: 'https://discord.gg/9uYE4NRrg4',
				github: 'https://github.com/unional',
				'x.com': 'https://x.com/Unional',
			},
			sidebar: [
				{
					label: 'About Me',
					autogenerate: { directory: 'about_me' },
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', link: '/guides/example/' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
