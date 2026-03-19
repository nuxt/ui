### 🔗 Linked issue

Resolves https://github.com/nuxt/ui/issues/5464

### ❓ Type of change

- [ ] 📖 Documentation (updates to the documentation or readme)
- [ ] 🐞 Bug fix (a non-breaking change that fixes an issue)
- [x] 👌 Enhancement (improving an existing functionality)
- [ ] ✨ New feature (a non-breaking change that adds functionality)
- [ ] 🧹 Chore (updates to the build process or auxiliary tools and libraries)
- [ ] ⚠️ Breaking change (fix or feature that would cause existing functionality to change)

### 📚 Description

The `sticky` prop was explicitly disabled when `virtualize` was on, and the docs listed it as unsupported.

The approach I found that works cleanest is switching from transform-based row positioning to the spacer-row strategy. Instead of applying `translateY` to each virtual row, two empty `<tr>` elements act as spacers at the top and bottom of `<tbody>`:

```
paddingTop  = virtualItems[0].start
paddingBottom = totalSize - virtualItems[last].end
```

Rows render at their natural position in the flow with no transforms, which means `position: sticky` on `<thead>` and `<tfoot>` just works. The outer `<div>` height wrapper and the `renderedSize` computed (used only for the old tfoot transform) are also gone.

The `sticky` prop guard and the unsupported note in the JSDoc and docs have been removed. Row pinning still remains unsupported in virtualized mode.

### 📝 Checklist

- [x] I have linked an issue or discussion.
- [x] I have updated the documentation accordingly.
