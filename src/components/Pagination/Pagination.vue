<template>
    <div class="d-flex justify-content-end align-items-center">
        <i class="fa-solid fa-angles-left mx-1"></i>
        <i class="fa-solid fa-angle-left mx-1"></i>
        <span class="inner-pagination-content mx-1">
            Pagina {{ page }} de {{ pages }}
        </span>
        <i class="fa-solid fa-angle-right mx-1"></i>
        <i class="fa-solid fa-angles-right mx-1"></i>
        <input type="text" class="inner-pagination-content border mx-1" 
         v-model="perPage"
         v-on:keyup="formatN"
         maxlength="2"
         style="height: 20px; width: 40px;">
    </div>
</template>

<script>
import { useStore } from 'vuex';

export default{
    props: ['totalRec'],
    data(){
        return{
            page: 1,
            perPage: "5"
        }
    },
    computed: {
        pages(){
            const remainder = this.totalRec % parseInt(this.perPage)
            

            if(remainder > 0){
                return Math.floor(this.totalRec / parseInt(this.perPage)) + 1
            }
            else{
                return this.totalRec / parseInt(this.perPage)
            }
        }
    },
    methods: {
        formatN(){
            var num = this.perPage.replace(/\./g,'');
            if(isNaN(num)){
                this.$swal({
                    icon: 'error',
                    title: 'En este campo solo se permiten números'
                })
                this.perPage = this.perPage.replace(/[^\d\.]*/g,'');
            }
            else{
                this.store.state.perPage = this.perPage
            }
        }
    },
    setup(){
        const store = useStore()

        return{
            store
        }
    }
}
</script>

<style>
.inner-pagination-content{
    font-size: smaller;
    text-align: center;
}
</style>