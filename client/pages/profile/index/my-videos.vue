<template>
    <div>
        <reviewsAnswersNav></reviewsAnswersNav>

        <div class="loader__wrapper" v-if="isLoadingMyVideos">
            <loader class="loader"></loader>
        </div>

        <my-video
            @deleteItem="videoStore.deleteItem(item.id)"
            :item="item"
            class="item"
            v-for="(item, index) in myVideos"
            :key="index"
        />

        <pagination
            v-if="myVideos.length && myVideosLastPage > 1"
            v-model:currentPage="currentPageLocal"
            :lastPage="myVideosLastPage"
        />
    </div>
</template>

<script setup>
    import pagination from '~/components/pagination'
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import loader from "~/components/loader";
    import myVideo from "~/components/profile/my-video";
    import { storeToRefs } from "pinia";
    import {useVideoStore} from "~/store/video";
    import {useRuntimeConfig} from "#app";

    const config = useRuntimeConfig();
    const videoStore = useVideoStore();
    const { isLoadingMyVideos, myVideos, myVideosOptions, myVideosLastPage } = storeToRefs(videoStore);

    let router =  useRouter();
    let route =  useRoute();

    const setPageQuery = value => {
        const query = {...route.query}

        if (value > 1) {
            query.page = value
        } else if (value === 1) {
            delete query.page
        }
        router.push({query})
    };

    const currentPageLocal = computed({
        get() {
            return myVideosOptions.value.currentPage;
        },
        set(value) {
            setPageQuery(value);
        }
    });

    watch(
        () => ({ params: route.query }),
        async (value) => {
            videoStore.setMyVideosOptionsByQuery(value.query);
            await videoStore.loadMyVideos();
        },
        {deep: true}
    );

    const setSEO = () => {
        const title = `Мои видео`;
        const metaName = `${title} ${config.public.siteTitle}`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    setSEO();


    onMounted(async () => {
        videoStore.setMyVideosOptionsByQuery(route.query);
        await videoStore.loadMyVideos();
    });

</script>

<style lang="scss" scoped>
    .loader {
        width: 100px;
        height: 100px;
        &__wrapper {
            display: flex;
            justify-content: center;
            align-items:center;
        }
    }
</style>
