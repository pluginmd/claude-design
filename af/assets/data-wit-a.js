/* Deep data — Work Item Types 01–11 (stage 1–2). Merges into MEEGLE_DATA.wit */
window.MEEGLE_DATA = window.MEEGLE_DATA || {};
window.MEEGLE_DATA.wit = window.MEEGLE_DATA.wit || {};
Object.assign(window.MEEGLE_DATA.wit, {

  'collection': {
    seq:'01', name:'Collection', code:'collection', stage:'s1', badge:{t:'keep',label:'nền tảng'}, wf:null,
    purpose:'Khung mùa vụ (Season/Drop) chứa toàn bộ Product Brief và Style của một mùa. Là gốc của cây quan hệ.',
    fields:[
      ['collection_code','Text','y','Auto SS-YYYY'],
      ['season','Single select','y','SP / SS / FW / Holiday'],
      ['launch_window','Date range','y','Khung ra mắt'],
      ['theme','Text','n','Chủ đề mùa'],
      ['target_revenue','Currency','n','Mục tiêu doanh thu mùa']
    ],
    nodes:[],
    related:[{t:'wit',id:'product-brief',tag:'con',kind:'Sinh ra N Product Brief (R1)'}],
    autos:[], roles:['merchandiser','production_planner']
  },

  'product-brief': {
    seq:'02', name:'Brief sản phẩm', code:'product-brief', stage:'s1', badge:{t:'new',label:'MỚI'}, wf:'5 node',
    purpose:'Merchandising + Production Planning đề xuất ý tưởng sản phẩm mới cho mùa. Calvin duyệt. Bước TRƯỚC khi có Style: ý tưởng được đề xuất từ thị trường và duyệt top-down.',
    fields:[
      ['brief_code','Text','y','Auto PB-YYYYMM-seq'],
      ['collection','Associated','y','Thuộc mùa nào'],
      ['brief_title','Text','y','"Áo polo nam basic mùa hè"'],
      ['product_category','Single select','y','Áo / Quần / Đầm / Jacket…'],
      ['target_segment','Single select','y','Nam / Nữ / Unisex / Kids'],
      ['target_price_range','Text','y','"350k–500k"'],
      ['market_reference','Attachment/URL','n','Ảnh trend, competitor ref'],
      ['merchandising_notes','Rich text','y','Phân tích thị trường, lý do đề xuất'],
      ['approved_by','Person','y','Calvin'],
      ['approval_status','Single select','c','Pending / Approved / Rejected / On-hold'],
      ['associated_styles','Associated (multi)','n','Sau duyệt → tạo Style']
    ],
    nodes:[
      {n:1,title:'Draft Brief',owner:'Merchandiser',tasks:['Phân tích trend mùa','Benchmark competitor','Xác định price range']},
      {n:2,title:'Production Planning Review',owner:'Production Planning',tasks:['Đánh giá khả thi sản xuất','Ước lượng lead time','Check năng lực nhà máy']},
      {n:3,title:'Calvin Approval',owner:'Anh Calvin',gate:true,tasks:['Đánh giá chiến lược mùa'],btns:[{k:'ok',t:'Duyệt → N4'},{k:'fix',t:'Cần bổ sung → N1'},{k:'kill',t:'Reject'}]},
      {n:4,title:'Assign to Design',owner:'Production Planning',tasks:['Chuyển brief cho Design','Set deadline thiết kế'],auto:'A_PB1 → tạo Style'},
      {n:5,title:'Closed',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'collection',tag:'cha',kind:'Thuộc Collection (R1)'},
      {t:'wit',id:'style',tag:'con',kind:'Sinh ra Style khi duyệt (R2)'}
    ],
    autos:['A_PB1'], roles:['merchandiser','production_planner','creative_director']
  },

  'style': {
    seq:'03', name:'Mẫu thiết kế', code:'style', stage:'s2', badge:{t:'tmpl',label:'3 template'}, wf:'Sản xuất 14 / FOB 11',
    purpose:'Xương sống của toàn hệ thống. Trường development_mode chọn 1 trong 3 template: "Sản xuất" (14 node — AF làm chủ rập, mẫu, NPL; 2 gate duyệt mẫu gốc & size set), "FOB" (11 node — nhà cung cấp chào mẫu & làm rập; 2 gate chọn mẫu & duyệt nội bộ), và "Restock" (6 node). Cả hai luồng phát triển hội tụ tại "Tạo mã Product". Mọi WIT con treo dưới Style.',
    fields:[
      ['style_code','Text','y','Theo quy tắc AF'],
      ['development_mode','Single select','y','Sản xuất (in-house) / FOB / Restock — quyết định template workflow'],
      ['product_brief','Associated','y','MỚI — link ngược brief gốc'],
      ['designer','Person','y','Người thiết kế'],
      ['design_lead','Person','y','Chị Diễm Chi'],
      ['sketch_rough','Attachment (multi)','y','Phác thảo ≥3 phương án'],
      ['sketch_detail','Attachment (multi)','y','Thiết kế chi tiết'],
      ['color_palette','Multi select','y','Bảng màu dự kiến'],
      ['size_run','Multi select','y','Dải size'],
      ['material_main','Text/Assoc','y','NPL chính'],
      ['cogs_target','Currency','y','Giá vốn mục tiêu'],
      ['retail_price','Currency','y','Giá bán'],
      ['margin_pct','Formula','n','= (retail−cogs)/retail']
    ],
    nodeNote:'Dưới đây là template "Sản xuất" (14 node). Template "FOB" (11 node) xem tab Workflow · nhánh B.',
    nodes:[
      {n:1,title:'Ý tưởng',owner:'Merchandising / PP',tasks:['Nhận Product Brief đã duyệt','Inherit category, segment, price range']},
      {n:2,title:'Thiết kế phác thảo',owner:'Designer',tasks:['Flat sketch ≥3 phương án','Color direction','Suggest material'],btns:[{k:'ok',t:'Gửi Diễm Chi duyệt'}]},
      {n:3,title:'Thiết kế chi tiết',owner:'Designer',tasks:['Detail front/back/side','Render colorway','Spec sơ bộ cho Purchasing']},
      {n:4,title:'Kiểm tra NPL?',owner:'Purchasing',gate:true,tasks:['Check tồn NPL','Đối chiếu BOM','Gate: đủ mới qua · Thiếu → Phát triển/thay thế'],auto:'A_ST1 → tạo NPL Check'},
      {n:5,title:'Làm rập mẫu gốc',owner:'Technical',tasks:['Vẽ rập base size','Tính định mức','Soạn bảng thông số'],auto:'A_ST2 → tạo Pattern Making'},
      {n:6,title:'May mẫu gốc',owner:'Sample Room',tasks:['Chuẩn bị NPL','Cắt → may → hoàn thiện','Chụp ảnh'],auto:'A_ST3 → tạo Sample Order'},
      {n:7,title:'Thử mẫu nội bộ',owner:'Design + PP + Merch',tasks:['Fitting / mannequin','Đánh giá tổng thể trước khi trình duyệt']},
      {n:8,title:'Duyệt mẫu gốc?',owner:'Diễm Chi',gate:true,tasks:['Đo kiểm thông số','Đánh giá form & tính thương mại','Escalate Calvin nếu >3 vòng'],auto:'A_ST4 → Sample Review',btns:[{k:'ok',t:'Đạt → N9'},{k:'fix',t:'Sửa → N5'},{k:'kill',t:'Hủy SP'}]},
      {n:9,title:'Nhảy rập size set',owner:'Technical',tasks:['Nhảy rập base → full run','Verify grading rule']},
      {n:10,title:'May size set mẫu gốc',owner:'Sample Room',tasks:['May đủ size run','Kiểm tra từng size'],auto:'A_ST6 → Sample Order'},
      {n:11,title:'Thử size set mẫu gốc',owner:'Technical + Sample Room',tasks:['Mặc thử / đo từng size','Kiểm grading thực tế']},
      {n:12,title:'Duyệt size set?',owner:'Diễm Chi',gate:true,tasks:['Grading đúng qua size?','Mọi điểm đo phải Pass'],auto:'A_ST7 → Sample Review',btns:[{k:'ok',t:'Đạt → N13'},{k:'fix',t:'Sửa → N9'},{k:'kill',t:'Hủy SP'}]},
      {n:13,title:'Ban hành Tài liệu KT sản xuất',owner:'Technical',tasks:['Compile spec final','Construction guide','Hoàn tất BOM','Lock thiết kế'],auto:'A_ST8 → tạo Tech Doc'},
      {n:14,title:'Tạo mã Product → Yêu cầu sản xuất',owner:'Production',expl:true,tasks:['Generate SKU matrix','Đẩy POS','Lập Production Request'],auto:'A_ST9 → Product Registration · A_PR1 → SKU · A_ST10 → Production Request'}
    ],
    related:[
      {t:'wit',id:'product-brief',tag:'cha',kind:'Thuộc Product Brief (R2)'},
      {t:'wit',id:'npl-check',tag:'con',kind:'NPL Check (R3)'},
      {t:'wit',id:'pattern-making',tag:'con',kind:'Pattern Making (R6)'},
      {t:'wit',id:'sample-order',tag:'con',kind:'Sample Order (R7)'},
      {t:'wit',id:'tech-doc',tag:'con',kind:'Tech Doc (R9)'},
      {t:'wit',id:'product-registration',tag:'con',kind:'Product Registration (R10)'},
      {t:'wit',id:'production-request',tag:'con',kind:'Production Request (R12)'}
    ],
    autos:['A_ST1','A_ST2','A_ST3','A_ST4','A_ST5','A_ST6','A_ST7','A_ST8','A_ST9','A_ST10','A_KILL'],
    roles:['designer','product_dev_director','creative_director','purchasing','technical','sample_room_lead','production_manager','production_planner']
  },

  'npl-check': {
    seq:'04', name:'Kiểm tra NPL', code:'npl-check', stage:'s2', badge:{t:'new',label:'MỚI'}, wf:'4 node',
    purpose:'Purchasing kiểm tra NPL có sẵn không. Nếu thiếu → rẽ nhánh "Phát triển NPL" hoặc "Dùng NPL thay thế". Gate chặn Style không tiến nếu chưa có nguồn NPL đầy đủ.',
    fields:[
      ['check_code','Text','y','Auto NPL-CK-seq'],
      ['style','Associated','y','Style đang kiểm'],
      ['material_list','Sub-table','y','Material × qty cần × tồn × kết quả'],
      ['overall_result','Single select','c','Đầy đủ / Thiếu một phần / Thiếu toàn bộ'],
      ['missing_items','Sub-table','c','Material × qty thiếu × action'],
      ['npl_development','Associated (multi)','n','WIT con khi phải phát triển'],
      ['material_pos','Associated (multi)','n','Đơn mua phát sinh']
    ],
    nodes:[
      {n:1,title:'Kiểm tra tồn NPL',owner:'Purchasing',tasks:['Check kho NPL hiện tại','Đối chiếu BOM từ Design','Liệt kê thiếu']},
      {n:2,title:'Quyết định',owner:'Purchasing',gate:true,tasks:['Đủ → Node 4','Thiếu → Node 3']},
      {n:3,title:'Xử lý thiếu',owner:'Purchasing',tasks:['Mỗi NPL thiếu chọn: Phát triển / Tìm NCC / Thay thế'],auto:'A_NPL1 → NPL Dev hoặc Material PO'},
      {n:4,title:'Hoàn tất',owner:'Auto',tasks:['Điều kiện: mọi NPL đã có nguồn']}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Thuộc Style (R3)'},
      {t:'wit',id:'npl-development',tag:'con',kind:'NPL Development (R4)'},
      {t:'wit',id:'material-po',tag:'con',kind:'Material PO (R5)'}
    ],
    autos:['A_ST1','A_NPL1'], roles:['purchasing','technical','product_dev_director']
  },

  'npl-development': {
    seq:'05', name:'Phát triển NPL', code:'npl-development', stage:'s2', badge:{t:'new',label:'MỚI'}, wf:'7 node',
    purpose:'Khi NPL chưa có trên thị trường hoặc cần phát triển riêng (vải đặc biệt, phụ liệu custom). Tìm NCC, nhận mẫu, lab test, chốt giá — hoặc fallback dùng NPL thay thế.',
    fields:[
      ['dev_code','Text','y','Auto NPL-DEV-seq'],
      ['npl_check','Associated','y','Phát sinh từ NPL Check nào'],
      ['material_name','Text','y','Tên NPL'],
      ['material_spec','Rich text','y','Yêu cầu kỹ thuật chi tiết'],
      ['target_suppliers','Associated (multi)','n','NCC tiềm năng'],
      ['samples_received','Sub-table','n','NCC × ngày nhận × đánh giá'],
      ['selected_supplier','Associated','n','NCC chọn cuối'],
      ['unit_price_final','Currency','n','Giá chốt'],
      ['lead_time_days','Number','n','Thời gian giao'],
      ['alternative_material','Text','n','NPL thay thế nếu không phát triển được']
    ],
    nodes:[
      {n:1,title:'Xác định yêu cầu',owner:'Purchasing + Technical',tasks:['Chuẩn hóa spec NPL']},
      {n:2,title:'Tìm NCC',owner:'Purchasing',tasks:['Liên hệ ≥3 NCC','Gửi spec']},
      {n:3,title:'Nhận mẫu NPL',owner:'Purchasing',tasks:['Ghi nhận samples_received']},
      {n:4,title:'Thử mẫu nội bộ',owner:'Technical + QC',tasks:['Test co giãn / phai màu / xù lông','Đánh giá']},
      {n:5,title:'Duyệt NPL',owner:'Diễm Chi',gate:true,btns:[{k:'ok',t:'Duyệt'},{k:'fix',t:'Dùng thay thế'},{k:'kill',t:'Hủy Style'}]},
      {n:6,title:'Chốt NCC & giá',owner:'Purchasing',tasks:['Đàm phán giá, MOQ, lead time']},
      {n:7,title:'Hoàn tất',owner:'Auto',tasks:['Update NPL Check → Đầy đủ']}
    ],
    related:[
      {t:'wit',id:'npl-check',tag:'cha',kind:'Thuộc NPL Check (R4)'},
      {t:'master',id:'vendor',tag:'ref',kind:'Tham chiếu Vendor'}
    ],
    autos:['A_NPL1'], roles:['purchasing','technical','qc_inspector','product_dev_director']
  },

  'material-po': {
    seq:'06', name:'Đơn mua NPL', code:'material-po', stage:'s2', badge:{t:'keep',label:'chuẩn'}, wf:'2 template',
    purpose:'Đơn mua nguyên phụ liệu. 2 template: Stock Item / Custom Development. Gắn chặt với NPL Check qua field npl_check_ref.',
    fields:[
      ['po_code','Text','y','Auto'],
      ['vendor','Associated','y','Nhà cung cấp'],
      ['npl_check_ref','Associated','n','Link về NPL Check'],
      ['material_lines','Sub-table','y','Material × qty × đơn giá'],
      ['total_amount','Formula','n','Tổng tiền'],
      ['expected_date','Date','y','Ngày giao dự kiến'],
      ['received_qty','Number','n','Đã nhận']
    ],
    nodes:[],
    related:[
      {t:'wit',id:'npl-check',tag:'cha',kind:'Phát sinh từ NPL Check (R5)'},
      {t:'master',id:'vendor',tag:'ref',kind:'Tham chiếu Vendor'}
    ],
    autos:['A_NPL1'], roles:['purchasing']
  },

  'pattern-making': {
    seq:'07', name:'Rập & Thông số KT', code:'pattern-making', stage:'s2', badge:{t:'new',label:'MỚI'}, wf:'6 node',
    purpose:'Technical làm rập mẫu gốc, nhảy rập size set, ban hành bảng thông số. Quy trình Technical chi tiết: rập gốc → grading → ban hành — phòng Technical làm chủ toàn bộ.',
    fields:[
      ['pattern_code','Text','y','Auto PAT-style-vN'],
      ['pattern_type','Single select','y','Rập mẫu gốc / Rập size set'],
      ['base_size','Single select','y','M / 38 / 40… size gốc'],
      ['pattern_file','Attachment','y','File rập DXF/PDF'],
      ['spec_sheet','Attachment','y','Bảng thông số đo'],
      ['size_grading_table','Sub-table','c','Size × Chest × Waist × Hip × Length'],
      ['grading_rule','Text','n','VD +2cm/size'],
      ['fabric_consumption','Number','y','Định mức vải/sp'],
      ['trim_list','Sub-table','y','Phụ liệu × định mức']
    ],
    nodes:[
      {n:1,title:'Làm rập mẫu gốc',owner:'Technical',tasks:['Nghiên cứu sketch','Vẽ rập base size','Tính định mức']},
      {n:2,title:'Bảng thông số KT',owner:'Technical',tasks:['Soạn spec_sheet']},
      {n:3,title:'Gửi Sample Room',owner:'Trigger',auto:'A_PAT1 → Sample Order (mẫu gốc)'},
      {n:4,title:'Nhảy rập size set',owner:'Technical',tasks:['Arrive sau khi mẫu gốc duyệt','Điền size_grading_table']},
      {n:5,title:'Gửi may size set',owner:'Trigger',auto:'A_PAT2 → Sample Order (size set)'},
      {n:6,title:'Ban hành tài liệu KT',owner:'Technical',auto:'A_PAT3 → tạo Tech Doc'}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Thuộc Style (R6)'},
      {t:'wit',id:'sample-order',tag:'con',kind:'Sinh Sample Order'},
      {t:'wit',id:'tech-doc',tag:'con',kind:'Sinh Tech Doc'}
    ],
    autos:['A_ST2','A_PAT1','A_PAT2','A_PAT3'], roles:['technical','sample_room_lead']
  },

  'sample-order': {
    seq:'08', name:'Lệnh may mẫu', code:'sample-order', stage:'s2', badge:{t:'new',label:'MỚI'}, wf:'5 node',
    purpose:'Lệnh may mẫu gửi Sample Room. 3 loại: mẫu gốc (1 cái, base size), size set (đủ size), mẫu chào (cho Factory đánh giá năng lực).',
    fields:[
      ['sample_code','Text','y','Auto SAM-style-type-seq'],
      ['sample_type','Single select','y','Mẫu gốc / Size set / Mẫu chào'],
      ['pattern','Associated','y','Rập tương ứng'],
      ['size_list','Multi select','y','Base size hoặc full run'],
      ['qty_per_size','Number','y','1 (gốc) / 1–2 (size set)'],
      ['material_source','Single select','y','Kho NPL / Mua mới / Mẫu NCC'],
      ['deadline','Date','y','Hạn giao mẫu'],
      ['assigned_to','Person (multi)','y','Sample Room team'],
      ['sample_photos','Attachment (multi)','n','Ảnh mẫu hoàn thiện']
    ],
    nodes:[
      {n:1,title:'Nhận lệnh',owner:'Sample Room Lead',tasks:['Check NPL sẵn sàng','Phân công thợ may']},
      {n:2,title:'Cắt & May',owner:'Sample Room',tasks:['Cắt theo rập','May','Hoàn thiện (2–5 ngày)']},
      {n:3,title:'Kiểm tra nội bộ',owner:'Sample Room Lead',tasks:['Đo kiểm thông số','Chụp ảnh']},
      {n:4,title:'Giao mẫu',owner:'Sample Room',tasks:['Cập nhật sample_photos'],auto:'→ trigger Sample Review'},
      {n:5,title:'Closed',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Thuộc Style (R7)'},
      {t:'wit',id:'pattern-making',tag:'ref',kind:'Dùng rập từ Pattern Making'},
      {t:'wit',id:'sample-review',tag:'con',kind:'Sinh Sample Review (R8)'}
    ],
    autos:['A_ST3','A_ST6','A_ST4','A_ST7','A_PAT1','A_PAT2'], roles:['sample_room_lead']
  },

  'sample-review': {
    seq:'09', name:'Duyệt mẫu', code:'sample-review', stage:'s2', badge:{t:'tmpl',label:'3 loại'}, wf:'4 node',
    purpose:'Đặc trưng cốt lõi của AF: 3 vòng duyệt riêng biệt — Duyệt mẫu gốc (kỹ thuật, Diễm Chi), Duyệt nội bộ (thương mại, Calvin), Duyệt size set (sizing, Diễm Chi + Technical). Không gộp.',
    fields:[
      ['review_code','Text','y','Auto'],
      ['review_type','Single select','y','Duyệt mẫu gốc / nội bộ / size set'],
      ['sample_order','Associated','y','Mẫu được duyệt'],
      ['chair','Person','y','Diễm Chi (gốc+size) / Calvin (nội bộ)'],
      ['fitting_photos','Attachment (multi)','y','Ảnh fitting'],
      ['measurement_check','Sub-table','y','Điểm đo × Chuẩn × Thực tế × Pass/Fail'],
      ['result','Single select','y','Đạt / Không đạt — sửa / Không đạt — hủy'],
      ['iteration_round','Number','y','Lần thứ mấy (escalate >3)']
    ],
    nodes:[
      {n:1,title:'Chuẩn bị',owner:'Technical',tasks:['Sắp xếp mẫu','Chuẩn bị bảng đo']},
      {n:2,title:'Thử mẫu',owner:'Chair',tasks:['Mặc thử / fitting','Đo kiểm','Đánh giá visual']},
      {n:3,title:'Quyết định',owner:'Chair',gate:true,btns:[{k:'ok',t:'Đạt'},{k:'fix',t:'Sửa → Sample Order mới'},{k:'kill',t:'Hủy sản phẩm'}]},
      {n:4,title:'Closed',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'sample-order',tag:'cha',kind:'Thuộc Sample Order (R8)'},
      {t:'wit',id:'style',tag:'ref',kind:'Quyết định số phận Style'}
    ],
    autos:['A_ST4','A_ST5','A_ST7','A_KILL'], roles:['product_dev_director','creative_director','technical']
  },

  'tech-doc': {
    seq:'10', name:'Tài liệu KT sản xuất', code:'tech-doc', stage:'s2', badge:{t:'keep',label:'gộp'}, wf:'4 node',
    purpose:'Gộp Tech Pack + bảng thông số + tài liệu ban hành. Là "nguồn sự thật" cho sản xuất. Lock sau khi Diễm Chi duyệt — không sửa được nữa.',
    fields:[
      ['doc_code','Text','y','TD-style-vN'],
      ['pattern','Associated','y','Rập nguồn'],
      ['spec_sheet_final','Attachment','y','Bảng thông số chính thức'],
      ['construction_guide','Attachment','y','Hướng dẫn may'],
      ['material_bom','Sub-table','y','NPL × định mức × NCC'],
      ['quality_standards','Rich text','y','Tiêu chuẩn QC sản phẩm'],
      ['approved_by','Person','y','Chị Diễm Chi'],
      ['is_locked','Switch','n','Lock sau duyệt']
    ],
    nodes:[
      {n:1,title:'Soạn',owner:'Technical',tasks:['Compile spec final','Viết construction guide','Hoàn tất BOM']},
      {n:2,title:'Review nội bộ',owner:'Technical'},
      {n:3,title:'Duyệt',owner:'Diễm Chi',gate:true},
      {n:4,title:'Ban hành (lock)',owner:'Technical',tasks:['is_locked = On']}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Thuộc Style (R9)'},
      {t:'wit',id:'production-request',tag:'ref',kind:'Đầu vào cho Production Request'}
    ],
    autos:['A_ST8','A_PAT3'], roles:['technical','product_dev_director']
  }

});
