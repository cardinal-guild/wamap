<template>
  <div v-if="island">
    {{ island.properties.name }}
  </div>
  <div v-else>
    {{ $store.state.islandData ? $store.state.islandData.length : 'null' }}
  </div>
</template>
<script>
import axios from 'axios'

export default {
  validate ({ params }) {
    return /^\d+/.test(params.id)
  },
  async asyncData ({ payload, params }) {
    if (payload) return { island: payload }
    else {
      const res = await axios.get(`${process.env.API_URL}/api/islands.json`)
      return {
        island: res.data.features.find(i => String(i.id) === params.id)
      }
    }
  },
  fetch ({ redirect, params, route, payload }) {
    if (!payload) redirect(`/${route.path.split('/')[1]}?island=${params.id}`)
  },
  head () {
    return {
      title: this.island ? this.island.properties.name : 'Loading...',
      meta: [
        { hid: 'og:title', name: 'og:title', content: this.island ? this.island.properties.name : 'Loading...' },
        { hid: 'og:image', name: 'og:image', content: this.island ? this.island.properties.imageOriginal : 'none' },
        {
          hid: 'og:description', name: 'og:description', content: this.island ?
            `
              Databanks: ${this.island.properties.databanks}
              Altitude: ${this.island.properties.altitude}
              Culture: ${this.island.properties.type.slice(0, 1).toUpperCase() + this.island.properties.type.slice(1)}
            ` :
            'N/A'
        }
      ]
    }
  }
}
</script>
