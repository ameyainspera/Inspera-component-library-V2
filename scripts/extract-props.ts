/**
 * extract-props.ts — derive each component's real prop API from its TypeScript
 * types, using the compiler API.
 *
 * Why this exists: the prop tables used to be hand-transcribed into
 * src/data/components.ts from a Figma variant sheet. They drifted badly — 24 of
 * 42 components documented Capitalized names (`Intent`, `WithLabel`) that React
 * silently ignores, and 99 real props (label, children, items, onChange, …)
 * were absent entirely, so the published spec could not describe a working
 * screen. Reading the types means the documentation cannot disagree with the
 * component.
 */
import { readdirSync } from 'node:fs'
import { basename, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const COMPONENT_DIR = join(root, 'src/components/inspera')

export interface PropDoc {
  name: string
  /** Rendered TypeScript type, with unions of string literals kept verbatim. */
  type: string
  required: boolean
  default?: string
  description?: string
}

/** Collapse the compiler's rendering into something a human (or model) reads well. */
function renderType(checker: ts.TypeChecker, type: ts.Type, node: ts.Node): string {
  const text = checker.typeToString(
    type,
    node,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias,
  )
  return text
    .replace(/ \| undefined$/, '')
    .replace(/"/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Default values, read from the destructuring pattern of the component function. */
function collectDefaults(source: ts.SourceFile): Record<string, string> {
  const defaults: Record<string, string> = {}

  const visit = (node: ts.Node) => {
    const isDefaultExported =
      (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)

    if (isDefaultExported && node.parameters.length > 0) {
      const [param] = node.parameters
      if (param && ts.isObjectBindingPattern(param.name)) {
        for (const element of param.name.elements) {
          if (!element.initializer) continue
          const key = (element.propertyName ?? element.name).getText(source)
          defaults[key] = element.initializer.getText(source)
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return defaults
}

export function extractComponentProps(): Record<string, PropDoc[]> {
  const files = readdirSync(COMPONENT_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => join(COMPONENT_DIR, f))

  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
  })
  const checker = program.getTypeChecker()
  const result: Record<string, PropDoc[]> = {}

  for (const file of files) {
    const source = program.getSourceFile(file)
    if (!source) continue

    const componentName = basename(file, '.tsx')
    const defaults = collectDefaults(source)
    let props: PropDoc[] | null = null

    ts.forEachChild(source, (node) => {
      if (props) return
      if (!ts.isInterfaceDeclaration(node)) return
      if (!node.name.text.endsWith('Props')) return
      // The component's own props interface, not a nested item shape.
      if (node.name.text !== `${componentName}Props`) return

      props = node.members.filter(ts.isPropertySignature).map((member) => {
        const name = member.name.getText(source).replace(/^'|'$/g, '')
        const symbol = checker.getSymbolAtLocation(member.name)
        const type = member.type
          ? renderType(checker, checker.getTypeFromTypeNode(member.type), member)
          : 'unknown'
        const description = symbol
          ? ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim()
          : ''

        return {
          name,
          type,
          required: !member.questionToken,
          ...(defaults[name] !== undefined ? { default: defaults[name] } : {}),
          ...(description ? { description } : {}),
        }
      })
    })

    if (props) result[componentName] = props
  }

  return result
}
