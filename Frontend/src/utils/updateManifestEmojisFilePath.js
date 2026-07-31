// NOTE ** This helper file was created by ChatGPT for modifying the old path name for emojis.
// NOTE ** Keep the manifest.json secured because it has the original sequence of emojis

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(
    __dirname,
    "../../public/emojis-library"
);

const MANIFEST_PATH = path.join(
    ROOT,
    "manifest.json"
);

// Read existing manifest
const manifest = JSON.parse(
    fs.readFileSync(
        MANIFEST_PATH,
        "utf-8"
    )
);

// Find every JSON emoji file and map it by filename
const fileMap = new Map();

function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            walk(fullPath);
            continue;
        }

        if (
            file.endsWith(".json") &&
            file !== "manifest.json"
        ) {
            fileMap.set(
                file.replace(".json", ""),
                fullPath
            );
        }
    }
}

walk(ROOT);

// Preserve manifest order.
// Only update the file path.
const updatedManifest = manifest.map(emoji => {
    const actualFilePath =
        fileMap.get(emoji.id);

    if (!actualFilePath) {
        console.warn(
            `File not found for: ${emoji.id}`
        );

        return emoji;
    }

    return {
        ...emoji,

        file: actualFilePath
            .replace(ROOT, "/emojis-library")
            .replace(/\\/g, "/")
    };
});

fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
        updatedManifest,
        null,
        2
    )
);

console.log(
    `Updated paths for ${updatedManifest.length} emojis`
);