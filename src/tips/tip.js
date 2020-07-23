import ui from './tipUi'
import edit from './tipEdit'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

export default class Tip extends Plugin {
  static get requires() {
    return [ui, edit, Widget];
  }
}
