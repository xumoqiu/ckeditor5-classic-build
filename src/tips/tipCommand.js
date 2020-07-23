import Command from '@ckeditor/ckeditor5-core/src/command';

export default class tipCommand extends Command {
  execute() {
    this.editor.model.change(writer => {
      this.editor.model.insertContent(createTip(writer));
    });
  }
}

function createTip(writer) {
  const editItemBox = writer.createElement('editItemBox');
  const tipContentBox = writer.createElement('tipContentBox');
  const tipTitle = writer.createElement('tipTitle');
  const tipContent = writer.createElement('tipContent');

  // 创建关闭按钮
  const tipClose = writer.createElement('tipClose');
  const span = writer.createElement('tipSpan');
  writer.insertText('x', writer.createPositionAt(span, 0));
  writer.append(span, tipClose);

  // 创建标题
  const paragraph = writer.createElement('paragraph');
  writer.appendText('提示的标题', paragraph);

  // 创建内容
  const paragraph1 = writer.createElement('paragraph');
  writer.appendText('1. 多喝水', paragraph1);
  const paragraph2 = writer.createElement('paragraph');
  writer.appendText('2. 多喝热水', paragraph2);
  writer.insert(paragraph, tipTitle, 0);
  writer.insert(paragraph1, tipContent, 0);
  writer.insert(paragraph2, tipContent, 1);
  writer.append(tipContent, tipContentBox);
  writer.append(tipClose, tipContentBox);
  writer.append(tipTitle, tipContentBox);
  writer.append(tipContentBox, editItemBox);

  return editItemBox;
}
