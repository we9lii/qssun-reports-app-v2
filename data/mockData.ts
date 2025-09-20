import { User, Role, StatCardData, Report, ReportType, ReportStatus, Branch, Notification, PermissionAssignment, WorkflowRequest, WorkflowStage, DocumentType, SalesCustomer, ProjectUpdate, AuditLog, AuditLogAction } from '../types';
import { FileText, Users, Building2, Star, TrendingUp } from 'lucide-react';

export const mockEmployee: User = {
    id: '1',
    employeeId: '12345',
    name: 'تجريبي',
    email: 'abdullah@qssun.com',
    phone: '966501234567',
    role: Role.Employee,
    branch: 'فرع القصيم',
    department: 'المبيعات',
    position: 'مسؤول مبيعات',
    joinDate: '2022-01-15',
    avatarUrl: `https://picsum.photos/seed/abdullah/128`,
    employeeType: 'Technician',
    hasImportExportPermission: true,
};

export const mockAdmin: User = {
    id: '101',
    employeeId: 'admin',
    name: 'فيصل النتيفي',
    email: 'it.faisal@qssun.solar',
    phone: '966555555555',
    role: Role.Admin,
    branch: 'المركز الرئيسي',
    department: 'الإدارة',
    position: 'مدير النظام',
    joinDate: '2020-03-10',
    avatarUrl: `https://picsum.photos/seed/khalid/128`,
    employeeType: 'Admin',
    hasImportExportPermission: true,
};

export const mockUsers: User[] = [
    mockEmployee,
    mockAdmin
];

const mockSalesCustomers: SalesCustomer[] = [
    { id: 1, name: 'شركة ABC', phone: '0501112222', region: 'الرياض', requestType: 'طلب عرض سعر', notes: 'عميل محتمل كبير', files: [] }
];

const mockProjectUpdates: ProjectUpdate[] = [
    { id: 'contract', label: 'توقيع العقد', completed: true, timestamp: '2024-05-02T10:00:00Z' },
    { id: 'siteHandover', label: 'تم استلام محضر الموقع', completed: true, files: [], timestamp: '2024-05-03T11:00:00Z' },
    { id: 'notifyTeam', label: 'إشعار الفريق الفني', completed: true, timestamp: '2024-05-04T09:00:00Z' },
    { id: 'secondPayment', label: 'تم استلام الدفعة الثانية', completed: false },
    { id: 'deliveryHandover', label: 'تم ارسال محضر تسليم الأعمال', completed: false, files: [] },
    { id: 'exceptions', label: 'الإستثناءات', completed: false },
];


export const mockReports: Report[] = [
    { id: 'R001', employeeId: '12345', employeeName: 'تجريبي', branch: 'فرع القصيم', department: 'المبيعات', type: ReportType.Sales, date: '2024-05-20T10:00:00Z', status: ReportStatus.Approved, details: { totalCustomers: 5, serviceType: 'تركيب نظام شمسي', customers: mockSalesCustomers } },
    { id: 'R002', employeeId: '67890', employeeName: 'فاطمة الزهراء', branch: 'الرياض', department: 'الفني', type: ReportType.Maintenance, date: '2024-05-20T14:30:00Z', status: ReportStatus.Pending, details: { serviceType: 'repair', workStatus: 'in_progress', customerName: 'مجمع تجاري', location: '21.5433, 39.1728', equipment: 'مفكات', duration: 4, notes: 'تحتاج قطعة غيار', beforeImages: [], afterImages: [] } },
    { id: 'R003', employeeId: '12345', employeeName: 'تجريبي', branch: 'فرع القصيم', department: 'المبيعات', type: ReportType.Project, date: '2024-05-19T11:00:00Z', status: ReportStatus.Rejected, details: { projectOwner: 'مؤسسة البناء', location: 'برج المملكة', size: '500kW', startDate: '2024-05-01', updates: mockProjectUpdates } },
    { id: 'R004', employeeId: '67890', employeeName: 'فاطمة الزهراء', branch: 'الرياض', department: 'الفني', type: ReportType.Inquiry, date: '2024-05-18T09:00:00Z', status: ReportStatus.Approved, details: { type: 'استفسار سعر' }, evaluation: { rating: 5, comment: 'استجابة سريعة وممتازة.' } },
];

export const mockBranches: Branch[] = [
    { id: 'B01', name: 'فرع القصيم', location: 'حي النخيل', phone: '0112345678', manager: 'زيد المهنا', creationDate: '2018-01-01' },
    { id: 'B02', name: 'الرياض', location: 'شارع التحلية', phone: '0123456789', manager: 'عمر ياسين', creationDate: '2019-06-15' },
    { id: 'B03', name: 'الدمام', location: 'طريق الكورنيش', phone: '0134567890', manager: 'سارة عبدالله', creationDate: '2020-02-20' },
];

export const mockNotifications: Notification[] = [
    { id: 'N01', title: 'تحديث سياسة الشركة', message: 'يرجى مراجعة سياسة الإجازات المحدثة على البوابة الداخلية.', type: 'all', recipient: 'جميع الموظفين', date: '2024-05-20T10:00:00Z', read: true },
    { id: 'N02', title: 'اجتماع قسم المبيعات', message: 'تذكير باجتماع فريق المبيعات غداً الساعة 10 صباحاً.', type: 'branch', recipient: 'فرع القصيم', date: '2024-05-19T15:00:00Z', read: false },
    { id: 'N03', title: 'مهمة صيانة جديدة', message: 'تم إسناد مهمة صيانة جديدة لك في الرياض.', type: 'user', recipient: 'فاطمة الزهراء', date: '2024-05-18T11:00:00Z', read: true },
];

export const mockPermissions: PermissionAssignment[] = [
    { id: 'P01', userId: '101', userName: 'فيصل النتيفي', userAvatarUrl: mockAdmin.avatarUrl, role: Role.Admin, assignedBranch: 'جميع الفروع', assignmentDate: '2020-03-10' },
    { id: 'P03', userId: '1', userName: 'تجريبي', userAvatarUrl: mockEmployee.avatarUrl, role: Role.Employee, assignmentDate: '2022-01-15' },
];

// --- New Advanced Workflow Mock Data ---

export const WORKFLOW_STAGES: WorkflowStage[] = [
    { id: 1, name: 'عرض السعر والموافقة', responsible: 'موظف المبيعات', requiredDocuments: ['Price Quote'] },
    { id: 2, name: 'أمر الشراء', responsible: 'قسم المشتريات', requiredDocuments: ['Purchase Order'] },
    { id: 3, name: 'الشحن', responsible: 'قسم الشحن', requiredDocuments: ['Bill of Lading', 'Invoice'] },
    { id: 4, name: 'التخليص الجمركي', responsible: 'مخلص جمركي', requiredDocuments: ['Shipping Certificate', 'Commercial Invoice', 'Packing List', 'Certificate of Origin'] },
    { id: 5, name: 'الاستلام والفحص', responsible: 'مدير المستودع', requiredDocuments: ['Compliance Certificate'] },
    { id: 6, name: 'المتابعة', responsible: 'مدير العمليات' },
    { id: 7, name: 'الإنجاز', responsible: 'مدير العمليات' },
];

export const mockRequests: WorkflowRequest[] = [
    { 
        id: 'REQ-001', 
        title: 'طلب استيراد ألواح شمسية', 
        description: '500 لوح شمسي من نوع Jinko Solar Tiger Pro 545W',
        type: 'استيراد', 
        priority: 'عالية', 
        currentStageId: 3, 
        creationDate: '2024-05-15T09:00:00Z',
        trackingNumber: 'TRK123456789',
        estimatedCost: 150000,
        actualCost: 148500,
        supplierInfo: { name: 'Jinko Solar Co.', contact: 'sales@jinko.com' },
        expectedDeliveryDate: '2024-07-30',
        lastModified: '2024-05-22T14:00:00Z',
        stageHistory: [
            { stageId: 0, stageName: 'إنشاء الطلب', processor: 'تجريبي', timestamp: '2024-05-15T09:00:00Z', comment: 'تم إنشاء الطلب وبدء سير العمل.', documents: [] },
            { stageId: 1, stageName: 'عرض السعر والموافقة', processor: 'تجريبي', timestamp: '2024-05-17T11:30:00Z', comment: 'تم استلام عرض السعر والموافقة عليه.',
                documents: [
                    { id: 'DOC01', file: new File([""], "Jinko_Quote_Q1.pdf", { type: "application/pdf" }), type: 'Price Quote', uploadDate: '2024-05-17' }
                ] 
            },
            { stageId: 2, stageName: 'أمر الشراء', processor: 'قسم المشتريات', timestamp: '2024-05-18T09:00:00Z', comment: 'تم إرسال أمر الشراء الرسمي.', 
                documents: [
                    { id: 'DOC02', file: new File([""], "PO-2024-112.pdf", { type: "application/pdf" }), type: 'Purchase Order', uploadDate: '2024-05-18' }
                ]
            },
        ],
    },
    { 
        id: 'REQ-002', 
        title: 'تصدير محولات طاقة', 
        description: '20 محول طاقة من نوع SMA Sunny Boy 5.0 إلى الإمارات',
        type: 'تصدير', 
        priority: 'متوسطة', 
        currentStageId: 5, 
        creationDate: '2024-05-10T09:00:00Z',
        lastModified: '2024-05-25T11:00:00Z',
        stageHistory: [
             { stageId: 0, stageName: 'إنشاء الطلب', processor: 'سارة عبدالله', timestamp: '2024-05-10T09:00:00Z', comment: 'تم إنشاء الطلب وبدء سير العمل.', documents: [] },
             { stageId: 1, stageName: 'عرض السعر والموافقة', processor: 'سارة عبدالله', timestamp: '2024-05-10T09:00:00Z', comment: 'طلب جديد من عميل في دبي.', documents:[
                { id: 'DOC04', file: new File([""], "Dubai_Customer_Quote.pdf"), type: 'Price Quote', uploadDate: '2024-05-10'}
             ] },
             { stageId: 2, stageName: 'أمر الشراء', processor: 'سارة عبدالله', timestamp: '2024-05-12T10:00:00Z', comment: 'تم استلام أمر الشراء.', documents:[] },
             { stageId: 3, stageName: 'الشحن', processor: 'سارة عبدالله', timestamp: '2024-05-20T11:00:00Z', comment: 'الشحنة غادرت الميناء.', documents: [
                 { id: 'DOC03', file: new File([""], "BOL-DXB-556.pdf"), type: 'Bill of Lading', uploadDate: '2024-05-20'}
             ]},
             { stageId: 4, stageName: 'التخليص الجمركي', processor: 'مكتب تخليص', timestamp: '2024-05-25T11:00:00Z', comment: 'تم التخليص بنجاح.', documents: [
                 { id: 'DOC05', file: new File([""], "Customs_Cert_556.pdf"), type: 'Shipping Certificate', uploadDate: '2024-05-25'}
             ]},
        ],
    },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'AL001', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), userId: '101', userName: 'فيصل النتيفي', userAvatarUrl: mockAdmin.avatarUrl, action: AuditLogAction.LoginSuccess, targetType: 'System', description: 'تم تسجيل الدخول بنجاح.' },
  { id: 'AL002', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), userId: '1', userName: 'تجريبي', userAvatarUrl: mockEmployee.avatarUrl, action: AuditLogAction.Create, targetType: 'Report', targetId: 'R001', description: 'أنشأ تقرير مبيعات جديد.' },
  { id: 'AL003', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), userId: '101', userName: 'فيصل النتيفي', userAvatarUrl: mockAdmin.avatarUrl, action: AuditLogAction.Delete, targetType: 'Report', targetId: 'R003', description: 'حذف تقرير مشروع.' },
  { id: 'AL004', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), userId: '102', userName: 'سارة عبدالله', userAvatarUrl: `https://picsum.photos/seed/sara/128`, action: AuditLogAction.Update, targetType: 'Employee', targetId: '2', description: 'تحديث بيانات الموظفة فاطمة الزهراء.' },
  { id: 'AL005', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), userId: 'unknown', userName: 'N/A', action: AuditLogAction.LoginFail, targetType: 'System', description: 'محاولة دخول فاشلة للمستخدم "baduser".' },
  { id: 'AL006', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), userId: '101', userName: 'فيصل النتيفي', userAvatarUrl: mockAdmin.avatarUrl, action: AuditLogAction.Export, targetType: 'Reports', description: 'تصدير قائمة التقارير إلى Excel.' },
];