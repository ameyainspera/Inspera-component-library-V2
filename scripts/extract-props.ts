/**
 * extract-props.ts - derive each component's real prop API from its TypeScript
 * types, using the compiler API.
 *
 * Why this exists: the prop tables used to be hand-transcribed into
 * src/data/components.ts from a Figma variant sheet. They drifted badly - 24 of
 * 42 components documented Capitalized names (`Intent`, `WithLabel`) that React
 * silently ignores, and 99 real props (label, children, items, onChange, ...)
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

/** A component's prop API plus any shapes its props reference. */
export interface ComponentApi {
  props: PropDoc[]
  relatedTypes: Record<string, string>
}

export interface PropDoc {
  name: string
  /** Rendered TypeScript type, with unions of string literals kept verbatim. */
  type: string
  required: boolean
  default?: string
  description?: string
}

/**
 * Render a prop's type the way a reader needs it.
 *
 * Deliberately *not* the compiler's fully-resolved type. Resolving `ReactNode`
 * expands to a ~10-member union containing an absolute `import("/Users/...")`
 * path - which is machine-specific (so generated files differed between a
 * laptop and CI) and tells a model nothing. Instead:
 *
 *   - a named alias that is a union of string literals is expanded to those
 *     literals in *declaration* order, because that variant list is the whole
 *     point of the table;
 *   - everything else keeps the annotation as written: `ReactNode`,
 *     `TabItem[]`, `(index: number) => void`.
 */
function renderType(checker: ts.TypeChecker, member: ts.PropertySignature, source: ts.SourceFile): string {
  if (!member.type) return 'unknown'
  const written = member.type.getText(source).replace(/\s+/g, ' ').trim()

  if (ts.isTypeReferenceNode(member.type) && ts.isIdentifier(member.type.typeName)) {
    const symbol = checker.getSymbolAtLocation(member.type.typeName)
    const decl = symbol?.declarations?.find(ts.isTypeAliasDeclaration)
    if (decl && ts.isUnionTypeNode(decl.type)) {
      const literals = decl.type.types.every(
        (t) => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal),
      )
      if (literals) {
        return decl.type
          .getText(source)
          .replace(/\s+/g, ' ')
          .replace(/"/g, "'")
          .replace(/^\|\s*/, '') // aliases are often written with a leading `|`
          .trim()
      }
    }
  }

  return written
}

/**
 * Shapes referenced by props and declared alongside the component - TabItem,
 * MenuItem, TableColumn. Without these, `items: TabItem[]` is a dead end for
 * anyone (or anything) trying to call the component.
 */
function collectRelatedTypes(
  source: ts.SourceFile,
  props: ts.PropertySignature[],
  selfName: string,
): Record<string, string> {
  const referenced = new Set<string>()
  for (const prop of props) {
    if (!prop.type) continue
    const visit = (n: ts.Node) => {
      if (ts.isTypeReferenceNode(n) && ts.isIdentifier(n.typeName)) referenced.add(n.typeName.text)
      ts.forEachChild(n, visit)
    }
    visit(prop.type)
  }

  const shapes: Record<string, string> = {}
  ts.forEachChild(source, (node) => {
    const named =
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text
    if (!named || named === selfName || !referenced.has(named)) return
    // Literal-union aliases are already inlined into the prop's type.
    if (ts.isTypeAliasDeclaration(node) && ts.isUnionTypeNode(node.type)) return
    shapes[named] = node.getText(source).trim()
  })
  return shapes
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

export function extractComponentProps(): Record<string, ComponentApi> {
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
  const result: Record<string, ComponentApi> = {}

  for (const file of files) {
    const source = program.getSourceFile(file)
    if (!source) continue

    const componentName = basename(file, '.tsx')
    const defaults = collectDefaults(source)
    let api: ComponentApi | null = null

    ts.forEachChild(source, (node) => {
      if (api) return
      if (!ts.isInterfaceDeclaration(node)) return
      // The component's own props interface, not a nested item shape.
      if (node.name.text !== `${componentName}Props`) return

      const members = node.members.filter(ts.isPropertySignature)
      const props = members.map((member) => {
        const name = member.name.getText(source).replace(/^'|'$/g, '')
        const symbol = checker.getSymbolAtLocation(member.name)
        const description = symbol
          ? ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim()
          : ''

        return {
          name,
          type: renderType(checker, member, source),
          required: !member.questionToken,
          ...(defaults[name] !== undefined ? { default: defaults[name] } : {}),
          ...(description ? { description } : {}),
        }
      })

      api = { props, relatedTypes: collectRelatedTypes(source, members, node.name.text) }
    })

    if (api) result[componentName] = api
  }

  return result
}
