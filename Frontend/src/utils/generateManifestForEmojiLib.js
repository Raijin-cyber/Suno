import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(
    __dirname,
    "../../public/emojis library"
);

const OUTPUT = path.join(
    ROOT,
    "manifest.json"
);

const manifest = [];

function unicodeToEmoji(unicode) {
    try {
        return String.fromCodePoint(
            ...unicode
                .split("_")
                .map(code =>
                    parseInt(
                        code.replace(/^u/i, ""),
                        16
                    )
                )
        );
    } catch {
        return "";
    }
}

function formatName(name) {
    return name
        .replace(".json", "")
        .replace(/_u[a-f0-9_]+$/i, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function walk(dir, category = "") {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);

        const stats =
            fs.statSync(fullPath);

        if (stats.isDirectory()) {
            walk(fullPath, file);
            return;
        }

        if (!file.endsWith(".json"))
            return;

        const id =
            file.replace(".json", "");

        const unicode =
        id.match(
            /_u([a-f0-9_]+)$/i
        )?.[1] || "";

        const clean =
            formatName(file);

        manifest.push({
            id,

            emoji:
                unicodeToEmoji(
                    unicode
                ),

            name: clean
                .split(" ")
                .map(
                    w =>
                        w[0].toUpperCase() +
                        w.slice(1)
                )
                .join(" "),

            category:
                category.toLowerCase(),

            keywords:
                clean
                    .toLowerCase()
                    .split(" "),

            file: fullPath
                .replace(
                    ROOT,
                    "/emojis library"
                )
                .replace(
                    /\\/g,
                    "/"
                ),

            createdAt:
                stats.birthtimeMs
        });
    });
}

walk(ROOT);

// oldest → newest
manifest.sort(
    (a, b) =>
        a.createdAt -
        b.createdAt
);

// remove temp field
const finalManifest =
    manifest.map(
        ({
            createdAt,
            ...emoji
        }) => emoji
    );

fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
        finalManifest,
        null,
        2
    )
);

console.log(
    `Generated ${finalManifest.length} emojis`
);