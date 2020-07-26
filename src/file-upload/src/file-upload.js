/**
 * @module heading/heading
 */

import FileUploadEditing from './file-upload-editing.js';
import FileUploadUI from './file-upload-ui.js';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class FileUpload extends Plugin {
    /**
     * 定义插件名称
     */
    static get pluginName() {
        return 'FileUpload';
    }

    /**
     * 实现插件的关键接口
     */
    static get requires() {
        return [FileUploadEditing, FileUploadUI];
    }
}
