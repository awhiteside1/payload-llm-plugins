import type { Parent, Root } from 'mdast'
import { headingRange } from 'mdast-util-heading-range'
import { find } from 'unist-util-find'
import between from 'unist-util-find-all-between'

export const getSectionByHeading = (
	tree: Root,
	query: string,
): Root => {
	let section: Root | undefined = undefined
	headingRange(tree, query, (start, between) => {
		section = { type: 'root', children: between, data: { heading: start } }
	})
	if(section) return  section
	throw new Error('Section not Found')
}

export const getSections = (tree: Root | Parent) => {
	const sections: Array<Root> = []
	let active = true
	while (tree.children.length && active) {
		active = false
		headingRange(tree as Root, /(.*)/, (start, between, end) => {
			sections.push({
				type: 'root',
				children: between,
				data: { heading: start },
			})
			tree.children = end ? tree.children.slice(tree.children.indexOf(end)) : []
			active = true
		})
	}
	return sections
}

export const getNoHeadingContent = (tree: Root): Root | undefined => {
	const firstHeading = find(tree, { type: 'heading', depth: 1 })
	const secondHeading = find(tree, { type: 'heading', depth: 2 })
	if (!firstHeading || !secondHeading) return undefined
	// @ts-ignore
	return { type: 'root', children: between(tree, firstHeading, secondHeading) }
}
