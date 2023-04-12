import {useNuxtApp} from "#app";

export const useFileStore = defineStore({
    id: 'file',
    state: () => ({
        isUploading: false,
        progress:0,
        uploadingFileUrls:[]
    }),
    actions: {
        async loadFilesAsForm({ files, entity, type, fileName }) {
            this.isUploading = true;
            if (['image', 'video'].includes(type)) {

                let form = new FormData();
                form.append('entity', entity);
                form.append('type', type);
                if (fileName) {
                    form.append('file_name', fileName);
                }

                //
                // if (!Array.isArray(files)) {
                //     files = [files]
                // }
                for (let i = 0; i < files.length; i++) {
                    form.append('files[]', files[i]);
                }

                const { $api } = useNuxtApp();
                const { data } = await $api.post('/files', form, {
                    headers: {'Content-Type': 'multipart/form-data'},
                    onUploadProgress: e => {
                        if (e.lengthComputable) {
                            this.progress = (e.loaded / e.total) * 100;
                        }
                    }
                });
                if (data && Array.isArray(data)) {
                    this.uploadingFileUrls = data
                        .filter(item => item.status !== false)
                        .map(item => item.saved_name)
                }
            }
            this.isUploading = false;
        },
    }
});
