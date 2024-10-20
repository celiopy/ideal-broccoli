import pluginNavigation from "@11ty/eleventy-navigation";
import pluginMarkdown from "./utils/markdown.js";
import pluginFilters from "./utils/filters.js";
import pluginIcons from "eleventy-plugin-icons";

const CONTENT_GLOBS = {
	posts: 'blog/**/*.md',
};

export default function (eleventyConfig) {
	// Navigation
	eleventyConfig.addPlugin(pluginNavigation);

	// Icons
	eleventyConfig.addPlugin(pluginIcons, {
		sources: [{ name: 'custom', path: 'icons' }]
	});

	// Markdown
	eleventyConfig.addPlugin(pluginMarkdown);

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	// CSS
	eleventyConfig.addPassthroughCopy("assets/");
	eleventyConfig.addWatchTarget("assets/");

	eleventyConfig.addNunjucksShortcode("infobox", function (type, content) {
		const types = {
			info: 'info',
			warning: 'warning',
			danger: 'danger'
		};

		const validType = types[type] || 'info'; // Default to info if type is invalid

		return `
			<div class="infobox ${validType}">
			<p>${content}</p>
			</div>
		`;
	});

	// Collections: Posts
	eleventyConfig.addCollection('posts', function (collection) {
		const posts = collection
		.getFilteredByGlob(CONTENT_GLOBS.posts)
		.filter(post => post.fileSlug !== 'blog') // Exclude blog/index.md
		.sort((a, b) => new Date(b.date) - new Date(a.date));

		return posts;
	});

	eleventyConfig.addShortcode("1sti", function(content) {
		const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
		if (imgMatch) {
			return `<img src="${imgMatch[1]}" alt="Image" style="height: 100%;">`;
		}
		return ''; // Return an empty string if no image is found
	});
};

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
		"html",
		"11ty.js",
	],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	dir: {
		output: "public",
	}
}
