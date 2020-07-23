import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview'
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import relFileIcon from './theme/icons/fileSelect.svg';

const relKeystroke = 'Ctrl+R';


export default class fileSelectUI extends Plugin {

    //弹出附件上传窗口

    init() {
        const editor = this.editor;
        const t = editor.t;

        // Setup `imageUpload` button.
        editor.ui.componentFactory.add('fileSelect', locale => {

            const view = new FileDialogButtonView(locale);

            view.set({
                acceptedType: '*',
                allowMultipleFiles: false
            });

            view.buttonView.set({
                label: 'Select file',
                icon: relFileIcon,
                tooltip: true,
                class: 'fileSelect',
                keystroke: relKeystroke,
                isEnabled: true
            });


            view.on('done', (evt, files) => {
                // for (const file of Array.from(files)) {

                view.fire(evt, files);

                // const reader = new FileReader();
                // reader.readAsDataURL(file);

                // reader.onload = function() {
                //     const base64Url = reader.result;
                //     const xhr = new XMLHttpRequest();
                //     xhr.open('POST', 'http://localhost:44301/File/UploadFiles', true);
                //     xhr.responseType = 'json';

                //     if (xhr.upload) {
                //         xhr.upload.addEventListener('progress', evt => {
                //             if (evt.lengthComputable) {
                //                 const uploadTotal = evt.total;
                //                 const uploaded = evt.loaded;
                //             }
                //         });
                //     }

                //     xhr.addEventListener('load', () => {
                //         const response = xhr.response;
                //         if (!response || response.error) {
                //             return reject(response && response.error ? response.error.message : genericErrorText);
                //         }
                //         resolve({
                //             default: response.url
                //         });
                //     });

                //     const data = new FormData();
                //     data.append('Base64Url', base64Url);
                //     data.append('UploadFolder', 'CKEditorFiles');
                //     xhr.send(data);
                // }

                // reader.onerror = function() {

                // }

                // reader.onprogress = function() {

                // }

                // reader.onabort = function() {
                //     reader.abort();
                // }

                //  }
            });

            return view;
        });

    }

}
