# Changelog

## [2.8.1](https://github.com/nuxt/ui/compare/v2.8.0...v2.8.1) (2023-09-09)


### Bug Fixes

* **Form:** fix `getValibotError` to avoid importing `safeParseAsync` ([#640](https://github.com/nuxt/ui/issues/640)) ([e8daf7f](https://github.com/nuxt/ui/commit/e8daf7f81018c01c28c2c38aed6ee57ef887f823))
* **Form:** fix valibot imports ([#617](https://github.com/nuxt/ui/issues/617)) ([1a7eb27](https://github.com/nuxt/ui/commit/1a7eb27cad9f3357c4dcde188530cdb0001d3ae6))
* **Pagination:** page numbers not clickable ([#624](https://github.com/nuxt/ui/issues/624)) ([c1e0654](https://github.com/nuxt/ui/commit/c1e0654417ad39df8be3f2172ab4e0af6dacb631))

## [2.8.0](https://github.com/nuxt/ui/compare/v2.7.0...v2.8.0) (2023-09-07)


### ⚠ BREAKING CHANGES

* **module:** use `tailwind-merge` for class merging (#509)

### Features

* **Avatar:** add `icon` prop as fallback ([df3b202](https://github.com/nuxt/ui/commit/df3b2028ed2a68178c41e136985500bc0e6f4608))
* **Avatar:** handle `icon` default from `app.config.ts` ([55daed0](https://github.com/nuxt/ui/commit/55daed0e5a220cc5f2abf1bf4a27bc86773b7939))
* **ButtonGroup:** add `orientation` prop ([#603](https://github.com/nuxt/ui/issues/603)) ([b3bc6e2](https://github.com/nuxt/ui/commit/b3bc6e2e9e9446ee3dab7ae02f939a9c01c4218b))
* **Form:** add valibot supprt ([#615](https://github.com/nuxt/ui/issues/615)) ([ab5153a](https://github.com/nuxt/ui/commit/ab5153ac19703c11b107825208e33d04e01a9be2))
* **Form:** improve form control and input validation trigger ([#487](https://github.com/nuxt/ui/issues/487)) ([6d7973f](https://github.com/nuxt/ui/commit/6d7973f6e1cc3552df45ac7ce2e2107d18061abf))
* **Modal:** add `fullscreen` prop ([#523](https://github.com/nuxt/ui/issues/523)) ([7e2bebd](https://github.com/nuxt/ui/commit/7e2bebd3ef88ea65a0dd03686e6a9d08b0d1edd7))
* **module:** add `DEFAULT` shade to `primary` color ([#493](https://github.com/nuxt/ui/issues/493)) ([c6056ed](https://github.com/nuxt/ui/commit/c6056ed13323f854a9ab4a07303b9e64cd0f563a))
* **module:** use `tailwind-merge` for class merging ([#509](https://github.com/nuxt/ui/issues/509)) ([8880bdc](https://github.com/nuxt/ui/commit/8880bdc45640103aea3e84a5410567bd87607738))
* **Table:** support nested keys in columns ([#503](https://github.com/nuxt/ui/issues/503)) ([858886a](https://github.com/nuxt/ui/commit/858886a85288370bfc7c0991e96929811f20f561))
* **Tabs:** control selected index ([#490](https://github.com/nuxt/ui/issues/490)) ([aaf09ad](https://github.com/nuxt/ui/commit/aaf09ad555f713738958b191e5649dc80bd3ba96))


### Bug Fixes

* **Alert:** fix wrong type of `actions` ([#507](https://github.com/nuxt/ui/issues/507)) ([b243e8c](https://github.com/nuxt/ui/commit/b243e8c94649a50358a5961d45b5f48c6c670383))
* **AvatarGroup:** add `justify-end` to wrapper to prevent right align ([e578b0d](https://github.com/nuxt/ui/commit/e578b0dd9e924cacf22ed541e4da54e558654254))
* **AvatarGroup:** pass default `size` to max avatar ([e49c673](https://github.com/nuxt/ui/commit/e49c67357364483d742bf9ccc7a94dc67edafe96))
* **AvatarGroup:** use `ui.wrapper` as `inheritAttrs` is not false ([eb609b1](https://github.com/nuxt/ui/commit/eb609b13e47da3e171351884f7fe6e7dcaa5ed77))
* **Badge:** allow `label` as number ([7c157ce](https://github.com/nuxt/ui/commit/7c157ce886fd6f35886255a5a2ee468c2b2089c3))
* **Button:** add missing prop types ([#508](https://github.com/nuxt/ui/issues/508)) ([a8a1c15](https://github.com/nuxt/ui/commit/a8a1c150a00212eeb8cde32ff06ee3b6c45fbedd))
* **ButtonGroup:** switch back to `ui` prop ([d4e3ab6](https://github.com/nuxt/ui/commit/d4e3ab606b19337c33e541ae399466ba8551e898))
* **Form:** fix wrong type of validate ([#496](https://github.com/nuxt/ui/issues/496)) ([3d6839d](https://github.com/nuxt/ui/commit/3d6839da97a09747b0090a3d5aa1ebe3d28b85fd))
* **FormGroup:** `size` were invalid since default has been removed ([7008df0](https://github.com/nuxt/ui/commit/7008df098887965f2ed3e43d2ccb64b3d32524b9))
* **FormGroup:** add missing `ref` import from vue ([39042b3](https://github.com/nuxt/ui/commit/39042b3de17efc26ee86b003a05e42e7a41f50bf))
* **Form:** use safeParseAsync for zod ([#497](https://github.com/nuxt/ui/issues/497)) ([8b19b18](https://github.com/nuxt/ui/commit/8b19b1880e744d81481b4e1f5b4e88d7f48f7bdb))
* **module:** missing `useHead` import ([0f252d0](https://github.com/nuxt/ui/commit/0f252d0caf550ba7ea4cfb24bed5f95a42e78970))
* **module:** missing `useNuxtApp` import ([888effe](https://github.com/nuxt/ui/commit/888effea0a66f5dd88cdd47d5d65da02bdec6ad6))
* **Popover:** handle `hover` mode with padding like dropdown ([dc951ff](https://github.com/nuxt/ui/commit/dc951ff69dd15dc942e5c61edb6bc0a5a516c89b))
* **Radio:** put back `id` for label selection ([9b3a22e](https://github.com/nuxt/ui/commit/9b3a22ea140e5a70c288c7b6241671e9d3542572))
* **SelectMenu:** invalid `gap` values ([998314e](https://github.com/nuxt/ui/commit/998314e1cbafced2844b06eac5f34fa3ddb8d1e5))
* **Table:** empty state is displayed if null ([#517](https://github.com/nuxt/ui/issues/517)) ([44ba758](https://github.com/nuxt/ui/commit/44ba758c0d50f2214554a477d661a914df2025ba))
* **Table:** missing component imports ([#608](https://github.com/nuxt/ui/issues/608)) ([d936316](https://github.com/nuxt/ui/commit/d9363168b282acc332a473340b77ee8f702e0e3f))
* **Tabs:** recompute marker position when `v-model` changes ([#524](https://github.com/nuxt/ui/issues/524)) ([fdce429](https://github.com/nuxt/ui/commit/fdce429b3ef1d203b2438299e46e57a010355fb0))
* **Tooltip:** hide on touch devices ([#580](https://github.com/nuxt/ui/issues/580)) ([f1ed007](https://github.com/nuxt/ui/commit/f1ed0076e5ada78ba6150745ce9d8459cc731b4e))
* use head instance from plugin ([791804b](https://github.com/nuxt/ui/commit/791804b2fba6493f07dc75b09f8b8ac95f71644d))

## [2.7.0](https://github.com/nuxtlabs/ui/compare/v2.6.0...v2.7.0) (2023-08-01)


### ⚠ BREAKING CHANGES

* **Link:** rename from `LinkCustom` and add `exact-query` / `exact-hash` props
* **Badge:** add colors and variants (solid has changed)
* **SelectMenu:** invert `ui` and `ui-select` props (#432)

### Features

* **Alert:** new component ([#449](https://github.com/nuxtlabs/ui/issues/449)) ([ab2abae](https://github.com/nuxtlabs/ui/commit/ab2abae48a03200d273b4f0cb3ce300fffcee64b))
* **Badge:** add colors and variants (solid has changed) ([05503e5](https://github.com/nuxtlabs/ui/commit/05503e564c3e8dfaee2e27e25b3409edb4c555a1))
* **Badge:** rename `outline` to `subtle` + add `soft` variants ([5bd5dc2](https://github.com/nuxtlabs/ui/commit/5bd5dc2bcaeb59d4b0a1aea802bd3e2b2160ad53))
* **CommandPalette:** bind active and selected to scoped slot ([#441](https://github.com/nuxtlabs/ui/issues/441)) ([b0440f8](https://github.com/nuxtlabs/ui/commit/b0440f81ce2960704ed7386ec069e52ecd7bb787))
* **FormGroup:** add `size` prop and theme options ([#391](https://github.com/nuxtlabs/ui/issues/391)) ([d2a8a07](https://github.com/nuxtlabs/ui/commit/d2a8a07a21a4943144bd990fdbfe645ea308ae7b))
* **Form:** new component ([#439](https://github.com/nuxtlabs/ui/issues/439)) ([a3aba1a](https://github.com/nuxtlabs/ui/commit/a3aba1abadd569b69f15697bcc5908b49e0a7f8a))
* **Link:** rename from `LinkCustom` and add `exact-query` / `exact-hash` props ([cefe5a7](https://github.com/nuxtlabs/ui/commit/cefe5a76e0a4820f648d23734228540e3010b233))
* **Notification:** support html with `title` and `description` slots ([#431](https://github.com/nuxtlabs/ui/issues/431)) ([df455db](https://github.com/nuxtlabs/ui/commit/df455db3caeb689ac1f24f224606183d4f5135ea))
* **Range:** increase narrowed surface ([#459](https://github.com/nuxtlabs/ui/issues/459)) ([3b183ac](https://github.com/nuxtlabs/ui/commit/3b183ac9cde86cf3ab6fbdc5dd124d66deec865d))
* **SelectMenu:** add `value-attribute` prop ([#429](https://github.com/nuxtlabs/ui/issues/429)) ([959c968](https://github.com/nuxtlabs/ui/commit/959c968420945fc0a143edb909c1289123fd62cb))
* **Tabs:** new component ([#450](https://github.com/nuxtlabs/ui/issues/450)) ([8298b62](https://github.com/nuxtlabs/ui/commit/8298b62f216712fc156ef1a114d6cff3a573efdb))
* **ui:** apply primary bg on `::selection` ([09d0ea2](https://github.com/nuxtlabs/ui/commit/09d0ea27ab36b0655106f0cf000f2c13c63b92bd))


### Bug Fixes

* **FormGroup:** `required` star display ([3dd0492](https://github.com/nuxtlabs/ui/commit/3dd0492f91422c8248691ac9d3f5de6d37278721))
* **FormGroup:** err when no prop defined ([93aebe6](https://github.com/nuxtlabs/ui/commit/93aebe6fc614bc2a78109f632297c3843f7a785a))
* **FormGroup:** missing imports ([#470](https://github.com/nuxtlabs/ui/issues/470)) ([dc1979c](https://github.com/nuxtlabs/ui/commit/dc1979cae1478cf864aab5ea573cc87d070185ce))
* **FormGroup:** set `size` default to null ([c59595f](https://github.com/nuxtlabs/ui/commit/c59595f2c6cf414bf04bb5995ba029a59ef8035b))
* **Form:** return state on validate ([#472](https://github.com/nuxtlabs/ui/issues/472)) ([248b0a6](https://github.com/nuxtlabs/ui/commit/248b0a68c675255a586d0ff61b0561f2f47b2682))
* **LinkCustom:** `exact` prop wasn't working ([82e152b](https://github.com/nuxtlabs/ui/commit/82e152be02ca7b8fc5d6e27ffd81ff3f0d8a8f80)), closes [#417](https://github.com/nuxtlabs/ui/issues/417)
* **LinkCustom:** improve prop binding and prevent error with externals ([914d156](https://github.com/nuxtlabs/ui/commit/914d156103d5ebca6b14ea705ed329508bf66d74))
* **Link:** handle `disabled` prop ([396aae7](https://github.com/nuxtlabs/ui/commit/396aae75638da88a736179f71324374d74a89d70)), closes [#473](https://github.com/nuxtlabs/ui/issues/473)
* **module:** ensure `red` color is safelisted for form elements ([208acca](https://github.com/nuxtlabs/ui/commit/208acca1e9269494310ff000104b21e999b66cf8)), closes [#423](https://github.com/nuxtlabs/ui/issues/423) [#373](https://github.com/nuxtlabs/ui/issues/373)
* **module:** omit colors defined as strings ([927b63f](https://github.com/nuxtlabs/ui/commit/927b63fa2e33cc5ee303554c0c43c9e89156b7c8))
* **module:** safelist all colors for `toast.add` ([2cd6208](https://github.com/nuxtlabs/ui/commit/2cd620899f3e997357f6274cc7a0bfc79a8277b6)), closes [#375](https://github.com/nuxtlabs/ui/issues/375) [#440](https://github.com/nuxtlabs/ui/issues/440)
* **module:** smart safelisting for components in snake case ([e25be11](https://github.com/nuxtlabs/ui/commit/e25be118b7fe4bfd4ec26be9aacfb0d87ee94d81)), closes [#461](https://github.com/nuxtlabs/ui/issues/461)
* **Popover:** hover mode ([#453](https://github.com/nuxtlabs/ui/issues/453)) ([10890e6](https://github.com/nuxtlabs/ui/commit/10890e6704e9884a7e86b37d0dc72e8f9c5177e7))
* **SelectMenu:** invert `ui` and `ui-select` props ([#432](https://github.com/nuxtlabs/ui/issues/432)) ([7cccbcf](https://github.com/nuxtlabs/ui/commit/7cccbcfef899a64d63c8d33639a2d0da155c46cb))
* **Table:** hide data when loading state is active ([#460](https://github.com/nuxtlabs/ui/issues/460)) ([2b3dc8d](https://github.com/nuxtlabs/ui/commit/2b3dc8d065c35671434975a07af4b2182a793b58))

## [2.6.0](https://github.com/nuxtlabs/ui/compare/v2.5.0...v2.6.0) (2023-07-18)


### ⚠ BREAKING CHANGES

* **Avatar:** bind component attributes to img element (#421)

### Features

* **Accordion:** add `multiple` prop and close others by default ([#364](https://github.com/nuxtlabs/ui/issues/364)) ([b78fcf9](https://github.com/nuxtlabs/ui/commit/b78fcf91a4b592a6ca83ca4333e1d6658ec6458d))
* **Accordion:** new component ([#301](https://github.com/nuxtlabs/ui/issues/301)) ([e50f377](https://github.com/nuxtlabs/ui/commit/e50f377b946996efd4546195e528fbed59dcb22f))
* **Avatar:** bind component attributes to img element ([#421](https://github.com/nuxtlabs/ui/issues/421)) ([773a23f](https://github.com/nuxtlabs/ui/commit/773a23f969d2dbbbcb01582f9e127e02f0248be9))
* **Modal:** add `prevent-close` prop ([2cc5c0d](https://github.com/nuxtlabs/ui/commit/2cc5c0d810e30b889081d1f457d725004bd0b933)), closes [#303](https://github.com/nuxtlabs/ui/issues/303)
* **SelectMenu:** handle async search ([#426](https://github.com/nuxtlabs/ui/issues/426)) ([5f8fe85](https://github.com/nuxtlabs/ui/commit/5f8fe8559f2eb12d3916387d5acf65a391bfa0eb))
* **Slideover:** add `prevent-close` prop ([d15e816](https://github.com/nuxtlabs/ui/commit/d15e8163e7d7eb3eb7624bb982c139581902d596))
* **Table:** add click event for the entire row ([#353](https://github.com/nuxtlabs/ui/issues/353)) ([d292706](https://github.com/nuxtlabs/ui/commit/d2927069673840dad58d388ab982b5488642edec))
* **Table:** allow columns `class` customization ([5dffa86](https://github.com/nuxtlabs/ui/commit/5dffa868b11760610ea0bf9f2ce37931cdac4eb9)), closes [#366](https://github.com/nuxtlabs/ui/issues/366)


### Bug Fixes

* **Accordion:** missing `ref` import from vue ([3de6b34](https://github.com/nuxtlabs/ui/commit/3de6b349d8b043ed2524bd6418f350ebb4557adb))
* **Accordion:** solve the shift between buttons when they are opened ([#379](https://github.com/nuxtlabs/ui/issues/379)) ([eaf0043](https://github.com/nuxtlabs/ui/commit/eaf0043da660dfb168a7d4f2312d4344598c2f86))
* **ButtonGroup:** err when no props on buttons ([80a9738](https://github.com/nuxtlabs/ui/commit/80a97384909891a14edca4ff760d5c81b26b3307)), closes [#360](https://github.com/nuxtlabs/ui/issues/360)
* **Button:** missing `disabled` state on some variants ([41a5238](https://github.com/nuxtlabs/ui/commit/41a523857902b1674ba7f6021938f68d66a2ddbd))
* **Modal:** disabling `transition` prop had no effect ([db34665](https://github.com/nuxtlabs/ui/commit/db346652b829ea02b8b1f5355f7080f5e530dcb2))
* **Range:** `disabled` thumb opacity ([c92dc98](https://github.com/nuxtlabs/ui/commit/c92dc980c984cff8e9f9c38eb9524d151523c16b))
* **Range:** progress style ([#385](https://github.com/nuxtlabs/ui/issues/385)) ([a79c165](https://github.com/nuxtlabs/ui/commit/a79c165eeeb3e8ea76cd3abc1b8f1218d02b446b))
* **SelectMenu:** missing `appear` on transition ([cbe2b1b](https://github.com/nuxtlabs/ui/commit/cbe2b1bfb802f8cb10dd4a0d36a8cefb215debb2)), closes [#400](https://github.com/nuxtlabs/ui/issues/400)
* **Table:** fixed row deletion bug on deselect ([#425](https://github.com/nuxtlabs/ui/issues/425)) ([46b444a](https://github.com/nuxtlabs/ui/commit/46b444a3e0cc988c89bfde7442b42b1e82095fc9))

## [2.5.0](https://github.com/nuxtlabs/ui/compare/v2.4.1...v2.5.0) (2023-06-27)


### ⚠ BREAKING CHANGES

* **Radio/Checkbox/Toggle:** handle `color` prop for form elements (#323)

### Features

* **Avatar:** handle `chipText` ([#306](https://github.com/nuxtlabs/ui/issues/306)) ([759af05](https://github.com/nuxtlabs/ui/commit/759af058df636f55a54326b21ebb1c315c73c26b))
* **defineShortcuts:** chained shortcuts + docs update ([#282](https://github.com/nuxtlabs/ui/issues/282)) ([a67f691](https://github.com/nuxtlabs/ui/commit/a67f691a0066e4d017f580388df31b22d1c45372))
* **Radio/Checkbox/Toggle:** handle `color` prop for form elements ([#323](https://github.com/nuxtlabs/ui/issues/323)) ([ffb312d](https://github.com/nuxtlabs/ui/commit/ffb312d34dfc2ac7a7aabdcbdf9ddb1d04d8a66f))
* **Range:** new component ([#290](https://github.com/nuxtlabs/ui/issues/290)) ([97a1c86](https://github.com/nuxtlabs/ui/commit/97a1c8643314d5ff950b122f46f31b206485cd50))
* RTL support ([#320](https://github.com/nuxtlabs/ui/issues/320)) ([4ea114a](https://github.com/nuxtlabs/ui/commit/4ea114a4d6b11277674c121130f746927045ade3))
* **Table:** pass row index to table cell ([#291](https://github.com/nuxtlabs/ui/issues/291)) ([71c2465](https://github.com/nuxtlabs/ui/commit/71c2465d7be78cfb0e274b107aceda9de5384fb7))
* **Table:** reset sort on third click ([1ff11ac](https://github.com/nuxtlabs/ui/commit/1ff11ac1a3eff537a4ee854a049668f312f1d415)), closes [#300](https://github.com/nuxtlabs/ui/issues/300)


### Bug Fixes

* **components:** prefix `@headlessui/vue` components ([41b85d5](https://github.com/nuxtlabs/ui/commit/41b85d50a865cfe4aa0f06a62f5209358422eaec)), closes [#315](https://github.com/nuxtlabs/ui/issues/315)
* **defineShortcuts:** missing `ref` import ([a880379](https://github.com/nuxtlabs/ui/commit/a8803794802c4032f703a0a0a6343a8204b19bc8))
* **defineShortcuts:** missing `useDebounceFn` import ([9cd73aa](https://github.com/nuxtlabs/ui/commit/9cd73aa49d1dd43bac8ec71932b850bdcb375fcf))
* **FormGroup:** prevent overriding `color` of children ([6be9290](https://github.com/nuxtlabs/ui/commit/6be9290f689c449b6a6435a3ef25e89a106e1c06)), closes [#352](https://github.com/nuxtlabs/ui/issues/352)
* **Table:** default `sortButton` icon ([07b27a2](https://github.com/nuxtlabs/ui/commit/07b27a228d293655368825979a6ca0bc1dd6e51a))
* **Table:** missing default sort icon when overriding `sort-button` prop ([0f3fe0d](https://github.com/nuxtlabs/ui/commit/0f3fe0d54ef8b45a046b84ceb31ae55a26e153fb))
* **Toggle:** add `opacity-50` when disabled ([c2ebb04](https://github.com/nuxtlabs/ui/commit/c2ebb0416eb2c92b759be5a4bf0d219031889b4b))
* **Tooltip:** add `color` in config ([1b03b8a](https://github.com/nuxtlabs/ui/commit/1b03b8a531d397871e0df4f8574d7f47ac4ec610))

### [2.4.1](https://github.com/nuxtlabs/ui/compare/v2.4.0...v2.4.1) (2023-06-21)


### Bug Fixes

* **forms:** precise type assertion for `onInput` event handler ([#293](https://github.com/nuxtlabs/ui/issues/293)) ([457b7a9](https://github.com/nuxtlabs/ui/commit/457b7a9fb72e6469014b6ca18e7034dd5c6f44b8))
* **module:** let `tailwindcss` viewer enabled by default ([4023fbe](https://github.com/nuxtlabs/ui/commit/4023fbec29e5b4d40fd23e8c2ae3d0cf23addc64)), closes [#292](https://github.com/nuxtlabs/ui/issues/292)
* **module:** safelist aliases for input ([f719111](https://github.com/nuxtlabs/ui/commit/f719111abb94c81f3932927a0154b3e1bed73a9a))
* **module:** safelist regex when a `:` was present before color ([f7e2082](https://github.com/nuxtlabs/ui/commit/f7e2082983c2eb650e95a9040aafde4ce2c88c54))
* **Radio/Checkbox:** remove legacy `custom` ([3bac087](https://github.com/nuxtlabs/ui/commit/3bac0874f106a8ff7436b541f9d064c1c7c27464))


## [2.4.0](https://github.com/nuxtlabs/ui/compare/v2.3.0...v2.4.0) (2023-06-13)


### ⚠ BREAKING CHANGES

* **forms:** bind `$attrs` to elements (#279)
* **Select:** rename `text-attribute` to `option-attribute` and defaults to `label`

### Features

* **CommandPalette:** handle `empty-state` ([#271](https://github.com/nuxtlabs/ui/issues/271)) ([652af93](https://github.com/nuxtlabs/ui/commit/652af93f5c7cd4b34044a5597f3c14441ed6d998))
* **module:** smart safelisting ([#268](https://github.com/nuxtlabs/ui/issues/268)) ([20fa4d2](https://github.com/nuxtlabs/ui/commit/20fa4d2317fc1e14fe87fa273957b92e63668945))
* **Pagination:** new component ([#257](https://github.com/nuxtlabs/ui/issues/257)) ([f0b24ba](https://github.com/nuxtlabs/ui/commit/f0b24ba25d52184b8683e364016ed8fb800fc96b))
* **table:** add loading state ([#259](https://github.com/nuxtlabs/ui/issues/259)) ([4741532](https://github.com/nuxtlabs/ui/commit/47415322ea56b5388e55c404c901531e807a9f00))
* **table:** add slot for empty state ([#260](https://github.com/nuxtlabs/ui/issues/260)) ([f7a34c8](https://github.com/nuxtlabs/ui/commit/f7a34c8feeda6a4e1e1daff87b37b375aaa0c90d))


### Bug Fixes

* **ButtonGroup:** invalid `size` validator ([a617672](https://github.com/nuxtlabs/ui/commit/a6176720c75b26768ba91efcab50689a932931ad))
* **ButtonGroup:** use `-space-x-px` on wrapper ([d91c0bb](https://github.com/nuxtlabs/ui/commit/d91c0bb8944224d4e8eb62f99a33a6be94e5cd92))
* **Button:** same size when no label + uniformize form elements ([a6903df](https://github.com/nuxtlabs/ui/commit/a6903df58fb91da44e6f83cc2bd9c963827fe5dd))
* **CommandPalette:** input focus after be5f352 ([cbc8ef1](https://github.com/nuxtlabs/ui/commit/cbc8ef13cc3253690c22c32d90ea9746970c345a))
* **deps:** move `@tailwindcss/container-queries` to dependencies ([9559d0b](https://github.com/nuxtlabs/ui/commit/9559d0b3bc09956d7fe17ee0deeef03599d02d45))
* **forms:** `padded` prop with `p-0` class ([207444f](https://github.com/nuxtlabs/ui/commit/207444fdea773b8ee64dd4f80b4f70b76462a9d6))
* **forms:** bind `$attrs` to elements ([#279](https://github.com/nuxtlabs/ui/issues/279)) ([e12e974](https://github.com/nuxtlabs/ui/commit/e12e9740c97b75d3b7b70c38978e249b5e26eead))
* **module:** deduplicate default safelist as components may share same rules ([2cfa1f8](https://github.com/nuxtlabs/ui/commit/2cfa1f8d0355d4c9cec5d4294d63e043d223cd64))
* **module:** hardcode `gray` safelist instead of deduplicate complex logic ([a733c13](https://github.com/nuxtlabs/ui/commit/a733c13866cdb74398f3e6f022cc63223e269e19))
* **module:** only safelist known colors ([cdce519](https://github.com/nuxtlabs/ui/commit/cdce519742b86ff29460aa50264d7bb34ad24bd0))
* **module:** prevent safelisting dynamic `:color` variables ([ccd9ca5](https://github.com/nuxtlabs/ui/commit/ccd9ca5106d0b81aed6591097f121eb81dcc9b47))
* **module:** transform `vue` files to detect multi-line components ([88c1930](https://github.com/nuxtlabs/ui/commit/88c1930845d26c66c2fbd32f99f52dbd23244341))
* **module:** use `@tailwindcss/forms` class strategy ([#278](https://github.com/nuxtlabs/ui/issues/278)) ([be5f352](https://github.com/nuxtlabs/ui/commit/be5f352296cf4e0c9099cf468ed905283b31007d))
* **Notification:** class priority for icon color ([07f7855](https://github.com/nuxtlabs/ui/commit/07f7855a263e516250f62d0730afc69753d0322c))
* **Radio/Checkbox:** split preset as `indeterminate` is checkbox only ([429791d](https://github.com/nuxtlabs/ui/commit/429791dab0fbb84bae1e1e13e7e688708f0b5c98))
* **SelectMenu:** input focus after `be5f352` ([717a514](https://github.com/nuxtlabs/ui/commit/717a5144511c4db013a57869ac06421accf51e38))
* **Table:** colspan of `empty` and `loading` is wrong when selection enabled ([#284](https://github.com/nuxtlabs/ui/issues/284)) ([786d776](https://github.com/nuxtlabs/ui/commit/786d7765f5517a7e8cdd718ce93fd9fecc427ba7))
* **Toggle:** missing `disabled` prop ([fe833eb](https://github.com/nuxtlabs/ui/commit/fe833eb2b2b4d1d32eb9e082b437a0259b6f75c6))


* **Select:** rename `text-attribute` to `option-attribute` and defaults to `label` ([b4a96a8](https://github.com/nuxtlabs/ui/commit/b4a96a8b01b52751c9a9c6609ed8cf7ccf516a04))

## [2.3.0](https://github.com/nuxtlabs/ui/compare/v2.2.1...v2.3.0) (2023-06-05)


### ⚠ BREAKING CHANGES

* **Input:** move pointer class inside its own preset class
* **SelectMenu:** remove `inline-flex` from wrapper to behave like other form elements
* **Notification:** rename to `closeButton` and `actionButton` for consistency
* **CommandPalette:** rename props to `emptyState` and `closeButton` for consistency
* **Toggle:** rename icons to `onIcon` / `offIcon` for consistency

### Features

* add `Table` component ([#237](https://github.com/nuxtlabs/ui/issues/237)) ([cce000a](https://github.com/nuxtlabs/ui/commit/cce000ab2b2af1079216e0e79769703fc4d9933e))


### Bug Fixes

* **Avatar:** placeholder font size ([71edb91](https://github.com/nuxtlabs/ui/commit/71edb91c4ff17a258d6229ed6c6fa6a4b54bdd53))
* **Badge:** remove `console.log` in validator ([f9b935f](https://github.com/nuxtlabs/ui/commit/f9b935f5f59b872fd952a2739d305d6574bf7cf8))
* **Button:** invalid padding when using `square` prop ([1ebaa5a](https://github.com/nuxtlabs/ui/commit/1ebaa5aa00752cd276f7c754d64ac7f85b14dc26))
* **CommandPalette:** override of `closeButton` and `emptyState` props ([2c673f5](https://github.com/nuxtlabs/ui/commit/2c673f5377dbbcdefa6b57eddba2c19d065d5f1f))
* **defineShortcuts:** err with input autocomplete that triggers `keydown` ([01fa85c](https://github.com/nuxtlabs/ui/commit/01fa85c7a3e476d4f710ed3a36c1e815fc986a94))
* **SelectMenu:** disable on loading ([8951923](https://github.com/nuxtlabs/ui/commit/8951923a11d533ebf53dbec5f852800555af253c))
* **Table:** add missing `text-left` in `th.base` ([6bd5142](https://github.com/nuxtlabs/ui/commit/6bd5142a377694599952e0f9b53fde0d0132b61b))
* **Table:** missing `ref` import from `vue` ([272af9d](https://github.com/nuxtlabs/ui/commit/272af9d24c7cda8341e66b57f76acdb9f46ea23e))
* **Table:** override of `sortButton` and `emptyState` props ([192b0e6](https://github.com/nuxtlabs/ui/commit/192b0e63018ae73e8acaa8b4b1771cda2b59bdb6))
* **Table:** type `sort` prop ([3ba0aed](https://github.com/nuxtlabs/ui/commit/3ba0aedcba578350e2fdd9c180505ed8920e0404))
* use `cloneVNode` when altering props in render functions ([5e50eb9](https://github.com/nuxtlabs/ui/commit/5e50eb9eb82571d22e0a2f1a2fe985addf7efe18)), closes [#252](https://github.com/nuxtlabs/ui/issues/252)


* **CommandPalette:** rename props to `emptyState` and `closeButton` for consistency ([daca463](https://github.com/nuxtlabs/ui/commit/daca46371cab1344bd87ffb0abe0f7e9cdb08609))
* **Input:** move pointer class inside its own preset class ([f59a92c](https://github.com/nuxtlabs/ui/commit/f59a92ca1533a44e17fbc8b7945bdaa9a83e805a))
* **Notification:** rename to `closeButton` and `actionButton` for consistency ([4458656](https://github.com/nuxtlabs/ui/commit/4458656be5547fc9505a5c4758bea4818ada408b))
* **SelectMenu:** remove `inline-flex` from wrapper to behave like other form elements ([ba44c58](https://github.com/nuxtlabs/ui/commit/ba44c58a80252a4394fcf2f84611ea2696883120))
* **Toggle:** rename icons to `onIcon` / `offIcon` for consistency ([8ee2ac1](https://github.com/nuxtlabs/ui/commit/8ee2ac10e7eda4c54418f613a5ef87dd89e1f7eb))

### [2.2.1](https://github.com/nuxtlabs/ui/compare/v2.2.0...v2.2.1) (2023-05-27)


### Bug Fixes

* **FormGroup:** missing `h` import from `vue` ([a96dc19](https://github.com/nuxtlabs/ui/commit/a96dc192157725143503b1a5e4b404cb48dc9d3f)), closes [#236](https://github.com/nuxtlabs/ui/issues/236)

## [2.2.0](https://github.com/nuxtlabs/ui/compare/v2.1.0...v2.2.0) (2023-05-26)


### ⚠ BREAKING CHANGES

* handle color states on form elements (#234)
* **Notification:** rename `progressColor` to `color` and style icon
* **Avatar:** remove `chipVariant` prop
* **VerticalNavigation:** split preset

### Features

* handle color states on form elements ([#234](https://github.com/nuxtlabs/ui/issues/234)) ([9ce531a](https://github.com/nuxtlabs/ui/commit/9ce531a06f1a972bc003876162e0503c1bbbdbd8))


### Bug Fixes

* **Notification:** remove default color on icon ([1a9dc5c](https://github.com/nuxtlabs/ui/commit/1a9dc5c980d8477cdf9386a17e20fc9fec0d883e))
* **Radio/Checkbox:** remove ring offset on focus ([a56dbea](https://github.com/nuxtlabs/ui/commit/a56dbeab351a5c58e5bb49f5762669e2884c6483))
* **VerticalNavigation:** badge display ([d2ee505](https://github.com/nuxtlabs/ui/commit/d2ee5058f819fc17f281f323dab2f0b3d80cf7bd)), closes [#205](https://github.com/nuxtlabs/ui/issues/205)


* **Avatar:** remove `chipVariant` prop ([1f22f84](https://github.com/nuxtlabs/ui/commit/1f22f84360c20498eea8971b21db9293a4c9c3dc))
* **Notification:** rename `progressColor` to `color` and style icon ([1b61ec7](https://github.com/nuxtlabs/ui/commit/1b61ec72e292325d7776a4719f14a75bdb18e110))
* **VerticalNavigation:** split preset ([19923cb](https://github.com/nuxtlabs/ui/commit/19923cbf1edc6c6d4aefb9ffab9f908b116e1c69))

## [2.1.0](https://github.com/nuxtlabs/ui/compare/v2.0.4...v2.1.0) (2023-05-19)


### Bug Fixes

* **app.config:** trailing space ([703fdef](https://github.com/nuxtlabs/ui/commit/703fdef9bd4c0e26b0e38a13c30aff5b1d9d19aa))
* **ButtonGroup/AvatarGroup:** allow `v-for` ([#173](https://github.com/nuxtlabs/ui/issues/173)) ([3fa10aa](https://github.com/nuxtlabs/ui/commit/3fa10aa4ebf9ff7d443f8f2564dcaf9b63ce1fa8))
* **DocsPageHeader:** github component link ([#182](https://github.com/nuxtlabs/ui/issues/182)) ([7f00ec6](https://github.com/nuxtlabs/ui/commit/7f00ec6c3d059e5e78172a8e4bab905a7f02fa63))
* **Input:** expose ref ([2ded24b](https://github.com/nuxtlabs/ui/commit/2ded24bec90a5ea6665ab6895ced15d9dd49e8ef))
* **module:** add `.mjs` extension to tailwind `content` when builded ([246449b](https://github.com/nuxtlabs/ui/commit/246449b32850db805c1133151b8449687e7c14be)), closes [#172](https://github.com/nuxtlabs/ui/issues/172)
* **Textarea:** expose ref ([ea740bf](https://github.com/nuxtlabs/ui/commit/ea740bf10a6090545ed58ff26322ee3a679b5452))

### [2.0.4](https://github.com/nuxtlabs/ui/compare/v2.0.3...v2.0.4) (2023-05-15)


### Bug Fixes

* **SelectMenu:** add missing `inline-flex` on wrapper ([e8b4654](https://github.com/nuxtlabs/ui/commit/e8b46540d8767c7a63c0ff8e28263615626916e7))

### [2.0.3](https://github.com/nuxtlabs/ui/compare/v2.0.2...v2.0.3) (2023-05-15)

### [2.0.2](https://github.com/nuxtlabs/ui/compare/v2.0.1...v2.0.2) (2023-05-11)


### Bug Fixes

* **LinkCustom:** handle `button` when no `to` prop ([c7c78cb](https://github.com/nuxtlabs/ui/commit/c7c78cb47b00963c8a9ea0c0599fbc7e128cff66))

### [2.0.1](https://github.com/nuxtlabs/ui/compare/v2.0.0...v2.0.1) (2023-05-11)


### Bug Fixes

* **app.config:** remove old `u-` classes ([939efba](https://github.com/nuxtlabs/ui/commit/939efba47ceb660e5448a3ea42f2acd71b9837ee))
* **Avatar:** `gray` missing for `chipColor` ([fd4c80a](https://github.com/nuxtlabs/ui/commit/fd4c80acd4c70c7d378ebf780cd843115d8f434d))
* **Avatar:** shrink chip ring ([ebf5fd6](https://github.com/nuxtlabs/ui/commit/ebf5fd6aeb2a5363e80457cf8245fbab5fbc17ca))
* **Button:** `variant` validator takes color into account ([d1d8ab3](https://github.com/nuxtlabs/ui/commit/d1d8ab3c647d50f37832d1ae531550944d5aa8e3))
* **colors:** missing `useNuxtApp` import ([76a0d61](https://github.com/nuxtlabs/ui/commit/76a0d61a0f7b3936b0eceff16e17bc6540fb946c))
* **CommandPalette:** expose input ref to template ([192bf4c](https://github.com/nuxtlabs/ui/commit/192bf4c375293b16d952b94cc098a0260f47996a))
* **CommandPalette:** put back searchable on `v-show` to input ref always exists ([aacb7e9](https://github.com/nuxtlabs/ui/commit/aacb7e98412d2973c6fc61d9cb3b6da9bd433eb0))
* **CommandPalette:** wrong type usage ([4665563](https://github.com/nuxtlabs/ui/commit/4665563e6f9c4054cb1c859991369fe2cc844047))
* **docs:** sticky search button `z-index` ([f48ead6](https://github.com/nuxtlabs/ui/commit/f48ead6faf6fd14deeff84ca7b25d6bb7fae6f12))
* **Icon:** missing import ([cd430a4](https://github.com/nuxtlabs/ui/commit/cd430a4cad5143c5bd45c003086091f769e4f015))
* **module:** remove `.ts` ext from app.config ([a076cae](https://github.com/nuxtlabs/ui/commit/a076cae4bfa387e1fd9800741b10702896c21ad2))
* **Notifications:** missing `computed` from vue ([9ce43ac](https://github.com/nuxtlabs/ui/commit/9ce43ac68bcef3fb7fff8a9e317ad6d4a5ac2cb9))
* prefix imported components ([0c69385](https://github.com/nuxtlabs/ui/commit/0c69385771ff1815cdcbff812962056da381a541))
* put back app.config for hmr ([626409e](https://github.com/nuxtlabs/ui/commit/626409e1014ddcacaf6ee155830bd9862b335058))
* remove augmentation of app ([#152](https://github.com/nuxtlabs/ui/issues/152)) ([f5c0030](https://github.com/nuxtlabs/ui/commit/f5c0030a198579e5929fd517b80e2e20c9bac769))
* revert back to runtime app for hmr ([#153](https://github.com/nuxtlabs/ui/issues/153)) ([97b1a85](https://github.com/nuxtlabs/ui/commit/97b1a85ea12499289866a6baf15661c1f15279ce))
* **Select:** move types from template ([fa05653](https://github.com/nuxtlabs/ui/commit/fa05653f23c4e9b1732eb4b9cd5e034f9bdca272))
* **Toggle:** wrong `icon-off` positioning ([d5471f4](https://github.com/nuxtlabs/ui/commit/d5471f4d371b72df0ca5fac36e698066aca3864e))
* update to fix type issues ([#151](https://github.com/nuxtlabs/ui/issues/151)) ([11e00a1](https://github.com/nuxtlabs/ui/commit/11e00a10e4781881e293e5fcd382331008c15346))
* **VerticalNavigation:** improve focus ([034a95d](https://github.com/nuxtlabs/ui/commit/034a95d3c92eee9a54bd266e02d7446f7792d051))
* **VerticalNavigation:** improve stacking context ([28ee917](https://github.com/nuxtlabs/ui/commit/28ee9179f5fbc006a47719ee632adf54f0e0ec4d))

## [2.0.0](https://github.com/nuxtlabs/ui/compare/v1.2.11...v2.0.0) (2023-05-04)


### Features

* rewrite to use app config and rework docs ([#143](https://github.com/nuxtlabs/ui/issues/143)) ([6da0db0](https://github.com/nuxtlabs/ui/commit/6da0db0113733df1a03220cb528bea862b553f37))

### [1.2.11](https://github.com/nuxtlabs/ui/compare/v1.2.10...v1.2.11) (2023-05-04)


### Bug Fixes

* **defineShortcuts:** use `useEventListener` ([#150](https://github.com/nuxtlabs/ui/issues/150)) ([59f62d3](https://github.com/nuxtlabs/ui/commit/59f62d322f07919d16a8d35340c3aa038cd09520))

### [1.2.10](https://github.com/nuxtlabs/ui/compare/v1.2.9...v1.2.10) (2023-04-07)


### Bug Fixes

* **CommandPalette:** typecheck ([cfce152](https://github.com/nuxtlabs/ui/commit/cfce1524b209212d9ce635b61376ff0d6bc3601b))

### [1.2.9](https://github.com/nuxtlabs/ui/compare/v1.2.8...v1.2.9) (2023-04-07)

### [1.2.8](https://github.com/nuxtlabs/ui/compare/v1.2.7...v1.2.8) (2023-04-04)

### [1.2.7](https://github.com/nuxtlabs/ui/compare/v1.2.6...v1.2.7) (2023-04-04)


### Bug Fixes

* **useTimer:** remaining after pause ([aafdfdb](https://github.com/nuxtlabs/ui/commit/aafdfdb59c365c542f93703dd52b4306ac935040))

### [1.2.6](https://github.com/nuxtlabs/ui/compare/v1.2.5...v1.2.6) (2023-04-04)

### [1.2.5](https://github.com/nuxtlabs/ui/compare/v1.2.4...v1.2.5) (2023-04-04)

### [1.2.4](https://github.com/nuxtlabs/ui/compare/v1.2.3...v1.2.4) (2023-04-04)

### [1.2.3](https://github.com/nuxtlabs/ui/compare/v1.2.2...v1.2.3) (2023-03-22)

### [1.2.2](https://github.com/nuxtlabs/ui/compare/v1.2.1...v1.2.2) (2023-03-20)

### [1.2.1](https://github.com/nuxtlabs/ui/compare/v1.2.0...v1.2.1) (2023-03-20)


### Bug Fixes

* **defineShortcuts:** shift + alphabetic character handling ([#140](https://github.com/nuxtlabs/ui/issues/140)) ([377b418](https://github.com/nuxtlabs/ui/commit/377b4189ca85603db0b7f040949260ba7494c46f))

## [1.2.0](https://github.com/nuxtlabs/ui/compare/v1.1.4...v1.2.0) (2023-03-09)


### Bug Fixes

* **defineShortcuts:** add missing import ([37b2271](https://github.com/nuxtlabs/ui/commit/37b2271bf04adfe6bee4d984fa12452b2168318c))
* **Tooltip:** `shortcutsClass` prop type ([fa49d52](https://github.com/nuxtlabs/ui/commit/fa49d52f17752eaa06f997a9b6e8df8adcab983f))

### [1.1.4](https://github.com/nuxtlabs/ui/compare/v1.1.3...v1.1.4) (2023-03-02)

### [1.1.3](https://github.com/nuxtlabs/ui/compare/v1.1.2...v1.1.3) (2023-03-02)

### [1.1.2](https://github.com/nuxtlabs/ui/compare/v1.1.1...v1.1.2) (2023-02-28)


### Bug Fixes

* **Tooltip:** truncate ([d08e64d](https://github.com/nuxtlabs/ui/commit/d08e64d53fa439f34d51909bcb6812f1bcd95d83))
* **VerticalNavigation:** links `to` type ([7970aef](https://github.com/nuxtlabs/ui/commit/7970aefcb032ce01fcb11e9285fa61ce87f59519))

### [1.1.1](https://github.com/nuxtlabs/ui/compare/v1.1.0...v1.1.1) (2023-02-20)

## [1.1.0](https://github.com/nuxtlabs/ui/compare/v1.0.0...v1.1.0) (2023-02-17)


### Features

* **CommandPalette:** handle async search for specific groups ([efa9674](https://github.com/nuxtlabs/ui/commit/efa9674815ab4de756079690da0a381c3703d564))


### Bug Fixes

* **CommandPalette:** types ([4702a4f](https://github.com/nuxtlabs/ui/commit/4702a4f10379201c167cc52099519778756a5780))

## [1.0.0](https://github.com/nuxtlabs/ui/compare/v0.2.1...v1.0.0) (2023-02-17)


### Features

* migrate to `@egoist/tailwindcss-icons` ([ee33522](https://github.com/nuxtlabs/ui/commit/ee3352278cf03fdd12f2a4663b403052de3f089a))

### [0.2.1](https://github.com/nuxtlabs/ui/compare/v0.2.0...v0.2.1) (2023-02-16)

## [0.2.0](https://github.com/nuxtlabs/ui/compare/v0.1.39...v0.2.0) (2023-02-16)

### [0.1.39](https://github.com/nuxtlabs/ui/compare/v0.1.38...v0.1.39) (2023-02-16)


### Features

* use `nuxt-icon` ([f5d068b](https://github.com/nuxtlabs/ui/commit/f5d068be9d5778b3d4fcdc11d06d9d765e62075d))


### Bug Fixes

* **SelectCustom:** handle search on string arrays ([6018f00](https://github.com/nuxtlabs/ui/commit/6018f009a86cca196d15e4e72dd5eb41aaeb4bad))

### [0.1.38](https://github.com/nuxtlabs/ui/compare/v0.1.37...v0.1.38) (2023-02-03)

### [0.1.37](https://github.com/nuxtlabs/ui/compare/v0.1.36...v0.1.37) (2023-02-03)


### Bug Fixes

* **CommandPalette:** improve accessibility ([#129](https://github.com/nuxtlabs/ui/issues/129)) ([bea47b5](https://github.com/nuxtlabs/ui/commit/bea47b5906d1bc665717830d6dc2f3ff2a0374f3))

### [0.1.36](https://github.com/nuxtlabs/ui/compare/v0.1.35...v0.1.36) (2023-02-02)


### Bug Fixes

* **CommandPalette:** put back cursor on top only when query changes ([5bf5a31](https://github.com/nuxtlabs/ui/commit/5bf5a314c414b96c656190719bd56acca10676f5))

### [0.1.35](https://github.com/nuxtlabs/ui/compare/v0.1.34...v0.1.35) (2023-02-01)


### Bug Fixes

* **AvatarGroup:** preset size prop ([c90cd9c](https://github.com/nuxtlabs/ui/commit/c90cd9c4f37bc3ce5f6e13f3279dc2c574c76524))
* **Dropdown:** lint ([1c4d46e](https://github.com/nuxtlabs/ui/commit/1c4d46e056adf84d69462a12af8ac29f93cbf87a))
* **Dropdown:** prevent panel display when no items ([a764486](https://github.com/nuxtlabs/ui/commit/a7644860b8c22a0163e01ca2c0eab2c48b09745a))

### [0.1.34](https://github.com/nuxtlabs/ui/compare/v0.1.33...v0.1.34) (2023-01-27)


### Bug Fixes

* **CommandPalette:** typecheck ([27717a5](https://github.com/nuxtlabs/ui/commit/27717a55b3e5120f32fba2bcea30f5a91262f1c5))

### [0.1.33](https://github.com/nuxtlabs/ui/compare/v0.1.32...v0.1.33) (2023-01-27)

### [0.1.32](https://github.com/nuxtlabs/ui/compare/v0.1.31...v0.1.32) (2023-01-23)

### [0.1.31](https://github.com/nuxtlabs/ui/compare/v0.1.30...v0.1.31) (2023-01-17)

### [0.1.30](https://github.com/nuxtlabs/ui/compare/v0.1.29...v0.1.30) (2023-01-17)

### [0.1.29](https://github.com/nuxtlabs/ui/compare/v0.1.28...v0.1.29) (2023-01-17)

### [0.1.28](https://github.com/nuxtlabs/ui/compare/v0.1.27...v0.1.28) (2023-01-13)

### [0.1.27](https://github.com/nuxtlabs/ui/compare/v0.1.26...v0.1.27) (2023-01-12)

### [0.1.26](https://github.com/nuxtlabs/ui/compare/v0.1.25...v0.1.26) (2023-01-09)


### Bug Fixes

* **CommandPalette:** select first item on search changes ([#126](https://github.com/nuxtlabs/ui/issues/126)) ([4f56921](https://github.com/nuxtlabs/ui/commit/4f56921096f5885cdab8b7cb5c5aa01304188e11))

### [0.1.25](https://github.com/nuxtlabs/ui/compare/v0.1.24...v0.1.25) (2023-01-09)

### [0.1.24](https://github.com/nuxtlabs/ui/compare/v0.1.23...v0.1.24) (2023-01-04)

### [0.1.23](https://github.com/nuxtlabs/ui/compare/v0.1.22...v0.1.23) (2022-12-20)

### [0.1.22](https://github.com/nuxtlabs/ui/compare/v0.1.21...v0.1.22) (2022-12-19)

### [0.1.21](https://github.com/nuxtlabs/ui/compare/v0.1.20...v0.1.21) (2022-12-19)

### [0.1.20](https://github.com/nuxtlabs/ui/compare/v0.1.19...v0.1.20) (2022-12-19)


### Bug Fixes

* avoid referring to complex types in props ([#123](https://github.com/nuxtlabs/ui/issues/123)) ([ff9f6c2](https://github.com/nuxtlabs/ui/commit/ff9f6c251df59641862d82587e5d963c8e6ea298))

### [0.1.19](https://github.com/nuxtlabs/ui/compare/v0.1.18...v0.1.19) (2022-12-16)

### [0.1.18](https://github.com/nuxtlabs/ui/compare/v0.1.17...v0.1.18) (2022-12-15)

### [0.1.17](https://github.com/nuxtlabs/ui/compare/v0.1.16...v0.1.17) (2022-12-06)


### Bug Fixes

* remove stop propagation on mode hover ([16fd1c0](https://github.com/nuxtlabs/ui/commit/16fd1c0ca38f1438e791c0d44399f590d9f20d02))

### [0.1.16](https://github.com/nuxtlabs/ui/compare/v0.1.15...v0.1.16) (2022-12-06)


### Bug Fixes

* **Popover:** preset from tooltip ([0ade69d](https://github.com/nuxtlabs/ui/commit/0ade69de2689b094b11a2dead8f71e3d2dccd552))

### [0.1.15](https://github.com/nuxtlabs/ui/compare/v0.1.14...v0.1.15) (2022-12-02)


### Bug Fixes

* **Dropdown:** better handle item click to preventDefault ([#119](https://github.com/nuxtlabs/ui/issues/119)) ([44a78d7](https://github.com/nuxtlabs/ui/commit/44a78d7f679812c59d4410d0bbc01f09abaa78dd))

### [0.1.14](https://github.com/nuxtlabs/ui/compare/v0.1.13...v0.1.14) (2022-12-02)

### [0.1.13](https://github.com/nuxtlabs/ui/compare/v0.1.12...v0.1.13) (2022-12-01)

### [0.1.12](https://github.com/nuxtlabs/ui/compare/v0.1.11...v0.1.12) (2022-11-29)


### Bug Fixes

* **Checkbox:** types ([629bb72](https://github.com/nuxtlabs/ui/commit/629bb724249cfe1fdd999cf52f8e72ca444bd94d))

### [0.1.11](https://github.com/nuxtlabs/ui/compare/v0.1.10...v0.1.11) (2022-11-29)


### Bug Fixes

* **Checkbox:** revert type fix as it breaks checkboxes ([7f18c6b](https://github.com/nuxtlabs/ui/commit/7f18c6bdc7c0054b2e5d4f9bf4e362847a3ba3a3))

### [0.1.10](https://github.com/nuxtlabs/ui/compare/v0.1.9...v0.1.10) (2022-11-26)


### Bug Fixes

* default popper options ([1ad9606](https://github.com/nuxtlabs/ui/commit/1ad96065fd706d828b906db3a5d578226ff08c36))
* default props for command palette ([#116](https://github.com/nuxtlabs/ui/issues/116)) ([952786e](https://github.com/nuxtlabs/ui/commit/952786ed79cd9cdf523f6eac5958f68790bacbea))

### [0.1.9](https://github.com/nuxtlabs/ui/compare/v0.1.8...v0.1.9) (2022-11-25)


### Bug Fixes

* **Icon:** couldn't load anymore ([6321d3e](https://github.com/nuxtlabs/ui/commit/6321d3ed8d5c9478cb1dafc1da94b21d0c7edb88))
* **Icon:** eslint ignore ([bc0c168](https://github.com/nuxtlabs/ui/commit/bc0c168c0b0feae96d6a1848c3a356d846e2cbb5))

### [0.1.8](https://github.com/nuxtlabs/ui/compare/v0.1.7...v0.1.8) (2022-11-16)

### [0.1.7](https://github.com/nuxtlabs/ui/compare/v0.1.6...v0.1.7) (2022-11-16)

### [0.1.6](https://github.com/nuxtlabs/ui/compare/v0.1.5...v0.1.6) (2022-11-15)


### Bug Fixes

* **SelectCustom:** add `w-full` on `ComboboxButton` ([3a300f7](https://github.com/nuxtlabs/ui/commit/3a300f72c1eca756ffd8f07ab871bf9c7bd7868d))

### [0.1.5](https://github.com/nuxtlabs/ui/compare/v0.1.4...v0.1.5) (2022-11-08)

### [0.1.4](https://github.com/nuxtlabs/ui/compare/v0.1.3...v0.1.4) (2022-11-08)


### Bug Fixes

* **button:** support `RouteLocationRaw` type for `to` ([#112](https://github.com/nuxtlabs/ui/issues/112)) ([1b56b50](https://github.com/nuxtlabs/ui/commit/1b56b50d4d54a5cb9e5febacdf42867988ae6c5d))

### [0.1.3](https://github.com/nuxtlabs/ui/compare/v0.1.2...v0.1.3) (2022-11-04)


### Bug Fixes

* **docs:** component input string field ([e521e1a](https://github.com/nuxtlabs/ui/commit/e521e1ac2421dc331652f1ea4ac2b0b2959dc069))
* **types:** add missing field in command palette type ([#111](https://github.com/nuxtlabs/ui/issues/111)) ([28586c3](https://github.com/nuxtlabs/ui/commit/28586c35a558d9e925094f86e07acdb928d54ad7))

### [0.1.2](https://github.com/nuxtlabs/ui/compare/v0.1.1...v0.1.2) (2022-10-27)

### [0.1.1](https://github.com/nuxtlabs/ui/compare/v0.1.0...v0.1.1) (2022-10-26)


### Bug Fixes

* **CommandPalette:** lint ([6fab68b](https://github.com/nuxtlabs/ui/commit/6fab68baa836c97680446e8cfdee7c5a64008539))
* **Dropdown:** close on click item with `to` ([#103](https://github.com/nuxtlabs/ui/issues/103)) ([5517cc2](https://github.com/nuxtlabs/ui/commit/5517cc28467f957956a20126c1ce48e64677cb82))
* **Popover:** avoid crash on mount if ref not loaded ([#105](https://github.com/nuxtlabs/ui/issues/105)) ([e9f0224](https://github.com/nuxtlabs/ui/commit/e9f0224b919445260d3b19511420a3fd448e4ea7))
* **SelectCustom:** types and lint ([ec8bd5c](https://github.com/nuxtlabs/ui/commit/ec8bd5cdc49feb924dfdff352d9f3d788653c583))

## [0.1.0](https://github.com/nuxtlabs/ui/compare/v0.0.3...v0.1.0) (2022-10-25)


### Bug Fixes

* `to` prop type ([be94fea](https://github.com/nuxtlabs/ui/commit/be94fea84acc69c0114099b5251ff34e3a239726))
* **CommandPalette:** command icons opacity in dark mode ([abb93b5](https://github.com/nuxtlabs/ui/commit/abb93b5fd3ddda8c91db3370c8e3109cff4a091d))
* **CommandPalette:** fix groups computed ([9302b8d](https://github.com/nuxtlabs/ui/commit/9302b8d635c3ffb489142601a17a9878072c89fe))
* **CommandPalette:** group items spacing ([32922de](https://github.com/nuxtlabs/ui/commit/32922def7deec5bee920a1fb1400449461315d0d))
* **CommandPalette:** hack for reactivity ([b43394d](https://github.com/nuxtlabs/ui/commit/b43394ddc3ee795b56679f7076e0c80a1c496b2e))
* **CommandPalette:** icon color on hover ([e4f148e](https://github.com/nuxtlabs/ui/commit/e4f148efa97adf52b1b5544ff6c349a4ac82a956))
* **CommandPalette:** icon inactive opacity on dark mode ([5722a3a](https://github.com/nuxtlabs/ui/commit/5722a3ae62706229179b75d9291babd1c2039244))
* **CommandPalette:** prevent empty active slot ([056ab30](https://github.com/nuxtlabs/ui/commit/056ab304745c3ba8dedbf9d6491839b9d620df88))
* **CommandPalette:** prevent shortcuts to disappear on hover ([f87252f](https://github.com/nuxtlabs/ui/commit/f87252f05debda7c98f5ab8a9453e57efafaad0f))
* **CommandPalette:** reactivity issue + improve results ([ec9f670](https://github.com/nuxtlabs/ui/commit/ec9f67094a51e3afde92f7924b8ee5d4e9053158)), closes [#95](https://github.com/nuxtlabs/ui/issues/95) [#96](https://github.com/nuxtlabs/ui/issues/96)
* **CommandPalette:** truncate suffix ([aa242aa](https://github.com/nuxtlabs/ui/commit/aa242aa87d5ae834d838518efd530003fdde5e24))
* default object options ([95c14a4](https://github.com/nuxtlabs/ui/commit/95c14a43600016bf405b557752fad289fb31154a))
* **Dropdown:** increase timeout for hover mode ([7291942](https://github.com/nuxtlabs/ui/commit/72919425b6e84581ba3b854aec3348977b335a3f))
* error in Popover and Dropdown ([541ed30](https://github.com/nuxtlabs/ui/commit/541ed304a0a4fa2646115547e03e44cf9e17c65e))
* **icon:** hydratation warning when loading same icon twice ([#99](https://github.com/nuxtlabs/ui/issues/99)) ([d57647a](https://github.com/nuxtlabs/ui/commit/d57647a77a145ff6e81d3a71550e98e3eaf3a842))
* load icons on mount rather than within setup ([#82](https://github.com/nuxtlabs/ui/issues/82)) ([62361bf](https://github.com/nuxtlabs/ui/commit/62361bfa8f77c2f3452af108f08434ba4c6ec4c5))
* **Modal:** use object for `innerStyle` ([72dc0d0](https://github.com/nuxtlabs/ui/commit/72dc0d0d0c270b2dfbf2ba8a8eb03a04eb5dea9a))
* **Notification:** improve placement with description ([945fec6](https://github.com/nuxtlabs/ui/commit/945fec62c2efa6baf7b32c8a85ba658dfd9311c9))
* **Notification:** prevent error without timeout ([8a66f5e](https://github.com/nuxtlabs/ui/commit/8a66f5e9bf65ab04b8878f0d597e439b45b46bb3))
* **Popover:** `inline-flex` on trigger button ([593573a](https://github.com/nuxtlabs/ui/commit/593573a286459b48fde8f49df2c2f1fc1dc98da6))
* **SelectCustom:** avoid submitting to form when closing ([#83](https://github.com/nuxtlabs/ui/issues/83)) ([cf1b2cd](https://github.com/nuxtlabs/ui/commit/cf1b2cdd133233481da6e1ec47b49b7f012aa204))

### [0.0.3](https://github.com/nuxtlabs/ui/compare/v0.0.2...v0.0.3) (2022-07-18)


### Features

* **AvatarGroup:** preset support ([#69](https://github.com/nuxtlabs/ui/issues/69)) ([00b9a08](https://github.com/nuxtlabs/ui/commit/00b9a0839b3fb19521080684cf3f4e46cf4c64e5))
* **button:** Add black variant ([#34](https://github.com/nuxtlabs/ui/issues/34)) ([46ca8c5](https://github.com/nuxtlabs/ui/commit/46ca8c5422cc00a2c66376d910b9669ab82002d0))
* **clipboard:** replace `navigator.clipboard` with vueuse `useClipboard` ([#33](https://github.com/nuxtlabs/ui/issues/33)) ([4532e09](https://github.com/nuxtlabs/ui/commit/4532e09ac067518fe607d7079b2761c783f36505))
* **CommandPalette:** implement component ([18dceb7](https://github.com/nuxtlabs/ui/commit/18dceb74455ccd6690069b973bcc9f563c78ebb3))
* **Dropdown:** add `hover` mode ([#45](https://github.com/nuxtlabs/ui/issues/45)) ([77149f0](https://github.com/nuxtlabs/ui/commit/77149f0dd454882dd0a271794d80a9a597789923))
* **Icon:** support custom component and emoji ([c1a7629](https://github.com/nuxtlabs/ui/commit/c1a7629e2988886633f989244fc2abfd580c6e1f))
* migrate to `@nuxtjs/tailwindcss` ([#32](https://github.com/nuxtlabs/ui/issues/32)) ([702abf7](https://github.com/nuxtlabs/ui/commit/702abf7a9fd91428d57b5dc95be34ded7f2db9e2))
* **module:** handle variants with dynamic colors ([5a8b078](https://github.com/nuxtlabs/ui/commit/5a8b078d65e32d0d3f5b8dc8df903814abfd5fca))
* **plugins:** clipboard ([#29](https://github.com/nuxtlabs/ui/issues/29)) ([832ffe4](https://github.com/nuxtlabs/ui/commit/832ffe4323c73e43506261c4c1765fd68851d7a0))
* **Popover:** handle hovering mode ([#47](https://github.com/nuxtlabs/ui/issues/47)) ([c431f8b](https://github.com/nuxtlabs/ui/commit/c431f8b4a17880b31eb838059cb03c8e95955c0e))
* **Slideover:** add close button in header ([#65](https://github.com/nuxtlabs/ui/issues/65)) ([2f90ce2](https://github.com/nuxtlabs/ui/commit/2f90ce2319766aed92063bcc9e3c92d7a1b3de99))
* **Slideover:** allow opening from the right side ([#64](https://github.com/nuxtlabs/ui/issues/64)) ([aecfef2](https://github.com/nuxtlabs/ui/commit/aecfef20e6aa7a092741f4ab7988c6b3e04bd706))
* **Slideover:** preset support ([#68](https://github.com/nuxtlabs/ui/issues/68)) ([5b4e4f8](https://github.com/nuxtlabs/ui/commit/5b4e4f864894261349834a5587c9eab4a0738c47))
* **toast:** add aliases for `info` and `warning` notifications ([23deef3](https://github.com/nuxtlabs/ui/commit/23deef325a33bd52f90dbd0a1005131b4314c1fd))
* **toast:** expose `timeout` to alias methods ([#30](https://github.com/nuxtlabs/ui/issues/30)) ([6bd5197](https://github.com/nuxtlabs/ui/commit/6bd51975bfefb963fa59c4a151833db029cfe93a))


### Bug Fixes

* **Avatar:** add missing `watch` import ([cc01af8](https://github.com/nuxtlabs/ui/commit/cc01af8e553bfe50eb8f1a51260db0331dc11a69))
* **AvatarGroup:** pass all avatar props ([723f075](https://github.com/nuxtlabs/ui/commit/723f075c562fa5ed261d02656e7cd5684fa06170))
* **Avatar:** missing `ref` import ([eb41b23](https://github.com/nuxtlabs/ui/commit/eb41b23432f931adaf52c650034e394c6ed9c547))
* **Avatar:** placeholder ([#31](https://github.com/nuxtlabs/ui/issues/31)) ([1bec8d1](https://github.com/nuxtlabs/ui/commit/1bec8d163c9288ecbce5acbc13a71b7a2c43fc5e))
* **Avatar:** prevent boolean src ([da3ed26](https://github.com/nuxtlabs/ui/commit/da3ed26c2ccc65f3b7d68fd07315c7c607e88318))
* **Avatar:** remove gradient support ([ed499b3](https://github.com/nuxtlabs/ui/commit/ed499b3b21097ead948de6c5f4270ffda5dafb6e))
* **Avatar:** truncate placeholder if too long ([#61](https://github.com/nuxtlabs/ui/issues/61)) ([6585bfc](https://github.com/nuxtlabs/ui/commit/6585bfc24a36d9b35bc1f5dcec9394c5aa731ec4))
* **Avatar:** url error handling ([#39](https://github.com/nuxtlabs/ui/issues/39)) ([fb3ff2e](https://github.com/nuxtlabs/ui/commit/fb3ff2e5fa2fd0a86a71da40cf4a7258be0d3899))
* **Button:** wrong config for icon size class ([760da3d](https://github.com/nuxtlabs/ui/commit/760da3d1a81ca06b49e95d30e7794ad3c72acb81))
* **Card:** nullable validator on card roundedClass prop ([c4a40b0](https://github.com/nuxtlabs/ui/commit/c4a40b065c021e3af706ea65a02fdce591f5acb4))
* **Card:** prevent double class ([06b07e2](https://github.com/nuxtlabs/ui/commit/06b07e292e9b29359926273fcacb6d25aa440f10))
* **Card:** prevent empty `sm:` class when `rounded-class` is null ([dd64637](https://github.com/nuxtlabs/ui/commit/dd6463710c58b62a3a5714a5917d885bb668ff55))
* **colors:** hard-code colors as tailwindcss/colors is different ([f67fdb7](https://github.com/nuxtlabs/ui/commit/f67fdb7d2fbe12f696cc02f00800dc0c4d8e5df5))
* **colors:** move primary to safeColors ([3ab0698](https://github.com/nuxtlabs/ui/commit/3ab0698d7f2ce4776ccf4f16e069e0af2ccd38b8))
* **CommandPalette:** add missing import ([ea293ba](https://github.com/nuxtlabs/ui/commit/ea293bae0ca10c19e8a1c021fd0d708933cd6c0b))
* **CommandPaletteGroup:** fail replace on items ([1495ff9](https://github.com/nuxtlabs/ui/commit/1495ff987d4e464540755a4e2b7e72b0b91548dc))
* **CommandPaletteGroup:** invalid spacing when no icon ([cf65b4a](https://github.com/nuxtlabs/ui/commit/cf65b4ab5456f2c5b54968ab011330fc324bad5f))
* **CommandPalette:** options priority ([76ffbf4](https://github.com/nuxtlabs/ui/commit/76ffbf4cf355f3cb36a9d896a4ed6d2a874fe780))
* **CommandPalette:** slice from computed options ([503b9a6](https://github.com/nuxtlabs/ui/commit/503b9a6b5c2e31152e7ea42aa059e595a4a92c17))
* Dropdown and Popover manual padding ([2e09939](https://github.com/nuxtlabs/ui/commit/2e099392f1f9ab926c6ce42146f649496a4723c3))
* **Dropdown:** improve disabled state ([5fb7f10](https://github.com/nuxtlabs/ui/commit/5fb7f102830eb33b207cf3ca0c955f7853df5fbd))
* Hover mode on Dropdown & Popover ([#48](https://github.com/nuxtlabs/ui/issues/48)) ([8bc4902](https://github.com/nuxtlabs/ui/commit/8bc4902078b34c0233c9304c996d38746b14b270))
* **Icon:** missing imports ([c3facb1](https://github.com/nuxtlabs/ui/commit/c3facb1fefa4c9681290d2f88ea2c78a7aeee217))
* **Icon:** name can be an object ([f513ea6](https://github.com/nuxtlabs/ui/commit/f513ea6ca89928982694819abbc8b5f26ddec5ae))
* **Icon:** reload icon when prop name changes ([78021d3](https://github.com/nuxtlabs/ui/commit/78021d385058634658f722ee90db214661ae88e4))
* **input:** background should go into appearance ([33b1176](https://github.com/nuxtlabs/ui/commit/33b1176bdd66e3774e8063e1e2caef4983e7680d))
* **Link:** `exact` handling ([ceedbe0](https://github.com/nuxtlabs/ui/commit/ceedbe0bbdb4cfac0548e3d00ccc2480bd41ec13))
* **Link:** add missing `inactive-class` on `button` and `a` ([035919a](https://github.com/nuxtlabs/ui/commit/035919a545f20b2714cbc21a7efa2c7ae2ad16cb))
* **Link:** handle `isActive` through vue-router ([aef1156](https://github.com/nuxtlabs/ui/commit/aef11562c945fe5e8384705c04948aa5f9db085e))
* **Link:** send correct active ([d4b6599](https://github.com/nuxtlabs/ui/commit/d4b65996ce025795e05d4e2621713f2ca46f855f))
* **Link:** use `exact` ([7737242](https://github.com/nuxtlabs/ui/commit/77372423d824dcfc7a175ccbeb3a6cb8a78a5af9))
* **Modal:** `widthClass` prop and default preset value ([#56](https://github.com/nuxtlabs/ui/issues/56)) ([d980176](https://github.com/nuxtlabs/ui/commit/d980176e03b9853a1c7f26db7a06c238fec96b81))
* **Modal:** move classes to `DialogPanel` ([dfe86f0](https://github.com/nuxtlabs/ui/commit/dfe86f0baf8ee43d4efc6730b8853dbcc322cce1))
* **Modal:** prevent attrs inherit ([850c766](https://github.com/nuxtlabs/ui/commit/850c766fabaef5be27270338b1e76abacae48877))
* **module:** `gradient-avatar` include ([85c8210](https://github.com/nuxtlabs/ui/commit/85c8210edeff59b18d3a46fb56fe8e5b8667a473))
* **module:** import `colors` from preset-mini ([185273f](https://github.com/nuxtlabs/ui/commit/185273f3e91d8a1d175020fe2774a2d948105b87))
* **module:** move colors utils to runtime dir ([93c9fe1](https://github.com/nuxtlabs/ui/commit/93c9fe1c74bc8ba02a6ef8f3bfc8a8b260349c93))
* **module:** parse presets with mjs ext ([b2705fe](https://github.com/nuxtlabs/ui/commit/b2705feedce6a2c957990da8730c800cfd654d46))
* **module:** presets content ([b8dd80d](https://github.com/nuxtlabs/ui/commit/b8dd80d3d37fbf9c02a8a056615deec8ffcd9302))
* **module:** register typography plugin ([bbbe57d](https://github.com/nuxtlabs/ui/commit/bbbe57dedbab96fe08671488a91626f018f19c71))
* **module:** remove safelist on max-w ([358387e](https://github.com/nuxtlabs/ui/commit/358387e3584b571685831171c322e6c98bd80433))
* **module:** resolve runtime dir ([65aa169](https://github.com/nuxtlabs/ui/commit/65aa1690ba584c7c66685ae22968b5e3bb086aff))
* **module:** search in tailwind colors for `primary` and `gray` ([10d89d3](https://github.com/nuxtlabs/ui/commit/10d89d3cd109561138f262c18732d832bae371dc))
* **module:** use `variants` key for safelist ([4c89122](https://github.com/nuxtlabs/ui/commit/4c891225b18efbc039288af489929c73d5245d0b))
* **Notifications:** default value in `useState` ([af566ab](https://github.com/nuxtlabs/ui/commit/af566ab1fa94d9542b0fd5f96010962054342085))
* **Notifications:** inexistant `z-55` ([60c72a2](https://github.com/nuxtlabs/ui/commit/60c72a20d1fcb82734c13721b003cef9222ee61a))
* **package:** update `postbuild:docs` command ([8045c7b](https://github.com/nuxtlabs/ui/commit/8045c7b47e117d1ec5d0eb0a53973743079d9f98))
* **plugins:** error in provides ([46ea467](https://github.com/nuxtlabs/ui/commit/46ea467098441b96329383154e7e60fd8ebbec06))
* **Popover:** add missing `onMounted` import ([656b6e1](https://github.com/nuxtlabs/ui/commit/656b6e1c59d89a82b2c3117c87a57e9c99e621c8))
* **Popover:** add missing `ref` import ([2eb2fea](https://github.com/nuxtlabs/ui/commit/2eb2feab672da15f102a500dfbde036bef96b9e4))
* **popper:** use `$el` after 1.5 upgrade ([9554e80](https://github.com/nuxtlabs/ui/commit/9554e801c26de31205f84459ae7679f714de172a)), closes [/github.com/tailwindlabs/headlessui/discussions/1125#discussioncomment-2299441](https://github.com/nuxtlabs//github.com/tailwindlabs/headlessui/discussions/1125/issues/discussioncomment-2299441)
* **preset:** replace avatar wrapper with `inline-flex` ([45cf898](https://github.com/nuxtlabs/ui/commit/45cf898ec3f03a7cc8631e9fe2adc8bac8bd53e9))
* **presets:** add disabled bg color on nuxt buttons ([e1d79d7](https://github.com/nuxtlabs/ui/commit/e1d79d7fe77e93305c04e7333effc2dad0d9b850))
* **presets:** defu merging ([e034218](https://github.com/nuxtlabs/ui/commit/e0342184febf3dbd355189c0766b20d268fce6ef))
* **presets:** dropdown avatar position ([516e7fa](https://github.com/nuxtlabs/ui/commit/516e7faf8ff0c8fe856da0c12ecae2d6d838b816))
* **presets:** support dark ring-offset-color ([a9f1d93](https://github.com/nuxtlabs/ui/commit/a9f1d937bc18d590a9038b15aa21743a15b48b24))
* **SelectCustom:** add default value to placeholder ([8492e16](https://github.com/nuxtlabs/ui/commit/8492e161dbb16bcece401da41ac83f250be8f68b))
* **SelectCustom:** add missing `listContainerClass` prop ([ae6e8ee](https://github.com/nuxtlabs/ui/commit/ae6e8eec032b8fee5581692dcf9a9f873fc8300c))
* **SelectCustom:** add missing `required` prop ([619f620](https://github.com/nuxtlabs/ui/commit/619f620b7ec9392b67c4ab61fb314dafd241b089))
* **SelectCustom:** add missing `text-sm` class ([eb6fbd9](https://github.com/nuxtlabs/ui/commit/eb6fbd9c4ae9efcc5c608f4e26de857409d219b6))
* **SelectCustom:** add missing bg in list input ([da4e8d5](https://github.com/nuxtlabs/ui/commit/da4e8d5c099dbde3a79d124d7debd590d8da0e58))
* **SelectCustom:** add tabindex -1 to hidden input ([09aed4b](https://github.com/nuxtlabs/ui/commit/09aed4b7529bb40a4b1cf9e28cefcc0ba33e1e33))
* **SelectCustom:** dark mode preset ([1e6ad72](https://github.com/nuxtlabs/ui/commit/1e6ad726441bb1f87c2688cdc203417bb0afe267))
* **SelectCustom:** handle placeholder when value is null ([4e0d23e](https://github.com/nuxtlabs/ui/commit/4e0d23ed3470f79f5c6ab805a7f5edd39594c197))
* **SelectCustom:** icon name in prop only for now ([2e64343](https://github.com/nuxtlabs/ui/commit/2e6434361004e6bc7e6de1e7ed669b719e5352d1))
* **SelectCustom:** improve creatable placeholder ([d413cf7](https://github.com/nuxtlabs/ui/commit/d413cf74d6eed70870c60120c1cebbe0335becd6))
* **SelectCustom:** missing padding on list ([524f841](https://github.com/nuxtlabs/ui/commit/524f8411c591fe68c54580d39c094e82cfe82620))
* **SelectCustom:** move max-height on base ([db39a9c](https://github.com/nuxtlabs/ui/commit/db39a9cdba2a585a4bde6c26c8dae1e0b3c1cd02))
* **SelectCustom:** move wrapper on top of `Listbox` ([8222d05](https://github.com/nuxtlabs/ui/commit/8222d05c15a7cede4f42eeebd2f3e14e01238819))
* **SelectCustom:** move wrapper under `Listbox` ([936d6a5](https://github.com/nuxtlabs/ui/commit/936d6a5fee41fc628f4b4efb2a32d46088316be8))
* **SelectCustom:** prop is `icon` instead of `iconName` ([6da0c28](https://github.com/nuxtlabs/ui/commit/6da0c2801909d27b0318c80f1ef0880150e4c14e))
* **SelectCustom:** remove unused import ([0e0f3e3](https://github.com/nuxtlabs/ui/commit/0e0f3e39d31bd70404600ac7d4b9641335839f3c))
* **Select:** default value handling ([eb00439](https://github.com/nuxtlabs/ui/commit/eb0043914bc832be57e1af6def72574a86c76339))
* **Select:** disable placeholder ([7723704](https://github.com/nuxtlabs/ui/commit/7723704f793eb444b24ee8b9d0a0eb2260b991c0))
* **Select:** normalizedValue handling Object modelValue ([#59](https://github.com/nuxtlabs/ui/issues/59)) ([e419d68](https://github.com/nuxtlabs/ui/commit/e419d68f645a14045519a72427f48015e331859b))
* **Slideover:** remove useless padding ([cf021a5](https://github.com/nuxtlabs/ui/commit/cf021a5888af2d996ccdfd99e693ce6797c7d36a))
* **Textarea:** autoresize ([#43](https://github.com/nuxtlabs/ui/issues/43)) ([ba643d9](https://github.com/nuxtlabs/ui/commit/ba643d9faa3761c336e18bfb4671db6e21e88397))
* **textarea:** autoresize reactivity ([#52](https://github.com/nuxtlabs/ui/issues/52)) ([f0bfe20](https://github.com/nuxtlabs/ui/commit/f0bfe20572b028747ed04f3b185880e4204ea072))
* **toast:** `id` should be a string ([7db0ca5](https://github.com/nuxtlabs/ui/commit/7db0ca50a00db12f9d5b3c9adf4d8ce788fe4d1b))
* **Toggle:** add `v-if` when icon props not defined ([90ff1c0](https://github.com/nuxtlabs/ui/commit/90ff1c0671e53ffe7fbf7b018f077f8d8fbe16cc))
* **Tooltip:** prevent close when hovering ([18c194e](https://github.com/nuxtlabs/ui/commit/18c194e8393c07acce40f2dc588d310b2f915126))
* **useTimer:** lint rule changed ([0e18526](https://github.com/nuxtlabs/ui/commit/0e18526a6fa3e32b2aedd137ca9b57d326ea20d9))
* **utils:** types ([00e0ab3](https://github.com/nuxtlabs/ui/commit/00e0ab39f8da9ffb6fffdd7121a69f3aaa071fd3))
* **VerticalNavigation:** `link.avatar` is now an object ([d733e25](https://github.com/nuxtlabs/ui/commit/d733e25bf01ae083e06b35a1bbd58a8bc87f8c4b))
* **VerticalNavigation:** remove `avatarSize` prop ([f0835cf](https://github.com/nuxtlabs/ui/commit/f0835cf979ff0e4e2fc1e36b1cbd377ee32f9b1b))

### 0.0.2 (2022-02-01)


### Features

* **AlertDialog:** create component ([#26](https://github.com/nuxtlabs/ui/issues/26)) ([71371ac](https://github.com/nuxtlabs/ui/commit/71371ac34ec23fb75d35f9240b1889efd3f6954b))
* **alert:** Handle link as button ([#25](https://github.com/nuxtlabs/ui/issues/25)) ([b218737](https://github.com/nuxtlabs/ui/commit/b2187374f642cd401c7703d3da7c9eafb719015f))
* **components:** Update toggle component ([8550c3b](https://github.com/nuxtlabs/ui/commit/8550c3bff7defa1a48338b1bae9371143b92f545))
* module improvements ([74bd7bc](https://github.com/nuxtlabs/ui/commit/74bd7bc180319929d93a162c9d97ccad5c9648d6))
* support presets ([#14](https://github.com/nuxtlabs/ui/issues/14)) ([8f09d0c](https://github.com/nuxtlabs/ui/commit/8f09d0c5ef81c2d7d5fc608fe6c5d7c2fa1a2267))


### Bug Fixes

* **Badge:** add missing vue import ([542ee20](https://github.com/nuxtlabs/ui/commit/542ee205df0af9d2d528c2aee3e25f1f9ce05434))
* **build:** add missing `types` dir ([f666ff1](https://github.com/nuxtlabs/ui/commit/f666ff19d145c82bb537fd2344b5d3bc4916fcb3))
* **build:** add plugins dir ([3d2a5fe](https://github.com/nuxtlabs/ui/commit/3d2a5fe0bbc968a6bd7ee2eb3b203cbd95dbf8a3))
* **build:** include components ([c30041f](https://github.com/nuxtlabs/ui/commit/c30041f96235a4fd35e971e9600c647145049947))
* **Button:** icon import ([0de12aa](https://github.com/nuxtlabs/ui/commit/0de12aac2058b139516a5e462d4f9cce26b8b0ea))
* components dir resolution ([500b4d6](https://github.com/nuxtlabs/ui/commit/500b4d6423cbfe8fc89412bd99e09f1585ce8ded))
* **docs:** module import ([84ec25b](https://github.com/nuxtlabs/ui/commit/84ec25bd56490da4ededf5459b1d87f45f1f3030))
* **forms:** default should use functions ([05c8f5d](https://github.com/nuxtlabs/ui/commit/05c8f5db2eccb1f283723cfbca35177c43ef5d5b))
* **Input:** import `ref` from `vue` ([8d23d8f](https://github.com/nuxtlabs/ui/commit/8d23d8f3c37afdcfac5997667b8774b744022a3d))
* **Input:** remove ref import ([9d70428](https://github.com/nuxtlabs/ui/commit/9d7042829b7e6c1992e0dafedf14a71857e9f63a))
* lint ([78013a7](https://github.com/nuxtlabs/ui/commit/78013a7b25ae0fe021c328e888f053b9fcbc9920))
* **Modal:** add missing `computed` import ([11d6cc2](https://github.com/nuxtlabs/ui/commit/11d6cc2ab49ed32353163c821597f79d2ed4a0e2))
* **module:** optimize deps for gradient-avatar ([09033bb](https://github.com/nuxtlabs/ui/commit/09033bb46cf9bc8292c1e8596164fdb812f40059))
* **module:** presets import ([97f8f56](https://github.com/nuxtlabs/ui/commit/97f8f56a021cfe6caab0d5c9d88a9dd2aa2b0030))
* **module:** use `resolveModule` to import presets ([2d31146](https://github.com/nuxtlabs/ui/commit/2d3114625d8dd9668c3d28cda64f7767733720b5))
* **Notification:** add missing vue dep ([cce650f](https://github.com/nuxtlabs/ui/commit/cce650fe4de75ad94a4753311fbe176928bda3f2))
* **Notifications:** add missing imports ([4a8dd68](https://github.com/nuxtlabs/ui/commit/4a8dd68725bb686cf078631efabb009dd7cbd5e0))
* path misalignment in build, upgrade unocss ([#3](https://github.com/nuxtlabs/ui/issues/3)) ([0b43414](https://github.com/nuxtlabs/ui/commit/0b43414999d066c856568c7e22e2d90e38f6a6bb))
* provide exports without condition ([d87a2c0](https://github.com/nuxtlabs/ui/commit/d87a2c0d6c83755e79291b9df8c7c8a2d58871b7))
* **Select:** missing vue imports ([1755aa8](https://github.com/nuxtlabs/ui/commit/1755aa8529600906885d6c96fc4888e4bb022a5a))
* **Textarea:** imports from vue ([ce46e58](https://github.com/nuxtlabs/ui/commit/ce46e5878405b9cafe8e176ddae0d3f76257ba22))
* **toast:** types ([adbee9c](https://github.com/nuxtlabs/ui/commit/adbee9c717364d2c36210bb85d4fc394cd752938))
* **Toggle:** add missing `computed` import ([0f09c9b](https://github.com/nuxtlabs/ui/commit/0f09c9baae501458af029f853c78b1c10a3ac133))
* **Tooltip:** missing `ref` import ([b08a8cc](https://github.com/nuxtlabs/ui/commit/b08a8cc0ac79e89817e338281a81c477d5ec645a))
* **useTimer:** remove log ([c6dcbd1](https://github.com/nuxtlabs/ui/commit/c6dcbd1b2b542dab1850504a60451a485e2d4004))
* **VerticalNavigation:** add `v-if` on label ([79d8e08](https://github.com/nuxtlabs/ui/commit/79d8e086f0c61887c52da6fe4a13f1bdf7077227))