import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import command from './tipCommand';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export default class tipEdit extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add('tip', new command(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    // 注册模型
    schema.register('editItemBox', {
      // 是否为一个完整的对象，不可被回车拆分，意思是回车等行为都是在它自身容器内进行
      isObject: true,
      allowWhere: '$block',
    })

    schema.register('tipContentBox', {
      allowWhere: '$block',
      isLimit: true,
      allowIn: 'editItemBox',
    })

    schema.register('tipTitle', {
      isLimit: true,
      allowIn: 'tipContentBox',
      isObject: true,
      allowContentOf: '$root'
    })

    schema.register('tipContent', {
      isLimit: true,
      allowIn: 'tipContentBox',
      isObject: true,
      allowContentOf: '$root'
    })

    schema.register('tipClose', {
      isLimit: true,
      allowIn: 'tipContentBox',
      allowContentOf: '$block'
    });


    schema.register('tipSpan', {
      isLimit: true,
      allowIn: 'tipClose',
      allowContentOf: '$block'
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    // 使用editingDowncast数据管道
    // 创建一个元件
    // model的名称整个项目需要唯一
    conversion.for('editingDowncast').elementToElement({
      model: 'editItemBox',
      view: (modelItem, viewWriter) => {
        const viewWrapper = viewWriter.createContainerElement('div');
        viewWriter.addClass('edit-item-box', viewWrapper);
        return toHorizontalLineWidget(viewWrapper, viewWriter);
      }
    });

    // 创建一个普通的转换器
    conversion.elementToElement({
      model: 'tipContentBox',
      view: {
        name: 'div',
        classes: 'tip-content-box'
      }
    });

    conversion.elementToElement({
      model: 'tipClose',
      view: {
        name: 'div',
        classes: 'close'
      }
    });

    conversion.elementToElement({
      model: 'tipSpan',
      view: {
        name: 'span',
        classes: 'closeIcon'
      }
    });

    // 创建一个普通的可编辑可选择的转换器
    conversion.for('editingDowncast').elementToElement({
      model: 'tipTitle',
      view: (modelItem, writer) => {
        const nested = writer.createEditableElement('div', { class: 'tip-title' });
        writer.setAttribute('contenteditable', nested.isReadOnly ? 'false' : 'true', nested);
        nested.on('change:isReadOnly', (evt, property, is) => {
          writer.setAttribute('contenteditable', is ? 'false' : 'true', nested);
        });
        return nested;
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'tipContent',
      view: (modelItem, writer) => {
        const nested = writer.createEditableElement('div', { class: 'tip-content' });
        writer.setAttribute('contenteditable', nested.isReadOnly ? 'false' : 'true', nested);
        nested.on('change:isReadOnly', (evt, property, is) => {
          writer.setAttribute('contenteditable', is ? 'false' : 'true', nested);
        });
        return nested;
      }
    });

  }
}

// 这个地方转换原件之后就可以进行选择之类的操作，但是这个方法是不能编辑的，因为源码里面给设置false了，具体操作可以看源码
// 源码：node_modules/@ckeditor/ckeditor5-widget/src/utils.js  => export function toWidget( element, writer, options = {} ) {}

function toHorizontalLineWidget(viewElement, writer, label) {
  // 在当前元素上设置自定义属性，  key  value  targetElement
  writer.setCustomProperty('tip', true, viewElement);
  // toWidget 转化为元件
  return toWidget(viewElement, writer, { label });
}
