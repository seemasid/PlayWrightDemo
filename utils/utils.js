import path from "path";
import fs from 'fs';
import { parse } from 'csv-parse/sync';

export const writeJsonToFile = (obj, outputPath) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(obj, null, 2), 'utf8');
}

export function csvReader(csvPath) {
    const content = fs.readFileSync(path.join(__dirname, csvPath), 'utf8');
    const records = parse(content, { trim: true, skip_empty_lines: true });
    return records.map(r => ({ title: r[0], qty: parseInt(r[1], 10) || 1 }));
}