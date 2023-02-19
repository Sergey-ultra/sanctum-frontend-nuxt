<template>
    <div class="wrapper">
        <form class="form">
            <div>Заглавная картинка статьи</div>
            <!--        <one-image-upload v-model:image="editedArticle.image"/>-->

            <div class="input-group">
                <label>
                    Категория статьи
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
                Теги статьи
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
            </div>

            <div class="input-group">
                <label>
                    Заголовок
                    <input v-model.trim="editedArticle.title" type="text" class="form-control input">
                </label>
                <div class="invalid-feedback" v-for="error of v$.editedArticle.body.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <div class="input-group">
                <label>
                    Превью
                    <textarea v-model.trim="editedArticle.preview" class="form-control textarea"></textarea>
                </label>
            </div>
            <div class="input-group">
                Статья
                <textarea
                    class="form-control textarea"
                    v-model.trim="editedArticle.body"
                >
                </textarea>
                <div class="invalid-feedback" v-for="error of v$.editedArticle.body.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <div class="buttons">
                <button class="btn" @click="save">{{ $route.params.id ? 'Сохранить' : 'Создать' }}</button>
                <nuxt-link :to="{name: 'profile-index-my-articles'}" class="btn">
                    <span>Назад</span>
                </nuxt-link>
            </div>
        </form>
    </div>
</template>

<script setup>
    import selectElement from "../../components/select-element";
    import {storeToRefs} from "pinia";
    import {useArticleStore} from "../../store/article";
    import {helpers, minLength, required} from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";

    const articleStore = useArticleStore();
    const {articleCategories, availableArticleTags} = storeToRefs(articleStore);

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


    onMounted(() => {
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

.cke_inner {
    width: 100%;
}
a {
    text-decoration: none;
}

.input {
    height: 38px;
    width: 200px;
    outline: #000 none medium;
    overflow: visible;
    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px;
    background-color: rgb(240, 242, 252);

    &:hover {
        border-color: rgb(192, 201, 240);
        transition: border-color 0.3s ease 0s;
    }

    &:focus {
        background-color: white;
        border-color: rgb(59, 87, 208);
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    }
}

.textarea {
    width: 100%;
    resize: vertical;
    outline: #000 none medium;
    overflow: visible;
    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px;
    background-color: rgb(240, 242, 252);

    &:hover {
        border-color: rgb(192, 201, 240);
        transition: border-color 0.3s ease 0s;
    }

    &:focus {
        background-color: white;
        border-color: rgb(59, 87, 208);
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    }
}

.buttons {
    height: 35px;
    margin-top: 15px;
    margin-bottom: 25px;
    align-items: center;
    display: flex;
    justify-content: flex-end;
}
.btn {
    margin-top: 15px;
    color: #fff;
    background-color: #42b983;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    line-height: 36px;
    padding: 0 20px;
}

.btn:not(:last-child) {
    margin-right: 15px;
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
.wrapper {
    margin-top: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
}
</style>