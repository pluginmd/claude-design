/* Deep data — automations (26) + roles (16). Merges into MEEGLE_DATA */
window.MEEGLE_DATA = window.MEEGLE_DATA || {};

window.MEEGLE_DATA.auto = {
  'A_PB1':{trigger:'Product Brief · node "Assign to Design" arrived',cond:'—',action:'Tạo Style, link product_brief, inherit category/segment',src:'product-brief',dst:'style'},
  'A_ST1':{trigger:'Style · N4 (Kiểm tra NPL) arrived',cond:'npl_check empty',action:'Tạo NPL Check, link style',src:'style',dst:'npl-check'},
  'A_ST2':{trigger:'Style · N5 arrived',cond:'pattern empty',action:'Tạo Pattern Making (rập mẫu gốc)',src:'style',dst:'pattern-making'},
  'A_ST3':{trigger:'Style · N6 arrived',cond:'—',action:'Tạo Sample Order (mẫu gốc)',src:'style',dst:'sample-order'},
  'A_ST4':{trigger:'Sample Order (mẫu gốc) closed',cond:'—',action:'Tạo Sample Review (duyệt mẫu gốc)',src:'sample-order',dst:'sample-review'},
  'A_ST5':{trigger:'Style · N9 arrived',cond:'—',action:'Tạo Sample Review (duyệt nội bộ)',src:'style',dst:'sample-review'},
  'A_ST6':{trigger:'Style · N11 arrived',cond:'—',action:'Tạo Sample Order (size set)',src:'style',dst:'sample-order'},
  'A_ST7':{trigger:'Sample Order (size set) closed',cond:'—',action:'Tạo Sample Review (duyệt size set)',src:'sample-order',dst:'sample-review'},
  'A_ST8':{trigger:'Style · N13 arrived',cond:'tech_doc empty',action:'Tạo Tech Doc',src:'style',dst:'tech-doc'},
  'A_ST9':{trigger:'Style · N14 arrived',cond:'product_reg empty',action:'Tạo Product Registration',src:'style',dst:'product-registration'},
  'A_ST10':{trigger:'Style · N15 arrived',cond:'—',action:'Tạo Production Request',src:'style',dst:'production-request'},
  'A_NPL1':{trigger:'NPL Check · N3 mỗi item thiếu',cond:'—',action:'Tạo NPL Development hoặc Material PO',src:'npl-check',dst:'npl-development'},
  'A_PAT1':{trigger:'Pattern Making · N3',cond:'—',action:'Tạo Sample Order (mẫu gốc)',src:'pattern-making',dst:'sample-order'},
  'A_PAT2':{trigger:'Pattern Making · N5',cond:'—',action:'Tạo Sample Order (size set)',src:'pattern-making',dst:'sample-order'},
  'A_PAT3':{trigger:'Pattern Making · N6',cond:'—',action:'Tạo Tech Doc draft',src:'pattern-making',dst:'tech-doc'},
  'A_PR1':{trigger:'Product Registration · N2',cond:'—',action:'Tạo SKU Master mỗi color × size',src:'product-registration',dst:'sku-master'},
  'A_PR2':{trigger:'SKU Master created',cond:'pos_synced=Off',action:'Push lên KiotViet / POS',src:'product-registration',dst:'sku-master'},
  'A_PRQ1':{trigger:'Production Request · N3',cond:'—',action:'Tạo Factory Quotation',src:'production-request',dst:'factory-quotation'},
  'A_FQ1':{trigger:'Factory Quotation · N5 selected',cond:'selected=On',action:'Tạo Production Order',src:'factory-quotation',dst:'production-order'},
  'A_PO1':{trigger:'Production Order confirmed',cond:'—',action:'Tạo Production Lot mỗi đợt giao',src:'production-order',dst:'production-lot'},
  'A_PO2':{trigger:'Production Order · "Material Ready"',cond:'—',action:'Tạo NPL Issue mỗi lot',src:'production-order',dst:'npl-issue'},
  'A_LOT1':{trigger:'Production Lot · "Shipped"',cond:'—',action:'Tạo Inbound Lot',src:'production-lot',dst:'inbound-lot'},
  'A_IB1':{trigger:'Inbound Lot · N3 QC',cond:'—',action:'Tạo QC Inspection (Final)',src:'inbound-lot',dst:'qc-inspection'},
  'A_IB2':{trigger:'Inbound Lot · N4 complete',cond:'—',action:'Update SKU Master stock (SKU đã có)',src:'inbound-lot',dst:'sku-master'},
  'A_ALO1':{trigger:'Allocation Order approved',cond:'—',action:'Push KiotViet + tạo Store Receipts',src:'sku-master',dst:null},
  'A_KILL':{trigger:'Sample Review result = "Hủy"',cond:'—',action:'Set Style = Hủy, lock all fields, notify team',src:'sample-review',dst:'style',crit:true}
};

window.MEEGLE_DATA.role = {
  'creative_director':{name:'Creative Director',ava:'C',color:'var(--st1)',lead:true,person:'Anh Calvin',dept:'Lãnh đạo',resp:'Duyệt ý tưởng (Product Brief), duyệt mẫu nội bộ (Gate 2 thương mại), duyệt giá Factory, duyệt campaign.',owns:['product-brief','sample-review','factory-quotation','marketing-campaign']},
  'product_dev_director':{name:'Product Dev Director',ava:'DC',color:'var(--st2)',lead:true,person:'Chị Diễm Chi',dept:'Lãnh đạo',resp:'Duyệt mẫu gốc (Gate 1 kỹ thuật), duyệt size set (Gate 3 sizing), duyệt & ban hành Tech Doc, duyệt Production Request.',owns:['style','sample-review','tech-doc','production-request']},
  'merchandiser':{name:'Merchandiser',ava:'M',color:'var(--p-color-gray-13)',dept:'Merchandising',resp:'Phân tích thị trường, đề xuất Product Brief, forecast sản lượng.',owns:['product-brief']},
  'production_planner':{name:'Production Planner',ava:'PP',color:'var(--p-color-gray-13)',dept:'Production Planning',resp:'Lập kế hoạch sản xuất, Production Request, Allocation.',owns:['product-brief','production-request','production-order']},
  'designer':{name:'Designer',ava:'D',color:'var(--p-color-gray-13)',dept:'Design',resp:'Phác thảo, thiết kế chi tiết, color direction.',owns:['style']},
  'purchasing':{name:'Purchasing',ava:'P',color:'var(--p-color-gray-13)',dept:'Purchasing',resp:'Kiểm tra NPL, tìm NCC, phát triển NPL, Material PO.',owns:['npl-check','npl-development','material-po']},
  'technical':{name:'Technical',ava:'T',color:'var(--p-color-gray-13)',dept:'Technical',resp:'Làm rập, bảng thông số, nhảy size, ban hành Tech Doc.',owns:['pattern-making','tech-doc']},
  'sample_room_lead':{name:'Sample Room Lead',ava:'SR',color:'var(--p-color-gray-13)',dept:'Sample Room',resp:'May mẫu gốc, size set, mẫu chào.',owns:['sample-order']},
  'production_manager':{name:'Production Manager',ava:'PM',color:'var(--p-color-gray-13)',dept:'Production',resp:'Tạo mã Product/SKU, quản lý Production Order & Lot.',owns:['product-registration','production-order','production-lot','sku-master']},
  'factory_contact':{name:'Factory Contact',ava:'F',color:'var(--p-color-gray-13)',dept:'Factory',resp:'Chào giá, may mẫu chào, sản xuất hàng loạt.',owns:['factory-quotation','production-order','production-lot']},
  'qc_inspector':{name:'QC Inspector',ava:'Q',color:'var(--p-color-gray-13)',dept:'QC',resp:'Kiểm NPL đầu vào, in-line, final, pre-shipment.',owns:['qc-inspection']},
  'warehouse_manager':{name:'Warehouse Manager',ava:'W',color:'var(--p-color-gray-13)',dept:'Warehouse',resp:'Xuất NPL cho Factory, nhập thành phẩm, map SKU.',owns:['npl-issue','inbound-lot']},
  'marketing_lead':{name:'Marketing Lead',ava:'MK',color:'var(--st4)',dept:'Marketing',resp:'Chiến dịch đa kênh, content, KPI.',owns:['marketing-campaign']},
  'sales_lead':{name:'Sales Lead',ava:'S',color:'var(--st4)',dept:'Sales',resp:'Bán online + offline, duyệt allocation.',owns:['sales-order','sku-master']},
  'store_manager':{name:'Store Manager',ava:'ST',color:'var(--p-color-gray-13)',dept:'Store',resp:'Nhận hàng, bán tại cửa hàng.',owns:['sales-order']},
  'accountant':{name:'Accountant',ava:'AC',color:'var(--p-color-gray-13)',dept:'Accounting',resp:'Đối soát doanh thu, thanh toán, công nợ.',owns:['sales-order']}
};
