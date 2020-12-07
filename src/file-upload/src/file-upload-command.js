import Command from '@ckeditor/ckeditor5-core/src/command';
import axios from 'axios';

export default class InsertSjkFileUploadEditorCommand extends Command {
    execute() {
        var that = this;
        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.className = 'uploadInput';
        uploadInput.onchange = function(e) {
            changeUploadInput.call(this, e, that, that.editor);
        };
        uploadInput.click();
    }


    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'sjk-attachment');
        this.isEnabled = allowedIn !== null;
    }
}

/**
 *  创建一个上传zip的dom
 * **/
function changeUploadInput(e, that, editor) {
    var form = new FormData();
    const name = this.files[0].name;
    const ext = this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1, this.files[0].name.length).toLocaleLowerCase();
    const size = this.files[0].size / 1024 / 1024;


    const baseUrl = that.editor.config._config.uploadFile.baseUrl;
    const uploadUrl = that.editor.config._config.uploadFile.uploadUrl;
    const ckEditorId = that.editor.config._config.uploadFile.ckEditorId;


    if (!ext.match(/zip|rar|7z|pdf|ppt|pptx|csv|xls|xlsx|doc|docx|mp4/)) {
        createWarningMessageEle('The supported file format is zip/rar/7z/pdf/ppt/pptx/csv/xls/xlsx/doc/docx/mp4', ckEditorId);
        return false;
    }
    if (size > 500) {
        createWarningMessageEle('File size can not exceed 500MB', ckEditorId);
        return false;
    }


    // form.append(that.editor.config._config.uploadFile.key1, this.files[0]);
    // form.append(that.editor.config._config.uploadFile.key2, 'ckeditorFile');

    form.append('file', this.files[0]);
    form.append('UploadFolder', that.editor.config._config.uploadFile.key);

    sendData(ckEditorId, baseUrl, uploadUrl, {
        params: form,
        fileName: name,
        fileSize: size
    }, insertFile, editor);
}
/**
 *
 * 发送二进制流给后台
 */
function sendData(ckEditorId, baseUrl, uploadUrl, args, callback, editor) {
    var containerDiv = document.createElement('div');
    containerDiv.id = 'ckeditorWarningMessageContainer';
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'ckeditorWarningMessage';
    loadingDiv.innerText = 'Uploading';
    containerDiv.appendChild(loadingDiv);
    // const refNode = document.getElementsByClassName('ck-restricted-editing_mode_standard')[0];
    // const parentNode = document.getElementsByClassName('ck-editor__main')[0];

    const refNode = document.getElementById(ckEditorId).getElementsByClassName('ck-content')[0];
    const parentNode = document.getElementById(ckEditorId).getElementsByClassName('ck-editor__main')[0]



    parentNode.insertBefore(containerDiv, refNode);

    axios({
        url: baseUrl + uploadUrl,
        method: 'post',
        data: args.params,
        headers: {
            //'Authorization': 'Bearer ' + abp.auth.getToken(), // 此处为你定义的token 值(Bearer token 接口认证方式)
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: [function(data) {
            return data
        }],
        onUploadProgress: progressEvent => {
            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
            loadingDiv.innerText = 'Uploading ：' + complete;
        }
    }).then(res => {
        callback(res.data, baseUrl, editor)
        containerDiv.remove();
    }).catch(error => {
        containerDiv.remove();
        createWarningMessageEle(error, ckEditorId);
    });
}


function createsjkFileUploadEditor(writer, data, baseUrl) {
    const box = writer.createElement('sjk-attachment', {
        attr_href: baseUrl + data.result[0].filePath,
        attr_name: data.result[0].fileName,
        attr_size: data.result[0].fileSize,
        href: baseUrl + data.result[0].filePath,
        name: data.result[0].fileName,
        size: data.result[0].fileSize
    });
    const aTarget = writer.createElement('sjk-name', {
        href: baseUrl + data.result[0].filePath,
        name: data.result[0].fileName,
        target: '_blank',
        download: baseUrl + data.result[0].filePath
    });
    //writer.insertText(data.result[0].fileName, writer.createPositionAt(name, 0));
    writer.append(aTarget, box);
    return box;
}


// errorAlert
function createWarningMessageEle(data, ckEditorId) {
    var containerDiv = document.createElement('div');
    containerDiv.id = 'ckeditorWarningMessageContainer';
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'ckeditorWarningMessage';
    containerDiv.appendChild(loadingDiv);
    loadingDiv.innerText = data;

    const refNode = document.getElementById(ckEditorId).getElementsByClassName('ck-content')[0];
    const parentNode = document.getElementById(ckEditorId).getElementsByClassName('ck-editor__main')[0];

    parentNode.insertBefore(containerDiv, refNode);
    setTimeout(() => {
        containerDiv.remove();
    }, 3000);
}
/**
 *
 *  回调回来之后的函数
 */
function insertFile(data, baseUrl, editor) {
    editor.model.change(writer => {
        editor.model.insertContent(createsjkFileUploadEditor(writer, data, baseUrl), editor.model.document.selection);
    });
}
