import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import InsertFileIcon from './theme/icons/InsertFile.svg';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import $ from 'jquery';

export default class InsertFile extends Plugin {
    init() {
        const editor = this.editor;
        editor.ui.componentFactory.add('insertFile', locale => {
            const view = new FileDialogButtonView(locale);

            view.set({
                acceptedType: '*',
                allowMultipleFiles: true
            });


            const bLabel = editor.config.get('InsertFile.label');
            const bIcon = editor.config.get('InsertFile.icon');
            const bBaseUrl = editor.config.get('InsertFile.baseUrl');
            const bUploadUrl = editor.config.get('InsertFile.uploadUrl');
            const bTooltip = editor.config.get('InsertFile.tooltip');
            const bAction = editor.config.get('InsertFile.action');


            view.buttonView.set({
                label: !!bLabel ? bLabel : 'Insert file',
                icon: !!bIcon ? bIcon : InsertFileIcon,
                tooltip: !!bTooltip ? bTooltip : true
            });

            view.on('done', (evt, files) => {
                for (const file of Array.from(files)) {
                    const fileName = file.name;
                    const fileType = file.type;
                    var formData = new FormData();
                    formData.append('file', file);
                    formData.append('UploadFolder', 'ckeditorFile');
                    $.ajax({
                        url: bBaseUrl + bUploadUrl,
                        type: 'POST',
                        cache: false,
                        data: formData,
                        processData: false,
                        contentType: false
                    }).done(function(res) {
                        const sourceUrl = bBaseUrl + '//' + res.result[0].filePath;
                        if (fileType.indexOf('image') > -1) {
                            editor.model.change(writer => {
                                const imageElement = writer.createElement('image', {
                                    src: sourceUrl,
                                    alignment: 'center'
                                });
                                editor.model.insertContent(imageElement, editor.model.document.selection);
                            });
                        } else {
                            editor.model.change(writer => {
                                var content = '<a target="_blank" href="' + sourceUrl + '">' + fileName + '</a>';
                                var viewFragment = editor.data.processor.toView(content);
                                var modelFragment = editor.data.toModel(viewFragment);
                                editor.model.insertContent(modelFragment, editor.model.document.selection);
                            });
                        }
                    }).fail(function(res) {

                    });

                }
            });


            return view;
        });
    }
}
