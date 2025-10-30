/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The format painter command.
 */
export default class FormatPainterCommand extends Command {
	constructor( editor ) {
		super( editor );

		// 存储复制的格式
		this.copiedAttributes = null;
		this.isActive = false;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		// 只有在有选区时才能使用格式刷
		this.isEnabled = !selection.isCollapsed;
	}

	/**
	 * 复制当前选中文本的格式
	 */
	copyFormat() {
		const model = this.editor.model;
		const selection = model.document.selection;

		if ( selection.isCollapsed ) {
			return;
		}

		// 复制所有文本属性
		this.copiedAttributes = new Map();

		// 定义需要复制的属性列表
		const attributesToCopy = [
			'bold',
			'italic',
			'underline',
			'code',
			'fontFamily',
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'highlight'
		];

		try {
			// 方法1: 直接从选区获取属性（这是获取格式最可靠的方法）
			for ( const attrName of attributesToCopy ) {
				if ( selection.hasAttribute( attrName ) ) {
					const attrValue = selection.getAttribute( attrName );
					this.copiedAttributes.set( attrName, attrValue );
				}
			}

			// 方法2: 如果方法1没有获取到，从选区的第一个位置获取属性
			if ( this.copiedAttributes.size === 0 ) {
				const firstRange = selection.getFirstRange();
				const startPosition = firstRange.start;

				// 获取位置前面的节点属性
				const nodeBefore = startPosition.nodeBefore;
				const nodeAfter = startPosition.nodeAfter;

				// 尝试从 nodeBefore 获取
				if ( nodeBefore ) {
					for ( const attrName of attributesToCopy ) {
						if ( nodeBefore.hasAttribute && nodeBefore.hasAttribute( attrName ) ) {
							this.copiedAttributes.set( attrName, nodeBefore.getAttribute( attrName ) );
						}
					}
				}

				// 如果还是没有，尝试从 nodeAfter 获取
				if ( this.copiedAttributes.size === 0 && nodeAfter ) {
					for ( const attrName of attributesToCopy ) {
						if ( nodeAfter.hasAttribute && nodeAfter.hasAttribute( attrName ) ) {
							this.copiedAttributes.set( attrName, nodeAfter.getAttribute( attrName ) );
						}
					}
				}
			}

			// 方法3: 使用 walker 遍历
			if ( this.copiedAttributes.size === 0 ) {
				const firstRange = selection.getFirstRange();

				for ( const value of firstRange.getWalker( { ignoreElementEnd: true } ) ) {
					const item = value.item;

					// 处理文本节点
					if ( item.is && ( item.is( '$textProxy' ) || item.is( '$text' ) ) ) {
						for ( const attrName of attributesToCopy ) {
							if ( item.hasAttribute( attrName ) && !this.copiedAttributes.has( attrName ) ) {
								this.copiedAttributes.set( attrName, item.getAttribute( attrName ) );
							}
						}
					}

					// 如果已经找到了属性，就停止查找
					if ( this.copiedAttributes.size > 0 ) {
						break;
					}
				}
			}
		} catch ( error ) {
			this.copiedAttributes = new Map();
		}

		this.isActive = true;
	}

	/**
	 * 应用复制的格式到当前选区
	 */
	execute() {
		const model = this.editor.model;
		const selection = model.document.selection;

		if ( !this.copiedAttributes || selection.isCollapsed ) {
			return;
		}

		// 检查是否有有效的选区
		if ( this.copiedAttributes.size === 0 ) {
			this.isActive = false;
			this.copiedAttributes = null;
			return;
		}

		try {
			model.change( writer => {
				// 获取所有选中的范围
				const ranges = Array.from( selection.getRanges() );

				for ( const range of ranges ) {
					// 跳过空范围
					if ( !range || range.isCollapsed ) {
						continue;
					}

					// 先清除现有格式
					const attributesToRemove = [
						'bold',
						'italic',
						'underline',
						'code',
						'fontFamily',
						'fontSize',
						'fontColor',
						'fontBackgroundColor',
						'highlight'
					];

					for ( const attrName of attributesToRemove ) {
						try {
							writer.removeAttribute( attrName, range );
						} catch ( e ) {
							// 忽略移除失败
						}
					}

					// 应用复制的属性
					for ( const [ attrName, attrValue ] of this.copiedAttributes ) {
						try {
							writer.setAttribute( attrName, attrValue, range );
						} catch ( e ) {
							// 忽略设置失败
						}
					}
				}
			} );
		} catch ( error ) {
			// 如果整体操作失败，静默处理
		}

		// 应用后清除状态
		this.isActive = false;
		this.copiedAttributes = null;
	}

	/**
	 * 取消格式刷
	 */
	cancel() {
		this.isActive = false;
		this.copiedAttributes = null;
	}
}

