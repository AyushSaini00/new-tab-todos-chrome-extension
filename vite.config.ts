import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";
import fs from "fs";

const removeFolderFromDist = (folderName: string) => {
  return {
    name: "remove-folder-from-dist",
    writeBundle(outputOptions: any) {
      const outDir = outputOptions.dir;
      const folderToRemove = path.resolve(outDir, folderName);

      if (fs.existsSync(folderToRemove)) {
        fs.rm(folderToRemove, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Failed to delete ${folderName}: `, err);
          } else {
            console.log(`removed ${folderName} from dist`);
          }
        });
      }
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte(), removeFolderFromDist("screenshots")],
});
