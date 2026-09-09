import * as esbuild from "esbuild";

const ctx = await esbuild
  .context({
    entryPoints: ["src/main.ts", "src/index.html"],
    bundle: true,
    format: "esm",
    outdir: "dist",
    sourcemap: true,
    minify: false,
    assetNames: "assets/[name]-[hash]",
    loader: {
      ".html": "copy",
      ".ts": "ts",
    },
  })
  .catch(() => process.exit(1));

await ctx.watch();

const server = await ctx.serve({
  servedir: "dist",
});

console.log(`Serving on http://localhost:${server.port}`);
