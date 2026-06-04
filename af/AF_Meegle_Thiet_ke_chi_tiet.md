# ĐẶC TẢ MEEGLE — AMERICAN FASHION (AF)
> Đặc tả hệ thống Meegle cho chuỗi giá trị American Fashion (thống nhất, build-ready).

---

# THIẾT KẾ CHI TIẾT MEEGLE — AMERICAN FASHION (AF)
## Build-Ready Customization

---

## CHƯƠNG 1 — TỔNG QUAN HỆ THỐNG AF

### 1.1. Bối cảnh doanh nghiệp

**American Fashion (AF)** là công ty thời trang Việt Nam với chuỗi giá trị hoàn chỉnh từ ý tưởng đến khách hàng sử dụng. Tổ chức phân chia rõ ràng theo 2 leader chính:

- **Anh Calvin** — phụ trách chiến lược sản phẩm, ý tưởng, định hướng merchandising
- **Chị Diễm Chi** — phụ trách toàn bộ phát triển sản phẩm (từ thiết kế → kỹ thuật → mẫu → duyệt)

### 1.2. Các phòng ban trong flow

Từ PDF, AF có **12 phòng ban/đơn vị** tham gia:

1. **Production Planning** — Lập kế hoạch sản xuất
2. **Merchandising** — Phân tích thị trường, đề xuất sản phẩm
3. **Design** — Thiết kế phác thảo + chi tiết
4. **Purchasing** — Mua sắm NPL, tìm NCC
5. **Technical** — Rập, thông số, tài liệu kỹ thuật
6. **Sample Room** — May mẫu (mẫu gốc + size set)
7. **Production** — Quản lý sản xuất, tạo mã product
8. **Factory** — Nhà máy/xưởng may (có thể nội bộ hoặc gia công)
9. **Supplier** — Nhà cung cấp NPL
10. **QC** — Kiểm tra chất lượng
11. **Warehouse** — Kho (xuất NPL + nhập thành phẩm)
12. **Marketing** — Truyền thông sản phẩm
13. **Sales** — Bán hàng
14. **Accounting** — Kế toán, đối soát

### 1.3. Luồng chính 5 giai đoạn (theo PDF)

```
GIAI ĐOẠN 1: Ý TƯỞNG
  Production Planning + Merchandising → Product Brief

GIAI ĐOẠN 2: PHÁT TRIỂN SẢN PHẨM
  Design → Purchasing (NPL) → Technical → Sample Room → Duyệt (3 vòng) → Tạo mã Product

GIAI ĐOẠN 3: SẢN XUẤT
  Yêu cầu SX → Factory chào mẫu → Warehouse xuất NPL → Factory sản xuất → QC → Nhập kho

GIAI ĐOẠN 4: BÁN HÀNG
  Marketing → Sales → Khách hàng sử dụng → Accounting đối soát

GIAI ĐOẠN 5: HẬU MÃI (mở rộng)
  Returns → Adjustments → Inter-store Transfer → KPI
```

---

## CHƯƠNG 2 — WORK ITEM TYPES (21 WIT + 5 MASTER DATA)

### 2.1. Danh sách WIT theo thứ tự luồng

| # | WIT | Tên VN | Giai đoạn | Ghi chú |
|---|---|---|---|---|
| 01 | `collection` | Bộ sưu tập / Season | 1 | Chuẩn |
| 02 | `product-brief` | Brief sản phẩm | 1 | **MỚI** — Merchandising đề xuất, Calvin duyệt |
| 03 | `style` | Mẫu thiết kế | 2 | Tương tự nhưng ít template hơn (2: New / Restock) |
| 04 | `npl-check` | Kiểm tra NPL | 2 | **MỚI** — gate kiểm tra NPL có sẵn hay phải phát triển |
| 05 | `npl-development` | Phát triển NPL | 2 | **MỚI** — khi NPL thiếu, phải R&D hoặc tìm NCC mới |
| 06 | `material-po` | Đơn mua NPL | 2 | Gắn chặt với NPL Check |
| 07 | `pattern-making` | Rập & Thông số KT | 2 | **MỚI** — tách từ Tech Pack, chi tiết hơn (rập gốc → nhảy size → ban hành) |
| 08 | `sample-order` | Lệnh may mẫu | 2 | **MỚI** — Sample Room nhận lệnh may (mẫu gốc HOẶC size set) |
| 09 | `sample-review` | Duyệt mẫu | 2 | **3 loại**: Duyệt mẫu gốc / Duyệt nội bộ / Duyệt size set |
| 10 | `tech-doc` | Tài liệu KT sản xuất | 2 | Gộp Tech Pack + bảng thông số + tài liệu ban hành |
| 11 | `product-registration` | Đăng ký mã Product | 2 | **MỚI** — Production tạo mã trước khi sản xuất |
| 12 | `production-request` | Yêu cầu sản xuất | 3 | **MỚI** — cầu nối giữa PTSP và Factory |
| 13 | `factory-quotation` | Chào giá nhà máy | 3 | **MỚI** — Factory chào mẫu/giá trước khi nhận sản xuất |
| 14 | `production-order` | Lệnh sản xuất | 3 | Chuẩn |
| 15 | `production-lot` | Lô sản xuất | 3 | Chuẩn |
| 16 | `npl-issue` | Phiếu xuất NPL | 3 | **MỚI** — Warehouse xuất NPL cho Factory |
| 17 | `qc-inspection` | Phiếu kiểm tra QC | 3 | **MỚI** — QC riêng (kiểm NPL đầu vào + thành phẩm) |
| 18 | `inbound-lot` | Lô nhập kho | 3 | Chuẩn |
| 19 | `sku-master` | Master SKU | 3 | Mã tạo sớm (từ Product Registration) |
| 20 | `marketing-campaign` | Chiến dịch Marketing | 4 | **MỚI** — rộng hơn Media Production |
| 21 | `sales-order` | Đơn hàng | 4 | Tương tự Order Record |
| — | `allocation-order` | Phân bổ | 4 | Giữ nguyên nếu có multi-store |
| — | `store-receipt` | Phiếu nhận store | 4 | Giữ nguyên |
| — | `sync-job` | Job đồng bộ | 4 | Giữ nguyên |
| — | `discrepancy-ticket` | Ticket chênh lệch | Cross | Giữ nguyên |
| — | `return-lot` | Lô trả hàng | 5 | Giữ nguyên |
| — | `inventory-adjustment` | Điều chỉnh tồn | 5 | Giữ nguyên |

### Master Data:
- `vendor` (NCC NPL)
- `factory` (Nhà máy — **MỚI**, tách khỏi vendor)
- `store` (Cửa hàng)
- `color-master`
- `size-master`
- `material-master` (**MỚI** — danh mục NPL chuẩn)

---

## CHƯƠNG 3 — DATA DICTIONARY CHI TIẾT TỪNG WIT

### 3.1. WIT 01: COLLECTION (Season/Drop)
Không thay đổi.

### 3.2. WIT 02: PRODUCT BRIEF ★ MỚI ★
Mục đích: Merchandising + Production Planning đề xuất ý tưởng sản phẩm mới cho mùa. Calvin duyệt. Đây là bước **trước** khi có Style.

Fields chính: `brief_code` (auto `PB-<YYYYMM>-<seq>`), `collection`, `brief_title`, `product_category`, `target_segment`, `target_price_range`, `market_reference`, `target_qty_estimate`, `season_timing`, `merchandising_notes`, `proposed_by`, `approved_by` (Calvin), `approval_status`, `associated_styles`, `priority`, `status`.

**Workflow** `wf.product_brief.standard` (5 node): Draft Brief → Production Planning Review → Calvin Approval → Assign to Design → Closed.

### 3.3. WIT 03: STYLE (Mẫu thiết kế)
Có **2 template**: "Style — New Design" (16 node) và "Style — Restock" (6 node).

Fields chính: `style_code`, `style_name`, `collection`, `product_brief` (MỚI — link ngược), `product_category`, `segment`, `designer`, `design_lead` (Diễm Chi), `sketch_rough`, `sketch_detail`, `color_palette`, `size_run`, `material_main`, `npl_check`, `pattern_making`, `sample_orders`, `sample_reviews`, `tech_doc`, `product_registration`, `target_qty_total`, `cogs_target`, `retail_price`, `margin_pct`, `status`.

### 3.4. WIT 04: NPL CHECK ★ MỚI ★
Mục đích: Purchasing kiểm tra NPL có sẵn không. Nếu thiếu → rẽ nhánh "Phát triển NPL" hoặc "Dùng NPL thay thế".

Fields: `check_code`, `style`, `material_list` (sub-table), `check_date`, `checker`, `overall_result` (Đầy đủ / Thiếu một phần / Thiếu toàn bộ), `missing_items` (sub-table), `npl_development`, `material_pos`, `status`.

**Workflow** `wf.npl_check.standard` (4 node): Kiểm tra tồn NPL → Quyết định → Xử lý thiếu → Hoàn tất.

### 3.5. WIT 05: NPL DEVELOPMENT ★ MỚI ★
Mục đích: Khi NPL chưa có trên thị trường hoặc cần phát triển riêng.

Fields: `dev_code`, `npl_check`, `style`, `material_name`, `material_spec`, `target_suppliers`, `samples_received`, `selected_supplier`, `lab_test_result`, `unit_price_final`, `lead_time_days`, `alternative_material`, `status`.

**Workflow** `wf.npl_development.standard` (7 node): Xác định yêu cầu → Tìm NCC → Nhận mẫu NPL → Thử mẫu nội bộ → Duyệt NPL → Chốt NCC & giá → Hoàn tất.

### 3.6. WIT 06: MATERIAL PO
2 template: Stock Item / Custom Development. Field `npl_check_ref`.

### 3.7. WIT 07: PATTERN MAKING (Rập & Thông số) ★ MỚI ★
Mục đích: Technical làm rập mẫu gốc, nhảy rập size set, ban hành bảng thông số.

Fields: `pattern_code`, `style`, `pattern_type` (Rập mẫu gốc / Rập size set), `base_size`, `pattern_file`, `spec_sheet`, `size_grading_table`, `grading_rule`, `fabric_consumption`, `trim_list`, `version`, `created_by`, `approved_by`, `status`.

**Workflow** `wf.pattern_making.standard` (6 node): Làm rập mẫu gốc → Bảng thông số KT → Gửi Sample Room → Nhảy rập size set → Gửi may size set → Ban hành tài liệu KT.

### 3.8. WIT 08: SAMPLE ORDER ★ MỚI ★
Mục đích: Lệnh may mẫu gửi Sample Room. 2 loại: mẫu gốc (1 cái, base size) và size set (đủ size).

Fields: `sample_code`, `style`, `sample_type` (Mẫu gốc / Size set / Mẫu chào), `pattern`, `size_list`, `qty_per_size`, `material_source`, `deadline`, `assigned_to`, `sample_photos`, `completion_date`, `status`.

**Workflow** `wf.sample_order.standard` (5 node): Nhận lệnh → Cắt & May → Kiểm tra nội bộ → Giao mẫu → Closed.

### 3.9. WIT 09: SAMPLE REVIEW (Duyệt mẫu — 3 loại)
AF có **3 vòng duyệt riêng biệt**, không gộp.

Fields: `review_code`, `style`, `review_type` (Duyệt mẫu gốc / Duyệt nội bộ / Duyệt size set), `sample_order`, `review_date`, `reviewers`, `chair`, `fitting_photos`, `measurement_check` (sub-table), `result` (Đạt / Không đạt — sửa / Không đạt — hủy), `feedback`, `iteration_round`, `status`.

**Workflow** `wf.sample_review.standard` (4 node): Chuẩn bị → Thử mẫu → Quyết định → Closed.

### 3.10. WIT 10: TECH DOC (Tài liệu KT sản xuất)
Fields: `doc_code`, `style`, `pattern`, `version`, `spec_sheet_final`, `construction_guide`, `material_bom`, `quality_standards`, `packing_instructions`, `approved_by` (Diễm Chi), `is_locked`, `status`.

**Workflow** `wf.tech_doc.standard` (4 node): Soạn → Review nội bộ → Duyệt (Diễm Chi) → Ban hành (lock).

### 3.11. WIT 11: PRODUCT REGISTRATION ★ MỚI ★
AF tạo mã Product **trước khi sản xuất** (sau duyệt mẫu).

Fields: `product_code`, `style`, `color_list`, `size_list`, `sku_matrix` (sub-table — SINH MÃ SKU TẠI ĐÂY), `retail_price`, `registered_by`, `registered_date`, `pos_synced`, `skus_created`, `status`.

**Workflow** `wf.product_registration.standard` (4 node): Xác nhận thông tin → Tạo mã SKU → Đồng bộ POS → Closed.
**Đây là điểm "explode" của AF** — xảy ra TRƯỚC sản xuất.

### 3.12. WIT 12: PRODUCTION REQUEST ★ MỚI ★
Cầu nối chính thức giữa PTSP và Sản xuất.

Fields: `request_code`, `style`, `tech_doc`, `product_registration`, `target_qty`, `color_size_breakdown`, `target_delivery_date`, `factory_preference`, `special_instructions`, `requested_by`, `approved_by`, `status`.

**Workflow** `wf.production_request.standard` (4 node): Lập yêu cầu → Duyệt → Chuyển Factory → Closed.

### 3.13. WIT 13: FACTORY QUOTATION ★ MỚI ★
Factory nhận yêu cầu → chào giá/chào mẫu → duyệt.

Fields: `quote_code`, `production_request`, `factory`, `style`, `quoted_price_per_unit`, `quoted_lead_time_days`, `min_order_qty`, `capacity_available`, `sample_required`, `sample_result`, `total_amount`, `negotiation_notes`, `selected`, `status`.

**Workflow** `wf.factory_quotation.standard` (6 node): Gửi yêu cầu báo giá → Factory chào mẫu/giá → May mẫu chào → Đánh giá & chọn → Duyệt giá → Closed.

### 3.14. WIT 14: PRODUCTION ORDER
2 template: Internal Factory / OEM. Field `factory_quotation`.

### 3.15. WIT 15: PRODUCTION LOT
Chia đợt giao, theo dõi tiến độ may.

### 3.16. WIT 16: NPL ISSUE (Phiếu xuất NPL) ★ MỚI ★
Warehouse xuất NPL cho Factory trước khi sản xuất.

Fields: `issue_code`, `production_order`, `production_lot`, `factory`, `issue_table`, `total_qty`, `issue_date`, `issued_by`, `received_by`, `delivery_note`, `status`.

**Workflow** `wf.npl_issue.standard` (4 node): Lập phiếu xuất → Duyệt xuất → Giao NPL → Closed.

### 3.17. WIT 17: QC INSPECTION ★ MỚI ★
QC là phòng riêng, kiểm tra: NPL đầu vào, giữa chuyền, thành phẩm cuối.

Fields: `qc_code`, `inspection_type` (NPL Incoming / In-line / Final / Pre-shipment), `source`, `style`, `factory`, `inspection_date`, `inspector`, `sample_size`, `total_inspected`, `pass_qty`, `fail_qty`, `pass_rate`, `defect_categories`, `defect_photos`, `result` (Pass / Conditional Pass / Fail), `corrective_action`, `aql_standard`, `report_file`, `status`.

**Workflow** `wf.qc_inspection.standard` (5 node): Lên kế hoạch → Thực hiện kiểm tra → Đánh giá kết quả → Corrective Action → Closed.

### 3.18. WIT 18: INBOUND LOT
Không có bước Generate SKU (SKU đã tạo ở Product Registration). Inbound Lot chỉ map qty về SKU đã tồn tại.

**Workflow** `wf.inbound_lot.af` (5 node): Awaiting Arrival → Goods Arrived & Count → QC Final → Stock In by SKU → Ready for Allocation.

### 3.19. WIT 19: SKU MASTER
SKU tạo ở Product Registration (trước sản xuất).

### 3.20. WIT 20: MARKETING CAMPAIGN ★ MỚI ★
Scope rộng: đa kênh, có KPI & ngân sách.

Fields: `campaign_code`, `campaign_name`, `collection`, `styles`, `campaign_type`, `channels`, `budget`, `start_date`, `end_date`, `content_plan`, `creative_assets`, `photographer`, `shoot_date`, `kpi_targets`, `actual_results`, `owner`, `status`.

**Workflow** `wf.marketing_campaign.standard` (7 node): Brief → Content Planning → Production → Review → Launch → Running → Report & Close.

### 3.21. WIT 21: SALES ORDER
Tương tự Order Record.

### Các WIT còn lại
Allocation Order, Store Receipt, Sync Job, Discrepancy Ticket, Return Lot, Inventory Adjustment — giữ nguyên.

---

## CHƯƠNG 4 — WORKFLOW CHI TIẾT: STYLE "NEW DESIGN" (16 NODE — ĐẶC THÙ AF)

```
Node 1: Brief & Ý tưởng
    ↓
Node 2: Thiết kế phác thảo
    ↓
Node 3: Thiết kế chi tiết
    ↓
Node 4: Kiểm tra NPL ──→ [Thiếu] → NPL Development / Material PO
    ↓ [Đầy đủ]
Node 5: Làm rập mẫu gốc
    ↓
Node 6: May mẫu gốc
    ↓
Node 7: ★ Duyệt mẫu gốc? ──→ [No] → Loop Node 5/6
    ↓ [Yes]
Node 8: Thử mẫu nội bộ
    ↓
Node 9: ★ Duyệt nội bộ? ──→ [No] → Chọn mẫu lại / Hủy
    ↓ [Yes]
Node 10: Nhảy rập size set
    ↓
Node 11: May size set
    ↓
Node 12: ★ Duyệt size set? ──→ [No] → Loop Node 10/11
    ↓ [Yes]
Node 13: Ban hành Tài liệu KT sản xuất
    ↓
Node 14: Tạo mã Product (Product Registration)
    ↓
Node 15: Yêu cầu sản xuất
    ↓
Node 16: Closed (chờ Production hoàn tất)
```

### Chi tiết từng node

**Node 1 — Brief & Ý tưởng** — Owner: Designer. Nhận brief từ Product Brief (đã duyệt bởi Calvin). Inherit fields từ Product Brief.

**Node 2 — Thiết kế phác thảo** — Owner: Designer. Form: sketch_rough (≥3 phương án). Custom button: "Gửi Diễm Chi duyệt phác thảo".

**Node 3 — Thiết kế chi tiết** — Owner: Designer. Condition: Diễm Chi đã chọn phương án. Form: sketch_detail, color_palette, size_run, material_main. On-complete: lock sketch_rough.

**Node 4 — Kiểm tra NPL** — Owner: Purchasing. Automation `A_ST1`: tạo NPL Check. **Gate**: Node 4 không complete cho đến khi NPL Check.status = Hoàn tất VÀ overall_result = Đầy đủ.

**Node 5 — Làm rập mẫu gốc** — Owner: Technical. Automation `A_ST2`: tạo Pattern Making (type: Rập mẫu gốc). Estimated: 2–3 days.

**Node 6 — May mẫu gốc** — Owner: Sample Room. Automation `A_ST3`: tạo Sample Order (type: Mẫu gốc). Estimated: 3–5 days.

**Node 7 — Duyệt mẫu gốc ★ GATE 1 ★** — Owner: Chị Diễm Chi. Automation `A_ST4`: tạo Sample Review (type: Duyệt mẫu gốc). Custom buttons: "Đạt" → Node 8; "Sửa" → rollback Node 5 (version +1, loop); "Hủy sản phẩm" → terminal "Hủy". Escalation: > 3 lần → Calvin.

**Node 8 — Thử mẫu nội bộ** — Owner: Production Planning + Merchandising + Design. Đánh giá thương mại (bán được không?).

**Node 9 — Duyệt nội bộ ★ GATE 2 ★** — Owner: Anh Calvin. Automation `A_ST5`: tạo Sample Review (type: Duyệt nội bộ). Buttons: "Chọn mẫu" → Node 10; "Không chọn — on hold" → park; "Hủy sản phẩm" → terminal. Gate **go/no-go thương mại**.

**Node 10 — Nhảy rập size set** — Owner: Technical. Form: pattern_making.size_grading_table. Estimated: 1–2 days.

**Node 11 — May size set** — Owner: Sample Room. Automation `A_ST6`: tạo Sample Order (type: Size set). Estimated: 5–7 days.

**Node 12 — Duyệt size set ★ GATE 3 ★** — Owner: Chị Diễm Chi + Technical. Automation `A_ST7`: tạo Sample Review (type: Duyệt size set). Focus: grading đúng qua các size? Buttons: "Đạt" → Node 13; "Sửa" → rollback Node 10; "Hủy" → terminal.

**Node 13 — Ban hành Tài liệu KT sản xuất** — Owner: Technical. Automation `A_ST8`: tạo Tech Doc. On-complete: lock tất cả field thiết kế.

**Node 14 — Tạo mã Product** — Owner: Production. Automation `A_ST9`: tạo Product Registration. **Điểm "explode" Style → SKU của AF**.

**Node 15 — Yêu cầu sản xuất** — Owner: Production Planning. Automation `A_ST10`: tạo Production Request. On-complete: Style → "Đang sản xuất".

**Node 16 — Closed (In Production → Bán hàng)** — Auto-complete khi Production Order hoàn tất + Inbound Lot nhập kho. Status cuối: "Sẵn sàng bán".

---

## CHƯƠNG 5 — AUTOMATION REGISTRY (AF-SPECIFIC)

| ID | Trigger | Condition | Action |
|---|---|---|---|
| `A_PB1` | Product Brief.Node4 arrived | — | Create Style, link product_brief, inherit category/segment |
| `A_ST1` | Style.Node4 (Kiểm tra NPL) arrived | npl_check empty | Create NPL Check, link style |
| `A_ST2` | Style.Node5 arrived | pattern_making empty | Create Pattern Making (type: Rập mẫu gốc) |
| `A_ST3` | Style.Node6 arrived | — | Create Sample Order (type: Mẫu gốc) |
| `A_ST4` | Sample Order (mẫu gốc) closed | — | Create Sample Review (type: Duyệt mẫu gốc) |
| `A_ST5` | Style.Node9 arrived | — | Create Sample Review (type: Duyệt nội bộ) |
| `A_ST6` | Style.Node11 arrived | — | Create Sample Order (type: Size set) |
| `A_ST7` | Sample Order (size set) closed | — | Create Sample Review (type: Duyệt size set) |
| `A_ST8` | Style.Node13 arrived | tech_doc empty | Create Tech Doc |
| `A_ST9` | Style.Node14 arrived | product_registration empty | Create Product Registration |
| `A_ST10` | Style.Node15 arrived | — | Create Production Request |
| `A_NPL1` | NPL Check.Node3 for each missing item | — | Create NPL Development OR Material PO |
| `A_PAT1` | Pattern Making.Node3 | — | Create Sample Order (type: Mẫu gốc) |
| `A_PAT2` | Pattern Making.Node5 | — | Create Sample Order (type: Size set) |
| `A_PAT3` | Pattern Making.Node6 | — | Create Tech Doc draft |
| `A_PR1` | Product Registration.Node2 | — | Create SKU Master per color×size |
| `A_PR2` | SKU Master created | pos_synced=Off | Push to KiotViet/POS |
| `A_PRQ1` | Production Request.Node3 | — | Create Factory Quotation |
| `A_FQ1` | Factory Quotation.Node5 selected=On | — | Create Production Order |
| `A_PO1` | Production Order confirmed | — | Create Production Lot per delivery round |
| `A_PO2` | Production Order.Node "Material Ready" | — | Create NPL Issue per lot |
| `A_LOT1` | Production Lot.Node "Shipped" | — | Create Inbound Lot |
| `A_IB1` | Inbound Lot.Node3 QC | — | Create QC Inspection (type: Final) |
| `A_IB2` | Inbound Lot.Node4 complete | — | Update SKU Master stock (SKU đã tồn tại) |
| `A_ALO1` | Allocation Order approved | — | Push KiotViet + Create Store Receipts |
| `A_KILL` | Sample Review result="Hủy" | — | Set Style.status=Hủy, lock all fields, notify team |

---

## CHƯƠNG 6 — SƠ ĐỒ QUAN HỆ AF (RELATIONSHIP MAP)

```
Collection (1)
└── Product Brief (N) ────────────── R1 Parental
    └── Style (N) ────────────────── R2 Parental
        ├── NPL Check (1) ──────── R3 Parental
        │   └── NPL Development (N) ── R4 Parental
        │   └── Material PO (N) ──── R5 Normal N:N
        ├── Pattern Making (N) ──── R6 Parental (versions)
        ├── Sample Order (N) ────── R7 Parental
        │   └── Sample Review (N) ── R8 Parental (per sample order)
        ├── Tech Doc (1) ──────────── R9 Parental
        ├── Product Registration (1) ── R10 Parental
        │   └── SKU Master (N) ──── R11 Parental ★ EXPLODE POINT ★
        ├── Production Request (1) ── R12 Parental
        │   └── Factory Quotation (N) ── R13 Parental
        │       └── Production Order (1) ── R14 Normal
        │           ├── Production Lot (N) ── R15 Parental
        │           │   ├── NPL Issue (N) ── R16 Parental
        │           │   ├── QC Inspection (N) ── R17 Normal
        │           │   └── Inbound Lot (1) ── R18 Parental
        │           │       └── QC Inspection (1) ── R17 (reuse)
        │           └── NPL Issue (aggregate) ── R16
        ├── Marketing Campaign (N:N) ── R19 Normal
        └── SKU Master (N) ──── R20 Normal (Style↔SKU direct)

SKU Master
├── Allocation Order (N:N) ── R21 Normal
│   └── Store Receipt (N) ── R22 Parental
├── Sales Order (N:N) ── R23 Normal
├── Return Lot (N:N) ── R24 Normal
├── Inventory Adjustment (N:N) ── R25 Normal
└── Sync Job (N) ── R26 Normal

MASTER DATA:
  Vendor → Material PO, NPL Development
  Factory → Factory Quotation, Production Order, Production Lot, NPL Issue
  Store → Allocation Order, Store Receipt, Sales Order
  Color Master → Style, SKU
  Size Master → Style, SKU
  Material Master → NPL Check, Material PO, NPL Issue, Tech Doc BOM
```

---

## CHƯƠNG 7 — LUỒNG VẬN HÀNH END-TO-END (KỊCH BẢN THỰC TẾ AF)

### Kịch bản: "Áo polo nam basic SP26 — từ ý tưởng đến bán hàng"

1. **Ý tưởng**: Merchandiser Hà phân tích trend → tạo Product Brief "Polo nam basic cotton 250gsm, 3 màu, target 500k". Production Planning review → Calvin duyệt "GO".
2. **Thiết kế**: Automation tạo Style. Designer Lan phác thảo 3 phương án. Diễm Chi chọn "slim fit" → thiết kế chi tiết, 3 màu (Trắng/Đen/Navy), 5 size (S–XXL).
3. **NPL**: NPL Check — cotton pique 250gsm có sẵn (2 màu), thiếu Navy → NPL Development → 3 NCC → chọn NCC Á Châu, 15 ngày lead time.
4. **Rập & Mẫu gốc**: Technical Hoàng làm rập base size M → Sample Room may 1 cái size M trắng (3 ngày).
5. **Duyệt mẫu gốc (Gate 1)**: Diễm Chi fitting → vai rộng 1cm → "Sửa" → loop → duyệt lần 2 "Đạt".
6. **Duyệt nội bộ (Gate 2)**: Calvin, Merchandising, Sales xem → "Chọn, tăng lên 4 màu — thêm Olive". Target 2000 cái.
7. **Size set**: Hoàng nhảy rập S/M/L/XL/XXL → Sample Room may 5 cái → duyệt size set "Đạt".
8. **Tech Doc**: compile spec + construction guide + BOM → Diễm Chi duyệt → Lock.
9. **Tạo mã Product**: Generate 20 SKU (4 màu × 5 size) → barcode → đẩy KiotViet. **SKU tồn tại trước sản xuất** (pre-order).
10. **Yêu cầu sản xuất**: 2000 cái, WHT 600/BLK 500/NVY 500/OLI 400. Delivery 45 ngày.
11. **Chào giá Factory**: Nội bộ 45k/40 ngày vs OEM-B 38k/50 ngày → chọn nội bộ.
12. **Sản xuất**: 2 Production Lot. Warehouse xuất NPL. QC 100% → 97% pass.
13. **Nhập kho**: Inbound Lot → QC Final → Stock In (map vào 20 SKU đã có).
14. **Phân bổ**: Allocation Order chia 8 store. Push KiotViet.
15. **Bán hàng**: Marketing campaign. Sales online + offline. Accounting đối soát.

---

## CHƯƠNG 8 — ROLE MATRIX AF

### 8.1. Danh sách Role (16 role)

| Role | Phòng ban | Trách nhiệm chính |
|---|---|---|
| `creative_director` | Lãnh đạo (Anh Calvin) | Duyệt ý tưởng, duyệt giá, duyệt nội bộ |
| `product_dev_director` | Lãnh đạo (Chị Diễm Chi) | Duyệt mẫu gốc, duyệt size set, duyệt Tech Doc |
| `merchandiser` | Merchandising | Product Brief, forecast |
| `production_planner` | Production Planning | Lập kế hoạch SX, request, allocation |
| `designer` | Design | Sketch, detail, color |
| `purchasing` | Purchasing | NPL Check, tìm NCC, Material PO |
| `technical` | Technical | Rập, thông số, grading, Tech Doc |
| `sample_room_lead` | Sample Room | May mẫu gốc + size set |
| `production_manager` | Production | Tạo mã, quản lý PO, lot |
| `factory_contact` | Factory | Chào giá, sản xuất |
| `qc_inspector` | QC | Kiểm tra NPL + thành phẩm |
| `warehouse_manager` | Warehouse | Xuất NPL, nhập thành phẩm |
| `marketing_lead` | Marketing | Campaign |
| `sales_lead` | Sales | Bán hàng, duyệt allocation |
| `store_manager` | Store | Nhận hàng, bán |
| `accountant` | Accounting | Đối soát, thanh toán |
| `space_admin` | IT | System admin |

### 8.2. RACI cho Style "New Design" workflow

| Node | R | A | C | I |
|---|---|---|---|---|
| N1 Brief | Designer | Diễm Chi | Merchandiser | Calvin |
| N2 Phác thảo | Designer | Diễm Chi | — | — |
| N3 Chi tiết | Designer | Diễm Chi | Technical | Purchasing |
| N4 NPL Check | Purchasing | Diễm Chi | Technical | Production Planning |
| N5 Rập | Technical | Diễm Chi | Designer | — |
| N6 May mẫu | Sample Room | Diễm Chi | Technical | — |
| N7 Duyệt mẫu gốc | Diễm Chi | Calvin | Technical, Designer | Production Planning |
| N8 Thử nội bộ | Production Planning | Calvin | Merchandiser, Sales | — |
| N9 Duyệt nội bộ | Calvin | Calvin | Diễm Chi | All |
| N10 Nhảy size | Technical | Diễm Chi | — | — |
| N11 May size set | Sample Room | Diễm Chi | Technical | — |
| N12 Duyệt size set | Diễm Chi + Technical | Diễm Chi | — | Calvin |
| N13 Tech Doc | Technical | Diễm Chi | — | Production |
| N14 Mã Product | Production | Production Planning | — | Sales, Marketing |
| N15 Yêu cầu SX | Production Planning | Diễm Chi | Calvin | Factory |

---

## CHƯƠNG 9 — PANORAMIC VIEWS AF

1. **Pipeline sản phẩm** (Calvin + Diễm Chi) — Kanban grouped by Style.current_node.
2. **NPL Health** (Purchasing) — Grid: NPL Check + NPL Development + Material PO, filter status ≠ Closed.
3. **Sample & Approval Tracker** (Diễm Chi) — Grid + Calendar: Sample Order + Sample Review.
4. **Production Dashboard** (Production Planning) — Gantt: Production Request + Factory Quotation + Production Order + Production Lot.
5. **Warehouse Operations** (Warehouse Manager) — Kanban: NPL Issue + Inbound Lot + Allocation Order.
6. **Quality Overview** (QC Lead) — Grid: QC Inspection (all types), grouped by inspection_type.
7. **End-to-End Style Tracker** (Calvin + Diễm Chi) — Tree: Collection → Product Brief → Style → ... → Inbound.
8. **Cost & Budget** (Accounting + Calvin) — Grid: Material PO + Factory Quotation + Production Order.

---

## CHƯƠNG 11 — BUILD ORDER AF (25 NGÀY)

### Sprint 1 (Day 1–7): Foundation
- Day 1: Space + 16 Roles + Master Data (Vendor, Factory, Store, Color, Size, Material)
- Day 2: Field options + Common fields
- Day 3: WIT 01–05 (Collection, Product Brief, Style, NPL Check, NPL Development)
- Day 4: WIT 06–10 (Material PO, Pattern Making, Sample Order, Sample Review, Tech Doc)
- Day 5: WIT 11–17
- Day 6: WIT 18–21 + remaining
- Day 7: All Relationships (R1–R26) + Detail Page Layouts

### Sprint 2 (Day 8–14): Workflows & Automations
- Day 8: Workflow Style "New Design" (16 node)
- Day 9: Workflow Style "Restock" + Product Brief + NPL Check + NPL Development
- Day 10: Workflow Pattern Making + Sample Order + Sample Review + Tech Doc + Product Registration
- Day 11: Workflow Production Request + Factory Quotation + Production Order + Production Lot
- Day 12: Workflow NPL Issue + QC Inspection + Inbound Lot + Allocation + Store Receipt
- Day 13: Automations A_PB1 → A_ST10, A_NPL1, A_PAT1–3, A_PR1–2
- Day 14: Automations A_PRQ1, A_FQ1, A_PO1–2, A_LOT1, A_IB1–2, A_ALO1, A_KILL + SLA + Notifications

### Sprint 3 (Day 15–21): Views & Integration
- Day 15: 8 Panoramic Views
- Day 16: 16 Role Views
- Day 17: KiotViet integration (Push SKU, Push transfer, Pull stock)
- Day 18: Validation rules + Approval thresholds
- Day 19: Pilot 1 Style end-to-end
- Day 20: Training Diễm Chi + Calvin + Design + Technical
- Day 21: Training Purchasing + Sample Room + Production + Warehouse

### Sprint 4 (Day 22–25): Go-live
- Day 22: Training QC + Marketing + Sales + Store Manager
- Day 23: Load test + regression
- Day 24: Go-live pilot (5 Styles)
- Day 25: Buffer + bug fixes + on-call
