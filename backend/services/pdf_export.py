"""
PDF export using fpdf2 (pure Python, cross-platform).
Note: WeasyPrint (specified in CLAUDE.md) is the preferred choice for Linux/production
deployments but requires GTK3 system libs not available on Windows dev machines.
"""
from datetime import date
from fpdf import FPDF, XPos, YPos


# Colour palette
NAVY = (30, 58, 95)
WHITE = (255, 255, 255)
LIGHT_GRAY = (249, 250, 251)
MID_GRAY = (107, 114, 128)
BORDER_GRAY = (229, 231, 235)
GREEN = (22, 163, 74)
GREEN_BG = (240, 253, 244)
AMBER = (217, 119, 6)
AMBER_BG = (255, 251, 235)
RED = (220, 38, 38)
RED_BG = (254, 242, 242)
BLUE_LIGHT = (219, 234, 254)
BLUE_BG = (248, 250, 255)
DARK_TEXT = (17, 24, 39)
SECTION_TITLE_COLOR = (30, 58, 95)


def _score_color(score: int) -> tuple:
    if score >= 70:
        return GREEN
    if score >= 50:
        return AMBER
    return RED


def _score_bg(score: int) -> tuple:
    if score >= 70:
        return GREEN_BG
    if score >= 50:
        return AMBER_BG
    return RED_BG


def generate_pdf(
    url: str,
    business_name: str,
    performance: dict,
    seo: dict,
    ai_report: dict,
) -> bytes:
    pdf = _AuditPDF(url=url, business_name=business_name)
    pdf.add_page()

    pdf.set_auto_page_break(auto=True, margin=15)

    _render_scores(pdf, performance)
    _render_web_vitals(pdf, performance)
    _render_seo_findings(pdf, seo)
    _render_content_stats(pdf, seo)
    _render_ai_report(pdf, ai_report)

    return bytes(pdf.output())


class _AuditPDF(FPDF):
    def __init__(self, url: str, business_name: str):
        super().__init__()
        self._url = url
        self._business_name = business_name
        self._audit_date = date.today().strftime("%d %B %Y").lstrip("0")
        self.set_margins(left=15, top=0, right=15)

    def header(self):
        # Navy header block
        self.set_fill_color(*NAVY)
        self.rect(x=0, y=0, w=210, h=42, style="F")

        # Brand tag
        self.set_xy(15, 8)
        self.set_font("Helvetica", "B", 7)
        self.set_text_color(147, 197, 253)
        self.cell(0, 5, "WEBSITE AUDITOR", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        # Business name
        self.set_x(15)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(*WHITE)
        self.cell(130, 8, self._business_name[:50], new_x=XPos.RIGHT, new_y=YPos.TOP)

        # Date top-right
        self.set_xy(145, 8)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(147, 197, 253)
        self.cell(50, 5, f"Report: {self._audit_date}", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        # URL
        self.set_x(15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(191, 219, 254)
        self.cell(0, 5, self._url[:80], new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self.ln(6)
        self.set_text_color(*DARK_TEXT)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*MID_GRAY)
        self.cell(0, 5, f"Website Auditor  |  {self._audit_date}  |  {self._url}", align="C")

    def section_title(self, title: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(*SECTION_TITLE_COLOR)
        self.cell(0, 7, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        # Underline
        x = self.get_x()
        y = self.get_y()
        self.set_draw_color(*BLUE_LIGHT)
        self.set_line_width(0.5)
        self.line(x, y, x + 180, y)
        self.ln(3)
        self.set_text_color(*DARK_TEXT)


def _render_scores(pdf: _AuditPDF, performance: dict):
    pdf.section_title("Performance Scores")

    scores = [
        ("Performance", performance.get("performance_score", 0)),
        ("SEO", performance.get("seo_score", 0)),
        ("Accessibility", performance.get("accessibility_score", 0)),
    ]

    card_w = 57
    card_h = 28
    gap = 5
    start_x = pdf.get_x()
    y = pdf.get_y()

    for i, (label, score) in enumerate(scores):
        x = start_x + i * (card_w + gap)
        bg = _score_bg(score)
        color = _score_color(score)

        pdf.set_fill_color(*bg)
        pdf.set_draw_color(*color)
        pdf.set_line_width(0.3)
        pdf.rect(x, y, card_w, card_h, style="FD")

        # Score number
        pdf.set_xy(x, y + 4)
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(*color)
        pdf.cell(card_w, 12, str(score), align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)

        # Label
        pdf.set_xy(x, y + 17)
        pdf.set_font("Helvetica", "B", 7)
        pdf.set_text_color(*MID_GRAY)
        pdf.cell(card_w, 5, label.upper(), align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)

    pdf.set_y(y + card_h + 4)
    pdf.set_text_color(*DARK_TEXT)


def _render_web_vitals(pdf: _AuditPDF, performance: dict):
    metrics = [
        ("Time to Interactive", performance.get("load_time_seconds")),
        ("First Contentful Paint", performance.get("first_contentful_paint")),
        ("Largest Contentful Paint", performance.get("largest_contentful_paint")),
        ("Total Blocking Time", performance.get("total_blocking_time")),
        ("Cumulative Layout Shift", performance.get("cumulative_layout_shift")),
    ]
    metrics = [(k, v) for k, v in metrics if v and v != "N/A"]
    if not metrics:
        return

    pdf.section_title("Core Web Vitals")
    _table(pdf, ["Metric", "Value"], metrics, col_widths=[130, 50])


def _render_seo_findings(pdf: _AuditPDF, seo: dict):
    pdf.section_title("SEO & Design Findings")

    title_info = seo.get("has_title", {})
    meta_info = seo.get("has_meta_description", {})
    images_missing = seo.get("images_missing_alt", 0)
    total_images = seo.get("total_images", 0)

    rows = [
        ("Page Title",       title_info.get("present", False), title_info.get("value", "—")[:60] or "—"),
        ("Meta Description", meta_info.get("present", False),  (meta_info.get("value") or "Not set")[:60]),
        ("H1 Heading",       seo.get("has_h1", False),         f"{seo.get('h1_count', 0)} found"),
        ("HTTPS / Secure",   seo.get("has_https", False),       "Secure" if seo.get("has_https") else "Not secure"),
        ("Mobile Viewport",  seo.get("has_viewport_meta", False), "Configured" if seo.get("has_viewport_meta") else "Missing"),
        ("Phone Number",     seo.get("has_phone_number", False),   "Found" if seo.get("has_phone_number") else "Not found"),
        ("Call to Action",   seo.get("has_cta_above_fold", False), "Found" if seo.get("has_cta_above_fold") else "Not found"),
        ("Image Alt Text",   images_missing == 0,
         f"{total_images - images_missing}/{total_images} images have alt text" if total_images else "No images"),
    ]

    headers = ["Check", "Status", "Details"]
    col_widths = [55, 22, 103]

    y = pdf.get_y()
    x_start = pdf.get_x()

    # Header row
    pdf.set_fill_color(*LIGHT_GRAY)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(*MID_GRAY)
    pdf.set_draw_color(*BORDER_GRAY)
    pdf.set_line_width(0.2)
    for i, (header, w) in enumerate(zip(headers, col_widths)):
        pdf.cell(w, 7, header.upper(), border=1, fill=True, align="L",
                 new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.ln(7)

    for row_idx, (name, passed, detail) in enumerate(rows):
        fill = row_idx % 2 == 0
        pdf.set_fill_color(*(LIGHT_GRAY if fill else WHITE))
        pdf.set_font("Helvetica", "B", 8)
        pdf.set_text_color(*DARK_TEXT)
        pdf.cell(col_widths[0], 7, name, border=1, fill=fill, new_x=XPos.RIGHT, new_y=YPos.TOP)

        # Pass/Fail badge
        if passed:
            pdf.set_text_color(*GREEN)
            status_text = "Pass"
        else:
            pdf.set_text_color(*RED)
            status_text = "Fail"
        pdf.set_font("Helvetica", "B", 8)
        pdf.cell(col_widths[1], 7, status_text, border=1, fill=fill, align="C",
                 new_x=XPos.RIGHT, new_y=YPos.TOP)

        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(*MID_GRAY)
        pdf.cell(col_widths[2], 7, detail, border=1, fill=fill, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_text_color(*DARK_TEXT)


def _render_content_stats(pdf: _AuditPDF, seo: dict):
    pdf.section_title("Content Overview")

    stats = [
        (str(seo.get("word_count", 0)), "Word Count"),
        (str(seo.get("total_images", 0)), "Images"),
        (str(seo.get("internal_links", 0)), "Internal Links"),
        (str(seo.get("external_links", 0)), "External Links"),
    ]

    card_w = 42
    card_h = 22
    gap = 4
    x_start = pdf.get_x()
    y = pdf.get_y()

    pdf.set_draw_color(*BORDER_GRAY)
    pdf.set_line_width(0.2)

    for i, (value, label) in enumerate(stats):
        x = x_start + i * (card_w + gap)
        pdf.set_fill_color(*LIGHT_GRAY)
        pdf.rect(x, y, card_w, card_h, style="FD")

        pdf.set_xy(x, y + 3)
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(*SECTION_TITLE_COLOR)
        pdf.cell(card_w, 9, value, align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)

        pdf.set_xy(x, y + 13)
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(*MID_GRAY)
        pdf.cell(card_w, 5, label.upper(), align="C", new_x=XPos.RIGHT, new_y=YPos.TOP)

    pdf.set_y(y + card_h + 4)
    pdf.set_text_color(*DARK_TEXT)


def _render_ai_report(pdf: _AuditPDF, ai_report: dict):
    pdf.section_title("AI-Generated Recommendations")

    summary = ai_report.get("summary", "No report available.")

    # Light blue box background
    box_x = pdf.get_x()
    box_y = pdf.get_y()
    box_w = 180

    pdf.set_fill_color(*BLUE_BG)
    pdf.set_draw_color(*BLUE_LIGHT)
    pdf.set_line_width(0.3)

    # Measure required height
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*DARK_TEXT)

    # Draw the text inside the box
    pdf.set_xy(box_x + 4, box_y + 4)
    pdf.multi_cell(box_w - 8, 5.5, summary, fill=False, border=0,
                   new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    end_y = pdf.get_y() + 4

    # Draw the box behind the text (draw after so text is on top)
    pdf.rect(box_x, box_y, box_w, end_y - box_y, style="FD")

    # Re-render text on top of the box
    pdf.set_xy(box_x + 4, box_y + 4)
    pdf.set_fill_color(*BLUE_BG)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*DARK_TEXT)
    pdf.multi_cell(box_w - 8, 5.5, summary, fill=False, border=0,
                   new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_y(end_y + 2)


def _table(pdf: _AuditPDF, headers: list, rows: list, col_widths: list):
    pdf.set_fill_color(*LIGHT_GRAY)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(*MID_GRAY)
    pdf.set_draw_color(*BORDER_GRAY)
    pdf.set_line_width(0.2)

    for header, w in zip(headers, col_widths):
        pdf.cell(w, 7, header.upper(), border=1, fill=True, align="L",
                 new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.ln(7)

    for i, row in enumerate(rows):
        fill = i % 2 == 0
        pdf.set_fill_color(*(LIGHT_GRAY if fill else WHITE))
        pdf.set_font("Helvetica", "", 8 if i > 0 else 8)
        pdf.set_text_color(*DARK_TEXT)
        for j, (cell, w) in enumerate(zip(row, col_widths)):
            is_value = j == len(row) - 1
            if is_value:
                pdf.set_font("Helvetica", "B", 8)
            else:
                pdf.set_font("Helvetica", "", 8)
            pdf.cell(w, 7, str(cell), border=1, fill=fill,
                     new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.ln(7)

    pdf.set_text_color(*DARK_TEXT)
