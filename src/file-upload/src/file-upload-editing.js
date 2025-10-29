import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import {
	toWidget
} from '@ckeditor/ckeditor5-widget/src/utils';
import InsertSjkFileUploadEditorCommand from './file-upload-command.js';
import '../theme/file-upload.css';

export default class fileUploadEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();
		// this._addDownloadListener();
		this.editor.commands.add( 'insertFileUploadBox', new InsertSjkFileUploadEditorCommand( this.editor ) );
	}

	// 文件下载框点击事件
	// _addDownloadListener() {
	//     document.addEventListener('click', (e) => {
	//         if (e.target.getAttribute('class') === 's-name') {

	//             var a = document.createElement('a');
	//             a.href = e.target.getAttribute('href');
	//             a.target = '_blank';
	//             a.click();
	//         } else {
	//             return false;
	//         }
	//     });
	// }

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'sjk-attachment', {
			isObject: true, // 会把 sjk-attachment 当成一个整体处理
			allowAttributes: [ 'attr_href', 'href', 'name', 'size', 'attr_name', 'attr_size' ],
			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block'
		} );

		schema.register( 'sjk-name', {
			allowWhere: '$block',
			isLimit: true,
			allowAttributes: [ 'href', 'name', 'target', 'download' ],
			allowIn: 'sjk-attachment'
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// downcast(model-to-view)
		// upcast(view-to-model)

		// 为了在视图中将<sjk-attachment>模型元素转换为<div class='s-attachment'></div>
		conversion.for( 'editingDowncast' )
			.elementToElement( {
				model: 'sjk-attachment',
				view: ( modelItem, writer ) => {
					const viewWrapper = writer.createContainerElement( 'div', { class: 's-attachment' } );
					return toWidget( viewWrapper, writer );
				}
			} );

		conversion.for( 'dataDowncast' )
			.elementToElement( {
				model: 'sjk-attachment',
				view: ( modelItem, writer ) => {
					return writer.createContainerElement( 'div', { class: 's-attachment' } );
				}
			} );
		// ---------

		conversion.for( 'downcast' ).elementToElement( {
			model: 'sjk-attachment',
			view: ( modelItem, writer ) => {
				const div = writer.createContainerElement( 'div', { class: 's-attachment' } );
				return toWidget( div, writer );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			converterPriority: 'high',
			view: {
				name: 'div',
				classes: 's-attachment'
			},
			model: ( viewElement, modelWriter ) => {
				return modelWriter.createElement( 'sjk-attachment', {
					attr_href: viewElement._children[ 0 ].getAttribute( 'attr_href' ) || '',
					name: viewElement._children[ 0 ].getAttribute( 'attr_name' ) || '',
					size: viewElement._children[ 0 ].getAttribute( 'attr_size' ) || ''
				} );
			}
		} );

		// sjk-name
		conversion.for( 'editingDowncast' )
			.elementToElement( {
				model: 'sjk-name',
				view: ( modelItem, writer ) => {
					const href = modelItem._attrs.get( 'href' );
					const name = modelItem._attrs.get( 'name' );
					const aTarget = writer.createContainerElement( 'a', {
						class: 's-name',
						href,
						target: '_blank',
						download: href,
						name
					} );

					const textNode = writer.createText( name );

					writer.insert( writer.createPositionAt( aTarget, 0 ), textNode );
					return aTarget;
				}
			} );

		conversion.for( 'dataDowncast' )
			.elementToElement( {
				model: 'sjk-name',
				view: ( modelItem, writer ) => {
					const href = modelItem._attrs.get( 'href' );
					const name = modelItem._attrs.get( 'name' );
					const aTarget = writer.createContainerElement( 'a', {
						class: 's-name',
						href,
						target: '_blank',
						download: href,
						name
					} );
					const textNode = writer.createText( name );

					writer.insert( writer.createPositionAt( aTarget, 0 ), textNode );
					return aTarget;
				}
			} );

		conversion.for( 'downcast' ).elementToElement( {
			model: 'sjk-name',
			view: ( modelItem, writer ) => {
				const href = modelItem._attrs.get( 'href' );
				const name = modelItem._attrs.get( 'name' );
				return writer.createContainerElement( 'a', {
					class: 's-name',
					href,
					target: '_blank',
					download: href,
					name
				} );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			converterPriority: 'high',
			view: {
				name: 'a',
				classes: 's-name'
			},
			model: ( viewElement, modelWriter ) => {
				const aTarget = modelWriter.createElement( 'sjk-name', {
					href: viewElement._attrs.get( 'href' ) || '',
					name: viewElement._attrs.get( 'name' ) || '',
					target: '_blank',
					download: viewElement._attrs.get( 'href' ) || ''
				} );

				return aTarget;
			}
		} );
	}
}
