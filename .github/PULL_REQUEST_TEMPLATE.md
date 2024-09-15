<!---
☝️ PR title should follow conventional commits (https://conventionalcommits.org)
-->

### 🔗 Linked issue

<!-- If it resolves an open issue, please link the issue here. For example "Resolves #123" -->
Resolves [#2170](https://github.com/nuxt/ui/issues/2170)

### ❓ Type of change

<!-- What types of changes does your code introduce? Put an `x` in all the boxes that apply. -->

- [ ] 📖 Documentation (updates to the documentation or readme)
- [x] 🐞 Bug fix (a non-breaking change that fixes an issue)
- [ ] 👌 Enhancement (improving an existing functionality)
- [ ] ✨ New feature (a non-breaking change that adds functionality)
- [ ] 🧹 Chore (updates to the build process or auxiliary tools and libraries)
- [ ] ⚠️ Breaking change (fix or feature that would cause existing functionality to change)

### 📚 Description

<!-- Describe your changes in detail -->
This PR addresses a reactivity issue with the `selectAllRows` function in the table component. When selecting all rows, the previous implementation used `Array.push()` to modify the array in place, which did not properly trigger Vue's reactivity system. This caused the `watch` on the `selected` array not to fire correctly.

The solution was to create a new array by spreading `selected.value`, then appending unselected rows to this new array and reassigning it back to `selected.value`. This ensures that Vue's reactivity system detects the changes and triggers the necessary updates.

### 📝 Checklist

<!-- Put an `x` in all the boxes that apply. -->
- [x] I have linked an issue or discussion.
- [ ] I have updated the documentation accordingly.