import { SITE_URL } from './site'

/**
 * Hand-authored OpenAPI description of the public surface of ui.nuxt.com.
 *
 * Nitro can generate one from the server handlers (`experimental.openAPI`), but
 * it lists every internal route (`/__nuxt_error`, `/api/_mdc/**`, the OAuth
 * metadata endpoints) and hardcodes a localhost `servers` entry when
 * prerendered, so agents would read a spec that mostly describes plumbing.
 *
 * The AI endpoints (`/api/ai`, `/api/chat`, `/api/completion`) are left out on
 * purpose: they back the documentation chat, are unauthenticated and metered
 * upstream, and documenting them would read as an invitation.
 *
 * Kept dependency-free on purpose.
 */

// OpenAPI ignores a header parameter named `Accept`, so the negotiation is
// described in prose and through the two response media types instead.
const MARKDOWN_DESCRIPTION = 'Every documentation page is available as Markdown. Append `.md` to the URL, or send `Accept: text/markdown` on the HTML URL. Known AI agent user agents receive Markdown by default.'

/** Nitro's JSON error payload, returned by every `/api/**` failure. */
function jsonError(description: string) {
  return {
    description,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' }
      }
    }
  }
}

function json(schemaRef: string, description: string) {
  return {
    description,
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${schemaRef}` }
      }
    }
  }
}

function markdown(description: string) {
  return {
    description,
    content: {
      'text/markdown': {
        schema: { type: 'string' }
      }
    }
  }
}

export function createOpenApiDocument(options: { version: string, url?: string }) {
  const url = options.url || SITE_URL

  return {
    openapi: '3.1.0',
    info: {
      title: 'Nuxt UI',
      summary: 'Documentation, content and metadata endpoints of ui.nuxt.com.',
      description: [
        'Nuxt UI is a Vue component library (Nuxt optional) with 125+ accessible, Tailwind CSS components.',
        '',
        'This specification covers the public, read-only endpoints agents can use to read the documentation and its metadata.',
        '',
        `- Markdown documentation: ${MARKDOWN_DESCRIPTION}`,
        `- MCP server: \`POST ${url}/mcp\` (streamable HTTP). See ${url}/.well-known/mcp/server-card.json`,
        `- Agent skill: ${url}/.well-known/skills/nuxt-ui/SKILL.md`,
        `- LLM indexes: ${url}/llms.txt and ${url}/llms-full.txt`,
        '',
        'No authentication is required and no endpoint mutates state.'
      ].join('\n'),
      version: options.version,
      license: {
        name: 'MIT',
        identifier: 'MIT'
      },
      contact: {
        name: 'Nuxt UI',
        url: `${url}/docs`
      }
    },
    servers: [{ url, description: 'Production' }],
    // Everything here is public and read-only: an empty requirement tells
    // agents no credentials are needed, rather than leaving them to guess.
    security: [],
    tags: [
      { name: 'Documentation', description: 'Documentation pages as Markdown.' },
      { name: 'Discovery', description: 'Machine-readable indexes and agent metadata.' },
      { name: 'Content', description: 'Navigation and module metadata behind the documentation site.' },
      { name: 'Data', description: 'Static datasets used by the component examples.' },
      { name: 'GitHub', description: 'Cached GitHub metadata for the repository.' }
    ],
    paths: {
      '/': {
        get: {
          operationId: 'getHomepage',
          tags: ['Documentation'],
          summary: 'Homepage',
          description: `Returns HTML by default, Markdown when negotiated. ${MARKDOWN_DESCRIPTION}`,
          responses: {
            200: {
              description: 'The homepage, as HTML or Markdown.',
              headers: { Vary: { $ref: '#/components/headers/Vary' } },
              content: {
                'text/html': { schema: { type: 'string' } },
                'text/markdown': { schema: { type: 'string' } }
              }
            }
          }
        }
      },
      '/docs/{path}': {
        get: {
          operationId: 'getDocumentationPage',
          tags: ['Documentation'],
          summary: 'Documentation page',
          description: `Returns HTML by default, Markdown when negotiated. ${MARKDOWN_DESCRIPTION}`,
          parameters: [
            {
              name: 'path',
              in: 'path',
              required: true,
              description: 'Page path below `/docs`, may contain slashes. For example `components/button` or `getting-started/installation/nuxt`.',
              schema: { type: 'string' },
              example: 'components/button'
            }
          ],
          responses: {
            200: {
              description: 'The documentation page, as HTML or Markdown.',
              headers: { Vary: { $ref: '#/components/headers/Vary' } },
              content: {
                'text/html': { schema: { type: 'string' } },
                'text/markdown': { schema: { type: 'string' } }
              }
            },
            404: { $ref: '#/components/responses/NotFoundMarkdown' }
          }
        }
      },
      '/raw/index.md': {
        get: {
          operationId: 'getHomepageMarkdown',
          tags: ['Documentation'],
          summary: 'Homepage as Markdown',
          description: 'Markdown summary of the project with links to the installation guides and the agent resources.',
          responses: {
            200: markdown('Homepage as Markdown, with YAML frontmatter.')
          }
        }
      },
      '/raw/docs/{path}.md': {
        get: {
          operationId: 'getDocumentationPageMarkdown',
          tags: ['Documentation'],
          summary: 'Documentation page as Markdown',
          description: 'Markdown source of a documentation page, with YAML frontmatter (`title`, `description`, `canonical_url`). Equivalent to `/docs/{path}.md`.',
          parameters: [
            {
              name: 'path',
              in: 'path',
              required: true,
              description: 'Page path below `/docs`, may contain slashes.',
              schema: { type: 'string' },
              example: 'components/button'
            }
          ],
          responses: {
            200: markdown('Documentation page as Markdown, with YAML frontmatter.'),
            404: { $ref: '#/components/responses/NotFoundMarkdown' }
          }
        }
      },
      '/sitemap.md': {
        get: {
          operationId: 'getSitemapMarkdown',
          tags: ['Discovery'],
          summary: 'Markdown sitemap',
          description: 'Every documentation page, grouped by section, linking to the Markdown URLs.',
          responses: { 200: markdown('Markdown index of every page.') }
        }
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemapXml',
          tags: ['Discovery'],
          summary: 'XML sitemap',
          description: 'Every indexable page, in the sitemaps.org XML format. `/sitemap.md` is the same index as Markdown links.',
          responses: {
            200: {
              description: 'Sitemap in the sitemaps.org XML format.',
              content: { 'application/xml': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          tags: ['Discovery'],
          summary: 'llms.txt index',
          description: 'Index of the documentation for LLMs, following the llms.txt convention, including a "When to use Nuxt UI" section.',
          responses: {
            200: {
              description: 'Markdown index.',
              content: { 'text/plain': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/llms-full.txt': {
        get: {
          operationId: 'getLlmsFullTxt',
          tags: ['Discovery'],
          summary: 'Full documentation for LLMs',
          description: 'Every documentation page concatenated as Markdown. Large response.',
          responses: {
            200: {
              description: 'Full documentation as Markdown.',
              content: { 'text/plain': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/openapi.json': {
        get: {
          operationId: 'getOpenApiDocument',
          tags: ['Discovery'],
          summary: 'This OpenAPI document',
          description: 'This document. It is regenerated on every deploy, so `info.version` tracks the published `@nuxt/ui` release.',
          responses: {
            200: {
              description: 'OpenAPI 3.1 document.',
              content: { 'application/json': { schema: { type: 'object' } } }
            }
          }
        }
      },
      '/.well-known/api-catalog': {
        get: {
          operationId: 'getApiCatalog',
          tags: ['Discovery'],
          summary: 'API catalog (RFC 9727)',
          description: 'Linkset pointing at this specification, the MCP server card and the LLM indexes.',
          responses: {
            200: {
              description: 'Linkset document.',
              content: {
                'application/linkset+json': {
                  schema: { $ref: '#/components/schemas/Linkset' }
                }
              }
            }
          }
        }
      },
      '/.well-known/mcp/server-card.json': {
        get: {
          operationId: 'getMcpServerCard',
          tags: ['Discovery'],
          summary: 'MCP server card',
          description: 'Describes the MCP endpoint, its capabilities and the tools, resources and prompts it exposes.',
          responses: {
            200: {
              description: 'MCP server card, following the schema it declares in `$schema`.',
              content: { 'application/json': { schema: { type: 'object' } } }
            }
          }
        }
      },
      '/.well-known/skills/index.json': {
        get: {
          operationId: 'getSkillsIndex',
          tags: ['Discovery'],
          summary: 'Agent skills index',
          description: 'Lists the agent skills published by this site and the files each one is made of, served under `/.well-known/skills/{name}/`.',
          responses: {
            200: {
              description: 'Skills index.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SkillsIndex' }
                }
              }
            }
          }
        }
      },
      '/mcp': {
        post: {
          operationId: 'callMcpServer',
          tags: ['Discovery'],
          summary: 'MCP endpoint',
          description: 'Model Context Protocol endpoint (streamable HTTP transport), speaking JSON-RPC 2.0. Use an MCP client rather than calling it directly. The `x-mcp-tools` header restricts the exposed tool set to a comma-separated list of tool names.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', description: 'JSON-RPC 2.0 request.' }
              }
            }
          },
          responses: {
            200: {
              description: 'JSON-RPC 2.0 response, or an SSE stream of them.',
              content: {
                'application/json': { schema: { type: 'object', description: 'JSON-RPC 2.0 response.' } },
                'text/event-stream': { schema: { type: 'string' } }
              }
            },
            400: jsonError('Unknown MCP tool requested through `x-mcp-tools`.')
          }
        }
      },
      '/api/navigation.json': {
        get: {
          operationId: 'getNavigation',
          tags: ['Content'],
          summary: 'Documentation navigation tree',
          description: 'The documentation navigation tree as rendered in the sidebar: nested items carrying the page title, path, framework and category.',
          responses: {
            200: {
              description: 'Nested navigation items.',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/NavigationItem' } }
                }
              }
            }
          }
        }
      },
      '/api/module.json': {
        get: {
          operationId: 'getModuleStats',
          tags: ['Content'],
          summary: 'Module stats, team and contributors',
          description: 'npm downloads and GitHub stars for `@nuxt/ui`, plus the team and contributor lists shown on the homepage. Cached for an hour.',
          responses: { 200: json('Module', 'Download and star counts, team members and contributors.') }
        }
      },
      '/api/component-example/{component}': {
        get: {
          operationId: 'getComponentExample',
          tags: ['Content'],
          summary: 'Source of a documentation example component',
          description: 'The single file component behind an example on a documentation page. Names are listed by the `list-examples` MCP tool and accepted in PascalCase, camelCase or kebab-case, with an optional `.json` suffix.',
          parameters: [
            {
              name: 'component',
              in: 'path',
              required: true,
              description: 'Example component name, in PascalCase or kebab-case. A `.json` suffix is accepted.',
              schema: { type: 'string' },
              example: 'button-loading-auto-example'
            }
          ],
          responses: {
            200: json('ComponentExample', 'Source code of the example component.'),
            404: jsonError('No example component with that name.')
          }
        }
      },
      '/api/countries.json': {
        get: {
          operationId: 'getCountries',
          tags: ['Data'],
          summary: 'Countries',
          description: 'Countries with their ISO 3166-1 alpha-2 code and flag emoji, the dataset behind the country select examples.',
          responses: {
            200: {
              description: 'Countries with their ISO 3166-1 alpha-2 code and flag.',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Country' } }
                }
              }
            }
          }
        }
      },
      '/api/phone-codes.json': {
        get: {
          operationId: 'getPhoneCodes',
          tags: ['Data'],
          summary: 'Phone dial codes',
          description: 'Countries with their dial code and phone number mask, the dataset behind the phone input examples.',
          responses: {
            200: {
              description: 'Countries with their dial code and phone number mask.',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/PhoneCode' } }
                }
              }
            }
          }
        }
      },
      '/api/locales.json': {
        get: {
          operationId: 'getLocales',
          tags: ['Data'],
          summary: 'Locales',
          description: 'Every locale Nuxt UI ships a translation for, mapped to its flag emoji.',
          responses: {
            200: {
              description: 'Map of locale tag to flag emoji, for example `{ "fr-FR": "🇫🇷" }`.',
              content: {
                'application/json': {
                  schema: { type: 'object', additionalProperties: { type: 'string' } }
                }
              }
            }
          }
        }
      },
      '/api/github/releases.json': {
        get: {
          operationId: 'getReleases',
          tags: ['GitHub'],
          summary: 'Recent releases',
          description: 'Releases of `nuxt/ui` as returned by the GitHub API, excluding v2. Empty when the server has no GitHub token configured.',
          responses: {
            200: {
              description: 'GitHub release objects.',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/GitHubObject' } }
                }
              }
            }
          }
        }
      },
      '/api/github/pulls.json': {
        get: {
          operationId: 'getPullRequests',
          tags: ['GitHub'],
          summary: 'Merged pull requests',
          description: 'Merged pull requests of `nuxt/ui` by human authors, as returned by the GitHub API. Empty when the server has no GitHub token configured.',
          responses: {
            200: {
              description: 'GitHub pull request objects.',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/GitHubObject' } }
                }
              }
            }
          }
        }
      },
      '/api/github/commits.json': {
        get: {
          operationId: 'getCommits',
          tags: ['GitHub'],
          summary: 'Commits touching given paths',
          description: 'Commits of `nuxt/ui` touching the given repository paths, newest first. Empty when the server has no GitHub token configured.',
          parameters: [
            {
              name: 'path',
              in: 'query',
              required: true,
              description: 'Repository path to look up. Repeat the parameter to query several paths at once.',
              schema: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } }
                ]
              },
              example: 'src/runtime/components/Button.vue'
            }
          ],
          responses: {
            200: {
              description: 'Commits, newest first.',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Commit' } }
                }
              }
            },
            400: jsonError('The `path` query parameter is missing.')
          }
        }
      }
    },
    components: {
      headers: {
        Vary: {
          description: 'Always includes `Accept` and `User-Agent`, since the representation depends on both.',
          schema: { type: 'string' }
        }
      },
      responses: {
        NotFoundMarkdown: {
          description: 'The page does not exist. The body is a short Markdown document linking to the sitemap and the other entry points.',
          content: {
            'text/markdown': { schema: { type: 'string' } }
          }
        }
      },
      schemas: {
        NavigationItem: {
          type: 'object',
          description: 'A documentation navigation entry.',
          properties: {
            title: { type: 'string' },
            path: { type: 'string' },
            stem: { type: 'string' },
            framework: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            children: {
              type: 'array',
              items: { $ref: '#/components/schemas/NavigationItem' }
            }
          },
          required: ['title', 'path']
        },
        Module: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                downloads: { type: 'integer', description: 'Monthly npm downloads.' },
                stars: { type: 'integer', description: 'GitHub stars.' }
              }
            },
            team: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  login: { type: 'string' },
                  avatarUrl: { type: 'string', format: 'uri' }
                }
              }
            },
            contributors: {
              type: 'array',
              items: {
                type: 'object',
                properties: { username: { type: 'string' } }
              }
            }
          }
        },
        ComponentExample: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Single file component source.' },
            filePath: { type: 'string' },
            pascalName: { type: 'string' }
          },
          required: ['code', 'pascalName']
        },
        Country: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            code: { type: 'string', description: 'ISO 3166-1 alpha-2 code.' },
            emoji: { type: 'string' }
          },
          required: ['name', 'code', 'emoji']
        },
        PhoneCode: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            code: { type: 'string', description: 'ISO 3166-1 alpha-2 code.' },
            emoji: { type: 'string' },
            dialCode: { type: 'string', example: '+33' },
            mask: { type: 'string', example: '# ## ## ## ##' }
          },
          required: ['name', 'code', 'dialCode']
        },
        Commit: {
          type: 'object',
          properties: {
            sha: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            message: { type: 'string', description: 'First line of the commit message.' }
          },
          required: ['sha', 'date', 'message']
        },
        Linkset: {
          type: 'object',
          description: 'RFC 9727 linkset. Each entry anchors a resource and points at its description and documentation.',
          properties: {
            linkset: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  'anchor': { type: 'string', format: 'uri' },
                  'service-desc': { $ref: '#/components/schemas/LinksetTargets' },
                  'service-doc': { $ref: '#/components/schemas/LinksetTargets' }
                },
                required: ['anchor']
              }
            }
          },
          required: ['linkset']
        },
        LinksetTargets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              href: { type: 'string', format: 'uri' },
              type: { type: 'string', description: 'Media type of the target.' }
            },
            required: ['href']
          }
        },
        SkillsIndex: {
          type: 'object',
          description: 'Agent skills published by this site, served under `/.well-known/skills/{name}/`.',
          properties: {
            skills: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  files: {
                    type: 'array',
                    description: 'Paths relative to the skill directory.',
                    items: { type: 'string' }
                  }
                },
                required: ['name', 'description', 'files']
              }
            }
          },
          required: ['skills']
        },
        Error: {
          type: 'object',
          description: 'Error payload returned by the JSON endpoints. Documentation pages answer errors as Markdown instead, and browsers get the HTML error page.',
          properties: {
            error: { type: 'boolean', const: true },
            url: { type: 'string', description: 'The requested URL.' },
            statusCode: { type: 'integer', example: 404 },
            statusMessage: { type: 'string', description: 'Machine-readable reason phrase.', example: 'Example not found!' },
            message: { type: 'string', description: 'Human-readable message.', example: 'Example not found!' },
            data: { type: 'object', description: 'Extra context, when the endpoint provides any.', additionalProperties: true }
          },
          required: ['error', 'statusCode', 'statusMessage', 'message']
        },
        GitHubObject: {
          type: 'object',
          description: 'Object as returned by the GitHub REST API, passed through unchanged.',
          additionalProperties: true
        }
      }
    }
  }
}
