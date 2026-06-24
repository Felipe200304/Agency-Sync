package com.agencysync.service;

import com.agencysync.domain.CalendarEvent;
import com.agencysync.domain.Model;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;

/** Gera a agenda do modelo em planilha .xlsx para alinhamento entre agências. */
@Service
public class AgendaExcelExporter {

    private static final String[] HEADERS = {"Data", "Início", "Fim", "Tipo", "Título", "Local", "Descrição"};

    public byte[] export(Model model, List<CalendarEvent> events) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Agenda");
            writeHeader(wb, sheet);
            int r = 1;
            for (CalendarEvent e : events) {
                Row row = sheet.createRow(r++);
                set(row, 0, e.getEventDate() == null ? "" : e.getEventDate().toString());
                set(row, 1, nz(e.getStartTime()));
                set(row, 2, nz(e.getEndTime()));
                set(row, 3, nz(e.getType()));
                set(row, 4, nz(e.getTitle()));
                set(row, 5, nz(e.getLocation()));
                set(row, 6, nz(e.getDescription()));
            }
            for (int c = 0; c < HEADERS.length; c++) sheet.autoSizeColumn(c);
            wb.write(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new UncheckedIOException("Falha ao gerar a planilha da agenda", ex);
        }
    }

    private void writeHeader(Workbook wb, Sheet sheet) {
        CellStyle style = wb.createCellStyle();
        Font bold = wb.createFont();
        bold.setBold(true);
        style.setFont(bold);
        Row header = sheet.createRow(0);
        for (int c = 0; c < HEADERS.length; c++) {
            Cell cell = header.createCell(c);
            cell.setCellValue(HEADERS[c]);
            cell.setCellStyle(style);
        }
    }

    private void set(Row row, int col, String value) {
        row.createCell(col).setCellValue(value);
    }

    private String nz(String v) {
        return v == null ? "" : v;
    }
}
