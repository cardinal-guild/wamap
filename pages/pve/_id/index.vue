<template>
  <div>{{ island.id }}</div>
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
  mounted () {
    this.$router.push(`/${this.$route.path.split('/')[1]}?island=${this.$route.params.id}`)
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
        },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ type: 'application/json+oembed', href: this.island ? `${process.env.API_URL}/api/islands/${this.island.id}/oEmbed.json` : 'none' }]
    }
  }
}
</script>
