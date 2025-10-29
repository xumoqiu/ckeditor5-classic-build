/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FormatPainterCommand from './format-painter-command';

import '../theme/format-painter.css';

/**
 * The format painter editing feature.
 */
export default class FormatPainterEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FormatPainterEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// 注册格式刷命令
		editor.commands.add( 'formatPainter', new FormatPainterCommand( editor ) );
	}
}

