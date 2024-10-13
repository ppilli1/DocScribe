from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle, SimpleDocTemplate, Paragraph
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
import update_patient_info

# Create a new PDF


def create_patient_pdf():
    new_pdf_data = update_patient_info.lol()
    pdf_file = "patient_data_table.pdf"
    doc = SimpleDocTemplate(pdf_file, pagesize=letter)

    # Build the PDF with the table
    elements = []
    styles = getSampleStyleSheet()

    # Define the table style
    for section in new_pdf_data:
        # Ensure every row has the same number of columns (2 in this case)
        section = [row if len(row) == 2 else row[:2] for row in section]

        # Use Paragraphs for text to handle wrapping
        wrapped_section = [[Paragraph(cell, styles['BodyText']) for cell in row] for row in section]
        
        table = Table(wrapped_section, colWidths=[2.5*inch, 4.0*inch])
        
        # Ensure the last row is correctly referenced, adjusting the len(section) usage
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            # ('BACKGROUND', (0, len(section)-1), (-1, len(section)-1), colors.beige),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),  # Ensures text is aligned at the top
        ])

        # Apply the style to the table
        table.setStyle(style)

        # Automatically adjust row heights to fit the content
        table._argW = [2.5*inch, 4.0*inch]
        
        elements.append(table)

    doc.build(elements)

    print(f"PDF generated successfully with the patient data table: {pdf_file}")
