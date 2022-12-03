<template>
  <div>
    <reviewsAnswersNav></reviewsAnswersNav>
    <h2>Ваши ответы будут полезны другим</h2>
    О многих товарах на Маркете пользователи задают вопросы.
    Возможно, на какие-то из них вы знаете ответ.
    Найдите в соответствующем разделе товар, о котором вы многое знаете, и проверьте, о чём спрашивают во вкладке «Вопросы о товаре».
  </div>
</template>

<script setup>
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    const setSEO = () => {
        const title = `Мои ответы`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }
    setSEO();
</script>

<style scoped>

</style>