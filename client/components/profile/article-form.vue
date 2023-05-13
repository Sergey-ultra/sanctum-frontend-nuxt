<template>
        <form class="form">
            <div class="input-group">
                <label>
                    <div class="label">
                        <span class="gray">Заглавная картинка статьи</span>
                    </div>
                    <one-image-upload
                            class="image-upload"
                            v-model:image="editedArticle.image"
                            :entity="`article`"
                    />
                </label>
            </div>

            <div class="input-group">
                <label>
                    <div class="label">
                        <span class="gray">Категория статьи</span>
                    </div>

                    <select v-model="editedArticle.article_category_id" class="form-control input">
                        <option
                            v-for="option in articleCategoriesLocal"
                            :key="option.id"
                            :value="option.id"
                        >
                            {{ option.name }}
                        </option>
                    </select>
                </label>
                <div class="invalid-feedback" v-for="error of v$.editedArticle.article_category_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <div class="input-group">
                <label>
                    <div class="label">
                        <span class="gray">Теги статьи</span>
                    </div>
                    <select-element>
                        <template v-slot:activator="{ on }">
                            <div class="form-control select" @click="on">
                                <div
                                    class="select__chip"
                                    v-for="selectedTag in selectedTags"
                                    :key="selectedTag.id"
                                >
                                    {{ selectedTag.tag }}
                                </div>
                            </div>
                        </template>
                        <label
                            class="select__item"
                            v-for="tag in availableArticleTags"
                            :key="tag.id"
                        >
                            <input
                                type="checkbox"
                                :value="tag.id"
                                v-model="selectedTagIds"
                            >
                            <span>{{ tag.tag }}</span>
                        </label>
                    </select-element>
                </label>
            </div>

            <div class="input-group">
                <label>
                    <div class="label">
                        <span class="gray">Заголовок</span>
                    </div>
                    <input v-model.trim="editedArticle.title" type="text" class="form-control input">
                </label>
                <div class="invalid-feedback" v-for="error of v$.editedArticle.body.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <div class="input-group">
                <label>
                    <div class="label">
                        <span class="gray">Превью</span>
                    </div>
                    <textareaComponent rows=4 v-model.trim="editedArticle.preview" class="form-control"></textareaComponent>
                </label>
            </div>
            <div class="input-group">
                <div class="label">
                    <span class="gray">Статья</span>
                </div>
<!--                <client-only>-->
<!--                   <ckEditorComponent :text="editedArticle.body"></ckEditorComponent>-->
<!--                </client-only>-->
                <textareaComponent rows=4 v-model.trim="editedArticle.body" class="form-control"></textareaComponent>
                <div class="invalid-feedback" v-for="error of v$.editedArticle.body.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <div class="buttons">
                <buttonComponent :color="'green-light'" :radius="true" @click="save">
                    {{ $route.params.id ? 'Сохранить' : 'Опубликовать' }}
                </buttonComponent>
            </div>
        </form>
</template>

<script setup>
    import textareaComponent from '../../components/textareaComponent'
    import buttonComponent from '../../components/button-component.vue'
    import selectElement from "../../components/select-element";
    import oneImageUpload from "../image-upload-as-form/one-image-upload.vue";
    // import ckEditorComponent from "../../components/ckEditorComponent";

    import {storeToRefs} from "pinia";
    import {useArticleStore} from "../../store/article";
    import {helpers, minLength, required} from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";

    const articleStore = useArticleStore();
    const {articleCategories, availableArticleTags, currentArticle} = storeToRefs(articleStore);

    const editedArticle = ref({
        article_category_id: null,
        tag_ids: []
    });

    const rules = {
        editedArticle: {
            article_category_id: {
                required: helpers.withMessage('Поле должно быть заполнено', required),
            },
            title: {
                required: helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Поле должно быть не меньше 8 символов', minLength(8))
            },
            preview: {
                required: helpers.withMessage('Поле должно быть заполнено', required),
            },
            body: {
                required: helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Поле должно быть не меньше 8 символов', minLength(8))
            },
        }
    };



    const v$ = useVuelidate(rules, { editedArticle });

    const route = useRoute();

    let articleCategoriesLocal = computed(() => {
        return [{
            id: null,
            name: 'Выберите категорию статьи'
        }].concat(articleCategories.value);
    });

    const selectedTagIds = computed({
        get() {
            return editedArticle.value.tag_ids;
        },
        set(value) {
            editedArticle.value.tag_ids = [...value];
        }
    });

    let selectedTags = computed(() => availableArticleTags.value.filter(el => editedArticle.value.tag_ids.includes(el.id)));
    const initEditedObject = () => {
        editedArticle.value = {
            ...currentArticle.value,
            tag_ids: currentArticle.value.tag_ids
                ? [...currentArticle.value.tag_ids]
                : []
        }
    };

    const save = async () => {
        const validated = await v$.value.$validate();
        if (validated) {
            if (!route.params.id) {
                await articleStore.createItem(editedArticle.value)
            } else {
                await articleStore.updateItem(editedArticle.value)
            }
            v$.value.$reset();
        }
    };


    onMounted( () => {
        articleStore.loadArticleCategories();
        articleStore.loadAvailableArticleTags();
    });
</script>

<style lang="scss" scoped>
    .form {
        width: 100%;
        max-width: 1000px;
        background: inherit;
        margin-bottom: 50px;
    }
    .image-upload {
        width: 33%;
    }

    .cke_inner {
        width: 100%;
    }

    .input-group {
        width: 100%;
    }

    .form-control {
        width: 100%;
    }
    .select {
        display: flex;
        flex-wrap: wrap;
        min-height: 36px;
        outline: #000 none medium;
        overflow: visible;
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
        border: 1px solid transparent;
        border-radius: 8px;
        background-color: rgb(240, 242, 252);
        //&:hover {
        //    border-color: rgb(192, 201, 240);
        //    transition: border-color 0.3s ease 0s;
        //}
        //&:focus {
        //    background-color: white;
        //    border-color: rgb(59, 87, 208);
        //    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
        //}

        &__chip {
            display: inline-flex;
            align-items: center;
            line-height: 20px;
            padding: 0 12px;
            background: #e0e0e0;
            border-radius: 16px;
            height: 32px;
            flex: 0 1 auto;
            margin: 4px;
            position: relative;
            outline: none;

            &:hover:before {
                opacity: .04;
            }

            &:before {

                background-color: currentColor;
                bottom: 0;
                border-radius: inherit;
                content: "";
                left: 0;
                opacity: 0;
                position: absolute;
                pointer-events: none;
                right: 0;
                top: 0;

            }
        }

        &__item {
            height: 30px;
            display: flex;
            align-items: center;

            & input {
                margin-right: 10px;
            }
        }
    }
    @media (max-width: 900px) {
        .image-upload {
            width: 50%;
        }
    }
    @media (max-width: 500px) {
        .image-upload {
            width: 100%;
        }
    }
</style>