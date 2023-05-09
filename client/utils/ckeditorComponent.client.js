import CKEditor from '@ckeditor/ckeditor5-vue';
import classicEditor from '@ckeditor/ckeditor5-build-classic';
export default defineNuxtPlugin(nuxtApp => {
    //ckeditor.constructor()
    nuxtApp.vueApp.use(CKEditor);
   // nuxtApp.vueApp.component(classicEditor)
})