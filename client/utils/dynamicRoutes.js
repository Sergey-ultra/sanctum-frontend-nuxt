//import {$fetch} from "ohmyfetch";

export default async () => {
    try {
        const { data: products } = await $fetch('https://smart-beautiful.ru/api/routes/skus-queries');
        const { data: brands } = await $fetch('https://smart-beautiful.ru/api/routes/brands');
        const { data: articles } = await $fetch('https://smart-beautiful.ru/api/routes/articles');
        const { data: categories } = await $fetch('https://smart-beautiful.ru/api/routes/categories');



        const productUrls = products.map(url => [
            `/product/${url}`,
            `/product/${url}/questions`,
            `/product/${url}/reviews`
        ]).flat();


        return [].concat(articles, productUrls, brands, categories);
    } catch (err) {
        console.error(err)
        return ['err' + err];
    }
}
