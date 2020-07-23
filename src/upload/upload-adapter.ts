export class UploadAdapter {
    private loader;
    private xhr;
    constructor(loader: any) {
      this.loader = loader;

    }
    public upload() {
        return new Promise((resolve, reject) => {


            this._initRequest();
            this._initListeners(resolve, reject, this.loader.file);
            this._sendRequest( this.loader.file );


        });
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open( 'POST',  '/File/UploadFiles', true );
        xhr.responseType = 'json';
    }

    _initListeners(resolve, reject, file){
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );

        xhr.addEventListener( 'load', () => {
            const response = xhr.response;
            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }
            resolve( {
                default: response.url
            } );
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }

    }

    _sendRequest( file ) {
        // Prepare the form data.
        const data = new FormData();
        //data.append( 'files', file );
        data.append( 'UploadFolder', 'CKEditorFiles' );
        // Send the request.
        this.xhr.send( data );
    }

    public abort() {
        this.xhr.abort();
    }
}
