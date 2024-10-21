import { cssModulesPlugin } from "@asn.aeb/esbuild-css-modules-plugin";
// @ts-ignore
import { tsconfigPathsPlugin } from "esbuild-plugin-tsconfig-paths";
//import { readFileSync } from "node:fs";
//import path from "path";
import { copy } from 'esbuild-plugin-copy';
import globby from "globby";
/**
 * Resolves a glob to a single file.
 * @function
 * @param glob - The glob to resolve.
 * @returns A promise that resolves to the first file that matches the glob.
 */
async function getHeroParents() {
    const fastGlobSettings = { onlyDirectories: true, unique: true };
    return await globby("src/assets/images/hero/*", fastGlobSettings);
}
/**
 * Resolves a glob to a single file.
 * @function
 * @param glob - The glob to resolve.
 * @returns An array of files that match the glob.
 */
export const heroParents = getHeroParents();
const jsBanner = `/**
 * ---DO NOT EDIT THIS FILE---
 * it is generated by the build process
 * instead edit the source file
 *
 * main site sources are in src/assets/javascripts directory
 */
`;
const cssBanner = `/**
  * ---DO NOT EDIT THIS FILE---
  * it is generated by the build process
  * instead edit the source file
  *
  * sources are in src/assets/stylesheets directory
  *
  */
`;
const ciBanner = `/**
  * ---DO NOT EDIT THIS FILE---
  * it is generated by the build process
  * instead edit the source file
  *
  * sources are in .github/src directory
  */
  `;
export const webConfig = {
    bundle: true,
    minify: true,
    sourcemap: true,
    metafile: true,
    banner: { js: jsBanner, css: cssBanner },
    format: "esm",
    platform: "browser",
    target: "es2018",
    outbase: "src",
    chunkNames: "[dir]/assets/javascripts/chunks/[name].[hash]",
    assetNames: "[dir]/[name].[hash]",
    loader: {
        ".js": "js",
        ".ts": "ts",
        ".tsx": "tsx",
        ".css": "css",
        ".scss": "css",
        ".sass": "css",
        ".woff": "file",
        ".woff2": "file",
        ".png": "file",
        ".svg": "file",
        ".webp": "file",
        ".avif": "file",
    },
    outExtension: { ".js": ".js", ".css": ".css" },
    splitting: false,
    plugins: [
        tsconfigPathsPlugin({
            cwd: process.cwd(),
            tsconfig: "tsconfig.json",
            filter: /src\/assets\/javascripts\/index.ts/
        }),
        cssModulesPlugin({
            emitCssBundle: {
                filename: "bundle.css",
            },
        }),
        copy({
            watch: true,
            verbose: true,
            resolveFrom: "cwd",
            globbyOptions: { gitignore: true, extglob: true, unique: true },
            assets: [
                { from: "./src/assets/images/*.+(svg|png|webp)", to: "./docs/assets/images" },
            ],
        }),
    ],
};
export const nodeConfig = {
    loader: webConfig.loader,
    format: "esm",
    bundle: true,
    metafile: false,
    banner: { js: ciBanner },
    platform: "node",
    target: "node18",
    sourcemap: false,
    minify: false,
    splitting: false,
    plugins: [],
    allowOverwrite: true,
    outExtension: { '.js': '.mjs' }
};
export const GHActions = [
    {
        // Build GitHub actions
        entryPoints: [".github/src/generate-changelog.ts"],
        entryNames: "[dir]/[name]",
        outdir: ".github/scripts",
        tsconfig: ".github/tsconfig.json",
        platform: "node",
    },
];
export const baseProject = {
    entryPoints: ["src/assets/javascripts/index.ts", "src/assets/stylesheets/bundle.css"
    ],
    tsconfig: "tsconfig.json",
    entryNames: "[dir]/[name].[hash]",
    platform: "browser",
    outdir: "docs",
};
/**
 * Resolves a glob to a single file.
 * @param glob - The glob to resolve.
 * @param fastGlobOptions - Options to pass to fast-glob.
 * @returns A promise that resolves to the first file that matches the glob.
 */
async function resolveGlob(glob, fastGlobOptions) {
    try {
        const result = await globby(glob, fastGlobOptions);
        if (result.length === 0) {
            throw new Error(`Glob "${glob}" did not match any files`);
        }
        else {
            return result;
        }
    }
    catch (error) {
        console.error("Error resolving glob:", error);
        throw error;
    }
}
/**
 * Generates the Srcset for a given image.
 * @function
 * @param image - The image to generate the Srcset for.
 * @returns A promise that resolves to the Srcset for the image.
 */
export async function generateSrcset(image) {
    const entries = await Promise.all(Object.entries(image.widths).map(async ([width, src]) => {
        return `${await resolveGlob(src, { onlyFiles: true, unique: true })} ${width}w`;
    }));
    return entries.join(", ");
}
const parents = await resolveGlob("src/assets/images/hero/*", { onlyDirectories: true });
export const heroImages = Object.fromEntries(await Promise.all(parents.map(async (parent) => {
    const key = parent.split("/").pop();
    const heroFilePattern = `${key}_{1280,1920,2560,3840}.avif`;
    const children = await globby(`${parent}/${heroFilePattern}`, { onlyFiles: true, unique: true });
    const flattenedWidths = children.reduce((acc, child) => {
        const width = [1280, 1920, 2560, 3840].find((w) => child.includes(w.toString()));
        if (width) {
            acc[width] = child;
        }
        return acc;
    }, {}); // Initialize acc as an empty WidthMap
    const srcset = generateSrcset({ parent, widths: flattenedWidths });
    return [key, { parent, widths: flattenedWidths, srcset }];
})));
//# sourceMappingURL=index.js.map