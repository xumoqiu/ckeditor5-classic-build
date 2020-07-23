import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileSelectCommand from './fileSelectCommand';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export default class FileSelectEditing extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('fileSelect', new FileSelectCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;


    }

    _defineConverters() {
        const conversion = this.editor.conversion;



    }
}
