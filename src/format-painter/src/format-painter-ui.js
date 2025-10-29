/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global setTimeout */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import formatPainterIcon from '../icons/format-painter.svg';

/**
 * The format painter UI feature.
 */
export default class FormatPainterUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FormatPainterUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// 添加格式刷按钮到工具栏
		editor.ui.componentFactory.add( 'formatPainter', locale => {
			const command = editor.commands.get( 'formatPainter' );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Format Painter' ),
				icon: formatPainterIcon,
				tooltip: true,
				isOn: false
			} );

			// 绑定按钮启用状态到命令
			view.bind( 'isEnabled' ).to( command, 'isEnabled' );

			let mouseUpListener = null;
			let escListener = null;

			// 监听按钮点击
			this.listenTo( view, 'execute', () => {
				if ( !view.isOn ) {
					// 第一次点击：复制格式
					command.copyFormat();

					// 立即设置按钮为激活状态
					view.isOn = true;

					// 添加鼠标释放监听器 - 在用户完成选择后应用格式
					mouseUpListener = () => {
						// 延迟执行以确保选区已更新
						setTimeout( () => {
							const selection = editor.model.document.selection;

							if ( command.isActive && !selection.isCollapsed ) {
								// 应用格式
								command.execute();

								// 关闭按钮激活状态
								view.isOn = false;

								// 清理监听器
								if ( mouseUpListener ) {
									editor.editing.view.document.off( 'mouseup', mouseUpListener );
									mouseUpListener = null;
								}
								if ( escListener ) {
									editor.editing.view.document.off( 'keydown', escListener );
									escListener = null;
								}
							}
						}, 50 );
					};

					// 添加ESC键取消功能
					escListener = ( evt, data ) => {
						if ( data.keyCode === 27 ) { // ESC键
							command.cancel();

							// 关闭按钮激活状态
							view.isOn = false;

							// 清理监听器
							if ( mouseUpListener ) {
								editor.editing.view.document.off( 'mouseup', mouseUpListener );
								mouseUpListener = null;
							}
							if ( escListener ) {
								editor.editing.view.document.off( 'keydown', escListener );
								escListener = null;
							}

							data.preventDefault();
							evt.stop();
						}
					};

					editor.editing.view.document.on( 'mouseup', mouseUpListener );
					editor.editing.view.document.on( 'keydown', escListener, { priority: 'high' } );
				} else {
					// 取消格式刷
					command.cancel();

					// 关闭按钮激活状态
					view.isOn = false;

					// 清理监听器
					if ( mouseUpListener ) {
						editor.editing.view.document.off( 'mouseup', mouseUpListener );
						mouseUpListener = null;
					}
					if ( escListener ) {
						editor.editing.view.document.off( 'keydown', escListener );
						escListener = null;
					}
				}

				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}

