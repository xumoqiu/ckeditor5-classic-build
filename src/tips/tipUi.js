import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

// import icon from './icons/insert.svg';

export default class tipUi extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;
    editor.ui.componentFactory.add('tip', locale => {
      const view = editor.editing.view;
      const command = editor.commands.get('tip');
      view.addObserver(ClickObserver);
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t('插入tip'),
        // 如果要用icon可以把这里打开，等会儿再说icon的问题
        // icon: icon,
        tooltip: true,
        // true表示使用文字，false表示用icon，可以一起用，但是会并列
        withText:true
      });
      buttonView.bind('isOn', 'tip').to(command, 'value', 'isEnabled');

      this.listenTo(buttonView, 'execute', () => editor.execute('tip'));
      return buttonView;
    });
  }
}
