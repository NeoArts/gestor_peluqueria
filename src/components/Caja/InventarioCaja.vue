<template>
    Holi
</template>

<script>
import firebase from 'firebase';

export default{
    beforeMount(){
        this.$swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            width: auto,
            didOpen: () => {
                this.$swal.showLoading();
            }
        })
    },
    data(){
        return{
            items: [],
            mostrar: false,
        }
    },
}
</script>

<style></style>