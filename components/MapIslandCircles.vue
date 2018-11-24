<template>
    
</template>

<script>
export default {
  props: ['zoomLevel'],
  watch: {
    zoom: function (val) {
      this.zoomLevel = val;
    }
  }
};
</script>
