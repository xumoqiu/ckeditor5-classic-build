import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import {
    toWidget,
    toWidgetEditable
} from '@ckeditor/ckeditor5-widget/src/utils';
import InsertSjkFileUploadEditorCommand from './file-upload-command.js'
import '../theme/file-upload.css';


export default class fileUploadEditing extends Plugin {
    static get requires() {
        return [Widget];
    }


    init() {

        this._defineSchema();
        this._defineConverters();
		this._addDownloadListener();
        this.editor.commands.add('insertFileUploadBox', new InsertSjkFileUploadEditorCommand(this.editor));
    }


    // 文件下载框点击事件
    _addDownloadListener() {
		debugger;
		document.addEventListener('click', (e) => {
			console.log(1122);

			if (e.target.getAttribute('class') === 's-name' || e.target.getAttribute('class') === 's-attachment ck-widget ck-widget_selected') {

				var a = document.createElement('a');
				a.href = e.target.getAttribute('attr_href');
				console.log(a.href);
				console.log(e.target.getAttribute('href'));
				a.target = '_blank';
				a.click();
			} else {
				return false;
			}
		});
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('sjk-attachment', {
            isObject: true, // 会把 sjk-attachment 当成一个整体处理
            allowAttributes: ['attr_href', 'href', 'name', 'size', 'attr_name', 'attr_size'],
            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
		});

		schema.register('sjk-name', {
			allowWhere: '$block',
			isLimit: true,
			allowAttributes:['href','name','target'],
			allowIn: 'sjk-attachment',
		});
    }

    /**
     * ck5 整体是基于 MVC（model view controller） 模式的编辑器。
     * model 是用来保存编辑器内容数据，它可以定义一个整块内容：比如 一个附件模块
     * view 可以理解为看到的 dom，比如一个附件模块的 dom 树
     *
     * 所以需要定义 converter 把 model 与 view 互相转化：
     * - 当上传附件后，使用 modelWriter 创建出一个 model 插入到编辑器，之后编辑器自动调用 model 转 view，
     *   在编辑区域展示出附件模块的 dom 内容
     * - 当手动设置编辑器的富文本内容时，编辑器就会根据设置的 dom 内容，调用 view 转 model，转化为编辑器内部维护的 model 数据
     */
    _defineConverters() {

		const conversion = this.editor.conversion;


		conversion.for( 'dataDowncast' )
		.elementToElement( {
			model: 'sjk-attachment',
			view: ( modelItem, writer ) => {
				return writer.createContainerElement( 'div', { class: 's-attachment' } );
			}
		});


		conversion.for('editingDowncast')
		.elementToElement({
			model: 'sjk-attachment',
			view: (modelItem, viewWriter) => {
			    const viewWrapper = viewWriter.createContainerElement('div',{ class: 's-attachment' });
			    return toWidget(viewWrapper, viewWriter);
			}
		  });


		  conversion.for('downcast').elementToElement({
            model: 'sjk-attachment',
            view: (modelElement, viewWriter) => {
				const viewWrapper = viewWriter.createContainerElement('div',{ class: 's-attachment' });
			    return toWidget(viewWrapper, viewWriter);
			}
        });

        conversion.for('upcast').elementToElement({
            converterPriority: 'high',
            view: {
                name: 'div',
                classes: 's-attachment'
            },
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('sjk-attachment', {
					attr_href: viewElement._children[0].getAttribute('attr_href') || '',
					name: viewElement._children[0].getAttribute('attr_name') || '',
					size: viewElement._children[0].getAttribute('attr_size') || ''
				});
            }
        });



		conversion.for( 'dataDowncast' )
		.elementToElement( {
			model: 'sjk-name',
			view: ( modelItem, writer ) => {
				return writer.createContainerElement( 'a', { class: 's-name' } );
			}
		});


		conversion.for('editingDowncast')
		.elementToElement({
			model: 'sjk-name',
			view: (modelItem, viewWriter) => {
			    const viewWrapper = viewWriter.createContainerElement('a',{ class: 's-name' });
			    return viewWrapper
			}
		  });


		  conversion.for('downcast').elementToElement({
            model: 'sjk-name',
            view: (modelElement, viewWriter) => {
				const viewWrapper = viewWriter.createContainerElement('a',{ class: 's-name' });
			 	 return viewWrapper;
			}
        });

        conversion.for('upcast').elementToElement({
            converterPriority: 'high',
            view: {
                name: 'a',
                classes: 's-name'
            },
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('sjk-name', {
					href: viewElement._children[0].getAttribute('href') || '',
					name: viewElement._children[0].getAttribute('attr_name') || '',
					target:'_blank'
				});
            }
        });


		//   conversion.elementToElement({
		// 	model: 'sjk-name',
		// 	view: {
		// 	  name: 'a',
		// 	  classes: 's-name'
		// 	}
		// 	// ,
		// 	// model:(viewElement, modelWriter) => {
        //     //     return modelWriter.createElement('a', {
		// 	// 		class:'s-name',
		// 	// 		href: viewElement._children[0].getAttribute('attr_href') || '',
		// 	// 		target: '_blank'
		// 	// 	});
        //     // }
		//   });
	};


}

