import * as pdfjsLib from 'pdfjs-dist';

// For pdfjs-dist v5, use the worker from the package itself
// This approach bundles the worker inline to avoid fetch issues
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

export const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
        console.log('Starting PDF extraction...');
        const arrayBuffer = await file.arrayBuffer();
        console.log('File loaded, size:', arrayBuffer.byteLength);

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        console.log('Loading task created');

        const pdf = await loadingTask.promise;
        console.log('PDF loaded, pages:', pdf.numPages);

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                // @ts-ignore - str exists on TextItem
                .map((item) => item.str)
                .join(' ');

            fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
        }

        console.log('Extraction complete, text length:', fullText.length);
        return fullText;
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        alert(`PDF Import Error: ${errorMsg}`);
        throw error;
    }
};
