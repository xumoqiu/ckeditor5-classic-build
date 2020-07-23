 class Base64UploadAdapter {

    public reader = new FileReader();
    loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    public upload() {
        return new Promise((resolve, reject) => {
            const reader = this.reader;
            reader.addEventListener('load', () => {
                console.log(reader.result);
                resolve({ default: reader.result });
            });

            reader.addEventListener('error', err => {
                reject(err);
            });

            reader.addEventListener('abort', () => {
                reject();
            });

            this.loader.file.then((file: Blob) => {
                reader.readAsDataURL(file);
            });
        });
    }

    public abort() {
        this.reader.abort();
    }
}
