import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { singleton } from 'tsyringe';

@singleton()
export class LogStreamHandler {
    private logDir: string;

    constructor() {
        // Adjust the path to point to the 'var' directory relative to your project's root
        this.logDir = path.join(__dirname, '../../../var/log');
    }

    public streamLogs(res: Response, filename: string, numberOfEntries: number, keywordFilter?: string): void {
        const filePath = path.join(this.logDir, filename);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Set headers for streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

        const lines: string[] = [];

        readStream.on('data', (chunk: string) => {
            lines.push(...chunk.split('\n'));

            if (lines.length > numberOfEntries) {
                lines.splice(0, lines.length - numberOfEntries);
            }

            if (keywordFilter) {
                const filteredLines = lines.filter(line => line.includes(keywordFilter));
                filteredLines.forEach(line => res.write(`${line}\n`));
            } else {
                lines.forEach(line => res.write(`${line}\n`));
            }

            res.flushHeaders();
        });

        readStream.on('end', () => {
            res.end();
        });

        readStream.on('error', (err: Error) => {
            res.status(500).json({ message: `Error reading file: ${err.message}` });
        });
    }
}
