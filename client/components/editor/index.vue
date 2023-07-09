<script setup>
    // import EditorJS    from '@editorjs/editorjs';
    // import SimpleImage from '@editorjs/simple-image';
    // // import List        from '@editorjs/list';
    // // // import LinkTool    from '@editorjs/link'
    // let EditorJS = null, SimpleImage = null;
    //
    // if (process.client) {
    //
    // }

    const props = defineProps({
        modelValue: {
            default: {},
        },
    });

    onMounted(async () => {

        // EditorJS = await import('@editorjs/editorjs');
        // SimpleImage = await import('@editorjs/simple-image');
        // console.log(process, EditorJS);
        const editor = new EditorJS({
            holder: 'editor2',
            tools: {
                image: SimpleImage,
                // list: List,
                // linkTool: LinkTool,
            },
            autofocus: true,
            onChange: (api, event) => {
                api.saver.save().then(async (data) => {
                    emit("update:modelValue", data);
                });
            },
            data: props.modelValue,
            logLevel: "ERROR",
        })

          //useNuxtApp().provide("currentEditor", editor);
    })
</script>
<template>
    <client-only>
        <div id="editor2"></div>
    </client-only>
</template>

