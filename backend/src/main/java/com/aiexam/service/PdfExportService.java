package com.aiexam.service;

import com.aiexam.model.ExamHistory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfExportService {

    public byte[] generateExamReport(ExamHistory history) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("EXAM REPORT")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            
            document.add(new Paragraph(" ")); // Empty line

            // Exam Details
            document.add(new Paragraph("Exam Details:")
                    .setFontSize(16)
                    .setBold());
            
            Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{3, 7}));
            detailsTable.setWidth(UnitValue.createPercentValue(100));
            
            addDetailRow(detailsTable, "Topic:", history.getTopic());
            addDetailRow(detailsTable, "Difficulty:", history.getDifficulty().name());
            addDetailRow(detailsTable, "Question Type:", history.getQuestionType().name());
            addDetailRow(detailsTable, "Date:", history.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            addDetailRow(detailsTable, "Total Questions:", String.valueOf(history.getNumberOfQuestions()));
            
            document.add(detailsTable);
            document.add(new Paragraph(" "));

            // Results
            document.add(new Paragraph("Results:")
                    .setFontSize(16)
                    .setBold());
            
            Table resultsTable = new Table(UnitValue.createPercentArray(new float[]{3, 7}));
            resultsTable.setWidth(UnitValue.createPercentValue(100));
            
            addDetailRow(resultsTable, "Score:", String.valueOf(history.getScore()));
            addDetailRow(resultsTable, "Percentage:", String.format("%.2f%%", history.getPercentage()));
            addDetailRow(resultsTable, "Performance:", history.getPerformanceRating().name());
            addDetailRow(resultsTable, "Correct Answers:", String.valueOf(history.getCorrectAnswers()));
            addDetailRow(resultsTable, "Wrong Answers:", String.valueOf(history.getWrongAnswers()));
            addDetailRow(resultsTable, "Skipped Answers:", String.valueOf(history.getSkippedAnswers()));
            addDetailRow(resultsTable, "Time Taken:", history.getTimeTaken() + " seconds");
            
            document.add(resultsTable);
            document.add(new Paragraph(" "));

            // Feedback
            if (history.getAiFeedback() != null) {
                document.add(new Paragraph("AI Feedback:")
                        .setFontSize(16)
                        .setBold());
                document.add(new Paragraph(history.getAiFeedback()));
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private void addDetailRow(Table table, String label, String value) {
        table.addCell(new Paragraph(label).setBold());
        table.addCell(new Paragraph(value));
    }
}