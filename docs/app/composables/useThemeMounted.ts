/**
 * True once the client has taken over, shared by every instance.
 *
 * The saved theme is restored on the client, so a control that reads it paints
 * the server's stock theme until then, or its markup disagrees with the one it
 * hydrates. `useMounted` does that per instance, and the header's cluster
 * mounts a second time when the mobile menu opens (UHeader reuses its template
 * inside it), so a control created then would flash the stock theme long after
 * hydration is done. Shared, it is already true for that second instance.
 */
export function useThemeMounted() {
  const mounted = useState('theme-mounted', () => false)

  onMounted(() => {
    mounted.value = true
  })

  return mounted
}
