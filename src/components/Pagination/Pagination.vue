<template>
    <div class="d-flex justify-content-end">
        <i class="fa-solid fa-angles-left mx-1"></i>
        <i class="fa-solid fa-angle-left mx-1"></i>
        <span class="inner-pagination-content">
            Pagina {{ page }} de {{ perPage }}
        </span>
        <i class="fa-solid fa-angle-right mx-1"></i>
        <i class="fa-solid fa-angles-right mx-1"></i>
    </div>
</template>

<script>
export default{
    props: ['totalRec'],
    data(){
        return{
            page: 1,
            perPage: 5
        }
    },
    computed: {
        pages(){
            const pages = totalRec % this.perPage

        }
    }
}
</script>