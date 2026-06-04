/* Deep data — Work Item Types 11–21 + master data. Merges into MEEGLE_DATA.wit / .master */
window.MEEGLE_DATA = window.MEEGLE_DATA || {};
window.MEEGLE_DATA.wit = window.MEEGLE_DATA.wit || {};
Object.assign(window.MEEGLE_DATA.wit, {

  'product-registration': {
    seq:'11', name:'Đăng ký mã Product', code:'product-registration', stage:'s2', badge:{t:'new',label:'MỚI · explode'}, wf:'4 node',
    purpose:'AF tạo mã Product & SKU TRƯỚC khi sản xuất (ngay sau duyệt mẫu). Nhờ vậy sản phẩm lên POS sớm để bán pre-order. Đây là điểm "explode" Style → N SKU.',
    fields:[
      ['product_code','Text','y','Mã bán hàng (≠ style_code)'],
      ['color_list','Multi select','y','Confirm màu final (có thể bớt)'],
      ['size_list','Multi select','y','Confirm size final'],
      ['sku_matrix','Sub-table','y','Color × Size × SKU × Barcode — SINH SKU TẠI ĐÂY'],
      ['retail_price','Currency','y','Giá bán'],
      ['pos_synced','Switch','n','Đã đẩy KiotViet/POS?'],
      ['skus_created','Associated (multi)','n','Link SKU Master']
    ],
    nodes:[
      {n:1,title:'Xác nhận thông tin',owner:'Production',tasks:['Confirm color/size final từ duyệt mẫu','Nhập giá bán','Generate SKU matrix']},
      {n:2,title:'Tạo mã SKU',owner:'Production',expl:true,tasks:['Verify danh sách SKU','In barcode'],auto:'A_PR1 → SKU Master mỗi color×size'},
      {n:3,title:'Đồng bộ POS',owner:'Production',tasks:['pos_synced = On'],auto:'A_PR2 → push KiotViet/POS'},
      {n:4,title:'Closed',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Thuộc Style (R10)'},
      {t:'wit',id:'sku-master',tag:'con',kind:'EXPLODE → N SKU (R11)'},
      {t:'wit',id:'production-request',tag:'ref',kind:'Đầu vào cho Production Request'}
    ],
    autos:['A_ST9','A_PR1','A_PR2'], roles:['production_manager','production_planner']
  },

  'production-request': {
    seq:'12', name:'Yêu cầu sản xuất', code:'production-request', stage:'s3', badge:{t:'new',label:'MỚI'}, wf:'4 node',
    purpose:'Cầu nối chính thức giữa giai đoạn PTSP và Sản xuất. Khi 3 duyệt mẫu OK + Tech Doc ban hành + Product Registration xong → phát sinh Yêu cầu sản xuất, truyền sang Factory.',
    fields:[
      ['request_code','Text','y','Auto PR-YYYYMM-seq'],
      ['tech_doc','Associated','y','Validate đã ban hành'],
      ['product_registration','Associated','y','Validate đã hoàn tất'],
      ['target_qty','Number','y','Tổng sản lượng'],
      ['color_size_breakdown','Sub-table','y','Color × Size × Qty'],
      ['target_delivery_date','Date','y','Hạn giao'],
      ['factory_preference','Associated','n','Factory ưu tiên'],
      ['approved_by','Person','y','Diễm Chi / Calvin']
    ],
    nodes:[
      {n:1,title:'Lập yêu cầu',owner:'Production Planning',tasks:['Sản lượng final','Breakdown color×size']},
      {n:2,title:'Duyệt',owner:'Diễm Chi',gate:true,tasks:['Validate Tech Doc + Product Reg đã xong']},
      {n:3,title:'Chuyển Factory',owner:'Production Planning',auto:'A_PRQ1 → Factory Quotation'},
      {n:4,title:'Closed',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Thuộc Style (R12)'},
      {t:'wit',id:'factory-quotation',tag:'con',kind:'Factory Quotation (R13)'},
      {t:'wit',id:'tech-doc',tag:'ref',kind:'Đầu vào'},
      {t:'wit',id:'product-registration',tag:'ref',kind:'Đầu vào'}
    ],
    autos:['A_ST10','A_PRQ1'], roles:['production_planner','product_dev_director','creative_director']
  },

  'factory-quotation': {
    seq:'13', name:'Chào giá nhà máy', code:'factory-quotation', stage:'s3', badge:{t:'new',label:'MỚI'}, wf:'6 node',
    purpose:'Factory (nội bộ hoặc gia công) nhận yêu cầu → chào giá/chào mẫu → so sánh chọn xưởng — so sánh nhiều factory để tối ưu giá & lead time.',
    fields:[
      ['quote_code','Text','y','Auto FQ-factory-seq'],
      ['factory','Associated','y','Nhà máy chào'],
      ['quoted_price_per_unit','Currency','y','Đơn giá gia công'],
      ['quoted_lead_time_days','Number','y','Thời gian SX'],
      ['min_order_qty','Number','n','MOQ'],
      ['capacity_available','Number','n','Năng lực khả dụng'],
      ['sample_required','Switch','n','Cần may mẫu chào?'],
      ['sample_result','Single select','n','Đạt / Không đạt'],
      ['total_amount','Formula','n','qty × đơn giá'],
      ['selected','Switch','n','Chọn factory này?']
    ],
    nodes:[
      {n:1,title:'Gửi yêu cầu báo giá',owner:'Production Planning'},
      {n:2,title:'Factory chào mẫu/giá',owner:'Factory contact',tasks:['Điền giá, lead time']},
      {n:3,title:'May mẫu chào',owner:'Factory',tasks:['Nếu sample_required=On'],auto:'→ Sample Order (mẫu chào)'},
      {n:4,title:'Đánh giá & chọn',owner:'Production + Diễm Chi',tasks:['So sánh nhiều factory']},
      {n:5,title:'Duyệt giá',owner:'Calvin',gate:true,tasks:['Nếu total > threshold'],btns:[{k:'ok',t:'Chọn Factory'},{k:'kill',t:'Reject'}]},
      {n:6,title:'Closed',owner:'Auto',auto:'A_FQ1 → Production Order'}
    ],
    related:[
      {t:'wit',id:'production-request',tag:'cha',kind:'Thuộc Production Request (R13)'},
      {t:'wit',id:'production-order',tag:'con',kind:'Production Order (R14)'},
      {t:'master',id:'factory',tag:'ref',kind:'Tham chiếu Factory'}
    ],
    autos:['A_PRQ1','A_FQ1'], roles:['production_planner','factory_contact','product_dev_director','creative_director']
  },

  'production-order': {
    seq:'14', name:'Lệnh sản xuất', code:'production-order', stage:'s3', badge:{t:'keep',label:'chuẩn'}, wf:'2 template',
    purpose:'Lệnh sản xuất chính thức. 2 template: Internal Factory / OEM. Thêm field factory_quotation link về quote được chọn.',
    fields:[
      ['po_code','Text','y','Auto'],
      ['factory','Associated','y','Nhà máy thực hiện'],
      ['factory_quotation','Associated','n','Quote được chọn'],
      ['total_qty','Number','y','Tổng sản lượng'],
      ['unit_cost','Currency','y','Đơn giá'],
      ['delivery_rounds','Number','n','Số đợt giao']
    ],
    nodes:[],
    related:[
      {t:'wit',id:'factory-quotation',tag:'cha',kind:'Từ Factory Quotation (R14)'},
      {t:'wit',id:'production-lot',tag:'con',kind:'Production Lot (R15)'},
      {t:'wit',id:'npl-issue',tag:'con',kind:'NPL Issue khi material ready'}
    ],
    autos:['A_FQ1','A_PO1','A_PO2'], roles:['production_manager','factory_contact']
  },

  'production-lot': {
    seq:'15', name:'Lô sản xuất', code:'production-lot', stage:'s3', badge:{t:'keep',label:'chuẩn'}, wf:null,
    purpose:'Chia đợt giao hàng từ một Production Order, theo dõi tiến độ may (cắt → may → hoàn thiện) và shipping về kho.',
    fields:[
      ['lot_code','Text','y','Auto'],
      ['production_order','Associated','y','Thuộc PO nào'],
      ['lot_qty','Number','y','Số lượng lô'],
      ['status_stage','Single select','n','Cắt / May / Hoàn thiện / Shipped'],
      ['ship_date','Date','n','Ngày xuất xưởng']
    ],
    nodes:[],
    related:[
      {t:'wit',id:'production-order',tag:'cha',kind:'Thuộc Production Order (R15)'},
      {t:'wit',id:'npl-issue',tag:'con',kind:'NPL Issue (R16)'},
      {t:'wit',id:'qc-inspection',tag:'con',kind:'QC Inspection (R17)'},
      {t:'wit',id:'inbound-lot',tag:'con',kind:'Inbound Lot (R18)'}
    ],
    autos:['A_PO1','A_LOT1'], roles:['production_manager','factory_contact']
  },

  'npl-issue': {
    seq:'16', name:'Phiếu xuất NPL', code:'npl-issue', stage:'s3', badge:{t:'new',label:'MỚI'}, wf:'4 node',
    purpose:'Warehouse xuất NPL cho Factory trước khi sản xuất. Đảm bảo kiểm soát NPL chặt chẽ theo BOM × sản lượng.',
    fields:[
      ['issue_code','Text','y','Auto NPL-ISS-seq'],
      ['production_order','Associated','y','Thuộc PO'],
      ['factory','Associated','y','Nhận NPL'],
      ['issue_table','Sub-table','y','Material × Qty yêu cầu × Qty xuất × Kho'],
      ['issued_by','Person','y','Warehouse'],
      ['received_by','Person','y','Factory contact'],
      ['delivery_note','Attachment','n','Phiếu giao NPL']
    ],
    nodes:[
      {n:1,title:'Lập phiếu xuất',owner:'Warehouse',tasks:['Theo BOM × qty sản xuất']},
      {n:2,title:'Duyệt xuất',owner:'Warehouse Manager',gate:true,tasks:['Validate tồn NPL đủ']},
      {n:3,title:'Giao NPL',owner:'Logistics',tasks:['Đóng gói','Giao Factory','Factory ký nhận']},
      {n:4,title:'Closed',owner:'Auto',tasks:['Trừ tồn NPL hệ thống']}
    ],
    related:[
      {t:'wit',id:'production-lot',tag:'cha',kind:'Thuộc Production Lot (R16)'},
      {t:'master',id:'factory',tag:'ref',kind:'Tham chiếu Factory'},
      {t:'master',id:'material-master',tag:'ref',kind:'Tham chiếu NPL'}
    ],
    autos:['A_PO2'], roles:['warehouse_manager']
  },

  'qc-inspection': {
    seq:'17', name:'Phiếu kiểm tra QC', code:'qc-inspection', stage:'s3', badge:{t:'new',label:'MỚI'}, wf:'5 node',
    purpose:'QC là phòng riêng, độc lập với sản xuất. Kiểm ở nhiều điểm: NPL đầu vào, in-line giữa chuyền, final thành phẩm, pre-shipment. Có AQL chuẩn và corrective action loop.',
    fields:[
      ['qc_code','Text','y','Auto QC-seq'],
      ['inspection_type','Single select','y','NPL Incoming / In-line / Final / Pre-shipment'],
      ['source','Associated (poly)','y','Material PO / Production Lot / Inbound Lot'],
      ['total_inspected','Number','y','Số kiểm'],
      ['pass_qty','Number','y','Đạt'],
      ['fail_qty','Number','y','Lỗi'],
      ['pass_rate','Formula','n','pass/total ×100'],
      ['defect_categories','Multi select','n','Stitching / Fabric / Color / Sizing…'],
      ['result','Single select','y','Pass / Conditional / Fail'],
      ['aql_standard','Single select','y','AQL 1.0 / 1.5 / 2.5 / 4.0'],
      ['corrective_action','Rich text','c','Required khi Fail']
    ],
    nodes:[
      {n:1,title:'Lên kế hoạch',owner:'QC Lead',tasks:['Xác định AQL','Chọn mẫu kiểm','Phân công']},
      {n:2,title:'Thực hiện kiểm tra',owner:'QC Inspector',tasks:['Ghi kết quả']},
      {n:3,title:'Đánh giá kết quả',owner:'QC Lead',gate:true,btns:[{k:'ok',t:'Pass'},{k:'fix',t:'Conditional'},{k:'kill',t:'Fail'}]},
      {n:4,title:'Corrective Action',owner:'Factory/Supplier',tasks:['Phân tích nguyên nhân','Sửa chữa','Re-inspect → loop N2']},
      {n:5,title:'Closed',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'production-lot',tag:'cha',kind:'Kiểm cho Production Lot (R17)'},
      {t:'wit',id:'inbound-lot',tag:'ref',kind:'QC Final cho Inbound'},
      {t:'master',id:'factory',tag:'ref',kind:'Tham chiếu Factory'}
    ],
    autos:['A_IB1'], roles:['qc_inspector','factory_contact']
  },

  'inbound-lot': {
    seq:'18', name:'Lô nhập kho', code:'inbound-lot', stage:'s3', badge:{t:'keep',label:'chuẩn'}, wf:'5 node',
    purpose:'Không sinh SKU mới (SKU đã tạo ở Product Registration). Node 4 chỉ map số lượng vào SKU đã tồn tại.',
    fields:[
      ['inbound_code','Text','y','Auto'],
      ['production_lot','Associated','y','Thuộc lô SX'],
      ['arrived_qty','Number','y','Số thực nhận'],
      ['qty_by_sku_table','Sub-table','y','SKU (đã có) × qty nhập'],
      ['qc_inspection','Associated','n','QC Final']
    ],
    nodes:[
      {n:1,title:'Awaiting Arrival',owner:'Warehouse'},
      {n:2,title:'Goods Arrived & Count',owner:'Warehouse',tasks:['Đếm thực nhận']},
      {n:3,title:'QC Final',owner:'QC',gate:true,auto:'A_IB1 → QC Inspection (Final)',tasks:['Chỉ qua khi QC pass']},
      {n:4,title:'Stock In by SKU',owner:'Warehouse',tasks:['Map qty vào SKU đã tồn tại'],auto:'A_IB2 → update SKU stock'},
      {n:5,title:'Ready for Allocation',owner:'Auto'}
    ],
    related:[
      {t:'wit',id:'production-lot',tag:'cha',kind:'Thuộc Production Lot (R18)'},
      {t:'wit',id:'qc-inspection',tag:'ref',kind:'QC Final'},
      {t:'wit',id:'sku-master',tag:'ref',kind:'Map qty vào SKU'}
    ],
    autos:['A_LOT1','A_IB1','A_IB2'], roles:['warehouse_manager','qc_inspector']
  },

  'sku-master': {
    seq:'19', name:'Master SKU', code:'sku-master', stage:'s3', badge:{t:'keep',label:'chuẩn'}, wf:null,
    purpose:'Đơn vị tồn kho nhỏ nhất (1 màu × 1 size). SKU được tạo ở Product Registration (trước sản xuất). Là gốc của mọi nghiệp vụ bán hàng & kho.',
    fields:[
      ['sku_code','Text','y','Color × Size'],
      ['barcode','Text','y','Mã vạch'],
      ['style','Associated','y','Style gốc'],
      ['color','Associated','y','Color Master'],
      ['size','Associated','y','Size Master'],
      ['stock_qty','Number','n','Tồn hiện tại'],
      ['retail_price','Currency','y','Giá bán'],
      ['pos_id','Text','n','ID trên KiotViet']
    ],
    nodes:[],
    related:[
      {t:'wit',id:'product-registration',tag:'cha',kind:'Sinh từ Product Registration (R11)'},
      {t:'wit',id:'sales-order',tag:'con',kind:'Sales Order (R23)'},
      {t:'wit',id:'marketing-campaign',tag:'ref',kind:'Marketing chạy theo SKU/Style'}
    ],
    autos:['A_PR1','A_PR2','A_IB2','A_ALO1'], roles:['production_manager','warehouse_manager','sales_lead']
  },

  'marketing-campaign': {
    seq:'20', name:'Chiến dịch Marketing', code:'marketing-campaign', stage:'s4', badge:{t:'new',label:'MỚI'}, wf:'7 node',
    purpose:'AF có Marketing là phòng riêng, scope rộng: launch / seasonal / sale / collab, đa kênh, có KPI & ngân sách.',
    fields:[
      ['campaign_code','Text','y','Auto'],
      ['campaign_name','Text','y','Tên chiến dịch'],
      ['styles','Associated (multi)','y','Style trong chiến dịch'],
      ['campaign_type','Multi select','y','Launch / Seasonal / Sale / Collab'],
      ['channels','Multi select','y','Social / Web / Email / In-store / PR / KOL'],
      ['budget','Currency','y','Ngân sách'],
      ['kpi_targets','Sub-table','n','Metric × Target'],
      ['actual_results','Sub-table','n','Metric × Actual']
    ],
    nodes:[
      {n:1,title:'Brief',owner:'Marketing Lead'},
      {n:2,title:'Content Planning',owner:'Marketing'},
      {n:3,title:'Production (shoot/design)',owner:'Marketing'},
      {n:4,title:'Review',owner:'Calvin',gate:true},
      {n:5,title:'Launch',owner:'Marketing'},
      {n:6,title:'Running (tracking)',owner:'Marketing'},
      {n:7,title:'Report & Close',owner:'Marketing'}
    ],
    related:[
      {t:'wit',id:'style',tag:'cha',kind:'Quảng bá Style (R19)'},
      {t:'wit',id:'sales-order',tag:'ref',kind:'Thúc đẩy đơn hàng'}
    ],
    autos:[], roles:['marketing_lead','creative_director']
  },

  'sales-order': {
    seq:'21', name:'Đơn hàng', code:'sales-order', stage:'s4', badge:{t:'keep',label:'chuẩn'}, wf:null,
    purpose:'Đơn bán hàng online + offline. Trừ tồn SKU, đẩy về Accounting đối soát.',
    fields:[
      ['order_code','Text','y','Auto'],
      ['channel','Single select','y','Online / Offline / Marketplace'],
      ['line_items','Sub-table','y','SKU × qty × giá'],
      ['customer','Text','n','Khách hàng'],
      ['total','Formula','n','Tổng đơn'],
      ['payment_status','Single select','n','Paid / Pending / Refunded']
    ],
    nodes:[],
    related:[
      {t:'wit',id:'sku-master',tag:'cha',kind:'Bán SKU (R23)'}
    ],
    autos:[], roles:['sales_lead','store_manager','accountant']
  }

});

/* Master data dictionary (lightweight) */
window.MEEGLE_DATA.master = {
  'vendor':{name:'Vendor (NCC)',desc:'Nhà cung cấp nguyên phụ liệu. Tham chiếu bởi Material PO, NPL Development.'},
  'factory':{name:'Factory (Nhà máy)',desc:'MỚI — tách khỏi vendor. Nội bộ hoặc gia công. Tham chiếu bởi Factory Quotation, Production Order/Lot, NPL Issue.'},
  'store':{name:'Store (Cửa hàng)',desc:'Điểm bán. Tham chiếu bởi Allocation Order, Store Receipt, Sales Order.'},
  'color-master':{name:'Color Master',desc:'Danh mục màu chuẩn. Tham chiếu bởi Style, SKU.'},
  'size-master':{name:'Size Master',desc:'Danh mục size chuẩn. Tham chiếu bởi Style, SKU.'},
  'material-master':{name:'Material Master',desc:'MỚI — danh mục NPL chuẩn. Tham chiếu bởi NPL Check, Material PO, NPL Issue, Tech Doc BOM.'}
};
