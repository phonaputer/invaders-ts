import * as esbuild from "esbuild";

const ctx = await esbuild
  .context({
    entryPoints: ["src/main.ts", "src/index.html", "src/style.css"],
    bundle: true,
    format: "esm",
    outdir: "dist",
    sourcemap: true,
    minify: false,
    assetNames: "assets/[name]-[hash]",
    loader: {
      ".css": "css",
      ".html": "copy", // TODO find out if there's a good plugin to allow having the HTML file be the only entrypoint
      ".ts": "ts",
    },
  })
  .catch(() => process.exit(1));

await ctx.watch();

const server = await ctx.serve({
  servedir: "dist",
});

console.log(`Serving on http://localhost:${server.port}`);
