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
    if (!ext.match(/zip|rar|7z|pdf|ppt|pptx|csv|xls|xlsx|doc|docx|mp4/)) {
        createWarningMessageEle('The supported file format is zip/rar/7z/pdf/ppt/pptx/csv/xls/xlsx/doc/docx/mp4');
        return false;
    }
    if (size > 500) {
        createWarningMessageEle('File size can not exceed 500MB');
        return false;
    }

    const baseUrl = that.editor.config._config.uploadFile.baseUrl;
    const uploadUrl = that.editor.config._config.uploadFile.uploadUrl;


    form.append(that.editor.config._config.uploadFile.key1, this.files[0]);
    form.append(that.editor.config._config.uploadFile.key2, 'ckeditorFile');
    sendData(baseUrl, uploadUrl, {
        params: form,
        fileName: name,
        fileSize: size
    }, insertFile, editor)
}
/**
 *
 * 发送二进制流给后台
 */
function sendData(baseUrl, uploadUrl, args, callback, editor) {
    // let request = new Request(baseUrl + uploadUrl, {
    //     body: args.params || {}, // *default, no-cache, reload, force-cache, only-if-cached
    //     // credentials: 'include', // include, same-origin, *omit
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors' // no-cors, cors, *same-origin
    // });


    // fetch(request)
    //     .then((data) => {
    //         return data.json();
    //     })
    //     .then((value) => {
    //         if (value.success) {
    //             callback(value, baseUrl, editor);
    //         } else {
    //             createWarningMessageEle(value.error);
    //         }
    //     })
    //     .catch((e) => {
    //         createWarningMessageEle(e)
    //     })



    var containerDiv = document.createElement('div');
    containerDiv.id = 'ckeditorWarningMessageContainer';
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'ckeditorWarningMessage';
    containerDiv.appendChild(loadingDiv);


    const cc = document.getElementsByClassName('ck-editor__main');

    cc[0].prepend(containerDiv);

    //document.body.appendChild(containerDiv);



    //ck

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
        createWarningMessageEle(error);
    });

    // const res = {
    //     url: 'https://www.baidu.com',
    //     name: args.fileName
    // };

    // callback(res, baseUrl, editor)

}


function createsjkFileUploadEditor(writer, data, baseUrl) {

    const box = writer.createElement('sjk-attachment', {
        attr_href: baseUrl + data.result[0].filePath,
        href: baseUrl + data.result[0].filePath,
        name: data.result[0].fileName,
        size: 1000,
        attr_name: data.result[0].fileName,
        attr_size: 1000
    });

    const name = writer.createElement('sjk-name', {
        href: baseUrl + data.result[0].filePath,
        name: data.result[0].fileName,
        target: '_blank'
    });

    writer.insertText(data.result[0].fileName, writer.createPositionAt(name, 0));
    writer.append(name, box);

    return box;

}


// errorAlert
function createWarningMessageEle(data) {


    var containerDiv = document.createElement('div');
    containerDiv.id = 'ckeditorWarningMessageContainer';

    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'ckeditorWarningMessage';

    containerDiv.appendChild(loadingDiv);
    document.body.appendChild(containerDiv);

    loadingDiv.innerText = data;
    //document.body.appendChild(containerDiv);


    const cc = document.getElementsByClassName('ck-editor__main');

    cc[0].prepend(containerDiv);

    // setTimeout(() => {
    //     containerDiv.remove();
    // }, 3000);
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
