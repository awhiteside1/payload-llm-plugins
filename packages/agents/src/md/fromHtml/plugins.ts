import type {Plugin} from 'unified'
import {fork, get} from 'radash'
import {remove} from 'unist-util-remove'
import type {Parent} from 'hast'
import type {Parent as MParent} from 'mdast'
import {Match} from 'effect'

const sectionsToRemove = ['References', 'See_also', 'External_links']

const isSection = (node: Parent | unknown) =>
	Match.value(node).pipe(
		Match.whenAnd(
			{ type: 'element', tagName: 'section' },
			(value: unknown) => {
				const isH2 = get(value, 'children[0].tagName') === 'h2'
				const hasId = sectionsToRemove.includes(
					get(value, 'children[0].properties.id'),
				)
				return isH2 && hasId
			},
			() => true,
		),
		Match.orElse(() => false),
	)

export const removeHTMLStuff: Plugin = () => {
	return (tree, file) => {
		remove(tree, isSection)
	}
}

export const moveLeadingTablesToEnd: Plugin = () => {
	return (tree, file) => {
		const firstHeading = (tree as MParent).children.findIndex(
			(x, index) => x.type === 'heading',
		)

		const afterFirstHeading = (tree as MParent).children.slice(firstHeading)

		const [tables, notTables] = fork(
			(tree as MParent).children.slice(0, firstHeading),
			(x) => x.type === 'table',
		)

		const newChildren = [...notTables, ...afterFirstHeading, ...tables]

		Object.assign(tree, { children: newChildren })
	}
}
