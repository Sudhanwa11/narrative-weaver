import DiaryEntry from '../models/diaryEntryModel.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import PDFDocument from 'pdfkit';

// Helper to get entries based on date range
const getEntriesForExport = async (userId, range, customStartDate, customEndDate) => {
  const query = { user: userId };
  const now = new Date();

  switch (range) {
    case '7days':
      query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
      break;
    case 'month':
      query.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
      break;
    case 'year':
      query.createdAt = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      break;
    case 'custom':
      query.createdAt = { $gte: new Date(customStartDate), $lte: new Date(customEndDate) };
      break;
    case 'all':
    default:
      // No date filter for 'all'
      break;
  }
  return await DiaryEntry.find(query).sort({ createdAt: 'asc' });
};

// Main export function
export const exportEntries = async (req, res) => {
  try {
    const { format, range, customStartDate, customEndDate } = req.body;
    const entries = await getEntriesForExport(req.user._id, range, customStartDate, customEndDate);

    if (entries.length === 0) {
      return res.status(404).json({ message: 'No entries found for the selected range.' });
    }

    const docTitle = "My Diary Entries from The Narrative Weaver";
    const paragraphs = entries.map(entry => {
        const date = new Date(entry.createdAt).toLocaleString();
        const feeling = entry.feeling ? `Feeling: ${entry.feeling}` : '';
        return [
            new Paragraph({
                children: [new TextRun({ text: date, bold: true, size: 24 })],
                spacing: { after: 120 },
            }),
            new Paragraph({
                children: [new TextRun({ text: feeling, italic: true, size: 22 })],
                spacing: { after: 240 },
            }),
            new Paragraph({
                children: [new TextRun({ text: entry.text, size: 24 })],
                spacing: { after: 480 },
            }),
        ];
    }).flat();

    if (format === 'docx') {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [new Paragraph({ children: [new TextRun({ text: docTitle, bold: true, size: 32 })], spacing: { after: 480 } }), ...paragraphs],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      res.setHeader('Content-Disposition', 'attachment; filename=MyDiary.docx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.send(buffer);

    } else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Disposition', 'attachment; filename=MyDiary.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      doc.fontSize(20).font('Helvetica-Bold').text(docTitle, { align: 'center' });
      doc.moveDown();

      entries.forEach(entry => {
        const date = new Date(entry.createdAt).toLocaleString();
        const feeling = entry.feeling ? `Feeling: ${entry.feeling}` : '';
        doc.fontSize(12).font('Helvetica-Bold').text(date);
        doc.fontSize(11).font('Helvetica-Oblique').text(feeling);
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').text(entry.text, { align: 'justify' });
        doc.moveDown(2);
      });
      doc.end();
    } else {
      res.status(400).json({ message: 'Unsupported format' });
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Failed to export entries." });
  }
};