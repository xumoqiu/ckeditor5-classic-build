import Command from '@ckeditor/ckeditor5-core/src/command';


var seperator = '、';
export default class InsertFileCommand extends Command {
    refresh() {
        this.isEnabled = true;
    }

    execute({ backContent, attachmentId }) {

        const editor = this.editor;
        const model = editor.model;
        const document = model.document;
        const selection = document.selection;

        model.change(writer => {


        });

    }
}
