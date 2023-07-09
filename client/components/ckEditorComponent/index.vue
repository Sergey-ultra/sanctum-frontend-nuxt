<template>
    <ckeditor
        :editor="editor"
        v-model.trim="textLocal"
        :config="editorConfig">
    </ckeditor>
</template>

<script>
    import UploadAdapter from '~/utils/customCKEditorUploader';
    // import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
    // import CKEditor from '@ckeditor/ckeditor5-vue';
    const uploader = function (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
            new UploadAdapter(loader, '/');
    };
    //let editor = reactive({});
    let CKEditor;
    let ClassicEditor;

    if (process.client) {
        ClassicEditor = await import("@ckeditor/ckeditor5-build-classic");
        CKEditor = (await import('@ckeditor/ckeditor5-vue')).component;
        //editor = ClassicEditor;
        console.log(ClassicEditor);
    } else {
        CKEditor = { component: { template: '<div></div>' } }
    }

    // //import classicEditor from "@ckeditor/ckeditor5-build-classic";
    // const props = defineProps({
    //     text: {
    //         type: String,
    //         default: ''
    //     }
    // });

    //const editorConfig = { extraPlugins: [ uploader ] };

    export default {
        components: {
            ckeditor: CKEditor
        },
        data() {
            return {
                editor: ClassicEditor,
                editorConfig: { extraPlugins: [ uploader ] }
            }
        },
        props: {
            modelValue: {
                type: String,
                default: ''
            }
        },
        computed: {
            textLocal: {
                get() {
                    return this.modelValue;
                },
                set(value) {
                    this.$emit("update:modelValue", value);
                }
            }
        }
    }
</script>
