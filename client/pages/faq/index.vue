<template>
    <div>
        <h1>Ответы на частые вопросы</h1>

        <div class="faq">
            <ul class="faq__parents wrapper">
                <li v-for="(item, index) in menu" :key="item.code" class="faq__menuItem">
                    <div @click="currentMenuIndex = index">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </svg>
                        {{ item.title }}
                    </div>
                </li>
            </ul>
            <div v-if="currentMenu" class="faq__content">
                <div v-if="currentQuestion !== null" @click="setCurrentQuestion(null)">
                    <fa icon="arrow-left"></fa>
                    Назад
                </div>
                <div class="section wrapper">
                    <h2 v-if="currentQuestion !== null">{{ currentQuestion?.q ?? ''}}</h2>
                    <h2 v-else>{{ currentMenu?.title ?? '' }}</h2>
                    <div v-if="currentQuestion !== null" class="faq__body">
                        {{ currentQuestion?.a ?? ''}}
                    </div>
                    <ul v-else class="faq__questions">
                        <li v-for="(question, questionIndex) in currentMenu.list.map(el => el.q)"
                            @click="setCurrentQuestion(questionIndex)">
                            {{ question }}
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>

</template>
<script setup>
import {useFaqStore} from "~/store/faq";
import {storeToRefs} from "pinia";

const faqStore = useFaqStore();
const { menu } = storeToRefs(faqStore);

const currentMenuIndex = ref(0);
const questionIndex = ref(null);

const currentMenu = computed(() => {
    if (null !== currentMenuIndex.value) {
        return menu.value[currentMenuIndex.value];
    }
    return null;
});

const currentQuestion = computed(() => {
    if (null !== questionIndex.value) {
        return currentMenu.value.list[questionIndex.value];
    }
    return null;
});

const setCurrentQuestion = index => questionIndex.value = index;

onMounted(async() => {
    await faqStore.loadMenu();
})
</script>
<style scoped lang="scss">
.faq {
    display: flex;
    justify-content: space-between;
    &__parents {
        margin: 0;
        list-style: none;
        width: 28%;
        padding:0;
    }
    &__menuItem {
        cursor: pointer;
        border-bottom: 1px solid #eee;
        & > * {
            gap: 10px;
            display: flex;
            padding: 1em;
        }
        & svg {
            width: 1.4em;
            height: 1.4em;
            flex-shrink: 0;
        }
    }
    &__content {
        width: 70%;
        & .section {
            padding: 0;
            & h2 {
                margin: 0;
                padding: 16px;
                border-bottom: 1px solid #eee;
            }
        }
    }
    &__questions {
        & li {
            cursor: pointer;
            padding-bottom: 24px;
        }
    }
    &__body {
        padding: 16px;
    }
}
</style>
