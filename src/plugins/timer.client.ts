import { defineNuxtPlugin } from '#app'

function Timer (callback, delay) {
  let timerId
  let start
  let remaining = delay

  this.pause = function () {
    window.clearTimeout(timerId)
    remaining -= new Date() - start
  }

  this.resume = function () {
    start = new Date()
    window.clearTimeout(timerId)
    timerId = window.setTimeout(callback, remaining)
  }

  this.reset = function () {
    start = new Date()
    window.clearTimeout(timerId)
    timerId = window.setTimeout(callback, delay)
  }

  this.stop = function () {
    window.clearTimeout(timerId)
  }

  this.resume()
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('timer', Timer)
})
