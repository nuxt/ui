# Changelog

## [3.0.0-alpha.10](https://github.com/nuxt/ui/compare/v3.0.0-alpha.9...v3.0.0-alpha.10) (2024-12-09)

### ⚠ BREAKING CHANGES

* **module:** migrate to `reka-ui` (#2448)
* **Form:** resolve async validation in yup & issue directly mutate state (#2702)

### Features

* **Avatar:** add `default` slot for fallback ([b741ef3](https://github.com/nuxt/ui/commit/b741ef3313bb894beaed0eaa7323ee3d951bf935))
* **Calendar:** add `icon` props ([#2778](https://github.com/nuxt/ui/issues/2778)) ([0f64802](https://github.com/nuxt/ui/commit/0f648024e0468d34c1499bb5b5d2ed32e0e7de4f))
* **Calendar:** implement component ([#2618](https://github.com/nuxt/ui/issues/2618)) ([2e9aeb5](https://github.com/nuxt/ui/commit/2e9aeb5f05e94d63ea453c4f07a3e84ee2a02773))
* **ColorPicker:** implement component ([#2670](https://github.com/nuxt/ui/issues/2670)) ([e475b64](https://github.com/nuxt/ui/commit/e475b6438d405e4695ffb19155d456534d16b897))
* **CommandPalette:** add `active` field on items for consistency ([3765537](https://github.com/nuxt/ui/commit/37655377e9675982e2fce422bdd79ea651424548))
* **css:** use `color-scheme` utilities on body ([a2512f6](https://github.com/nuxt/ui/commit/a2512f680dc0df7add48bc17ef3be30d579be782))
* **i18n:** add Dutch locale ([#2728](https://github.com/nuxt/ui/issues/2728)) ([3baddfd](https://github.com/nuxt/ui/commit/3baddfd12186a68cc302f31cf0934cb9cf48060d))
* **i18n:** add Turkish locale ([#2716](https://github.com/nuxt/ui/issues/2716)) ([de8228e](https://github.com/nuxt/ui/commit/de8228e504affd1a57106101f5168a33702d4d53))
* **locale:** add Brazilian Portuguese language ([#2825](https://github.com/nuxt/ui/issues/2825)) ([b7ff7d8](https://github.com/nuxt/ui/commit/b7ff7d8aa63c41cf7afbecaa31824e098ea291af))
* **locale:** add Japanese language ([#2794](https://github.com/nuxt/ui/issues/2794)) ([ecc4755](https://github.com/nuxt/ui/commit/ecc4755a17874e59e06e70307a40dfd3fb3f20a0))
* **locale:** add Portuguese language ([#2855](https://github.com/nuxt/ui/issues/2855)) ([8b5d412](https://github.com/nuxt/ui/commit/8b5d412fd70b14a53cffa9129f5edd8a40e0f2e8))
* **locale:** add Slovak language ([#2821](https://github.com/nuxt/ui/issues/2821)) ([68a10f0](https://github.com/nuxt/ui/commit/68a10f09d5f164f2f5f07e65297e29fa2d939425))
* **locale:** translate Korean ([#2703](https://github.com/nuxt/ui/issues/2703)) ([2cbf83e](https://github.com/nuxt/ui/commit/2cbf83eb8484ad9abebd6ca01ad344918570af5b))
* **module:** migrate to `reka-ui` ([#2448](https://github.com/nuxt/ui/issues/2448)) ([81ac076](https://github.com/nuxt/ui/commit/81ac076219c3d7ef151f641414a0fbeca2da0bdd))
* **NavigationMenu:** handle `item.trailingIcon` display ([4b653ef](https://github.com/nuxt/ui/commit/4b653ef7735d9d2dfea65260433ade05eb3d3bd7))
* **Stepper:** new component ([#2733](https://github.com/nuxt/ui/issues/2733)) ([6484d01](https://github.com/nuxt/ui/commit/6484d010a1eee6f5d86968e4701b945953089b17))
* **Table:** handle `meta.class` on `th` and `td` ([#2790](https://github.com/nuxt/ui/issues/2790)) ([004a577](https://github.com/nuxt/ui/commit/004a5774678da24ccc267e96697c6088c51d5eea))

### Bug Fixes

* **Breadcrumb:** missing `aria-hidden` on presentation items ([a7a1227](https://github.com/nuxt/ui/commit/a7a1227c93110727e24f822fa50b547eb66bb16e)), closes [#2725](https://github.com/nuxt/ui/issues/2725)
* **Calendar:** handle icons in RTL mode ([#2770](https://github.com/nuxt/ui/issues/2770)) ([e7b69b7](https://github.com/nuxt/ui/commit/e7b69b7d6f0ebb3c578b9f58bcddf8ad36e6c6ce))
* **Calendar:** omit `as` / `asChild` props ([9478fc0](https://github.com/nuxt/ui/commit/9478fc076846d4a7fef13e63bdc274cd8d161063))
* **ColorPicker:** handle RTL mode ([#2858](https://github.com/nuxt/ui/issues/2858)) ([f98b91c](https://github.com/nuxt/ui/commit/f98b91c22ae21071a25f69cc8682eb6197a54c5a))
* **CommandPalette:** keep `ignoreFilter` groups at their place ([#2833](https://github.com/nuxt/ui/issues/2833)) ([3b9ca22](https://github.com/nuxt/ui/commit/3b9ca2263de1b936639b1b20ad0baf1cb059fda5))
* **components:** apply class on `trigger` instead of `content` when present ([a6ecef0](https://github.com/nuxt/ui/commit/a6ecef0f0d87a8dff4e4cb9ec507058ec94ed82b)), closes [#2132](https://github.com/nuxt/ui/issues/2132)
* **components:** specify collisionPadding to all menus ([148b024](https://github.com/nuxt/ui/commit/148b02464d47ada421313327585924b17f4e3f2d))
* **ContextMenu:** remove close animation ([#2798](https://github.com/nuxt/ui/issues/2798)) ([ed27222](https://github.com/nuxt/ui/commit/ed2722257a22c770eda811fbad58980bcef9dad5))
* **defineShortcuts:** return `useEventListener` to unregister the listener ([80befc1](https://github.com/nuxt/ui/commit/80befc107c6c6e7ab99dbe12376976babf315158)), closes [#2031](https://github.com/nuxt/ui/issues/2031)
* **devtools:** error with renderer when `colorMode` is disabled ([#2792](https://github.com/nuxt/ui/issues/2792)) ([f06fbaf](https://github.com/nuxt/ui/commit/f06fbafc1e709c7b4e54e2ba40d44c5770685a5d))
* **Form:** resolve async validation in yup & issue directly mutate state ([#2702](https://github.com/nuxt/ui/issues/2702)) ([c9806da](https://github.com/nuxt/ui/commit/c9806da6d850ea50ff8d2f11a1fbc5a43459b71f))
* **icons:** make `loading` icon clockwise ([#2797](https://github.com/nuxt/ui/issues/2797)) ([bc2bcb3](https://github.com/nuxt/ui/commit/bc2bcb30d97e2e873c4c7d535f82a4980cd35b02))
* **Link:** partial query match for Vue ([#2787](https://github.com/nuxt/ui/issues/2787)) ([a6c2205](https://github.com/nuxt/ui/commit/a6c22052e1c70e4ce6b2c7f783667a7f8c6cafa4))
* **locale:** improve German translation ([#2826](https://github.com/nuxt/ui/issues/2826)) ([c440c91](https://github.com/nuxt/ui/commit/c440c91a29fc1acd281a7f9d9b0cf74f5341553d))
* **Modal:** prevent from going out of screen ([b7ba2c7](https://github.com/nuxt/ui/commit/b7ba2c7759485ddb0a8bae589e4b6536ac9b1c96)), closes [#2711](https://github.com/nuxt/ui/issues/2711)
* **NavigationMenu:** wrong badge class ([86f2b48](https://github.com/nuxt/ui/commit/86f2b4856cc6beaf0440795500a5c74f9af04f36)), closes [#2766](https://github.com/nuxt/ui/issues/2766)
* **Progress:** handle `horizontal` animation in RTL mode ([#2723](https://github.com/nuxt/ui/issues/2723)) ([0baa3a0](https://github.com/nuxt/ui/commit/0baa3a06d449ab97093c451bd16215cf83c39447))
* **Stepper:** handle RTL mode ([#2844](https://github.com/nuxt/ui/issues/2844)) ([198d04d](https://github.com/nuxt/ui/commit/198d04de51d16ec7fcaa546370e4f67aa73bfee0))
* **Stepper:** missing import ([816bb69](https://github.com/nuxt/ui/commit/816bb69debdbf83f36c3ed3627985142e62b7dd1))
* **Table:** handle `loading` animation in RTL mode ([#2771](https://github.com/nuxt/ui/issues/2771)) ([b1550d5](https://github.com/nuxt/ui/commit/b1550d58adfeb09977619ad3ff7e776782a89603))
* **Tabs:** prevent hover on disabled ([a938d24](https://github.com/nuxt/ui/commit/a938d24f90431494c2da89411c301a228ab8d3f7))
* **Tabs:** truncate not working ([c1ff978](https://github.com/nuxt/ui/commit/c1ff978370fb343950837b380ccf02a33db53ccb))
* **types:** handle array of strings in AppConfig ([#2854](https://github.com/nuxt/ui/issues/2854)) ([4b241ba](https://github.com/nuxt/ui/commit/4b241ba3c32f4456252768b664488799a8278f0e))
* **useLocale:** update locale import to enable tree shaking ([#2735](https://github.com/nuxt/ui/issues/2735)) ([3bccb67](https://github.com/nuxt/ui/commit/3bccb6782a601e686df5d0ee405d738572f182e1))

## [3.0.0-alpha.9](https://github.com/nuxt/ui/compare/v3.0.0-alpha.8...v3.0.0-alpha.9) (2024-11-19)

### Features

* **cli:** add locale command ([#2586](https://github.com/nuxt/ui/issues/2586)) ([824ba56](https://github.com/nuxt/ui/commit/824ba5629183bc4cd59321213558770db211f6e5))
* **css:** add `--ui-bg-muted` / `--ui-border-muted` variables ([7f6db45](https://github.com/nuxt/ui/commit/7f6db45f1e15ef39cda9b732cb601c552f29570a))
* **Form:** apply transformations ([#2550](https://github.com/nuxt/ui/issues/2550)) ([75c5e87](https://github.com/nuxt/ui/commit/75c5e87724e7abdf0a6751d7a1dbbafb947f373f))
* **FormField:** add `error-pattern` prop ([#2601](https://github.com/nuxt/ui/issues/2601)) ([143612e](https://github.com/nuxt/ui/commit/143612ec737d1c7571398601c3222f2eed37996e))
* **InputMenu/SelectMenu:** add `create-item` prop ([#2472](https://github.com/nuxt/ui/issues/2472)) ([f516d7b](https://github.com/nuxt/ui/commit/f516d7b36da51565f4ab05a4c9cfe5e5b4015124))
* **InputNumber:** implement component ([#2577](https://github.com/nuxt/ui/issues/2577)) ([bd2f077](https://github.com/nuxt/ui/commit/bd2f077fe8e645d5fce8b1eb5a6eb1068b3e8f7c))
* **Link:** allow partial query match for its active state ([#2664](https://github.com/nuxt/ui/issues/2664)) ([7329900](https://github.com/nuxt/ui/commit/7329900ae549430b88567a09cbb585d3cf0a6d32))
* **locale:** add Persian language ([#2682](https://github.com/nuxt/ui/issues/2682)) ([14fb21b](https://github.com/nuxt/ui/commit/14fb21be0034ffc0ba5d213734c00f12e0d6bea8))
* **locale:** add Polish language ([#2678](https://github.com/nuxt/ui/issues/2678)) ([2fc36c8](https://github.com/nuxt/ui/commit/2fc36c878c67967ec91e4f6999575bad45521d44))
* **locale:** add support for Arabic ([#2582](https://github.com/nuxt/ui/issues/2582)) ([602a667](https://github.com/nuxt/ui/commit/602a667343be22b72383ab3cf42f36ec9e135082))
* **locale:** add support for Czech translation ([#2593](https://github.com/nuxt/ui/issues/2593)) ([4889d30](https://github.com/nuxt/ui/commit/4889d30b448296de42e146dc5771738837c31f8c))
* **locale:** add support for Italian ([#2583](https://github.com/nuxt/ui/issues/2583)) ([4fbbb25](https://github.com/nuxt/ui/commit/4fbbb25f68b0b5ee76e50f2da776a74d54acc041))
* **locale:** provide `code` ([#2611](https://github.com/nuxt/ui/issues/2611)) ([8a8b1ee](https://github.com/nuxt/ui/commit/8a8b1ee2e1628bc5439ef109d3c68b69bf631f81))
* **locale:** provide `dir` on `defineLocale` ([#2620](https://github.com/nuxt/ui/issues/2620)) ([937585c](https://github.com/nuxt/ui/commit/937585cb3f8bc902d60a4b5904711598204aee2d))
* **locale:** translate chinese ([#2580](https://github.com/nuxt/ui/issues/2580)) ([febda5c](https://github.com/nuxt/ui/commit/febda5c2b67374d1358a66694543b77037d239c6))
* **locale:** translate Spanish ([#2644](https://github.com/nuxt/ui/issues/2644)) ([8ed434c](https://github.com/nuxt/ui/commit/8ed434c105b75ae02aa7493a235cebb64d518d09))
* **locale:** typing `dir` ([#2643](https://github.com/nuxt/ui/issues/2643)) ([e55c0e2](https://github.com/nuxt/ui/commit/e55c0e25947e7bcef931b26dafaad120f488a627))
* **module:** support i18n in components ([#2553](https://github.com/nuxt/ui/issues/2553)) ([2636240](https://github.com/nuxt/ui/commit/26362408b161108487b889ff001bec9166059c79))
* **NavigationMenu:** control items `open` & `defaultOpen` on vertical ([30218f1](https://github.com/nuxt/ui/commit/30218f1b5b0a56207fd4db224ffa0401ac194a04)), closes [#2608](https://github.com/nuxt/ui/issues/2608)
* **PinInput:** implement component ([#2570](https://github.com/nuxt/ui/issues/2570)) ([95aa6f6](https://github.com/nuxt/ui/commit/95aa6f68b316d02c28d1124d9a826bca55cde81f))
* **Popover:** add `prevent-close` prop ([ea97759](https://github.com/nuxt/ui/commit/ea97759c2c219bdf5c48b652b47d293ddf513a00)), closes [#2245](https://github.com/nuxt/ui/issues/2245)
* **SelectMenu:** use `UInput` in search to handle props like icon ([ff1e079](https://github.com/nuxt/ui/commit/ff1e0798d384d40ad82a95fe5faa16acb080efe3)), closes [#2021](https://github.com/nuxt/ui/issues/2021)
* **Table:** add `caption` prop ([446f9c1](https://github.com/nuxt/ui/commit/446f9c1085e96187afdc5c1d7ce3450f8df1a2e1))

### Bug Fixes

* **App:** missing `vue` imports ([ddb4690](https://github.com/nuxt/ui/commit/ddb46905e7e3480ab578bcd8a478f25dff60081a))
* **App:** remove `dir` prop ([#2630](https://github.com/nuxt/ui/issues/2630)) ([7cc26d0](https://github.com/nuxt/ui/commit/7cc26d098dff70923bcd9d414d675018951b1967))
* **Breadcrumb/Carousel/Pagination:** handle icons in RTL mode ([#2633](https://github.com/nuxt/ui/issues/2633)) ([e5119a9](https://github.com/nuxt/ui/commit/e5119a9ca4e217ef769904323c16bd8c0cbc02d9))
* **Breadcrumb:** render as `nav` ([756f791](https://github.com/nuxt/ui/commit/756f791a1a8dd3a4a88c212b4e4f775584decb55)), closes [#2649](https://github.com/nuxt/ui/issues/2649)
* **Button:** improve neutral solid variant hover ([8d85498](https://github.com/nuxt/ui/commit/8d85498ee197ec0b26cdd7c4b08f84fec45ddd8f))
* **Carousel:** use `dir` from locale ([#2647](https://github.com/nuxt/ui/issues/2647)) ([1fbbfe8](https://github.com/nuxt/ui/commit/1fbbfe8df06b3b8b294615ac328d582c5230aa8b))
* **ContextMenu/DropdownMenu:** relative imports with prefix ([47f58f5](https://github.com/nuxt/ui/commit/47f58f52ef2d03176a184a3ca2154f5cea655edb))
* **css:** `--font-family-sans` renamed to `--font-sans` ([#2680](https://github.com/nuxt/ui/issues/2680)) ([b2fa657](https://github.com/nuxt/ui/commit/b2fa65734bb59186520c985f7c73fc34a0cb8b37))
* **css:** remove useless spacing override ([8d00265](https://github.com/nuxt/ui/commit/8d0026558a21efbbca08e9939844f7479a0d6cce))
* **FormField:** missing conditions to apply container classes ([#2631](https://github.com/nuxt/ui/issues/2631)) ([9241ba1](https://github.com/nuxt/ui/commit/9241ba1230b0fde41595634362d83c92c66b7699))
* **Form:** match `error-pattern` on input validation ([#2606](https://github.com/nuxt/ui/issues/2606)) ([3584a33](https://github.com/nuxt/ui/commit/3584a3328b8588f024557c9908242bc374853419))
* **InputMenu/SelectMenu:** init `filter` with `labelKey` ([18931ac](https://github.com/nuxt/ui/commit/18931acdb316bc72a3e5ed6d20985688ad5c8d99))
* **InputMenu/SelectMenu:** look in `items` only with `value-attribute` ([0ceafe1](https://github.com/nuxt/ui/commit/0ceafe1d54000f3eb49562b00c188d82fa23c4ee)), closes [#2464](https://github.com/nuxt/ui/issues/2464)
* **InputMenu/SelectMenu:** multiple not working with generic boolean casting ([503f701](https://github.com/nuxt/ui/commit/503f701c7ecdfe27e9057e5ddebfc7e03889d61b)), closes [#2541](https://github.com/nuxt/ui/issues/2541)
* **InputMenu/SelectMenu:** use `isEqual` from `ohash` ([f943f88](https://github.com/nuxt/ui/commit/f943f88fcc9f4678d8f7bd224799e289a0c57dd8))
* **Link:** missing relative import ([#2588](https://github.com/nuxt/ui/issues/2588)) ([95a0bbc](https://github.com/nuxt/ui/commit/95a0bbc581a40677f620eed3170f9a423976214b))
* **locale:** Improve German translation ([#2676](https://github.com/nuxt/ui/issues/2676)) ([992be91](https://github.com/nuxt/ui/commit/992be91823fe1877254ccd092c71c77dd3ff42f7))
* **locale:** it translation ([#2623](https://github.com/nuxt/ui/issues/2623)) ([73e25ed](https://github.com/nuxt/ui/commit/73e25ed23562f755ea4c66e6c5fb06dd18caac1e))
* **locale:** Italian translation ([#2584](https://github.com/nuxt/ui/issues/2584)) ([d167c9b](https://github.com/nuxt/ui/commit/d167c9b807a82fdf0fd280ce8417a66f86d7ed72))
* **Modal/Slideover:** prevent `esc` with `prevent-close` prop ([9e2cc5b](https://github.com/nuxt/ui/commit/9e2cc5b12567472044726924a3896b4b0e7993a1)), closes [#2501](https://github.com/nuxt/ui/issues/2501)
* **module:** remove `fast-deep-equal` in favor of custom `isEqual` ([37a3597](https://github.com/nuxt/ui/commit/37a359701f4b2ce4a9b0727b64c0e3eea6be00b4))
* **module:** skip devtools renderer page injection if router integration is disabled ([#2571](https://github.com/nuxt/ui/issues/2571)) ([afe4003](https://github.com/nuxt/ui/commit/afe40033b088d8aedb73fa8387a0284ef78444e4))
* **PinInput:** missing `useFormField` import ([601f4b2](https://github.com/nuxt/ui/commit/601f4b2cd2027817b935e02a0b4584dc3dce655f))
* **Textarea:** `autoresize` does not work when initializing `modelValue` ([#2681](https://github.com/nuxt/ui/issues/2681)) ([d3a079a](https://github.com/nuxt/ui/commit/d3a079a644db3dfe2f4e9567973550d74b3ba905))
* **Toaster:** teleport to `body` ([b0be26d](https://github.com/nuxt/ui/commit/b0be26d67feab467ac5862edd82e52df03a5091c)), closes [#2404](https://github.com/nuxt/ui/issues/2404)
* **Toast:** unreachable behind overlays ([#2650](https://github.com/nuxt/ui/issues/2650)) ([0daac5b](https://github.com/nuxt/ui/commit/0daac5bafb756c3a2dfaf2bf166c30c0eb476e08))
* **useLocale:** missing import in various components ([#2603](https://github.com/nuxt/ui/issues/2603)) ([df7a61a](https://github.com/nuxt/ui/commit/df7a61a97a14b3d7943baee6a74686134dfdb10b))

### Reverts

* Revert "docs(ComponentCode/ComponentExample): use relative imports" ([5deadc7](https://github.com/nuxt/ui/commit/5deadc709640bbfd3ec14c1c9363deb55e765d6a))

## [3.0.0-alpha.8](https://github.com/nuxt/ui/compare/v3.0.0-alpha.7...v3.0.0-alpha.8) (2024-11-07)

### ⚠ BREAKING CHANGES

* **theme:** migrate from `heroicons` to `lucide` (#2540)

### Features

* **Avatar:** infer `width` / `height` on `<img>` based on `size` prop ([c9adf33](https://github.com/nuxt/ui/commit/c9adf333be3e489b91fd044189809c28c62e7951))
* **Avatar:** use `NuxtImg` component when available ([f1a14dd](https://github.com/nuxt/ui/commit/f1a14dd87c3e250a7eaa6729f68201201a476f9f)), closes [nuxt/ui#2078](https://github.com/nuxt/ui/issues/2078)
* **Badge:** handle `icon` and `avatar` props ([#2497](https://github.com/nuxt/ui/issues/2497)) ([2d52834](https://github.com/nuxt/ui/commit/2d52834529e00a43b1a9b3015d073500b4208981))
* **components:** improve RTL support ([#2433](https://github.com/nuxt/ui/issues/2433)) ([94c4918](https://github.com/nuxt/ui/commit/94c49186e16d84d77a637bbdfe00e7cb880204fe))
* **DropdownMenu/ContextMenu:** handle `color` field in items ([#2510](https://github.com/nuxt/ui/issues/2510)) ([f66c96e](https://github.com/nuxt/ui/commit/f66c96e277970f80c905a8936c73b1d37479a940))
* **InputMenu/Select/SelectMenu:** `arrow` prop implementation ([#2503](https://github.com/nuxt/ui/issues/2503)) ([f26f6c8](https://github.com/nuxt/ui/commit/f26f6c8168ad5e44e47ab770cee10035257841a2))
* **Kbd:** special keys for macOS and other systems ([#2494](https://github.com/nuxt/ui/issues/2494)) ([332c6c0](https://github.com/nuxt/ui/commit/332c6c08d73ebdbffc18e1f196962eaa76e7a8dc))
* **module:** add support for `vue` using `unplugin` ([#2416](https://github.com/nuxt/ui/issues/2416)) ([d4a943e](https://github.com/nuxt/ui/commit/d4a943e631b5e16dc7863395f1dd906087228e1c))
* **module:** devtools integration ([#2196](https://github.com/nuxt/ui/issues/2196)) ([701c75a](https://github.com/nuxt/ui/commit/701c75a2a88a29be2fce193f75e1484799a5539c))
* **NavigationMenu:** add `item-content` slot ([b5ca0d9](https://github.com/nuxt/ui/commit/b5ca0d96f1de049dde698e57a340fc8ee54dd2e7))
* **Table:** customize `header` and `cell` through slots ([#2457](https://github.com/nuxt/ui/issues/2457)) ([ef561e7](https://github.com/nuxt/ui/commit/ef561e7cba172b61f296d4ff11815ec31902fb4a))
* **theme:** migrate from `heroicons` to `lucide` ([#2540](https://github.com/nuxt/ui/issues/2540)) ([a6c1a6c](https://github.com/nuxt/ui/commit/a6c1a6c587ca35439852ce93cd4edc5041c6a9bf))

### Bug Fixes

* **ButtonGroup:** merge class with theme ([d980115](https://github.com/nuxt/ui/commit/d9801154088ec7a20901b805f5d21e485e481d98)), closes [nuxt/ui#2498](https://github.com/nuxt/ui/issues/2498)
* **Carousel:** add missing `aria-label` on dots ([#2489](https://github.com/nuxt/ui/issues/2489)) ([03dd1eb](https://github.com/nuxt/ui/commit/03dd1eba7ece4c48393960dc6c725be3a1eec776))
* **Chip:** proxy attrs to slot ([8669553](https://github.com/nuxt/ui/commit/8669553ea415cc969b2066a78830d03e8dfc811b)), closes [nuxt/ui#2484](https://github.com/nuxt/ui/issues/2484)
* **components:** missing relative imports ([1a93d13](https://github.com/nuxt/ui/commit/1a93d13a1609d8b90783f20b330738cd7456503e)), closes [nuxt/ui#2515](https://github.com/nuxt/ui/issues/2515)
* **InputMenu/Select/SelectMenu:** improve types ([#2471](https://github.com/nuxt/ui/issues/2471)) ([db8111d](https://github.com/nuxt/ui/commit/db8111d7835d030ced79899e826ff1eb74cf1cf4))
* **InputMenu/SelectMenu:** `fast-deep-equal` import ([309e52f](https://github.com/nuxt/ui/commit/309e52faa76fc0a135dbc0d9543380ffd9066bda)), closes [nuxt/ui#2488](https://github.com/nuxt/ui/issues/2488)
* **module:** add `fast-deep-equal` in `optimizeDeps` ([0bfe2b6](https://github.com/nuxt/ui/commit/0bfe2b60b3eb06ec30c80505f10380bab4f7ad4c))
* **module:** define `[#build](https://github.com/nuxt/ui/issues/build)/app.config` ([12ae20d](https://github.com/nuxt/ui/commit/12ae20df20db18d233a185c59ede7dcaeca93071)), closes [nuxt/ui#2532](https://github.com/nuxt/ui/issues/2532)
* **NavigationMenu:** add missing `min-w-0` to make truncate work ([#2476](https://github.com/nuxt/ui/issues/2476)) ([1402436](https://github.com/nuxt/ui/commit/1402436c2b0262edada04273b60c3b2914df2895))
* **NavigationMenu:** enforce `data-orientation` ([64ad4b6](https://github.com/nuxt/ui/commit/64ad4b6892d827df921550bf7ae31048d8d6cc50))
* **NavigationMenu:** improve generic types ([#2482](https://github.com/nuxt/ui/issues/2482)) ([fc2015b](https://github.com/nuxt/ui/commit/fc2015bb0e9ccb017a91ba1ee839cd84cf740cf3))
* **Table:** types in undeclared slots ([#2544](https://github.com/nuxt/ui/issues/2544)) ([f821e66](https://github.com/nuxt/ui/commit/f821e6681bfc5d1515fe7158fe3fda639a897ac8))
* **Tabs:** same behaviour between `pill` and `link` variants ([e592da2](https://github.com/nuxt/ui/commit/e592da2fcb9deb5ad5f2ffb442ff07d86923bab6)), closes [#2338](https://github.com/nuxt/ui/issues/2338)
* **templates:** type error in app config ([77d18d8](https://github.com/nuxt/ui/commit/77d18d8ab7bf28aee316a443d52b852dfc5fd1ca)), closes [nuxt/ui#2481](https://github.com/nuxt/ui/issues/2481)
* **useKbd:** hydration issue ([845f85a](https://github.com/nuxt/ui/commit/845f85a072598f47c7afe10c4e5ebcc480450113)), closes [#2494](https://github.com/nuxt/ui/issues/2494)
* **utils:** improve `escapeRegExp` function ([a97c511](https://github.com/nuxt/ui/commit/a97c511279d32747b487ab5de32677e36a884e53))

## [3.0.0-alpha.7](https://github.com/nuxt/ui/compare/v3.0.0-alpha.6...v3.0.0-alpha.7) (2024-10-23)

### ⚠ BREAKING CHANGES

* **components:** rename `select` to `onSelect` on items

### Features

* **Accordion/Breadcrumb/CommandPalette/ContextMenu/DropdownMenu/NavigationMenu/Tabs:** add `labelKey` prop ([acfc6ce](https://github.com/nuxt/ui/commit/acfc6cef2db88774749d38a98416fdd85922d513))
* **Button:** handle `avatar` prop ([a54c3e4](https://github.com/nuxt/ui/commit/a54c3e49fe782e329f9245e496c336143e3e4b23))
* **CommandPalette:** handle `loading` field in items ([49abad2](https://github.com/nuxt/ui/commit/49abad243cee97b99753e2500c4bdaa0efe5eb75))
* **ContextMenu/DropdownMenu:** handle `checkbox` items type ([8ef6e71](https://github.com/nuxt/ui/commit/8ef6e712acbb2fc026eb35cefa8e29fc0b59d70f)), closes [#2144](https://github.com/nuxt/ui/issues/2144)
* **ContextMenu/DropdownMenu:** handle `loading` field in items ([b975235](https://github.com/nuxt/ui/commit/b975235c8b8e693a32efd3fd5381eed88fa3db4d))
* **Form:** add `superstruct` validation ([#2363](https://github.com/nuxt/ui/issues/2363)) ([5385944](https://github.com/nuxt/ui/commit/53859443593b584f7cd44106021e80f441e9ca06))
* **Input/InputMenu/Select/SelectMenu:** handle `avatar` prop ([53a3796](https://github.com/nuxt/ui/commit/53a3796d1b08717a589028f99fc01084df661708))
* **InputMenu/RadioGroup/Select/SelectMenu:** handle `labelKey` and use `get` to support dot notation ([f6f9823](https://github.com/nuxt/ui/commit/f6f9823b15d84362d093703cb15ecba64c73c2c2))
* **NavigationMenu:** handle children on `vertical` orientation ([#2384](https://github.com/nuxt/ui/issues/2384)) ([34bddd4](https://github.com/nuxt/ui/commit/34bddd45be2ba1d51ddb9b6b40860f2414f63180))
* **Table:** implement component ([#2364](https://github.com/nuxt/ui/issues/2364)) ([b54950e](https://github.com/nuxt/ui/commit/b54950e3ed77a466eb048788757a76018638eafa))

### Bug Fixes

* **AvatarGroup:** wrong ring on big sizes ([61b2323](https://github.com/nuxt/ui/commit/61b232377b4b1fb41de30fd33e690a36b36ba575))
* **Button:** invalid hover on `link` variant ([df2013c](https://github.com/nuxt/ui/commit/df2013ca92a49b5947e2fbc2641fd92860c32042))
* **Checkbox:** `indeterminate` prop not working ([f6631ff](https://github.com/nuxt/ui/commit/f6631ff7bc607e140e9db2c7335c409a811820e4))
* **components:** rename `select` to `onSelect` on items ([b39c4d1](https://github.com/nuxt/ui/commit/b39c4d127e0ddf7607e868ecc83930ca49436bad))
* **css:** `font-sans` already applied on <html> ([9e03da4](https://github.com/nuxt/ui/commit/9e03da41b3537236864ae2a533c47e99a6270b77))
* **css:** make `[@theme](https://github.com/theme)` default ([a2bad2e](https://github.com/nuxt/ui/commit/a2bad2eee2d2a9255152692898078d26e9ecad98))
* **Drawer/Modal/Slideover:** no need for `z-index` since its isolated ([bcfa4b7](https://github.com/nuxt/ui/commit/bcfa4b74a9713be764ecb6db93d60d1360e52f07)), closes [nuxt/ui#2347](https://github.com/nuxt/ui/issues/2347)
* **Input/InputMenu/Select/SelectMenu:** uniformize placeholder color ([f59844b](https://github.com/nuxt/ui/commit/f59844bb617f50ef78ae5abe250b0744d7341a2f))
* **InputMenu/SelectMenu:** escape regexp before search ([7c21dde](https://github.com/nuxt/ui/commit/7c21ddefa87bf3d9999c0e790b48c004c078304d))
* **InputMenu/SelectMenu:** improve displayed value ([0f9ac87](https://github.com/nuxt/ui/commit/0f9ac8733e402d1f22a3eb6c1e24a8d5607b3572)), closes [nuxt/ui#2353](https://github.com/nuxt/ui/issues/2353)
* **InputMenu:** emit `focus` event ([#2386](https://github.com/nuxt/ui/issues/2386)) ([7802aac](https://github.com/nuxt/ui/commit/7802aacf3f5be572dd64c3288196432a41f06b0e))
* **module:** stop using tailwind's shorthand arbitrary variable syntax ([#2366](https://github.com/nuxt/ui/issues/2366)) ([dcce571](https://github.com/nuxt/ui/commit/dcce571cdab08de8408c8ba6b236b051eec3a603))
* **Slideover:** set max height on `top` / `bottom` positions ([a68016e](https://github.com/nuxt/ui/commit/a68016ec5d6859e892c90333d35fd7db09fdcf10)), closes [nuxt/ui#2388](https://github.com/nuxt/ui/issues/2388)

## [3.0.0-alpha.6](https://github.com/nuxt/ui/compare/v3.0.0-alpha.5...v3.0.0-alpha.6) (2024-10-09)


### ⚠ BREAKING CHANGES

* **module:** implement design system with CSS variables (#2298)

### Features

* **Carousel:** implement component ([#2288](https://github.com/nuxt/ui/issues/2288)) ([68ee3f1](https://github.com/nuxt/ui/commit/68ee3f11ca01b19cf890ef8105ffb87ef9bb3188))
* **Form:** add Standard Schema support ([#2303](https://github.com/nuxt/ui/issues/2303)) ([0955c07](https://github.com/nuxt/ui/commit/0955c07edd8ea5b5c39b770804b8e4c6f86d94b0))
* **module:** implement `--ui-radius` CSS variable ([#2341](https://github.com/nuxt/ui/issues/2341)) ([057e86c](https://github.com/nuxt/ui/commit/057e86cfda1ef5c7a370c99ef409d22e48772ca7))
* **module:** set `disableTransition` option on `@nuxtjs/color-mode` ([b82af02](https://github.com/nuxt/ui/commit/b82af02839b7d75344d9431fabdc42f0ac0681e1))


### Bug Fixes

* **Accordion:** use `text-left break-words` instead of `truncate` on label ([6c7c2f0](https://github.com/nuxt/ui/commit/6c7c2f02f395747a0c68a499630f502e3f02ded3))
* **Alert:** default variant to `solid` for consistency ([3a7c5c2](https://github.com/nuxt/ui/commit/3a7c5c26011bfcffcdf6ac3451adb2af1453b9db))
* **Button:** center text with `block` prop ([3cf5535](https://github.com/nuxt/ui/commit/3cf5535b2faa28b557ca55d694abdfa7d7ad0efc)), closes [nuxt/ui#2317](https://github.com/nuxt/ui/issues/2317)
* **Carousel:** move embla plugins to `dependencies` ([bee04ad](https://github.com/nuxt/ui/commit/bee04adf4cc4fd6d69e93ad94500f5ef604405e7))


### Code Refactoring

* **module:** implement design system with CSS variables ([#2298](https://github.com/nuxt/ui/issues/2298)) ([9368c6a](https://github.com/nuxt/ui/commit/9368c6a63955a2e6c2f4f900a9b91c61bb2e5a72))

## [3.0.0-alpha.5](https://github.com/nuxt/ui/compare/v3.0.0-alpha.4...v3.0.0-alpha.5) (2024-10-02)


### Features

* **module:** enable `@nuxtjs/color-mode` ([9dcf903](https://github.com/nuxt/ui/commit/9dcf903926046b6e92b4784043e374d2174e4201))
* **module:** override `dark` variant with class strategy ([0f86b87](https://github.com/nuxt/ui/commit/0f86b87385375e5bd859e84d21f8b4f06b0a99e0))


### Bug Fixes

* **Button:** props specified more than once ([66a04ad](https://github.com/nuxt/ui/commit/66a04add91389910e1336bf0be1cfeada3540f76))

## [3.0.0-alpha.4](https://github.com/nuxt/ui/compare/v3.0.0-alpha.3...v3.0.0-alpha.4) (2024-10-01)


### Features

* **Drawer:** handle `direction` + `handle` props ([5f77aac](https://github.com/nuxt/ui/commit/5f77aac368448c7c45a0f9238d2dc3a5b0de825e))


### Bug Fixes

* **Accordion:** missing `min-w-0` on trigger ([6c28597](https://github.com/nuxt/ui/commit/6c285977bd175d4866ca601bca47132ebb2d3440))
* **build.config:** disable mkdist `addRelativeDeclarationExtensions` option ([f54f607](https://github.com/nuxt/ui/commit/f54f6074131db0f68eab1edcde3a4b2a7ecaba92))
* **CommandPalette:** missing `min-w-0` on root ([a61e765](https://github.com/nuxt/ui/commit/a61e7656c25b26409cab77178e67d1cb9ec22dbd))
* **Drawer:** improve max-width on mobile ([fac52fa](https://github.com/nuxt/ui/commit/fac52fa933aeb02f0855d20be37c4214efba0ab7))
* **InputMenu:** missing `group` on trailing ([2c7c41b](https://github.com/nuxt/ui/commit/2c7c41bd046a961d398bbe8ee4a5945cd1fbaeab))
* **README:** npm badge link ([#2271](https://github.com/nuxt/ui/issues/2271)) ([30c33c7](https://github.com/nuxt/ui/commit/30c33c71134ccbea4258949a851eaf8b26213b60))
* **templates:** app config colors type ([96c9246](https://github.com/nuxt/ui/commit/96c9246d83b54637ceb2e2dd77542e435690c387))
* **Toast:** improve focus styles ([1f9abda](https://github.com/nuxt/ui/commit/1f9abdae614acbfa0be868a599071a601406f0f5))


### Reverts

* Revert "chore(deps): refresh lock" ([b83ecc9](https://github.com/nuxt/ui/commit/b83ecc9a6f309d37d3f096667143a4ed7700db6d))

## [3.0.0-alpha.3](https://github.com/nuxt/ui/compare/v3.0.0-alpha.2...v3.0.0-alpha.3) (2024-09-18)


### Features

* **module:** move `colors` options into `theme.colors` ([2e95446](https://github.com/nuxt/ui/commit/2e954467c4679d70b68d3155ae34eca300508e38))

## [3.0.0-alpha.2](https://github.com/nuxt/ui/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2024-09-18)


### Features

* **Button:** loading-auto ([#2198](https://github.com/nuxt/ui/issues/2198)) ([ed18e74](https://github.com/nuxt/ui/commit/ed18e7454986ed104fc73b77e88573b3c1df8566))
* **module:** improve options ([5076b8c](https://github.com/nuxt/ui/commit/5076b8cc9e908cf289150c668b1707dc1397dba3))
* **module:** install `@nuxt/fonts` by default ([8898a5d](https://github.com/nuxt/ui/commit/8898a5d6758b1047e35bcdf648362c42de387488))


### Bug Fixes

* **Button:** button link not showing disabled classes ([#2189](https://github.com/nuxt/ui/issues/2189)) ([7c2adf2](https://github.com/nuxt/ui/commit/7c2adf2f7fc88174897cc775c752414a8b84f3a9))
* **Button:** duplicate click handlers ([#2213](https://github.com/nuxt/ui/issues/2213)) ([dd6bf56](https://github.com/nuxt/ui/commit/dd6bf5694ff05ed1eeb9df8c42f833f51dbec66e))
* **playground:** typecheck ([cf92c5f](https://github.com/nuxt/ui/commit/cf92c5f3f0e0f329844ee60772773a844ea1cc71))

## [3.0.0-alpha.1](https://github.com/nuxt/ui/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2024-09-11)


### Features

* **module:** hard-code css file to be imported anywhere ([62a2643](https://github.com/nuxt/ui/commit/62a2643a80e7ab6c6e154ba59801d393d9a53c40))


### Bug Fixes

* **ContextMenu/DropdownMenu:** lint unused var ([a03a55c](https://github.com/nuxt/ui/commit/a03a55cf8d89c45fba6607f83b67367cfd419c3e))
* import from `../types/index` ([3e28c8f](https://github.com/nuxt/ui/commit/3e28c8f35a64a7c19ce18f36dbe580503f2050bc))
* **Link:** only bind necessary slot props ([7fe7ff6](https://github.com/nuxt/ui/commit/7fe7ff6fe2055d29b7fd54793ca52850842294e3))
* **NavigationMenu:** handle open state hover effect ([84186e5](https://github.com/nuxt/ui/commit/84186e52e997a4dd55f98bf7bc0199656943b9c9))
* **plugins:** infer type from `[#app](https://github.com/nuxt/ui/issues/app)` to remove build warning ([debf9cc](https://github.com/nuxt/ui/commit/debf9cc85339b7b162ac34392757214a16dad977))
* **README:** license link ([71428da](https://github.com/nuxt/ui/commit/71428da3dc9c6f17a6e21b2bd889f6090be127d6))
* **templates:** augment `@nuxt/schema` rather than `nuxt/schema` ([40b3570](https://github.com/nuxt/ui/commit/40b3570343dc68684d3ecf03e1a439e815f57ba3))
* **types:** no longer need to import types with `/index` suffix ([8277167](https://github.com/nuxt/ui/commit/82771673f20b6ece7e126a4f8914311473d687e3))
* **useButtonGroup:** lint ([97d0593](https://github.com/nuxt/ui/commit/97d05936cd198026e6c4d66920266e0b4b85242c))

## [3.0.0-alpha.0](https://github.com/nuxt/ui/compare/v2.15.0...v3.0.0-alpha.0) (2024-09-05)


### ⚠ BREAKING CHANGES

* **module:** move `primary` and `gray` inside `colors` object
* **Link:** expose `active` instead of `isActive` in default slot

### Features

* **Accordion:** add `body` slot to solve animation flick ([85d1723](https://github.com/nuxt/ui/commit/85d172339f690aeb83a7ae7d3ad812938bb6e000))
* **Accordion:** add `trailingIcon` prop ([fc3d42d](https://github.com/nuxt/ui/commit/fc3d42d5eaba9491ae21f05025899219346f5ca4))
* **Accordion:** new component ([a21648a](https://github.com/nuxt/ui/commit/a21648a1918584b3f4036da96604be66e560b71c))
* add `transition-colors` on hover effects ([633a394](https://github.com/nuxt/ui/commit/633a39452aa28afe4a523f458787fc5102d28ee6))
* **Alert/CommandPalette/Modal/Slideover/Toast:** handle `closeIcon` and uniformize `close` prop ([e4eef89](https://github.com/nuxt/ui/commit/e4eef8976742ac5de418af0fe80d79bfd32fa83f))
* **Alert:** add `actions` slot ([2d15709](https://github.com/nuxt/ui/commit/2d157090c029afb715706e7b464d37c0c377ea82))
* **Alert:** new component ([1535313](https://github.com/nuxt/ui/commit/1535313596cd144886b887ede295da980f394082)), closes [#23](https://github.com/nuxt/ui/issues/23)
* **Avatar:** bind `as` to image to support `NuxtImg` ([cff37bf](https://github.com/nuxt/ui/commit/cff37bf211ddcf67a67ef66dc526ba6cd780ff21))
* **AvatarGroup:** new component ([#71](https://github.com/nuxt/ui/issues/71)) ([def5f7c](https://github.com/nuxt/ui/commit/def5f7c10bd28fbfea5fb8a3c7314ff8592c5335))
* **Avatar:** new component ([978595c](https://github.com/nuxt/ui/commit/978595ce88bfef959f3cd6f405b405727e3929e0))
* **Breacrumb/ContextMenu/DropdownMenu/NavigationMenu:** bind item `class` on link ([d13e27e](https://github.com/nuxt/ui/commit/d13e27eb5bd75227f6e67cbcdfdfe31dcf59e2e4))
* **Breadcrumb:** new component ([53a2bc0](https://github.com/nuxt/ui/commit/53a2bc02642ec9ccecc71fa60cdd2913a4de5214)), closes [#22](https://github.com/nuxt/ui/issues/22)
* **Breadcrumb:** rename `links` to `items` + improve slots ([d56d3a1](https://github.com/nuxt/ui/commit/d56d3a13e3240fedeadcbd8bcadb5c732b7ce2bc))
* **Button:** add `subtle` variant ([1d2e1ca](https://github.com/nuxt/ui/commit/1d2e1caaf5edcbad55bc5c3c75da8afc90ab7a94))
* **ButtonGroup:** new component ([#88](https://github.com/nuxt/ui/issues/88)) ([43066fd](https://github.com/nuxt/ui/commit/43066fd9ea971c6b6c3bf5d58383bb2c9cd076a3))
* **Button:** use `useComponentIcons` ([6e10a09](https://github.com/nuxt/ui/commit/6e10a0942fb408c7092a95f9251ff763a8c3b2d0))
* **Card:** new component ([78908c3](https://github.com/nuxt/ui/commit/78908c3d64a6759a915b5a8b772e750f928740e4))
* **Checkbox/Progress/RadioGroup/Slider/Switch:** add `black` color ([08c91fe](https://github.com/nuxt/ui/commit/08c91fe8f1b7b8d0571bd140e05363e4b71ab6d8))
* **Checkbox:** new component ([#67](https://github.com/nuxt/ui/issues/67)) ([bfd5988](https://github.com/nuxt/ui/commit/bfd59883584aee4c1a0a88952f4277c52afdf2ca))
* **Chip:** new component ([d6bebd5](https://github.com/nuxt/ui/commit/d6bebd5ef9fb40e946a6e6a34c44aff8639c4290))
* **cli:** `init` command ([cdd9b17](https://github.com/nuxt/ui/commit/cdd9b178f32b9807c451734b85c4cfb9f5e8438d))
* **CommandPalette:** handle `filter` false and `postFilter` ([1ef977f](https://github.com/nuxt/ui/commit/1ef977fb8c3a754a909a82733f31b1b45577f021))
* **CommandPalette:** implement group `filter` function ([e29cf79](https://github.com/nuxt/ui/commit/e29cf793cbc46a960dd66241f3bb716887038d18))
* **CommandPalette:** improve theme and performance ([20476f4](https://github.com/nuxt/ui/commit/20476f4b9a95817598fb2e2ae5cb383b0d1411e2))
* **CommandPalette:** new component ([#80](https://github.com/nuxt/ui/issues/80)) ([d0017bf](https://github.com/nuxt/ui/commit/d0017bf847c05f64c3bd131b9e57b2f90009fbe3))
* **components:** allow override of sizes through `ui` prop ([6aa0ea3](https://github.com/nuxt/ui/commit/6aa0ea306f2b89a900c86b1a411217d108d399c0))
* **components:** uniformize colors and variants ([#141](https://github.com/nuxt/ui/issues/141)) ([c018c23](https://github.com/nuxt/ui/commit/c018c23224167df3594f39157d3cb35f0118534b))
* **ContextMenu:** handle `size` prop ([#130](https://github.com/nuxt/ui/issues/130)) ([aa832f3](https://github.com/nuxt/ui/commit/aa832f32a0ddfc6068537f6322603c0fa6f8b1df))
* **ContextMenu:** new component ([65a3b0a](https://github.com/nuxt/ui/commit/65a3b0a2d0f8a4e32b9c0ce4707f22268b32e3dc)), closes [#18](https://github.com/nuxt/ui/issues/18)
* **defineShortcuts:** migrate with reactivity ([#72](https://github.com/nuxt/ui/issues/72)) ([80b413a](https://github.com/nuxt/ui/commit/80b413a724d0702d66df9488b9a974f0d7ba0d41))
* **Drawer:** implement with `vaul-vue` ([5e6275f](https://github.com/nuxt/ui/commit/5e6275fcff151f3607939b1503ff60f970375564)), closes [#53](https://github.com/nuxt/ui/issues/53)
* **DropdownMenu:** add `[#item](https://github.com/nuxt/ui/issues/item)` slot for consistency ([1dcc1f5](https://github.com/nuxt/ui/commit/1dcc1f50740c1b4ed17c77a22562ccd662c85d15))
* **DropdownMenu:** handle `size` prop ([#125](https://github.com/nuxt/ui/issues/125)) ([dfa9936](https://github.com/nuxt/ui/commit/dfa99362d4d70ac76c43a1b1c3e815272bee9a25))
* **DropdownMenu:** handle item type `separator` ([a5bb25d](https://github.com/nuxt/ui/commit/a5bb25dd95be81d34564c5b5c4e3174ec126dbdb))
* **DropdownMenu:** new component ([#37](https://github.com/nuxt/ui/issues/37)) ([4403350](https://github.com/nuxt/ui/commit/44033508a7347a5c75204d359b641a6f2da2cff9))
* **DropdownMenu:** pass `index` to slots ([735f81e](https://github.com/nuxt/ui/commit/735f81e771d3673f444be99b93cff1ef93c3ac6c))
* expose `open` state to slots ([ed2c45a](https://github.com/nuxt/ui/commit/ed2c45ac76285bb394fa16970fca27690d3de454))
* **Form:** `Select` and `InputMenu` integration ([#97](https://github.com/nuxt/ui/issues/97)) ([52cf471](https://github.com/nuxt/ui/commit/52cf471099a78737e13f755fd89ff38c8c761aea))
* **Form:** nested form validation ([#23](https://github.com/nuxt/ui/issues/23)) ([1671278](https://github.com/nuxt/ui/commit/167127861f117ece8a54421b5000f50d8d611b39))
* **Form:** new component ([#4](https://github.com/nuxt/ui/issues/4)) ([de62676](https://github.com/nuxt/ui/commit/de62676647531c4d0a40c4696f9a7a3b75af32ff))
* **Form:** support for `valibot@33` ([#132](https://github.com/nuxt/ui/issues/132)) ([20acc92](https://github.com/nuxt/ui/commit/20acc92eecbd17b9a6ea16ed688fe39af94708a2))
* **Icon:** use `@antfu/nuxt-icon-poc` ([#76](https://github.com/nuxt/ui/issues/76)) ([142affb](https://github.com/nuxt/ui/commit/142affb9a72faa07bb9b448a95042c13aec09623))
* **Input/Textarea:** expose ref ([74a6bca](https://github.com/nuxt/ui/commit/74a6bca2b334f54b99294be8848f345e69ff1141))
* **Input:** handle icons ([de8100a](https://github.com/nuxt/ui/commit/de8100af3a36253d32d449a9bd445a761386b724))
* **InputMenu/Select/SelectMenu:** introduce `valueKey` prop ([eeec967](https://github.com/nuxt/ui/commit/eeec9676cde0201736d70739847ee820fb80657c)), closes [#108](https://github.com/nuxt/ui/issues/108)
* **InputMenu:** expose `modelValue` and `open` to slots ([659d5e2](https://github.com/nuxt/ui/commit/659d5e2c5a9164c684cb49429d5045bdae11eac6))
* **InputMenu:** handle `multiple` ([fe3ab65](https://github.com/nuxt/ui/commit/fe3ab652b4b9258cd02c48ded5b8858001818e03)), closes [#91](https://github.com/nuxt/ui/issues/91)
* **InputMenu:** handle `size` prop ([#131](https://github.com/nuxt/ui/issues/131)) ([18c5ead](https://github.com/nuxt/ui/commit/18c5ead1bd1f253524da587305c234a88c56ed25))
* **InputMenu:** new component ([#86](https://github.com/nuxt/ui/issues/86)) ([99f20a4](https://github.com/nuxt/ui/commit/99f20a4154b26f75fbec0762d5a02a08b5a319a7))
* **Input:** set `autocomplete` to `off` by default ([eba8b4b](https://github.com/nuxt/ui/commit/eba8b4b31a3d83d4dcb67246eed0fc21fb46dce7))
* **Input:** use `defineModel` ([#61](https://github.com/nuxt/ui/issues/61)) ([091f8e9](https://github.com/nuxt/ui/commit/091f8e91c45039391800de80807ce77db3656500))
* **Kbd:** add `color` prop ([2cc41de](https://github.com/nuxt/ui/commit/2cc41dedcfe73183a285a5ce5e7192290926771b))
* **Link:** break component in two with `custom` prop ([3ed5a08](https://github.com/nuxt/ui/commit/3ed5a085181be75d25178640d686274745e54aa3))
* **Link:** style with app config ([349780d](https://github.com/nuxt/ui/commit/349780dae18e3acc4cd1dda8152ae6d0377004ba))
* **Modal:** new component ([5d1d5b3](https://github.com/nuxt/ui/commit/5d1d5b33e8fe959644e5f93986c9c7630ea288cc))
* **Modal:** open programmatically ([#78](https://github.com/nuxt/ui/issues/78)) ([2bf99e1](https://github.com/nuxt/ui/commit/2bf99e1eb4df7333a46df666c446ba7af4e54e93))
* **module:** add `[@source](https://github.com/source)` when `@nuxt/content` is present ([8dfac7f](https://github.com/nuxt/ui/commit/8dfac7fd574bef3ea714e21b852c50aafd6feff4))
* **module:** add option to disable transitions ([5f4fd97](https://github.com/nuxt/ui/commit/5f4fd972ff2251863751549271a9e80123fdbfc8))
* **module:** allow `tailwind.css` customization ([8d560bd](https://github.com/nuxt/ui/commit/8d560bdd212bbbf25a7d4a706a99cc57721d593e))
* **module:** move `primary` and `gray` inside `colors` object ([ccbaf6e](https://github.com/nuxt/ui/commit/ccbaf6ea150e0902d7150585bd09f132fc26ff89))
* **NavigationMenu:** handle content, `color`, `variant`, etc. ([1af449d](https://github.com/nuxt/ui/commit/1af449d6e0e2cd454425d8bc6bf1482e5dac99fd))
* **NavigationMenu:** improve theme with `line` variant and border ([ec6ebba](https://github.com/nuxt/ui/commit/ec6ebbacbe1a0797ec86fe85197a98b084e27e5d))
* **NavigationMenu:** new component ([0d4d86d](https://github.com/nuxt/ui/commit/0d4d86d79db488b79ca2baf7d620b415a36cb135))
* **NavigationMenu:** pass `index` to slots ([0f10d98](https://github.com/nuxt/ui/commit/0f10d9882099256a77b86e5786a7e2ee71c83d46))
* **NavigationMenu:** rename `links` to `items` + improve slots ([ea19a30](https://github.com/nuxt/ui/commit/ea19a3061fb49960fe3b9d28d05cec8fd7f6647e))
* **NavigationMenu:** replace `line` variant with `highlight` prop ([af43b5d](https://github.com/nuxt/ui/commit/af43b5df250fb65bf9696b5b3fb6cb507b2184a1))
* **Pagination:** allow using pagination buttons as links ([#114](https://github.com/nuxt/ui/issues/114)) ([5c5676e](https://github.com/nuxt/ui/commit/5c5676edf957230bf3ac53fa527b1b4b4373750f))
* **Pagination:** new component ([c36bae4](https://github.com/nuxt/ui/commit/c36bae4b21e4a6c899be39800ca90051f79db1e0)), closes [#11](https://github.com/nuxt/ui/issues/11)
* **Popover:** handle `hover` mode ([7b89601](https://github.com/nuxt/ui/commit/7b8960124fcf24a5d3869e3913ea5220af3a76bf))
* **Popover:** new ([c131ce9](https://github.com/nuxt/ui/commit/c131ce955f23ce2613f5493689df8352de3cd4b6))
* **Progress:** new component ([#75](https://github.com/nuxt/ui/issues/75)) ([138cb2d](https://github.com/nuxt/ui/commit/138cb2d12d9414813beed22dcedcee61e3d4f6de))
* **RadioGroup:** handle `horizontal` orientation ([#74](https://github.com/nuxt/ui/issues/74)) ([8144372](https://github.com/nuxt/ui/commit/814437255e47d6be40cd00420e2ab579ab76f5b9))
* **RadioGroup:** handle `value-key` prop ([850e84c](https://github.com/nuxt/ui/commit/850e84c0e0ce11bdc90be1ae652dec6723012243))
* **RadioGroup:** new component ([#41](https://github.com/nuxt/ui/issues/41)) ([e29b514](https://github.com/nuxt/ui/commit/e29b514f8d114a56eee76a29388fe050eb5c2722))
* **Select/SelectMenu:** handle `size` prop ([#133](https://github.com/nuxt/ui/issues/133)) ([b61696c](https://github.com/nuxt/ui/commit/b61696cdca77cc2f671dcbf330e731230ec97ba3))
* **SelectMenu:** add prop to disable search ([db30284](https://github.com/nuxt/ui/commit/db30284e7a24f14544c2c3b758c7912e98d3768a))
* **SelectMenu:** handle `multiple` prop ([27ffb8d](https://github.com/nuxt/ui/commit/27ffb8d8abc466d2a4bbb9a313b0c4f6a3a97501)), closes [#102](https://github.com/nuxt/ui/issues/102)
* **SelectMenu:** new component ([#103](https://github.com/nuxt/ui/issues/103)) ([7a376b5](https://github.com/nuxt/ui/commit/7a376b5e49baf11eb09c1b58326441cb240f7cb7))
* **Select:** new component ([#92](https://github.com/nuxt/ui/issues/92)) ([1942b8e](https://github.com/nuxt/ui/commit/1942b8e117bdae745049b088afe7487b6a9095f9))
* **Separator:** new component ([#46](https://github.com/nuxt/ui/issues/46)) ([8d76a8b](https://github.com/nuxt/ui/commit/8d76a8b1957d6910cdf25c66a966b808cf8525c7))
* **Skeleton:** new component ([e2fb253](https://github.com/nuxt/ui/commit/e2fb25309f13068c7a49de1b507f258013c72e11))
* **Slideover:** add `top` / `bottom` sides ([3e8a992](https://github.com/nuxt/ui/commit/3e8a99244e550f9ed68a30182c9ec0753d240138))
* **Slideover:** new component ([38eb932](https://github.com/nuxt/ui/commit/38eb932b538abb08d10e564308d92538ee345463))
* **Slideover:** open programmatically ([#122](https://github.com/nuxt/ui/issues/122)) ([b886150](https://github.com/nuxt/ui/commit/b886150147afbde882003fb5dc710a5975b633cd))
* **Slider:** new component ([#57](https://github.com/nuxt/ui/issues/57)) ([78e4560](https://github.com/nuxt/ui/commit/78e45600de9ac6a3e197baa7fed4fb4a46164c33))
* **Switch:** add ` label`  and ` description` props ([#60](https://github.com/nuxt/ui/issues/60)) ([2fe91f3](https://github.com/nuxt/ui/commit/2fe91f3847198e4415edfda36cb977458866bbd9))
* **Switch:** form integration ([#48](https://github.com/nuxt/ui/issues/48)) ([ebb7c07](https://github.com/nuxt/ui/commit/ebb7c074afb583e6da8e1e06f12318faa1bf552c))
* **Switch:** handle `loading` and `loadingIcon` ([8fd3693](https://github.com/nuxt/ui/commit/8fd369372ba54d7ac2efa3d0186498d8e1608c41)), closes [#65](https://github.com/nuxt/ui/issues/65)
* **Switch:** new component ([cd1073d](https://github.com/nuxt/ui/commit/cd1073d93876c6f15f71bcd8d5c4c4bc76492330))
* **Tabs:** handle `avatar` ([bf0a04e](https://github.com/nuxt/ui/commit/bf0a04eb8bda666df2c88f7d0ea121c135f7d065))
* **Tabs:** handle `color` and `variant` props ([82ffc1e](https://github.com/nuxt/ui/commit/82ffc1ed574d741be03c43dfa300fefca0d042e0)), closes [#116](https://github.com/nuxt/ui/issues/116)
* **Tabs:** handle `content` prop as `boolean` ([e051ef6](https://github.com/nuxt/ui/commit/e051ef682aa7d4ec91b7145c1d96bb1d9913ad2d))
* **Tabs:** handle `size` prop ([#124](https://github.com/nuxt/ui/issues/124)) ([2b69652](https://github.com/nuxt/ui/commit/2b6965211dd9193026b85576d292f9f5138f99e6))
* **Tabs:** handle items `icon` ([06ea029](https://github.com/nuxt/ui/commit/06ea029ef624116792230fdb57cdcee13b610fc0))
* **Tabs:** new component ([13d389f](https://github.com/nuxt/ui/commit/13d389fd3979f089e37006741f51400168e58631))
* **Textarea:** new component ([#62](https://github.com/nuxt/ui/issues/62)) ([2ca6973](https://github.com/nuxt/ui/commit/2ca697333790efe3304f1f03b12be53912bdaf2d))
* **Toast:** actions `color` defaults from prop ([9a42338](https://github.com/nuxt/ui/commit/9a42338da377cc538fddad3c37143a6d74527a9b))
* **Toast:** add `actions` slot ([51872be](https://github.com/nuxt/ui/commit/51872bef6c7187450b63a4b88e4f6e714efd146a))
* **Toast:** implement progress duration ([d726e4d](https://github.com/nuxt/ui/commit/d726e4ddacc68c8bd63084bfbd32893e292d3846)), closes [#51](https://github.com/nuxt/ui/issues/51)
* **Toast:** new component ([#50](https://github.com/nuxt/ui/issues/50)) ([3da1e1a](https://github.com/nuxt/ui/commit/3da1e1a5183852011beadb91af4edbeb3f233e39))
* uniformize components sizes ([#68](https://github.com/nuxt/ui/issues/68)) ([f302a15](https://github.com/nuxt/ui/commit/f302a159727e44dce8f12909c3fbe316efe8b1e4))
* **useComponentIcons:** extract repetitive logic ([e4882e6](https://github.com/nuxt/ui/commit/e4882e6804394ab448dbdbb3673adadb80faafe2))
* **useKbd:** new composable ([#73](https://github.com/nuxt/ui/issues/73)) ([f076019](https://github.com/nuxt/ui/commit/f076019f8f84f2c71c66bfa806d7861ccf8fb959))
* **useToast:** add `clear` method ([89ff6b6](https://github.com/nuxt/ui/commit/89ff6b6702179fde2fff3294a1909463883378ae))


### Bug Fixes

* **Accordion:** dont set a `default-value` ([c36940a](https://github.com/nuxt/ui/commit/c36940a2210219aa36076b480740c044a536634f))
* **Accordion:** handle `disabled` through variants ([6236953](https://github.com/nuxt/ui/commit/6236953ed068721348f912b9033b1fa1beb378ab))
* **Alert:** add missing `close` slot ([26491af](https://github.com/nuxt/ui/commit/26491afcd10509f0f7d4cf8ea6e108f08f525f64))
* **Avatar:** bind `$attrs` on image ([da42c04](https://github.com/nuxt/ui/commit/da42c0489a501724e5bbcfedc76103df3d84f35d))
* **AvatarGroup:** default size to `md` ([9620d90](https://github.com/nuxt/ui/commit/9620d903c5471b76da3d7465d702d0e347c83892))
* **AvatarGroup:** handle deep children ([e9832b9](https://github.com/nuxt/ui/commit/e9832b95f56f97665be82ffe16e7cad72dc62f90))
* **Avatar:** improve sizes ([c726f13](https://github.com/nuxt/ui/commit/c726f13ac2a57a3de36d2c596d5a6ac086fa1a95))
* **Avatar:** increase gray on light mode ([fe467da](https://github.com/nuxt/ui/commit/fe467da9bfec5890bde8130832d4f89f954c84e8))
* **Badge:** handle `label` as `number` ([6cd7c8a](https://github.com/nuxt/ui/commit/6cd7c8a5fbe17c40610163258800f2034a2ba6ad))
* **Breadcrumb:** only apply `aria-current="page"` when link is active ([e5695e7](https://github.com/nuxt/ui/commit/e5695e78bc04827a1f774c4a39d9428eb31941e7))
* **Button:** extend now works with compound variants ([53755da](https://github.com/nuxt/ui/commit/53755da8359d8d5ffa4426b4f696489ebbe51f47))
* **ButtonGroup:** define its own `size` variant ([0dfd8b3](https://github.com/nuxt/ui/commit/0dfd8b3248d2f0fe6422ff4f03f027427282639b))
* **Button:** invalid icon size for `lg` ([f0f8927](https://github.com/nuxt/ui/commit/f0f89272a0992bdd1bba32e3458c864f665d5f58))
* **Button:** loading on trailing ([c8bdb51](https://github.com/nuxt/ui/commit/c8bdb51f68a308169f7ce10ede70612f968fa676))
* **Button:** move span with `truncate` inside default slot ([561c1fb](https://github.com/nuxt/ui/commit/561c1fb6652fe413497f8a04f563c1ed98f754ba))
* **Card:** improve body padding ([cecfb58](https://github.com/nuxt/ui/commit/cecfb58445affccf0d52f975d0329acbcbd3d9c2))
* **Card:** missing slots definition ([02da03b](https://github.com/nuxt/ui/commit/02da03b4a8fc9fd2c8d95a86812e746f789ebe1a))
* **Checkbox:** icon render ([fc50996](https://github.com/nuxt/ui/commit/fc50996ccfeaa2602f53c2f2683300462cf12992))
* **Checkbox:** reduce icon size ([3c89d6b](https://github.com/nuxt/ui/commit/3c89d6b2c5ad5cb0081c4607660760f7460a585e))
* **Chip:** extend now works with compound variants ([6dfd696](https://github.com/nuxt/ui/commit/6dfd696092e6a9633be62ec7d1a7fb2a24dc8657))
* **Chip:** improve sizes ([d5fe5b3](https://github.com/nuxt/ui/commit/d5fe5b3f4da1a834c14a6aae768163967c817a34))
* **Chip:** size injection ([#105](https://github.com/nuxt/ui/issues/105)) ([8baee12](https://github.com/nuxt/ui/commit/8baee1292f62ee7c4380ddb57b69bb9a23dbc2e0))
* **Collapsible:** ensure default slot exists ([c85a8cf](https://github.com/nuxt/ui/commit/c85a8cfe0b8f2e2b4a2ac15d3239c842b91b5bc0))
* **CommandPalette/InputMenu/Select/SelectMenu:** adapt chip size ([bdc3217](https://github.com/nuxt/ui/commit/bdc32175719b538828b4f63ad952dbd6f81b99b9))
* **CommandPalette:** ts errors ([d558b3e](https://github.com/nuxt/ui/commit/d558b3e29c6649bae2762c7412544d5d82b382bf))
* **components:** `ui` prop override with class ([#136](https://github.com/nuxt/ui/issues/136)) ([235556d](https://github.com/nuxt/ui/commit/235556d3e00b7a008fe16beba3f370b4af8bbb56))
* **components:** allow override of `root` through `ui.root` ([47ad74d](https://github.com/nuxt/ui/commit/47ad74d029f03c9013a76b8ee0a4b6cc37072cc5))
* **components:** declare `ui` prop with `PartialString` when arrays in theme slots ([5cc4457](https://github.com/nuxt/ui/commit/5cc4457a743fadbc775b11c41f7bb1fb89b5a728))
* **Container:** missing slots definition ([ab83053](https://github.com/nuxt/ui/commit/ab83053fef1571b0d0bf8519fb3c874b15cfef51))
* **ContextMenu/DropdownMenu:** move `open` and `default-open` props to `Sub` ([9af6d7d](https://github.com/nuxt/ui/commit/9af6d7dc5924f8c73036397e772fcbddf106e1af))
* **ContextMenu:** remove `arrow` prop ([4ac7a7e](https://github.com/nuxt/ui/commit/4ac7a7e3e97c28b0faf0cd1240f9aa6c385399ca))
* define empty props in slots for `nuxt-component-meta` parsing ([369e0b1](https://github.com/nuxt/ui/commit/369e0b195206277dbd8b39514f1bcb4a833512f3))
* **Divider:** add `w-full` only on horizontal wrapper ([#1565](https://github.com/nuxt/ui/issues/1565)) ([bd8b737](https://github.com/nuxt/ui/commit/bd8b737642280e6a83b67f9a27dd7a823a77e963))
* **DropdownMenu:** add overflow scroll if height is added ([80a8c2d](https://github.com/nuxt/ui/commit/80a8c2d772adf188eefa24dfdb1783bbb3fb98b7))
* **DropdownMenu:** handle disabled with data attribute for links ([cd214f9](https://github.com/nuxt/ui/commit/cd214f91dbe25828a99b26b8e908456743ae2cfc))
* **Dropdown:** missing `mouseenter` event on container ([7288953](https://github.com/nuxt/ui/commit/72889535e7e9763e7ebf59498f22c39bf09d6477))
* dynamic slots autocomplete ([#77](https://github.com/nuxt/ui/issues/77)) ([c6a93f7](https://github.com/nuxt/ui/commit/c6a93f71f2b0b9c2d3f89b1de2ae5ee254579ad0))
* **FormField:** added a utility type to fix some type errors ([#81](https://github.com/nuxt/ui/issues/81)) ([559a8cb](https://github.com/nuxt/ui/commit/559a8cba5814194b679de5beb3a66d5bda87e25b))
* **FormField:** allow `error` prop as boolean ([a23c314](https://github.com/nuxt/ui/commit/a23c3140dfef9bead862a4296a8cbfb05868a00e))
* **FormField:** generics ([a78b096](https://github.com/nuxt/ui/commit/a78b0965e8c936b315ac0e51d4955e28941f8a34))
* **Form:** inconsistent validation events for `InputMenu` and `Select` ([#123](https://github.com/nuxt/ui/issues/123)) ([a2114c5](https://github.com/nuxt/ui/commit/a2114c587435af901d5bbea047a297169bc7abfb))
* **fuse:** prevent indices highlight of a single char ([7b278b0](https://github.com/nuxt/ui/commit/7b278b041c4f09b512fc498a2eb54aef3cab845c))
* **Input/SelectMenu:** handle `file` type and `change` events ([#1570](https://github.com/nuxt/ui/issues/1570)) ([878f707](https://github.com/nuxt/ui/commit/878f7078a28c5e70a662682d1293db466d518c7d))
* **Input/Textarea:** remove useless gap ([67a1568](https://github.com/nuxt/ui/commit/67a15686e5adafbe5345253d06394f896e93e6f8))
* **Input:** invalid `xs` size ([4a281b3](https://github.com/nuxt/ui/commit/4a281b30939b0ccecbcfb213bb1102b21d959791))
* **InputMenu/Select/SelectMenu:** use `defuFn` to override base slot ([2aa4358](https://github.com/nuxt/ui/commit/2aa4358d328e7c8e1a1dca718acad391a09280fc))
* **InputMenu:** bind `searchTerm` with `defineModel` ([ff9fd9f](https://github.com/nuxt/ui/commit/ff9fd9f657c8e37a658136301ff4a1872842b956))
* **Input:** missing `file:` selector on dark mode ([f9259f6](https://github.com/nuxt/ui/commit/f9259f685777e5d6a5e5b5326e56579b24cf40d4))
* **Input:** use `pl` / `pr` instead of `ps` / `pe` ([a31d4cf](https://github.com/nuxt/ui/commit/a31d4cffb540db30a8689a170d941620bf4993c3)), closes [#32](https://github.com/nuxt/ui/issues/32)
* **Input:** use `ring` instead of `ring-1` ([0920099](https://github.com/nuxt/ui/commit/0920099362c9a2a8493a9715a9d84f4192d80a36))
* **Input:** wrong type for `type` prop ([3651c7e](https://github.com/nuxt/ui/commit/3651c7ec4135a05061b5aa613fa62867c2e0602f))
* **Kbd:** optional `value` prop when using default slot ([40d17f7](https://github.com/nuxt/ui/commit/40d17f7b03f2ce1306a8f3a9368744fbc1906ae1))
* **Link:** active class ([c384ec9](https://github.com/nuxt/ui/commit/c384ec94a2b5d4a7f92c98ce56c484e440a6afaf))
* **Link:** add missing `slots` definition ([76e3d0b](https://github.com/nuxt/ui/commit/76e3d0b9f3f582f84983f2813430e4d8eae40c84))
* **Link:** allow `ariaLabel` to be picked ([c1ac3a9](https://github.com/nuxt/ui/commit/c1ac3a9f9d5357bc3a7b125d8793d69d8d518bd3))
* **Link:** expose `active` instead of `isActive` in default slot ([46c066d](https://github.com/nuxt/ui/commit/46c066d79146bfad5ecc74769407b0f13595ec03))
* **Link:** improve `type` prop ([802a159](https://github.com/nuxt/ui/commit/802a15990d6c4c192c43730ceb46022fd19c7d61))
* **module:** add `isolate` class on root node ([0c6720b](https://github.com/nuxt/ui/commit/0c6720be7304af94dc3cb54fd772e40845875393))
* **module:** handle theme HMR on dev ([#84](https://github.com/nuxt/ui/issues/84)) ([12ba480](https://github.com/nuxt/ui/commit/12ba480d347f081bc0fac54e49b37b8f1513762f))
* **module:** inject options in `nuxt.options.ui` ([cf38e7e](https://github.com/nuxt/ui/commit/cf38e7ed78037001a159c794b097d2995a6d3f86))
* **module:** prevent `colors` option merge ([c4419fa](https://github.com/nuxt/ui/commit/c4419fa113c04c73e02c613a25fdbdde11cfbc32))
* **module:** prevent override of `rootAttrs.class` ([3097da4](https://github.com/nuxt/ui/commit/3097da486fe0891641d81fefcd38d9b31284a8b0))
* **module:** typo in `fuchsia` color ([7fd38a8](https://github.com/nuxt/ui/commit/7fd38a8cb829c1f19a7da2f80f2a1cc4f1ca257e))
* **module:** use `@tailwindcss/postcss` ([cdf6ebd](https://github.com/nuxt/ui/commit/cdf6ebdafbf3174d27b8a3a29c22df2f5160ac51))
* **module:** use relative imports to components / composables ([42f4f8d](https://github.com/nuxt/ui/commit/42f4f8d3370ab0dd94e09d8960e87076afbb1035))
* **NavigationMenu:** `highlightColor` defaults to `color` prop ([0bdd6df](https://github.com/nuxt/ui/commit/0bdd6dfe8609d1c951023b6785c4ff87a813b2f6))
* **NavigationMenu:** `label` doesn't need to be typed as `number` ([ee1d6ed](https://github.com/nuxt/ui/commit/ee1d6ed08fdcf00ad11ea2ef15869b861ae8a688))
* **NavigationMenu:** add default `highlightColor` ([c838b3a](https://github.com/nuxt/ui/commit/c838b3a040d090aeeab297fca451ea8d80942728))
* **NavigationMenu:** handle `disabled` through variants + `isolate` list + use separator instead of divide ([f664f69](https://github.com/nuxt/ui/commit/f664f690970058088ebfa975297ca2721c03316f))
* **NavigationMenu:** handle `truncate` on vertical orientation ([298ac68](https://github.com/nuxt/ui/commit/298ac68447046a0a37d1857db24fe815cc02fbab))
* **NavigationMenu:** optional `links` ([4301821](https://github.com/nuxt/ui/commit/4301821473b0cca086e634146cc6d9f440ca151b))
* **NavigationMenu:** prevent err without links ([03edad8](https://github.com/nuxt/ui/commit/03edad885d082a38688e0d34efe12c3f86fc0291))
* **NavigationMenu:** use `ULink` with `custom` ([c8bedf8](https://github.com/nuxt/ui/commit/c8bedf84585ad119599a89faa23185a1b94120da))
* **Pagination:** center text when link ([440593c](https://github.com/nuxt/ui/commit/440593c5e43eac3ede2acf257e1862a648b02d40))
* **plugins:** add missing `type` ([63f752a](https://github.com/nuxt/ui/commit/63f752a4a8e4a5966bbe938e65dfdf706c706a07))
* **plugins:** use `import.meta` ([c9f0999](https://github.com/nuxt/ui/commit/c9f09992b7ac9ef2c34d5957fb31fd2aa5db3791))
* **Popover:** ensure default slot exists ([5d3ad6b](https://github.com/nuxt/ui/commit/5d3ad6b93ef5fa583a5dcbee102a7391426308f3))
* **Popover:** missing `mouseenter` event on container ([8517897](https://github.com/nuxt/ui/commit/8517897c34adaa9e3624f867b43106deb59fcbe8)), closes [#1564](https://github.com/nuxt/ui/issues/1564)
* **Popover:** split reactive props with `mode` ([7d2d3b9](https://github.com/nuxt/ui/commit/7d2d3b9c0ffc4e58021639e8b7ea0d23addb4493))
* **Popover:** use `scale-in` / `scale-out` animations ([f90f7d7](https://github.com/nuxt/ui/commit/f90f7d7b7c0d81cf42b2232e9c12597210cd5791))
* **Progress:** initial indicator style when percent is 0 ([d2442a1](https://github.com/nuxt/ui/commit/d2442a1e4793d3869bfc938197b00f21b4033d19))
* **RadioGroup:** missing `as` prop binding ([d3c7991](https://github.com/nuxt/ui/commit/d3c79912d8b9c02fee267958cd34e4fbeb0d3de7))
* **RadioGroup:** style `legend` based on size ([b1bcaab](https://github.com/nuxt/ui/commit/b1bcaabd19eb3087d222dc53a37a520735b2f4ed))
* remove `IconProps` usage ([6d377d1](https://github.com/nuxt/ui/commit/6d377d1f4bb0b29f9bec346a31dbfb29fbdc57fe))
* **SelectMenu:** adapt input size ([5c12d42](https://github.com/nuxt/ui/commit/5c12d428c4e39a5c28b5d0107c0091f8299bca50))
* **SelectMenu:** display `modelValue` even if false ([813fdfd](https://github.com/nuxt/ui/commit/813fdfd646dd4f2cb574653dc6a4e993f5025e10))
* **SelectMenu:** input before empty ([bedb863](https://github.com/nuxt/ui/commit/bedb863fc68fd8b687a5094aa16da6aed21b5959))
* **Select:** missing comma in `&nbsp;` ([c00ec5e](https://github.com/nuxt/ui/commit/c00ec5e2f255d83296cfd71f991cca04b00bfa26))
* **Select:** wrong button group variants ([5b2e7d8](https://github.com/nuxt/ui/commit/5b2e7d8bad6531795c00cdaa37e21d769dee452e))
* **Skeleton:** increase gray on light mode ([3cdbb27](https://github.com/nuxt/ui/commit/3cdbb276357a2a167079507975b285f9c714462f))
* specify pnpm version ([#85](https://github.com/nuxt/ui/issues/85)) ([e5f0063](https://github.com/nuxt/ui/commit/e5f0063dbac29f7d27d8ad5a3d42a4c7ee71dcab))
* **Switch:** improve sizes ([3a89661](https://github.com/nuxt/ui/commit/3a89661c663998b1de440f3f9925564434b43f2e))
* **Tabs:** `force-mount` content ([d294931](https://github.com/nuxt/ui/commit/d2949310eeeea323b1d066f2ccf34b7597b12e32))
* **Tabs:** `horizontal` orientation ([1e65933](https://github.com/nuxt/ui/commit/1e65933d9ca12b91b24e58ddd1273848fe11057c))
* **Tabs:** add missing slots definition ([b78ca9c](https://github.com/nuxt/ui/commit/b78ca9c56a60941d6a2a1d1c6e2234fbc5980e7d))
* **Tabs:** align `link` variant left when vertical ([9d5f9a7](https://github.com/nuxt/ui/commit/9d5f9a70101bcc75f05dc59a3d4dc2d368106b5f))
* **Tabs:** broken design ([80a3a0c](https://github.com/nuxt/ui/commit/80a3a0c28f81656b8c144146b72ceca45d2e99b7))
* **Tabs:** improve config ([88eb4ca](https://github.com/nuxt/ui/commit/88eb4cac974194b13a34281f76d4771f125685a2))
* **Tabs:** missing props pick ([f086f26](https://github.com/nuxt/ui/commit/f086f2662e659e5522adcfbad453d4f44b9be9d1))
* **Tabs:** optional `items` ([20caea1](https://github.com/nuxt/ui/commit/20caea1cd7b896e443c846766865174234a25d20))
* **Tabs:** specific transition ([48ddf39](https://github.com/nuxt/ui/commit/48ddf39188467b3c4d346c22c0a60e4acd4b025d))
* **Tabs:** use `shrink-0` ([f8b50a3](https://github.com/nuxt/ui/commit/f8b50a357152a600ccab784796d8cf11e1eb039d))
* **Tabs:** use `transition-all` ([92e1d09](https://github.com/nuxt/ui/commit/92e1d09990d88ed43eec74d313f76a1c2b7eb565))
* **Tabs:** wrong text color with `pill` colored ([f70b639](https://github.com/nuxt/ui/commit/f70b63970a9791533f7ae29dfc56a12001119e2d))
* **templates:** add `error` in `AppConfig` type ([c7536a7](https://github.com/nuxt/ui/commit/c7536a7af963319ed6307701b38ff2b006b2a3ac))
* **templates:** dont override `AppConfig` type ([e151be4](https://github.com/nuxt/ui/commit/e151be4734d8c9a53cf33f6040994912cce24a67))
* **templates:** export types in dev mode ([1eaec0f](https://github.com/nuxt/ui/commit/1eaec0ff568bcdff78a0aae0fa824f8b7d1c63e6))
* **templates:** handle `-` in regexp ([0a00387](https://github.com/nuxt/ui/commit/0a00387688923fc0cfacbd70c335c664d8d04cc0))
* **templates:** import from `[#build](https://github.com/nuxt/ui/issues/build)/ui.css` no longer works ([eb85fa8](https://github.com/nuxt/ui/commit/eb85fa8353ac791b4c889ec103c7247e60bfd81a))
* **templates:** missing command in keyframes ([6a1b97a](https://github.com/nuxt/ui/commit/6a1b97add00e481bcc6b06d46e17f4d4f6a97468))
* **templates:** pass options to theme in dev mode ([5694823](https://github.com/nuxt/ui/commit/5694823a416fbb70d10702a023420837d31046d6))
* **templates:** unshift css ([e1ab903](https://github.com/nuxt/ui/commit/e1ab9031097d96f0459621c677e1522c49f9297d))
* **Textarea:** invalid `xs` size ([bed6252](https://github.com/nuxt/ui/commit/bed62520a988cc2e9337d3eb72f2e512df40cf14))
* **Textarea:** same `size` as input ([e398637](https://github.com/nuxt/ui/commit/e398637174008cc1bcb8519169bc3c539157cbae))
* **Toast:** add missing slots ([cfb4cfd](https://github.com/nuxt/ui/commit/cfb4cfdd7b81302fb3c3f9cd4b4e3a7c80e28779))
* **Toaster:** add missing transition on `translate` ([239e0a5](https://github.com/nuxt/ui/commit/239e0a5ac1315a37b52a16bb7a024cefa28dac23))
* **Toaster:** increase container height to prevent animation blink ([4dcb74e](https://github.com/nuxt/ui/commit/4dcb74e0a9feea074c6cb56aa73a28107deddc38))
* **Toaster:** proxy slot from `App` ([4b29828](https://github.com/nuxt/ui/commit/4b29828e9ddb2602ad7195a4c21ea7963377248e))
* **Toaster:** wrong leave animation when collapsed ([c3ed18b](https://github.com/nuxt/ui/commit/c3ed18beb64369fe8a5e0ffee0b749f40c9fc736))
* **Toast:** prevent progress bar to blink on leave ([83049fd](https://github.com/nuxt/ui/commit/83049fd23ed4eb829a64061a08be846aefab4b98))
* **Tooltip:** ensure default slot exists ([431255e](https://github.com/nuxt/ui/commit/431255e0fec90555f1b5e8e0fc1f039ed853eb75))
* **Tooltip:** missing conditions on slots ([d00084c](https://github.com/nuxt/ui/commit/d00084c54cebe239f738af0bfdc159124bb85903))
* **Tooltip:** missing root props proxy ([be8bf69](https://github.com/nuxt/ui/commit/be8bf691c3883845582b788b15c99be7fabb3c29))
* **Tooltip:** put back close animation ([34cf395](https://github.com/nuxt/ui/commit/34cf395f1a688404030c2a5f37417fae9b2f38d9))
* **Tooltip:** remove content max-width ([6c5354e](https://github.com/nuxt/ui/commit/6c5354edde42f51cc1c642c2ae5b17ea0886dae2))
* **Tooltip:** use `scale-in` / `scale-out` animations ([0450f6b](https://github.com/nuxt/ui/commit/0450f6b4a91d0af38ff6094fb590915b7164d9e0))
* **types:** useless import ([5f7872f](https://github.com/nuxt/ui/commit/5f7872f06e81e03443e2d1c27a654cfe32c55fb3))
* **useComponentIcons:** reactivity when using `defu` ([45454fa](https://github.com/nuxt/ui/commit/45454fae45b8571a9691284bd6a13a838e8ea1c9))

## [2.18.6](https://github.com/nuxt/ui/compare/v2.18.5...v2.18.6) (2024-09-23)


### Bug Fixes

* **components:** accept partial config in `ui` prop ([#2235](https://github.com/nuxt/ui/issues/2235)) ([eecf4f7](https://github.com/nuxt/ui/commit/eecf4f7ed8a32a874f00afd7bff2964a1366e0b5))
* **Modal/Slideover:** bind transition class to `TransitionChild` for Vue 3.5 ([#2227](https://github.com/nuxt/ui/issues/2227)) ([803c20a](https://github.com/nuxt/ui/commit/803c20ad92e8a31fefd6d300856735b0e9adbdf9))
* **SelectMenu:** wrong placeholder color with multiple ([#2218](https://github.com/nuxt/ui/issues/2218)) ([28ad5cf](https://github.com/nuxt/ui/commit/28ad5cf98251c6a8acec8d0bf4f0fd07ff6b7066))
* **Table:** colspan with expand ([#2217](https://github.com/nuxt/ui/issues/2217)) ([56118c4](https://github.com/nuxt/ui/commit/56118c4a794f3d763dad7b65e044814cf7ef11cf))
* **Tabs:** handle icon `margin` in RTL mode ([#2233](https://github.com/nuxt/ui/issues/2233)) ([ea05414](https://github.com/nuxt/ui/commit/ea05414930fe3f5e6805c8aa25bbe8f746bcc86e))
* **useFormField:** optional property access ([#2226](https://github.com/nuxt/ui/issues/2226)) ([0a054a5](https://github.com/nuxt/ui/commit/0a054a52b64b4f774041c40223e18e7e056cfd80))

## [2.18.5](https://github.com/nuxt/ui/compare/v2.18.4...v2.18.5) (2024-09-18)


### Features

* **Form:** add errors slot prop ([#2188](https://github.com/nuxt/ui/issues/2188)) ([67c6a74](https://github.com/nuxt/ui/commit/67c6a74ed15db1ee8a40e9c74ecfef0d3c3e374a))


### Bug Fixes

* **Button:** button link not showing disabled classes ([#2185](https://github.com/nuxt/ui/issues/2185)) ([e8ea84a](https://github.com/nuxt/ui/commit/e8ea84a5736759d953664f8f397a2339c212b294))
* **Carousel:** remove trailing space in next button icon ([#2088](https://github.com/nuxt/ui/issues/2088)) ([1282a5f](https://github.com/nuxt/ui/commit/1282a5f6c001aa05597d458800bafcf6b6419634))
* **FormGroup:** remove id when used with `RadioGroup` ([#2152](https://github.com/nuxt/ui/issues/2152)) ([7aec42c](https://github.com/nuxt/ui/commit/7aec42ca15aaa0ccc63c520b484cba203fd3232b))
* **Input:** avoid binding value when type is `file` ([#2047](https://github.com/nuxt/ui/issues/2047)) ([82313e8](https://github.com/nuxt/ui/commit/82313e862cbf21ae631156af4cd057f1383db634))
* **module:** allow CSS variables in tailwind colors ([#2014](https://github.com/nuxt/ui/issues/2014)) ([7f50c70](https://github.com/nuxt/ui/commit/7f50c7031fecb5ab26a6d0f58b576b2fd0860487))
* **module:** augment `@nuxt/schema` rather than `nuxt/schema` ([#2171](https://github.com/nuxt/ui/issues/2171)) ([ead904f](https://github.com/nuxt/ui/commit/ead904fd2f2bbb29fd60ccde063bf02daa2cbdbb))
* **module:** consider user tailwind `configPath` for module as string ([#2074](https://github.com/nuxt/ui/issues/2074)) ([e4ba4f7](https://github.com/nuxt/ui/commit/e4ba4f7c729f99dde51891636605793864812d30))
* **Pagination:** use links on prev and next button ([#2179](https://github.com/nuxt/ui/issues/2179)) ([c850f85](https://github.com/nuxt/ui/commit/c850f85aaa40c7abbe8cc4dc1bd4705bf7677390))
* **README:** update license link ([#2154](https://github.com/nuxt/ui/issues/2154)) ([8d79eea](https://github.com/nuxt/ui/commit/8d79eea19b3276b1f1e069d33b98b311e9b91cfd))
* **Slideover:** bind `rounded` class to panel ([#2187](https://github.com/nuxt/ui/issues/2187)) ([bf32baa](https://github.com/nuxt/ui/commit/bf32baaab01dc4150622f67b3b4a8d02d21b922c))
* **Slideover:** bind `shadow` class to panel ([#2201](https://github.com/nuxt/ui/issues/2201)) ([d22526c](https://github.com/nuxt/ui/commit/d22526c0c10735a92e63b7d086e7b8534a08d768))
* **Table:** checkbox can emit the `[@select](https://github.com/select)` event ([#2072](https://github.com/nuxt/ui/issues/2072)) ([b1f691f](https://github.com/nuxt/ui/commit/b1f691f28ca8c94f6b658dcb61eeff06951bd1d0))
* **Table:** select all rows reactivity issue ([#2200](https://github.com/nuxt/ui/issues/2200)) ([68124de](https://github.com/nuxt/ui/commit/68124de5106e55cb2987a6ba4ec1120d79b51788))
* **Tabs:** recalculate marker if items change ([#2101](https://github.com/nuxt/ui/issues/2101)) ([82c4926](https://github.com/nuxt/ui/commit/82c4926c090ce7fac48022a93b1b05b877bb48dd))
* **Textarea:** resolve row count calculation errors caused by scrollbar ([#2040](https://github.com/nuxt/ui/issues/2040)) ([8210936](https://github.com/nuxt/ui/commit/8210936f22fcf6b7eb5b9711e2c29be38956b8d6))

## [2.18.4](https://github.com/nuxt/ui/compare/v2.18.3...v2.18.4) (2024-08-05)


### Bug Fixes

* **Form:** submit event data ([#2012](https://github.com/nuxt/ui/issues/2012)) ([4d61936](https://github.com/nuxt/ui/commit/4d61936e7e90b664846a8f265825612c509511d7))
* **module:** handle nested colors from ui config ([#2008](https://github.com/nuxt/ui/issues/2008)) ([1cc7e2a](https://github.com/nuxt/ui/commit/1cc7e2a306e0f3f666b9a588f6ed02e7eabc0272))
* **module:** reduce css bundle size by fixing safelist regex ([#2005](https://github.com/nuxt/ui/issues/2005)) ([8ac9ca4](https://github.com/nuxt/ui/commit/8ac9ca49789a9a7281f7a40926e7e9a8068cc395))
* **module:** suffix types imports with `/index` ([7e37668](https://github.com/nuxt/ui/commit/7e37668940d06c5aa20b60d9bfd600d50a171014)), closes [#2018](https://github.com/nuxt/ui/issues/2018)
* **Tabs:** use `nextTick` before marker calc ([#2020](https://github.com/nuxt/ui/issues/2020)) ([9c04969](https://github.com/nuxt/ui/commit/9c049690227af8aba61a1f7c002b00c5dfeb63ff))
* **useFormGroup:** app config default input size ([#2011](https://github.com/nuxt/ui/issues/2011)) ([3485092](https://github.com/nuxt/ui/commit/3485092edb55f9ef2ca038a8c137431866d6c28a))

## [2.18.3](https://github.com/nuxt/ui/compare/v2.18.2...v2.18.3) (2024-07-30)


### Bug Fixes

* **Link:** define `rel` as any ([69f605f](https://github.com/nuxt/ui/commit/69f605fa724454e4be9e4cee9666a5d57f43a129))
* **types:** only use `.ts` for index ([93ddf1d](https://github.com/nuxt/ui/commit/93ddf1d60b0ea5f99f564f3d3969c397ad91cc72))

## [2.18.2](https://github.com/nuxt/ui/compare/v2.18.1...v2.18.2) (2024-07-25)


### Bug Fixes

* **Tabs:** add missing `UIcon` import ([4fd1be2](https://github.com/nuxt/ui/commit/4fd1be28922bf39584005c14982e5cd9a7d0c624))

## [2.18.1](https://github.com/nuxt/ui/compare/v2.18.0...v2.18.1) (2024-07-25)


### Bug Fixes

* **components:** use relative imports ([ea721a3](https://github.com/nuxt/ui/commit/ea721a3705cfbcef3075f8c9c1f4acf359974597))

## [2.18.0](https://github.com/nuxt/ui/compare/v2.17.0...v2.18.0) (2024-07-25)


### ⚠ BREAKING CHANGES

* **Icon:** migrate from `@egoist/tailwindcss-icons` to new `@nuxt/icon` (#1789)

### Features

* **Checkbox/Radio/RadioGroup:** add `help` slot ([c3122f7](https://github.com/nuxt/ui/commit/c3122f776daa6d68f201f22c37e0084aac37ed06)), closes [#1957](https://github.com/nuxt/ui/issues/1957)
* **CommandPalette:** handle `static` groups ([#1458](https://github.com/nuxt/ui/issues/1458)) ([b264ad2](https://github.com/nuxt/ui/commit/b264ad2ebdc8d4ee4aab5c994df968025207021f))
* **Icon:** migrate from `@egoist/tailwindcss-icons` to new `@nuxt/icon` ([#1789](https://github.com/nuxt/ui/issues/1789)) ([c904604](https://github.com/nuxt/ui/commit/c904604c23987c2535e0e91e9c4fec50477f6b34))
* **module:** improve app config types autocomplete ([#1870](https://github.com/nuxt/ui/issues/1870)) ([3f8ea5d](https://github.com/nuxt/ui/commit/3f8ea5dbded7b6836495103739688905ff26fe22))
* **RadioGroup:** add `selected` to label slot props ([#1587](https://github.com/nuxt/ui/issues/1587)) ([d18477d](https://github.com/nuxt/ui/commit/d18477def58171d51bdb7d00e31e2807b2e7015b))
* **SelectMenu:** add selected to `label` / `leading` / `trailing` slots props ([#1349](https://github.com/nuxt/ui/issues/1349)) ([6b216ca](https://github.com/nuxt/ui/commit/6b216cab1ba3bb69cb317254dfd562ab020c5e92))
* **SelectMenu:** handle function in `showCreateOptionWhen` prop ([#1853](https://github.com/nuxt/ui/issues/1853)) ([7e974b5](https://github.com/nuxt/ui/commit/7e974b55d72b8ac0ab42ef722a2d1904c3e4e091))
* **Skeleton:** add `as` prop ([#1955](https://github.com/nuxt/ui/issues/1955)) ([bce94db](https://github.com/nuxt/ui/commit/bce94db9fdb2c29a4f2e5981e5dce49a44a4ac8a))
* **Table:** expand row ([#1036](https://github.com/nuxt/ui/issues/1036)) ([7155318](https://github.com/nuxt/ui/commit/71553180294c53024c28de9bbebf4ea69f616da7))
* **Table:** handle `rowClass` property in `columns` ([#1632](https://github.com/nuxt/ui/issues/1632)) ([748e491](https://github.com/nuxt/ui/commit/748e49175da37b85bd18d62a8455875990866d5b))
* **Tabs:** handle `icon` in items ([#1798](https://github.com/nuxt/ui/issues/1798)) ([e8eb394](https://github.com/nuxt/ui/commit/e8eb3941ad4c1c306ccbe9e11d979d5f6c808330))


### Bug Fixes

* **Accordion:** truncate buttons ([5db18c0](https://github.com/nuxt/ui/commit/5db18c00565f9d2bb9f2768c2de2ab291a55bcae)), closes [#1909](https://github.com/nuxt/ui/issues/1909)
* **Alert/Notification:** missing margin on description ([2c55fb6](https://github.com/nuxt/ui/commit/2c55fb63365ee7cc1e993ebd5aa5f83ddadcd26a)), closes [#1959](https://github.com/nuxt/ui/issues/1959)
* **Breadcrumb:** use `rotate` on rtl icon ([53003fc](https://github.com/nuxt/ui/commit/53003fcd07d67d13ada0759ff6c5cd3635fba0e3))
* **ButtonGroup/FormGroup:** pass default sizes to children ([#1875](https://github.com/nuxt/ui/issues/1875)) ([6b6b03d](https://github.com/nuxt/ui/commit/6b6b03d59f5ab3096b731c59d18a1085d25b5e8e))
* **Carousel:** remove `mix-blend-overlay` on indicators ([#1714](https://github.com/nuxt/ui/issues/1714)) ([f74f1df](https://github.com/nuxt/ui/commit/f74f1df6ca5f93e11e542245b611c1aa7c4b8308))
* **FormGroup:** don't check for `error` slot so `help` slot can render ([#1888](https://github.com/nuxt/ui/issues/1888)) ([99c52e5](https://github.com/nuxt/ui/commit/99c52e50082d5e99440894c7a077a17510f0de50))
* **InputMenu/SelectMenu:** invalid `label` with `value-attribute` and async search ([4d5f250](https://github.com/nuxt/ui/commit/4d5f2509022e4fb74fc268d5479f7cc8f0415040)), closes [#1780](https://github.com/nuxt/ui/issues/1780)
* **InputMenu/SelectMenu:** prevent double filter with async search ([e2881d3](https://github.com/nuxt/ui/commit/e2881d3801c54c49d66d41d4f0ba312a7b3ebce7)), closes [#1966](https://github.com/nuxt/ui/issues/1966)
* **Link:** allow `ariaLabel` to be picked ([720c44d](https://github.com/nuxt/ui/commit/720c44dd5ee90bb3b30aef32f01ff6eae1397aa4)), closes [#1934](https://github.com/nuxt/ui/issues/1934)
* **Progress:** pass down attrs to `<progress>` to improve accessibility ([#1881](https://github.com/nuxt/ui/issues/1881)) ([abd13f1](https://github.com/nuxt/ui/commit/abd13f1f8fd4c8b10069174534c5fdec6c83576e))
* **RadioGroup:** allow boolean in `modelValue` prop ([#1913](https://github.com/nuxt/ui/issues/1913)) ([8eca5a0](https://github.com/nuxt/ui/commit/8eca5a0d627e22f42350a060f09c4e44b6de422f))

## [2.17.0](https://github.com/nuxt/ui/compare/v2.16.0...v2.17.0) (2024-06-13)


### Features

* **Alert:** add `actions` slot ([#1785](https://github.com/nuxt/ui/issues/1785)) ([c8dd71c](https://github.com/nuxt/ui/commit/c8dd71c4f5a5239811b07b50f1dc802101af07d5))
* **Form:** update and migrate `valibot` to v0.31.0 ([#1848](https://github.com/nuxt/ui/issues/1848)) ([1d5bd89](https://github.com/nuxt/ui/commit/1d5bd89d5881163fc6dc917e138b9d8304dff6c4))
* **Notification:** allow ring customization with `{color}` ([#1830](https://github.com/nuxt/ui/issues/1830)) ([3ebff4d](https://github.com/nuxt/ui/commit/3ebff4d133372e339e2c4c439576e9e192b29cc3))
* **Slideover:** handle `top` and `bottom` side ([#1834](https://github.com/nuxt/ui/issues/1834)) ([50ad14f](https://github.com/nuxt/ui/commit/50ad14f9dffe4f76bef888cd10d30b417c75bca5))
* **Tabs:** add `content` prop to avoid the render of the HTML markup ([#1831](https://github.com/nuxt/ui/issues/1831)) ([6e2678d](https://github.com/nuxt/ui/commit/6e2678d1d8a498322eb3eff909ccbba55e40a2b7))


### Bug Fixes

* **Alert/Notification:** use `div` for description ([e8898d1](https://github.com/nuxt/ui/commit/e8898d15a667ba66e78828315e3cc4e92845cd3f)), closes [#1551](https://github.com/nuxt/ui/issues/1551)
* **Alert:** base style not applied on icon ([#1859](https://github.com/nuxt/ui/issues/1859)) ([f65aefb](https://github.com/nuxt/ui/commit/f65aefb7067c1c64c1355b5d699129e716ef1281))
* **Breadcrumb:** allow `aria-current` to be overrideable ([ebfb835](https://github.com/nuxt/ui/commit/ebfb8350339725c0a6f88c73f16bff01d61538c2)), closes [#1856](https://github.com/nuxt/ui/issues/1856)
* **Carousel:** prevent mouse click when dragging ([#1781](https://github.com/nuxt/ui/issues/1781)) ([4f0d00f](https://github.com/nuxt/ui/commit/4f0d00f7a6eebf05adceaf1e7c2869ad91949cf3))
* **CommandPalette:** hide `empty-state` when `null` ([249bbd4](https://github.com/nuxt/ui/commit/249bbd49dc8420603e8d561543d237abeb400908)), closes [#1787](https://github.com/nuxt/ui/issues/1787)
* **Form:** maintain other errors when using `setErrors` with a path ([#1818](https://github.com/nuxt/ui/issues/1818)) ([06990be](https://github.com/nuxt/ui/commit/06990beabf67f668322b4d3fb2ec93cc4f3bdcd4))
* **Input:** hide wrapper when type is `hidden` ([#1797](https://github.com/nuxt/ui/issues/1797)) ([e7c2f78](https://github.com/nuxt/ui/commit/e7c2f7856c05ed96f48c83d64d8e1d3f41ab58fe))
* **Link:** typo in `exactHash` type ([581b470](https://github.com/nuxt/ui/commit/581b470cc79c2315bb2d56e02a7c134a7861c616)), closes [#1767](https://github.com/nuxt/ui/issues/1767)
* **SelectMenu:** wrong placeholder color when `modelValue` is an empty string ([9b9ccdb](https://github.com/nuxt/ui/commit/9b9ccdb59e98fed096dd18809af646b10de46b9f)), closes [#1862](https://github.com/nuxt/ui/issues/1862)
* **Select:** remove defaults for `value` and `text` ([6c124bb](https://github.com/nuxt/ui/commit/6c124bb1ac2fef116161da56a3a8e5f92144ce3a)), closes [#1702](https://github.com/nuxt/ui/issues/1702)

## [2.16.0](https://github.com/nuxt/ui/compare/v2.15.2...v2.16.0) (2024-05-07)


### ⚠ BREAKING CHANGES

* **Input:** redesign `file` type without absolute positioning (#1712)

### Features

* **InputMenu/SelectMenu:** allow lazy search ([#1705](https://github.com/nuxt/ui/issues/1705)) ([7e6ba78](https://github.com/nuxt/ui/commit/7e6ba786816516ab5007a2ff15fc974cfdd796ab))
* **module:** HMR support with `@nuxtjs/tailwindcss` ([#1665](https://github.com/nuxt/ui/issues/1665)) ([821e15b](https://github.com/nuxt/ui/commit/821e15b696b03d0f5e20e001d39f86a8b3cec426))
* **Table:** allow providing a `<caption>` ([#1680](https://github.com/nuxt/ui/issues/1680)) ([3fca668](https://github.com/nuxt/ui/commit/3fca66857d3616bf24a1b0579c90179a7883869d))
* **useToast:** allow clearing all notifications ([#1695](https://github.com/nuxt/ui/issues/1695)) ([82d619b](https://github.com/nuxt/ui/commit/82d619b2a75b9d08f3f5b314d37c30d77d8341e9))


### Bug Fixes

* **Breadcrumb:** pass `click` event to `ULink` ([5481dab](https://github.com/nuxt/ui/commit/5481dab53dbe0b28188b4a16811f3e8816d93edf))
* **Input:** redesign `file` type without absolute positioning ([#1712](https://github.com/nuxt/ui/issues/1712)) ([ed5c74d](https://github.com/nuxt/ui/commit/ed5c74dc17df784485eabc39c83e62ada9210a49))
* **Notification:** update timer when timeout prop changes ([#1673](https://github.com/nuxt/ui/issues/1673)) ([cba9ad7](https://github.com/nuxt/ui/commit/cba9ad78db58cb9228bb9c96f0469d43bde2bf3e))
* **Slideover:** export and clean types ([#1692](https://github.com/nuxt/ui/issues/1692)) ([bd3fa86](https://github.com/nuxt/ui/commit/bd3fa8658f84fb7bd96d322968462c5eaa987b86))
* **Table:** provide `aria-sort` for sortable table headings ([#1675](https://github.com/nuxt/ui/issues/1675)) ([6f60fa9](https://github.com/nuxt/ui/commit/6f60fa9a980020f6a5afc2916e699a7f9a47e8ce))

## [2.15.2](https://github.com/nuxt/ui/compare/v2.15.1...v2.15.2) (2024-04-12)


### Features

* **Accordion:** add `unmount` prop to allow lazy mounting for heavy components ([#1590](https://github.com/nuxt/ui/issues/1590)) ([91e5002](https://github.com/nuxt/ui/commit/91e50020507ac66992dfb52b3e0ad1a1ae5614b5))
* **Table:** add `checkbox` ui config ([#1409](https://github.com/nuxt/ui/issues/1409)) ([8b54660](https://github.com/nuxt/ui/commit/8b546600dbfbff187d9c5be1b35ea1772e94f83f))


### Bug Fixes

* **Breadcrumb:** missing `min-w-0` on wrapper to truncate ([9f01145](https://github.com/nuxt/ui/commit/9f01145bc674378371ff34d7110f3235b57d2459)), closes [#1650](https://github.com/nuxt/ui/issues/1650)
* **Carousel:** next and prev buttons disabled ([#1619](https://github.com/nuxt/ui/issues/1619)) ([e909884](https://github.com/nuxt/ui/commit/e909884d0327bfd7b4d5551382123f8998beff6a))
* **Popover/Dropdown:** prevent unintended closure on touchstart in mobile devices ([#1609](https://github.com/nuxt/ui/issues/1609)) ([2392b4a](https://github.com/nuxt/ui/commit/2392b4aa405430fc22766f130448a7cc5ced9a3a))
* **Slideover:** remove dynamic component when closing ([#1615](https://github.com/nuxt/ui/issues/1615)) ([58faa10](https://github.com/nuxt/ui/commit/58faa1053b9be3f627c3fcff1bcaa14850bb9e7f))
* **Slideover:** wait for transition to complete to reset state ([#1624](https://github.com/nuxt/ui/issues/1624)) ([07a4d13](https://github.com/nuxt/ui/commit/07a4d13c0fcb05c87fb42e02a3a2d6c5c52ccf09))

## [2.15.1](https://github.com/nuxt/ui/compare/v2.15.0...v2.15.1) (2024-04-02)


### Features

* **Avatar:** add `as` prop to use `NuxtImg` underneath ([49b73aa](https://github.com/nuxt/ui/commit/49b73aa024be14a9aa150a2804f4dcb18542fa49)), closes [#1577](https://github.com/nuxt/ui/issues/1577)


### Bug Fixes

* **Checkbox:** `[@change](https://github.com/change)` event value ([#1580](https://github.com/nuxt/ui/issues/1580)) ([c98d6e3](https://github.com/nuxt/ui/commit/c98d6e31c0e3f46b97957d5cf3de7f9da1f70c58))
* **Divider:** add `w-full` only on horizontal wrapper ([#1565](https://github.com/nuxt/ui/issues/1565)) ([bd8b737](https://github.com/nuxt/ui/commit/bd8b737642280e6a83b67f9a27dd7a823a77e963))
* **Dropdown:** missing `mouseenter` event on container ([7288953](https://github.com/nuxt/ui/commit/72889535e7e9763e7ebf59498f22c39bf09d6477))
* **Input/SelectMenu:** handle `file` type and `change` events ([#1570](https://github.com/nuxt/ui/issues/1570)) ([878f707](https://github.com/nuxt/ui/commit/878f7078a28c5e70a662682d1293db466d518c7d))
* **Popover:** missing `mouseenter` event on container ([8517897](https://github.com/nuxt/ui/commit/8517897c34adaa9e3624f867b43106deb59fcbe8)), closes [#1564](https://github.com/nuxt/ui/issues/1564)

## [2.15.0](https://github.com/nuxt/ui/compare/v2.14.2...v2.15.0) (2024-03-26)


### ⚠ BREAKING CHANGES

* **forms:** normalize input emits (#1560)

### Features

* **Accordion:** emit `open` event with index ([#1559](https://github.com/nuxt/ui/issues/1559)) ([224ec3c](https://github.com/nuxt/ui/commit/224ec3c1fbfb9875398d3af60e5fe49e47ce55b1))
* **Alert:** add `icon` & `avatar` slots ([#1401](https://github.com/nuxt/ui/issues/1401)) ([cee3e12](https://github.com/nuxt/ui/commit/cee3e126a472735c0e484de315868bb28287164f))
* **Slideover:** open programmatically ([#1465](https://github.com/nuxt/ui/issues/1465)) ([e769759](https://github.com/nuxt/ui/commit/e7697595c8769ceea61690f6c2f294206de50972))
* **Toggle:** add `loading` prop ([#1546](https://github.com/nuxt/ui/issues/1546)) ([e1e05af](https://github.com/nuxt/ui/commit/e1e05af0bafd1e5d1b91f374562ed8d389fb0cae))


### Bug Fixes

* **ButtonGroup:** nested group elements ([#1530](https://github.com/nuxt/ui/issues/1530)) ([7658211](https://github.com/nuxt/ui/commit/765821153753d1a49276421511224336aebcdd2f))
* **Carousel:** add tab-based ARIA roles ([#1516](https://github.com/nuxt/ui/issues/1516)) ([e736eca](https://github.com/nuxt/ui/commit/e736ecafff59f9d4eb88b366ef1e9d26449b8ca3))
* **Checkbox:** bind `data-n-ids` to root element ([#1495](https://github.com/nuxt/ui/issues/1495)) ([a2b8b70](https://github.com/nuxt/ui/commit/a2b8b700df6ad0907a5d4d622d178d1345b55b83))
* **forms:** normalize input emits ([#1560](https://github.com/nuxt/ui/issues/1560)) ([92e7362](https://github.com/nuxt/ui/commit/92e736213b221d5ec8cfb8881fda4fc65ce7dfa0))
* **InputMenu:** trigger alignement on safari ([f4a48f6](https://github.com/nuxt/ui/commit/f4a48f6016ede664e4f46741e7811b0dbe0acfbe)), closes [#1505](https://github.com/nuxt/ui/issues/1505)
* opt in to `import.meta.*` properties ([#1561](https://github.com/nuxt/ui/issues/1561)) ([cc62e34](https://github.com/nuxt/ui/commit/cc62e345eb96a632730bed796c77afe7ecdadf2a))
* **Popover/Dropdown:** use `[@touchstart](https://github.com/touchstart).passive` instead of `[@touchstart](https://github.com/touchstart).prevent` ([#1520](https://github.com/nuxt/ui/issues/1520)) ([a563d8f](https://github.com/nuxt/ui/commit/a563d8fed44535107080fee094995d87ca5dc2b6))
* **SelectMenu:** `filteredOptions` might be undefined ([#1541](https://github.com/nuxt/ui/issues/1541)) ([b0ecac5](https://github.com/nuxt/ui/commit/b0ecac563c5702fe40cf42a8861b1d2d1366d423))
* **SelectMenu:** handle `Boolean` type as model value ([#1550](https://github.com/nuxt/ui/issues/1550)) ([c49f899](https://github.com/nuxt/ui/commit/c49f8999d319ec487672ebd68e8b3f0031843cd6))

## [2.14.2](https://github.com/nuxt/ui/compare/v2.14.1...v2.14.2) (2024-03-05)


### Bug Fixes

* **Alert:** improve `description` alignment when no title provided ([ca4f06a](https://github.com/nuxt/ui/commit/ca4f06a313314af5813007878a9b6c8f1003c6d1)), closes [#1408](https://github.com/nuxt/ui/issues/1408)
* **Checkbox:** label interaction without `FormGroup` ([#1427](https://github.com/nuxt/ui/issues/1427)) ([6e77f1d](https://github.com/nuxt/ui/commit/6e77f1d5144d7d87b0c76b43ecf3d731166c808b))
* **Dropdown:** active/inactive dropdown links ([#1407](https://github.com/nuxt/ui/issues/1407)) ([6a1142b](https://github.com/nuxt/ui/commit/6a1142b4032150def78c69080df455f7d2a25e7b))
* **Dropdown:** improve `hover` mode on touch devices ([70bf4a7](https://github.com/nuxt/ui/commit/70bf4a73921f47fcd41599874b595a6eed947f5a))
* **HorizontalNavigation:** add `relative` class to icon ([0a4a9e3](https://github.com/nuxt/ui/commit/0a4a9e3d2c4a7584570e4ab7ae6fe8265c960a33))
* **Modal:** remove `overflow-hidden` ([#1460](https://github.com/nuxt/ui/issues/1460)) ([002129c](https://github.com/nuxt/ui/commit/002129c29926df5a816288b916194ab28cf4c8a4))
* **Notification:** improve `description` alignment when no title provided ([9cce445](https://github.com/nuxt/ui/commit/9cce4456d03c52daca4d7347e60cbcd7f501317a))
* **Popover:** improve `hover` mode on touch devices ([b50fbcf](https://github.com/nuxt/ui/commit/b50fbcf760e908579e81f6e57234f2080e2bf035))
* **RadioGroup:** add missing `fieldset` config ([2d64b50](https://github.com/nuxt/ui/commit/2d64b50559946b166c02cfe921e63d746cdc09d4)), closes [#1472](https://github.com/nuxt/ui/issues/1472)
* **SelectMenu:** check `null` model value ([4b6e80e](https://github.com/nuxt/ui/commit/4b6e80e3646e263a83614830d9ec6adb0edf2ede)), closes [#1421](https://github.com/nuxt/ui/issues/1421)
* **Tooltip:** arrow not hidden on mobile ([272c19d](https://github.com/nuxt/ui/commit/272c19de708144b1b132b98a7287254974f4e144)), closes [#1470](https://github.com/nuxt/ui/issues/1470)
* **VerticalNavigation:** add `relative` class to icon ([0b29dd4](https://github.com/nuxt/ui/commit/0b29dd4ca560cac7d151132e086eab17c0498a5c)), closes [#1245](https://github.com/nuxt/ui/issues/1245)

## [2.14.1](https://github.com/nuxt/ui/compare/v2.14.0...v2.14.1) (2024-02-23)


### Bug Fixes

* **module:** revert tailwind config from [#1272](https://github.com/nuxt/ui/issues/1272) ([#1404](https://github.com/nuxt/ui/issues/1404)) ([ba15add](https://github.com/nuxt/ui/commit/ba15add4db5d2f84e987819628cbbf88edcbad57))

## [2.14.0](https://github.com/nuxt/ui/compare/v2.13.0...v2.14.0) (2024-02-22)


### Features

* **Carousel:** expose methods to allow autoplay ([41ecd2a](https://github.com/nuxt/ui/commit/41ecd2a3d553886db3e32d9f48a477268d93f3c6)), closes [#1300](https://github.com/nuxt/ui/issues/1300)
* **Divider:** handle `size` prop ([#1307](https://github.com/nuxt/ui/issues/1307)) ([cbeede6](https://github.com/nuxt/ui/commit/cbeede66bb3bd7778e03c19ebbf55bf7bd753cb8))
* **Form:** use nuxt `useId` to bind input labels ([#1211](https://github.com/nuxt/ui/issues/1211)) ([27c71fa](https://github.com/nuxt/ui/commit/27c71fa40ecb9f8524fee7f3d17a384bc8812d25))
* **Input:** handle type `file` ([946a39c](https://github.com/nuxt/ui/commit/946a39c73990dc352cf7b9a77bfaec339cdcab34)), closes [#563](https://github.com/nuxt/ui/issues/563)
* **Modal:** open programmatically ([#1319](https://github.com/nuxt/ui/issues/1319)) ([6f29c62](https://github.com/nuxt/ui/commit/6f29c620ab758e27be63f8af53674828b59fb6ed))
* **Table:** display progress bar when `loading` ([#1362](https://github.com/nuxt/ui/issues/1362)) ([3fe3521](https://github.com/nuxt/ui/commit/3fe35217cbc0cef7f41550c175e4e7ea2cc939a8))
* **Tabs:** add `unmount` prop as `false` by default ([843a978](https://github.com/nuxt/ui/commit/843a9786445f6170c1380e3b404151da52b5a154)), closes [#663](https://github.com/nuxt/ui/issues/663)
* **Textarea:** add `maxrows` prop to restrict autoresize ([#1302](https://github.com/nuxt/ui/issues/1302)) ([f643e7b](https://github.com/nuxt/ui/commit/f643e7b316639a79cf03da25250ab0fa85f466d5))


### Bug Fixes

* **Accordion:** style disclosure `div` after [#1199](https://github.com/nuxt/ui/issues/1199) ([882247e](https://github.com/nuxt/ui/commit/882247e5f40bf41fdfdffea501de5c898a7fb0b2))
* **Alert:** remove `required` title to prevent warning when using slot ([e545b6f](https://github.com/nuxt/ui/commit/e545b6f0a128475166dcea3c1028798b106805f3))
* **Card:** prevent `body` padding without default slot ([f682905](https://github.com/nuxt/ui/commit/f682905b26a22546634e9adc4b838a7741dbd7c9))
* **components:** hydration attribute mismatch with vue `3.4` ([#1199](https://github.com/nuxt/ui/issues/1199)) ([10db144](https://github.com/nuxt/ui/commit/10db14475f7a527180be3fcf33cc5d3af52452c9))
* **Form:** improve `validate` path type ([#1370](https://github.com/nuxt/ui/issues/1370)) ([5266591](https://github.com/nuxt/ui/commit/5266591c886422d5265e46e08e1276913d12bed1))
* **Form:** return false when silent validation fails ([#1371](https://github.com/nuxt/ui/issues/1371)) ([d4b6147](https://github.com/nuxt/ui/commit/d4b6147fcceb7ff9cebe1586bb3094b10f50acb5))
* **Link:** check `disabled` prop before navigating ([#1321](https://github.com/nuxt/ui/issues/1321)) ([ac42ec1](https://github.com/nuxt/ui/commit/ac42ec106ff259e1d44515e5fb3b5236559ac713))
* **Meter:** missing import of `Icon` component ([f8b296f](https://github.com/nuxt/ui/commit/f8b296fc60b93c4656fd397f8eb6b06b4a1dcd93)), closes [#1328](https://github.com/nuxt/ui/issues/1328)
* **module:** prevent tailwind warn with `bun` ([bb40c31](https://github.com/nuxt/ui/commit/bb40c3103174a039f65b31c65fcc5d40cb29ce6b)), closes [#809](https://github.com/nuxt/ui/issues/809)
* **module:** put back `all` option in icons plugin ([412cd75](https://github.com/nuxt/ui/commit/412cd75eddb6140d7d9b3358b04df1e61f22b481)), closes [#1237](https://github.com/nuxt/ui/issues/1237)
* **Notification:** remove `required` title to prevent warning when using slot ([aa2b1ca](https://github.com/nuxt/ui/commit/aa2b1cae8881dece9a629dc95a8f9df88f9bbd27))
* **Progress:** prevent `NaN` percent display when indeterminate ([a55a08a](https://github.com/nuxt/ui/commit/a55a08a91eca6f4c7ff3ad40ee566b6445d2dfd0))
* **RadioGroup:** pass `help` prop to radio children ([5a5b284](https://github.com/nuxt/ui/commit/5a5b284e967ca9cdb6c7df9809ed4f4569a65cfa)), closes [#1313](https://github.com/nuxt/ui/issues/1313)
* **SelectMenu:** revert component `is` after [#1199](https://github.com/nuxt/ui/issues/1199) ([d0f4530](https://github.com/nuxt/ui/commit/d0f4530e8572a08d544041dec1f24a51bbc3b1e8))
* **utils:** prevent merge of `popper` key ([9f35297](https://github.com/nuxt/ui/commit/9f352976ced5845a5fad00a6630d0166941a8a13)), closes [#1393](https://github.com/nuxt/ui/issues/1393)


### Reverts

* Revert "docs: add missing `overflow-hidden` on components" ([b893607](https://github.com/nuxt/ui/commit/b8936070f9e1f866a21d39f6c45140f86efebec4))

## [2.13.0](https://github.com/nuxt/ui/compare/v2.12.3...v2.13.0) (2024-01-30)


### ⚠ BREAKING CHANGES

* **VerticalNavigation:** use `Badge` component for consistency

### Features

* **Carousel:** new component ([#927](https://github.com/nuxt/ui/issues/927)) ([f37b043](https://github.com/nuxt/ui/commit/f37b0431382867c24a0eff511ae151115cdfa2a2))
* **Dropdown:** default delay from config ([c4a1c04](https://github.com/nuxt/ui/commit/c4a1c04174d612e8c4cdd430067a3bdf3d69f4bf))
* **Form:** handle multiple paths in `validate` ([#1273](https://github.com/nuxt/ui/issues/1273)) ([20ac4b3](https://github.com/nuxt/ui/commit/20ac4b3332267491067f3a5a393ca97e3ec6bab5))
* **HorizontalNavigation:** new component ([#1279](https://github.com/nuxt/ui/issues/1279)) ([b8007ba](https://github.com/nuxt/ui/commit/b8007bab5efde70a375d6e3b9be91a0b698485b1))
* **InputMenu:** handle `nullable` prop when clearing input ([5e49fb8](https://github.com/nuxt/ui/commit/5e49fb8736e01889b8f7a60cf0edc420e49fe52c))
* **Modal/Slideover:** emit `close-prevented` event ([#1207](https://github.com/nuxt/ui/issues/1207)) ([6faf15b](https://github.com/nuxt/ui/commit/6faf15bc7460d7473ec47de48e407d45cf7d2e26))
* **module:** add option to disable global css styles ([#1266](https://github.com/nuxt/ui/issues/1266)) ([f96eb5e](https://github.com/nuxt/ui/commit/f96eb5e8b794af75303a98fa38e5285bcf928614))
* **Popover:** default delay from config ([7f5711b](https://github.com/nuxt/ui/commit/7f5711bc76cc509079934fd15ebbccb82bced064))
* **Tooltip:** default delay from config ([3400b56](https://github.com/nuxt/ui/commit/3400b56d82c1713e67838ba246bba687f3056fe6))
* **VerticalNavigation:** use `Badge` component for consistency ([3e81eee](https://github.com/nuxt/ui/commit/3e81eee6e6dc066dda9e2270e183a76bc8695996))


### Bug Fixes

* **Breadrumb:** handle truncate ([5d3a962](https://github.com/nuxt/ui/commit/5d3a962782781e4204d24a2f240974612912f7ee))
* **Link:** propagate `active` prop to slot as `isActive` ([b76e761](https://github.com/nuxt/ui/commit/b76e761bbb98fe7bbd19fba16220e26fd96e9731))
* **Select:** consistent placeholder with input and textarea ([2cb41db](https://github.com/nuxt/ui/commit/2cb41db111da79f4f3f8ccd825071820050ba885)), closes [#1276](https://github.com/nuxt/ui/issues/1276)
* **Slideover:** handle translate in RTL mode ([#1259](https://github.com/nuxt/ui/issues/1259)) ([ea58c88](https://github.com/nuxt/ui/commit/ea58c88baab3a0684e5b0140895ee630087ea044))

## [2.12.3](https://github.com/nuxt/ui/compare/v2.12.2...v2.12.3) (2024-01-18)


### Bug Fixes

* **link:** import type from `[#vue](https://github.com/nuxt/ui/issues/vue)-router` ([79ec3fd](https://github.com/nuxt/ui/commit/79ec3fd031e28d15854e2f0d4fb978df337e43d5)), closes [#1253](https://github.com/nuxt/ui/issues/1253)

## [2.12.2](https://github.com/nuxt/ui/compare/v2.12.1...v2.12.2) (2024-01-18)


### Bug Fixes

* **link:** improve nuxt link `rel` type ([05e90aa](https://github.com/nuxt/ui/commit/05e90aa1d13ab1772189d33278f482405ff88975))

## [2.12.1](https://github.com/nuxt/ui/compare/v2.12.0...v2.12.1) (2024-01-18)


### Bug Fixes

* **Button:** inherit nuxt link props without breaking `nuxt-component-meta` ([d3e19dc](https://github.com/nuxt/ui/commit/d3e19dc65a530201c3adc7738e95e5a09b0a9274)), closes [#578](https://github.com/nuxt/ui/issues/578)
* **Button:** pass-through nuxt link props to `ULink` ([a44bfc8](https://github.com/nuxt/ui/commit/a44bfc85114bed15ed25bb8c79d7ed52adc8d43c))
* **InputMenu:** take `option-attribute` into account to display label ([1a93791](https://github.com/nuxt/ui/commit/1a937919a26546cfd7edb3f6a11ef790d401999d))
* **Link:** prevent `type` bind on `<a>` ([b0df864](https://github.com/nuxt/ui/commit/b0df86437902696b594e5e7042601506a8bf4436))
* **SelectMenu:** take `option-attribute` into account to display label ([b9fe74b](https://github.com/nuxt/ui/commit/b9fe74bca5f48555e76c16237c2acc868f69e243)), closes [#1151](https://github.com/nuxt/ui/issues/1151)
* **Tooltip:** typo in kbd component ([4405d32](https://github.com/nuxt/ui/commit/4405d3239f7e19d399659347f079555318b3231b))

## [2.12.0](https://github.com/nuxt/ui/compare/v2.11.1...v2.12.0) (2024-01-09)


### ⚠ BREAKING CHANGES

* **Card:** remove `overflow-hidden` on wrapper

### Features

* **Breadcrumb:** handle `labelClass` and merge `iconClass` ([f623ec1](https://github.com/nuxt/ui/commit/f623ec1130edf448988784b36c15a850470685c4))
* **Dropdown:** handle `labelClass` and merge `iconClass` ([1c9835d](https://github.com/nuxt/ui/commit/1c9835d7f149231cf2e3e053e5ea08eceeaaa61d)), closes [#716](https://github.com/nuxt/ui/issues/716)
* **Dropdown:** handle manual mode ([3844714](https://github.com/nuxt/ui/commit/38447146445618a1310a6315c608f4cd21069e17)), closes [#1143](https://github.com/nuxt/ui/issues/1143)
* **Form:** expose submit function ([#1186](https://github.com/nuxt/ui/issues/1186)) ([4a25a12](https://github.com/nuxt/ui/commit/4a25a12390f8ecae83c1081c89eba99a8fda14f8))
* **InputMenu:** new component ([#1095](https://github.com/nuxt/ui/issues/1095)) ([6d8d82a](https://github.com/nuxt/ui/commit/6d8d82a265692aaee556e40b09e4b3048ae044da))
* **Pagination:** add `disabled` prop ([0976833](https://github.com/nuxt/ui/commit/0976833753cd2140649bc324f53a263d4e09ecff)), closes [#1189](https://github.com/nuxt/ui/issues/1189)
* **Popover:** open and close events ([#1038](https://github.com/nuxt/ui/issues/1038)) ([f32f578](https://github.com/nuxt/ui/commit/f32f578125c12b35e59db2f7981c8b1b5a146397))
* **SelectMenu:** add `empty` slot when no options ([5d1919a](https://github.com/nuxt/ui/commit/5d1919a5381b316637d50405d287428f67f2b9cc)), closes [#1089](https://github.com/nuxt/ui/issues/1089)
* **SelectMenu:** allow control of search query ([f735db0](https://github.com/nuxt/ui/commit/f735db04d62fca678ca30ecd565b32e70bcda3e0)), closes [#1174](https://github.com/nuxt/ui/issues/1174)
* **SelectMenu:** allow creating option despite search ([#1080](https://github.com/nuxt/ui/issues/1080)) ([0fdc8f7](https://github.com/nuxt/ui/commit/0fdc8f70b6a656114d30b07d682e4edcd61a23fb))
* **Table:** add `sort-mode` prop ([56e0c9a](https://github.com/nuxt/ui/commit/56e0c9a9a05e1e8491e2d460b8d51084bd2c1305)), closes [#1149](https://github.com/nuxt/ui/issues/1149)
* **Table:** add custom sort function to columns ([#1075](https://github.com/nuxt/ui/issues/1075)) ([4f3af6c](https://github.com/nuxt/ui/commit/4f3af6cfdb5213d1be3d2680fcf3a95f7b3bc0b3))
* **VerticalNavigation:** ability to add dividers ([#963](https://github.com/nuxt/ui/issues/963)) ([ffd20b3](https://github.com/nuxt/ui/commit/ffd20b3991a35ae7fa0e249fa009e330fd963705))
* **VerticalNavigation:** handle `labelClass` and merge `iconClass` ([a79f7c0](https://github.com/nuxt/ui/commit/a79f7c0a34c0414fe4feb95691e1f044b07ef087))
* **VerticalNavigation:** improve accessibility ([#948](https://github.com/nuxt/ui/issues/948)) ([29e64ca](https://github.com/nuxt/ui/commit/29e64ca963eeed1e82640957860f43391d8683ed))


### Bug Fixes

* **Alert:** always pass a function to actions click events ([5d78111](https://github.com/nuxt/ui/commit/5d781112f1eb464658c83047bf80c2ea7c9a2b05)), closes [#1197](https://github.com/nuxt/ui/issues/1197)
* **Card:** remove `overflow-hidden` on wrapper ([4124406](https://github.com/nuxt/ui/commit/412440603206151d63b04ffe6bed1bbc5b0e6615)), closes [#806](https://github.com/nuxt/ui/issues/806) [#1034](https://github.com/nuxt/ui/issues/1034)
* **config:** prevent class merge of `avatar` size ([b22bd70](https://github.com/nuxt/ui/commit/b22bd70d54e68c3217ba42690210084749fee656))
* **Dropdown:** improve placement with `hover` mode ([c6aa421](https://github.com/nuxt/ui/commit/c6aa4215d7f9003adeefa7cdff76c7a88715f20c)), closes [#1179](https://github.com/nuxt/ui/issues/1179)
* **Dropdown:** merge item `class` ([7151b7b](https://github.com/nuxt/ui/commit/7151b7b97d42f389506521044ebaffa8a299e7fb)), closes [#1157](https://github.com/nuxt/ui/issues/1157)
* **Form:** invalid errors when using `clear` by path ([#1165](https://github.com/nuxt/ui/issues/1165)) ([97a3975](https://github.com/nuxt/ui/commit/97a39751977bf1e942e2bafd5839141383b7af2f))
* **Form:** memory leak ([#1185](https://github.com/nuxt/ui/issues/1185)) ([ea2a24b](https://github.com/nuxt/ui/commit/ea2a24b5fe6ddc87e6eb951a662ce8b84b9d987f))
* **forms:** dont disable inputs and selects on `loading` ([3258167](https://github.com/nuxt/ui/commit/3258167a1431b664cd1dcc925a4b3fe06a996831)), closes [#1117](https://github.com/nuxt/ui/issues/1117)
* **Link:** handle `active` override when value is false ([83631cc](https://github.com/nuxt/ui/commit/83631ccbca1364f012b0c2899f97e2166dd1d360))
* **Popover:** allow manual mode without blocking normal behaviour ([3334e2a](https://github.com/nuxt/ui/commit/3334e2af3de2844de08ee530e62f2e4e2fd7ed24))
* **Popover:** improve placement with `hover` mode ([bc00f9c](https://github.com/nuxt/ui/commit/bc00f9c4b25dd4b99cb6e53014624f41ee929654)), closes [#781](https://github.com/nuxt/ui/issues/781)
* **RadioGroup:** pass `option.disabled` to children ([0c8ab9d](https://github.com/nuxt/ui/commit/0c8ab9d98e494c49cceac111edc0606ee4d63638)), closes [#1109](https://github.com/nuxt/ui/issues/1109)
* **SelectMenu:** input border focus after `tailwindcss` 3.4 ([e8f573b](https://github.com/nuxt/ui/commit/e8f573b6bb32a22873d9f93b40883ca12b481d7e))
* **Table:** display nothing instead of error when key is missing ([00d0fd5](https://github.com/nuxt/ui/commit/00d0fd59192cc171abb3d2ddaee46b2b9fa9422f)), closes [#1173](https://github.com/nuxt/ui/issues/1173)
* **Table:** respect sort prop updates from parent component ([#1208](https://github.com/nuxt/ui/issues/1208)) ([c6841d0](https://github.com/nuxt/ui/commit/c6841d06a48ffef95d238f94a4822a1e48b85422))
* **Toggle:** add missing `change` event ([4c84839](https://github.com/nuxt/ui/commit/4c84839a0183756b9f8df8674aace8cd40e44dcd)), closes [#1113](https://github.com/nuxt/ui/issues/1113)
* update vue and fix type issues ([#1112](https://github.com/nuxt/ui/issues/1112)) ([5c99ae1](https://github.com/nuxt/ui/commit/5c99ae131d1a50a8db21f1d5794a06080c515831))
* **useShortcuts:** include `contenteditable="plaintext-only"` elements in `usingInput` ([#1159](https://github.com/nuxt/ui/issues/1159)) ([648eec3](https://github.com/nuxt/ui/commit/648eec31b99fcffb65c042e0a5587da941c8e90f))
* **useShortcuts:** invalid code after [#1159](https://github.com/nuxt/ui/issues/1159) ([56e1fed](https://github.com/nuxt/ui/commit/56e1fed373786fc158ca9da9f02a9ec4e273afce))


### Reverts

* Revert "docs: pull `nuxt/ui-pro` docs from `main` branch" ([d0ce8ee](https://github.com/nuxt/ui/commit/d0ce8ee1c4a3d7b2285885d76e02e03168011110))

## [2.11.1](https://github.com/nuxt/ui/compare/v2.11.0...v2.11.1) (2023-12-11)


### Bug Fixes

* **Breadcrumb:** handle divider in rtl ([#1049](https://github.com/nuxt/ui/issues/1049)) ([e53cdea](https://github.com/nuxt/ui/commit/e53cdeaf0b3746da76cb6a658a5f71064d97fc9a))
* **CommandPalette:** improve performances and avoid multiple recompute ([db508b2](https://github.com/nuxt/ui/commit/db508b218f5277b2522566f790bd268eae2ee1e5))
* **CommandPalette:** missing right padding on input with close button ([ad33b26](https://github.com/nuxt/ui/commit/ad33b26729b1bf3d21f8d480e04c197f4fbb6119))
* **components:** move remaining classes to config ([#1039](https://github.com/nuxt/ui/issues/1039)) ([e408eab](https://github.com/nuxt/ui/commit/e408eabd8b841cdf8c71ce27c35c9675f2db8625))
* **module:** prevent class merging on `default` children ([f07968a](https://github.com/nuxt/ui/commit/f07968afef263d38183ce6c9cd9185ef7eee0494)), closes [#1076](https://github.com/nuxt/ui/issues/1076)
* **Notification:** handle dynamic backgrounds ([#1063](https://github.com/nuxt/ui/issues/1063)) ([1f0f618](https://github.com/nuxt/ui/commit/1f0f6181db7fa1ab45b8f7fec8df1cedccaec688))
* **RadioGroup:** props reactivity issues ([#1065](https://github.com/nuxt/ui/issues/1065)) ([7196d81](https://github.com/nuxt/ui/commit/7196d81b4cecf1711a01bed5fed1236ab3b2398b))
* **types:** favor `Record<string, any>>` instead of `object` ([4d72a75](https://github.com/nuxt/ui/commit/4d72a758fad5cffa09f3aaf6b3df9baf7edc2a9f))
* **types:** improve with strict mode ([#1041](https://github.com/nuxt/ui/issues/1041)) ([4a9b66a](https://github.com/nuxt/ui/commit/4a9b66aeb32a332e2d5be7e236e5d4567044b3e2))
* **types:** workaround for `popper` weak type ([5718dfd](https://github.com/nuxt/ui/commit/5718dfd69a7040987354485b30f7da7aee342abb)), closes [#644](https://github.com/nuxt/ui/issues/644)


### Reverts

* Revert "chore(deps): pin `vitest`" ([6984989](https://github.com/nuxt/ui/commit/6984989a2c20fbde177d1e64ea1a7cae07f03c4d))

## [2.11.0](https://github.com/nuxt/ui/compare/v2.10.0...v2.11.0) (2023-11-23)


### Features

* **Breadcrumb:** new component ([#506](https://github.com/nuxt/ui/issues/506)) ([a35bfc7](https://github.com/nuxt/ui/commit/a35bfc734372cd24a8f86fca7b69f091051ce918))
* **Checkbox:** config `label`, `required` and `help` size ([a1b38c4](https://github.com/nuxt/ui/commit/a1b38c4b66a16fefe8b514ec699a84309fcb7225))
* **Chip:** new component ([#886](https://github.com/nuxt/ui/issues/886)) ([d4f1b5e](https://github.com/nuxt/ui/commit/d4f1b5ef82f58c2df4dd9491ceb61b55da7ba4c3))
* **FormGroup:** add eager validation ([#992](https://github.com/nuxt/ui/issues/992)) ([d39e2de](https://github.com/nuxt/ui/commit/d39e2de935bcbbaf86c4b4b368e81bb08859b2e6))
* **Icon:** switch to `nuxt-icon` with `dynamic` prop or app config ([#862](https://github.com/nuxt/ui/issues/862)) ([c601fc6](https://github.com/nuxt/ui/commit/c601fc6c5583763a2cdf6c575dda55c46311612a))
* **module:** allow options override of `@egoist/tailwindcss-icons` plugin ([#1013](https://github.com/nuxt/ui/issues/1013)) ([ec58948](https://github.com/nuxt/ui/commit/ec58948153eb9c3048c41187ae505072a817b746))
* **Notification:** customize default timeout ([#1003](https://github.com/nuxt/ui/issues/1003)) ([83c3be7](https://github.com/nuxt/ui/commit/83c3be716aa42eee70a1bbc3b8a28b7fa483c9bf))
* **Popover:** ability to add overlay ([#1014](https://github.com/nuxt/ui/issues/1014)) ([06d4510](https://github.com/nuxt/ui/commit/06d4510d1c485ede49d1572454aeb8581384626e))
* **SelectMenu:** allows to clear search query on close ([#968](https://github.com/nuxt/ui/issues/968)) ([11ccbbb](https://github.com/nuxt/ui/commit/11ccbbb24ef61e6bd3bb703f950955dd21d6a3eb))
* **Textarea:** add default slot for complex usages ([55697e6](https://github.com/nuxt/ui/commit/55697e601e9b94e2159aa27613edd7265d5d06af)), closes [#971](https://github.com/nuxt/ui/issues/971)
* **Toggle:** add `size` prop ([#950](https://github.com/nuxt/ui/issues/950)) ([3c71bf3](https://github.com/nuxt/ui/commit/3c71bf36b0232745765c6860af2be7f44bf948a0))
* **types:** support custom values from `app.config.ts` ([#863](https://github.com/nuxt/ui/issues/863)) ([7339324](https://github.com/nuxt/ui/commit/7339324355362eebd30707fdd1944270e41525f4))


### Bug Fixes

* **Alert:** improve config options ([91511b9](https://github.com/nuxt/ui/commit/91511b921d65150f8da9c71e361d305477234f84)), closes [#760](https://github.com/nuxt/ui/issues/760)
* **Alert:** prevent `gap` when no close button or action ([9a1a1b8](https://github.com/nuxt/ui/commit/9a1a1b8caf1c040c458230458b9fa9cbfb32a1bb)), closes [#831](https://github.com/nuxt/ui/issues/831)
* **ButtonGroup:** handle components with children ([#999](https://github.com/nuxt/ui/issues/999)) ([f4be95d](https://github.com/nuxt/ui/commit/f4be95dcf5a07c964ae9f2555070d437e0388c13))
* **CommandPalette:** activate first option after async search ([#981](https://github.com/nuxt/ui/issues/981)) ([a975939](https://github.com/nuxt/ui/commit/a97593985c93d4cc30ceff0e3bdf8070f17b63f6))
* **defineShortcuts:** support minus `-` key ([#962](https://github.com/nuxt/ui/issues/962)) ([de38afd](https://github.com/nuxt/ui/commit/de38afd97b7bfd9af2619a17a42f27177abfec7e))
* **Dropdown:** pass event to `click` function ([60fa2be](https://github.com/nuxt/ui/commit/60fa2beed0ef0dbac6429033cc96803edf847120))
* **Dropdown:** use `NuxtLink` with `custom` prop to close on select ([f323379](https://github.com/nuxt/ui/commit/f3233799096b18b1d6c86391799a7c98a110fa4d)), closes [#899](https://github.com/nuxt/ui/issues/899)
* **FormGroup:** hydration mismatch on inputId ([#942](https://github.com/nuxt/ui/issues/942)) ([a3046aa](https://github.com/nuxt/ui/commit/a3046aa25626ca50e9d9fc6288321940445e88a1))
* **FormGroup:** remove inputId if the input is a fieldset ([#914](https://github.com/nuxt/ui/issues/914)) ([e81d5cf](https://github.com/nuxt/ui/commit/e81d5cf99831cfc320049051eeaf36f15951282b))
* **Input/Textarea:** add `v-model` modifiers ([#856](https://github.com/nuxt/ui/issues/856)) ([68f6956](https://github.com/nuxt/ui/commit/68f6956d6e0cb5155e19b8d464a42953b8e30475))
* **Link:** handle `active` state when `to` prop is not provided ([6cc77a3](https://github.com/nuxt/ui/commit/6cc77a3e6cbb263b649de0ea044894e0b7c4258a)), closes [#988](https://github.com/nuxt/ui/issues/988)
* **Link:** reactivity issue with `active` prop ([15a40f5](https://github.com/nuxt/ui/commit/15a40f53f218bbe768262efc03dd7eaaf147ed6e)), closes [nuxt/nuxt.com#1432](https://github.com/nuxt/nuxt.com/issues/1432)
* **module:** `boolean` types and bump nuxt to `3.8.2` ([#1006](https://github.com/nuxt/ui/issues/1006)) ([ca62ce1](https://github.com/nuxt/ui/commit/ca62ce13d3238819475528de0340416e6db9e5e6))
* **module:** use correct alias for `[#ui](https://github.com/nuxt/ui/issues/ui)-colors` ([#913](https://github.com/nuxt/ui/issues/913)) ([c84438f](https://github.com/nuxt/ui/commit/c84438f491e7e3f8af5c6d892a2141b9ada2c155))
* **Notification:** improve config options ([7cb987d](https://github.com/nuxt/ui/commit/7cb987de42ad89efc227eef47a8e06e7bc93206f))
* **Notification:** prevent `gap` when no close button or action ([ded6a7f](https://github.com/nuxt/ui/commit/ded6a7f73d9ea57b5e771ce192c9ee36e6f98bba))
* **Notifications:** teleport to `body` ([#909](https://github.com/nuxt/ui/issues/909)) ([8451f4d](https://github.com/nuxt/ui/commit/8451f4d9bbe51972688966f529cf0713060adb7a))
* **Progress:** percentage calculation ([#939](https://github.com/nuxt/ui/issues/939)) ([c55871b](https://github.com/nuxt/ui/commit/c55871b8449e9947e84ecb2f9667eea287b579e6))
* **Radio:** prevent `help` text from inlining with label ([#894](https://github.com/nuxt/ui/issues/894)) ([a2d70f0](https://github.com/nuxt/ui/commit/a2d70f04e98ce181ac217eaf6b66a8728af95805))
* **SelectMenu:** fixes non-strings and nested searchable attributes ([#967](https://github.com/nuxt/ui/issues/967)) ([37fdf22](https://github.com/nuxt/ui/commit/37fdf224c07e47312c731b20080533ad7d8d786c))

## [2.10.0](https://github.com/nuxt/ui/compare/v2.9.0...v2.10.0) (2023-10-31)


### Features

* **CommandPalette:** handle `filter` attribute in groups ([#871](https://github.com/nuxt/ui/issues/871)) ([8ba2a79](https://github.com/nuxt/ui/commit/8ba2a791e4877682705bd752d4ab6f9c52d0b37b))
* **Divider:** new component ([#757](https://github.com/nuxt/ui/issues/757)) ([eb9ce6a](https://github.com/nuxt/ui/commit/eb9ce6a0ddb7d73e3d3accee000ac71c20b96d1b))
* **Form:** handle `[@error](https://github.com/error)` event ([#718](https://github.com/nuxt/ui/issues/718)) ([e16379f](https://github.com/nuxt/ui/commit/e16379fdbdff6c98e96dc03cc67f3912f2f61075))
* **Input/Textarea:** allow specifying autofocus delay for page transitions ([#816](https://github.com/nuxt/ui/issues/816)) ([8bfd359](https://github.com/nuxt/ui/commit/8bfd3591a624ad7b77bcd9d3c38961a1ba59f23c))
* **Meter:** new component ([#827](https://github.com/nuxt/ui/issues/827)) ([abbcc37](https://github.com/nuxt/ui/commit/abbcc37fbb4b52b1503a69f8312cbecfe222f675))
* **Pagination:** add first and last page buttons ([#842](https://github.com/nuxt/ui/issues/842)) ([c5ce997](https://github.com/nuxt/ui/commit/c5ce997ba9d7abdb8282fcd34b88c380a7a4c592))
* **Popover:** manual mode & horizontal offset ([#781](https://github.com/nuxt/ui/issues/781)) ([92b8618](https://github.com/nuxt/ui/commit/92b86186e7b8a987eec1da9cf45a0ec378d421cf))
* **popper:** `arrow` option & docs consistency across components ([#875](https://github.com/nuxt/ui/issues/875)) ([f785ecd](https://github.com/nuxt/ui/commit/f785ecd46fdff77ecb8579d8a7edc463bcce2407))
* **Progress:** new component ([#697](https://github.com/nuxt/ui/issues/697)) ([2c5559b](https://github.com/nuxt/ui/commit/2c5559b73ea22f1021c18c2561de1e6cd6f9741f))
* **RadioGroup:** configurable label size ([#881](https://github.com/nuxt/ui/issues/881)) ([5a2644b](https://github.com/nuxt/ui/commit/5a2644b329dd1bb85a8ca70f849e108dbb93c776))
* **RadioGroup:** new component ([#730](https://github.com/nuxt/ui/issues/730)) ([23d5dc7](https://github.com/nuxt/ui/commit/23d5dc7b981d56127dd2bd3f03d752a76f36653c))
* **Range:** add `2xs`, `xs`, `xl` and `2xl` sizes to match progress component ([3cb3914](https://github.com/nuxt/ui/commit/3cb3914386e465180337ff8bf3f78e07a14bbafb)), closes [#673](https://github.com/nuxt/ui/issues/673)
* **Table:** add `v-model:sort` prop ([#803](https://github.com/nuxt/ui/issues/803)) ([9f4d88e](https://github.com/nuxt/ui/commit/9f4d88e0aa7ec8cbbdae3fccd372d8c5e81d7ad0))
* **Tooltip:** adding option to show popper arrow ([#868](https://github.com/nuxt/ui/issues/868)) ([4ce2374](https://github.com/nuxt/ui/commit/4ce23746da27ad0ef9b1833e41105165045f1cb8))


### Bug Fixes

* **Accordion:** toggle correct element when keyboard press ([#805](https://github.com/nuxt/ui/issues/805)) ([96296c3](https://github.com/nuxt/ui/commit/96296c3d388a4f65f08e4a062f720d37f2c84ebc))
* **Divider:** display a single border when no content ([3c5c338](https://github.com/nuxt/ui/commit/3c5c3389f8cdfcf9b70f1bb7d5553d0be55278a4))
* **Dropdown:** use `NuxtLink` instead of `ULink` ([#882](https://github.com/nuxt/ui/issues/882)) ([c37ad8b](https://github.com/nuxt/ui/commit/c37ad8b79a61ffccbb8959ca07fdf54923313e00))
* **FormGroup:** ensure size exists in config ([#695](https://github.com/nuxt/ui/issues/695)) ([f5f3388](https://github.com/nuxt/ui/commit/f5f33882f9ad48944e54f31cb784bedf26dccbd1))
* **Modal:** remove padding on mobile with `fullscreen` enabled ([550ac10](https://github.com/nuxt/ui/commit/550ac10e49d15e0b5435e031ec61f7defdaee445)), closes [#811](https://github.com/nuxt/ui/issues/811)
* **Notification:** add roles for accessibility ([#724](https://github.com/nuxt/ui/issues/724)) ([40f3b16](https://github.com/nuxt/ui/commit/40f3b161003f71ecacf57b9641de66acd14e3fab))
* **Table:** enable sorting for nested column keys ([#835](https://github.com/nuxt/ui/issues/835)) ([b4f7b03](https://github.com/nuxt/ui/commit/b4f7b035f7e802427e57fc7359020648a23eb71e))
* **Table:** prevent `[@select](https://github.com/select)` event call when selecting all rows ([#838](https://github.com/nuxt/ui/issues/838)) ([51f4d54](https://github.com/nuxt/ui/commit/51f4d549998c0d570adc843e1f3835cbd163ae69))
* **Tabs:** truncate buttons content ([ddbb431](https://github.com/nuxt/ui/commit/ddbb4319539e9e306ed9fc6f4f2145f20f13683a)), closes [#796](https://github.com/nuxt/ui/issues/796)
* **types:** handle sub-objects in `app.config.ts` (button colors) ([7be2af7](https://github.com/nuxt/ui/commit/7be2af7127acba2e1228b7994ecd8eb40e5c376b)), closes [#858](https://github.com/nuxt/ui/issues/858)
* use explicit type imports ([#830](https://github.com/nuxt/ui/issues/830)) ([a8279d1](https://github.com/nuxt/ui/commit/a8279d1c97c2f2c6a5d9fd971abb27767b5beb4c))

## [2.9.0](https://github.com/nuxt/ui/compare/v2.8.1...v2.9.0) (2023-10-02)


### ⚠ BREAKING CHANGES

* **module:** use `tailwind-merge` for `app.config` & move config to components & type props (#692)

### Features

* **FormGroup:** add slots ([#714](https://github.com/nuxt/ui/issues/714)) ([2fc9385](https://github.com/nuxt/ui/commit/2fc938575d2e409ba9df9fb2ddb8d51d021a1756))
* **Link:** add `active` prop to override default behaviour ([#732](https://github.com/nuxt/ui/issues/732)) ([8257a11](https://github.com/nuxt/ui/commit/8257a11dcba9c34053f8061ed1383894d06b2a6c))
* **Link:** add `as` prop ([#535](https://github.com/nuxt/ui/issues/535)) ([e404912](https://github.com/nuxt/ui/commit/e40491208ac1096e505803072df0d9e2e771008e))
* **module:** use `tailwind-merge` for `app.config` & move config to components & type props ([#692](https://github.com/nuxt/ui/issues/692)) ([34d2f57](https://github.com/nuxt/ui/commit/34d2f57801d08d26262fdff4398ec3d3329b4bb0))
* remove `lodash-es` ([#648](https://github.com/nuxt/ui/issues/648)) ([d6476d1](https://github.com/nuxt/ui/commit/d6476d17f9b17317a7160271dacdb854f30237ae))
* **Table:** add ability to custom style for  `td` and  `tr` ([#741](https://github.com/nuxt/ui/issues/741)) ([874447c](https://github.com/nuxt/ui/commit/874447cb41a77868513459eee5d3301fe8b8e9a1))


### Bug Fixes

* **Accordion:** close other items in circular order ([#735](https://github.com/nuxt/ui/issues/735)) ([6887f73](https://github.com/nuxt/ui/commit/6887f732ee8e14625459a0576460523845cb0a6d))
* **FormGroup:** prevent input click from propagating to label ([#651](https://github.com/nuxt/ui/issues/651)) ([4c58330](https://github.com/nuxt/ui/commit/4c5833083f0840add52f3c67efc42b8db5687d37))
* **FormGroup:** use explicit label instead of implicit label ([#638](https://github.com/nuxt/ui/issues/638)) ([681f0e5](https://github.com/nuxt/ui/commit/681f0e5684feaad0c711130404751f2fd65ddbe4))
* **module:** move `@headlessui/tailwindcss` to plugins on module install ([3e647e4](https://github.com/nuxt/ui/commit/3e647e4af154dad7fa186f062ce984e4d8d0e202))
* **module:** retain props reactivity through `useUI` ([#745](https://github.com/nuxt/ui/issues/745)) ([109ec52](https://github.com/nuxt/ui/commit/109ec52d50b0b32b0f0b24ece5b92cd7bbce29da))
* **Pagination:** handle `max > 5` and `max` equal total pages ([#728](https://github.com/nuxt/ui/issues/728)) ([a071e4b](https://github.com/nuxt/ui/commit/a071e4b8755f5dbbdfd05985c8fcb65c3cdab3ec))
* **Range:** fix track pseudo-elements for mozilla ([#636](https://github.com/nuxt/ui/issues/636)) ([8955595](https://github.com/nuxt/ui/commit/8955595dc6904d0090ad7f82ed8b376a15e51f94))
* **SelectMenu:** handle numbers ([0544a01](https://github.com/nuxt/ui/commit/0544a01c5b7ae534a595e6c91d2884a601ae3185)), closes [#574](https://github.com/nuxt/ui/issues/574)
* **Table:** add missing classes in `app.config.ts` ([a603ea5](https://github.com/nuxt/ui/commit/a603ea56c165e9ad01482d092460da3991f3e41d)), closes [#655](https://github.com/nuxt/ui/issues/655)
* **Table:** select all rows without select listener ([#652](https://github.com/nuxt/ui/issues/652)) ([83d609d](https://github.com/nuxt/ui/commit/83d609d53067b2639a55a0e367a5e7adbd8a22fc))
* **Tabs:** add visible focus indicator on active tabs ([#690](https://github.com/nuxt/ui/issues/690)) ([be734fc](https://github.com/nuxt/ui/commit/be734fc026b75bc8c921e9401ba6e97f65356cec))
* **Tabs:** allow custom keys in `TabItem` ([#671](https://github.com/nuxt/ui/issues/671)) ([15e418e](https://github.com/nuxt/ui/commit/15e418e6c6f981afd2c0e8f27dedb303b8cbad70))
* **Tabs:** prevent focus of `TabPanel` with `tabindex="-1"` ([cbb2f28](https://github.com/nuxt/ui/commit/cbb2f28c3fd96e45c7af20675b5b67576ddc0d63))

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
