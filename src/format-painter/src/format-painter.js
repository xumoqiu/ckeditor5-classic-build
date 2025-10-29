/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FormatPainterEditing from './format-painter-editing';
import FormatPainterUI from './format-painter-ui';

/**
 * The format painter feature.
 *
 * This plugin enables copying and applying text formatting.
 */
export default class FormatPainter extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ FormatPainterEditing, FormatPainterUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FormatPainter';
	}
}

