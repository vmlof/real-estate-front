import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import ts from "typescript";

// Run the actual server modules with Next's request APIs replaced by test adapters.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const stubs = {
      "server-only": "export {};",
      "next/headers":
        "export async function cookies() { return globalThis.__testCookies.getStore(); }",
      "next/navigation":
        "export function redirect(url) { throw new Error('REDIRECT:' + url); }",
    };
    if (specifier in stubs)
      return {
        url: "data:text/javascript," + encodeURIComponent(stubs[specifier]),
        shortCircuit: true,
      };
    let target;
    if (specifier.startsWith("@/"))
      target = path.resolve("src", specifier.slice(2));
    else if (
      specifier.startsWith(".") &&
      context.parentURL?.startsWith("file:")
    )
      target = fileURLToPath(new URL(specifier, context.parentURL));
    if (target && existsSync(target + ".ts"))
      return { url: pathToFileURL(target + ".ts").href, shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && url.endsWith(".ts")) {
      const source = readFileSync(fileURLToPath(url), "utf8");
      return {
        format: "module",
        source: ts.transpileModule(source, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
