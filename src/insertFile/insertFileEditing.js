import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import InsertFileCommand from './insertFileCommand';

export default class InsertFileEditing extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('insertFile', new InsertFileCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;


    }

    _defineConverters() {
        const conversion = this.editor.conversion;



    }
}
