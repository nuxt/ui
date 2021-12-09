import { defineNuxtPlugin } from '#app'

function Ticker (callback, interval) {
  let id

  this.start = function () {
    id = window.setInterval(callback, interval)
  }

  this.stop = function () {
    window.clearInterval(id)
  }

  this.start()
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('ticker', Ticker)
})
