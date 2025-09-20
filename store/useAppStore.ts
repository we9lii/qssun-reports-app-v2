import { create } from 'zustand';
import { User, Report, ReportType, WorkflowRequest, ReportStatus, Role, Branch, ChatSession, ChatMessage } from '../types';
import { mockRequests, mockReports, mockUsers, mockBranches } from '../data/mockData';
import toast from 'react-hot-toast';

interface AppState {
    // UI State & App Lifecycle
    activeView: string;
    isSidebarCollapsed: boolean;
    isMobileMenuOpen: boolean;
    isWorkflowModalOpen: boolean;
    isWelcomeBannerVisible: boolean;
    welcomeBannerTimeoutId: number | null;
    confirmationState: {
        isOpen: boolean;
        message: string;
        onConfirm: () => void;
    };
    viewingEmployeeId: string | null;
    
    setActiveView: (view: string) => void;
    toggleSidebar: () => void;
    setMobileMenuOpen: (isOpen: boolean) => void;
    setWorkflowModalOpen: (isOpen: boolean) => void;
    dismissWelcomeBanner: () => void;
    clearWelcomeBannerTimeout: () => void;
    openConfirmation: (message: string, onConfirm: () => void) => void;
    closeConfirmation: () => void;
    viewEmployeeProfile: (employeeId: string) => void;
    clearViewingEmployeeId: () => void;

    // Workflow State
    requests: WorkflowRequest[];
    activeWorkflowId: string | null;
    setActiveWorkflowId: (id: string | null) => void;
    createRequest: (request: WorkflowRequest) => void;
    updateRequest: (request: WorkflowRequest) => void;

    // Reports State
    reports: Report[];
    activeReportId: string | null;
    editingReportId: string | null;
    reportForPrinting: Report | null;
    initialAllReportsFilter: { type?: ReportType } | null;
    reportsLogFilters: { status: ReportStatus } | null;
    setActiveReportId: (id: string | null) => void;
    setEditingReportId: (id: string | null) => void;
    addReport: (report: Omit<Report, 'id'>) => void;
    updateReport: (report: Report, userRole: User['role']) => void;
    deleteReport: (reportId: string) => void;
    viewReport: (reportId: string) => void;
    editReport: (report: Report) => void;
    printReport: (reportId: string) => void;
    clearReportForPrinting: () => void;
    setInitialAllReportsFilter: (filter: { type?: ReportType } | null) => void;
    clearInitialAllReportsFilter: () => void;
    setReportsLogFilters: (filters: { status: ReportStatus } | null) => void;

    // Admin Data State
    users: User[];
    branches: Branch[];
    addUser: (userData: Omit<User, 'id' | 'joinDate' | 'avatarUrl'>) => void;
    updateUser: (userData: Partial<User> & { id: string }) => void;
    deleteUser: (userId: string) => void;
    addBranch: (branchData: Omit<Branch, 'id'|'creationDate'>) => void;
    updateBranch: (branchData: Partial<Branch> & {id: string}) => void;
    deleteBranch: (branchId: string) => void;

    // AI Chat State
    chatSessions: ChatSession[];
    quickChat: ChatSession | null;
    sendNaseehMessage: (messageContent: string, sessionId: string, user: User) => void;
    createNewSession: () => void;
    deleteSession: (sessionId: string) => void;
    sendQuickChatMessage: (messageContent: string, user: User) => void;
    clearQuickChat: () => void;
}

const initialChatSession: ChatSession = {
    id: 'session-1',
    title: 'مقدمة عن الطاقة الشمسية',
    isLoading: false,
    messages: [
        { id: 'msg-1', sender: 'ai', content: 'مرحباً بك! أنا "نصيح"، مساعدك الذكي. كيف يمكنني خدمتك اليوم؟' }
    ]
};

const useAppStore = create<AppState>((set, get) => ({
    // UI State & App Lifecycle
    activeView: 'dashboard',
    isSidebarCollapsed: false,
    isMobileMenuOpen: false,
    isWorkflowModalOpen: false,
    isWelcomeBannerVisible: true,
    welcomeBannerTimeoutId: null,
    confirmationState: {
        isOpen: false,
        message: '',
        onConfirm: () => {},
    },
    viewingEmployeeId: null,
    
    setActiveView: (view) => set({ activeView: view, viewingEmployeeId: null }),
    toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
    setWorkflowModalOpen: (isOpen) => set({ isWorkflowModalOpen: isOpen }),
    dismissWelcomeBanner: () => {
        const existingTimeoutId = get().welcomeBannerTimeoutId;
        if (existingTimeoutId) clearTimeout(existingTimeoutId);
        const randomDelay = (15 + Math.random() * 15) * 60 * 1000;
        const newTimeoutId = setTimeout(() => set({ isWelcomeBannerVisible: true }), randomDelay);
        set({ isWelcomeBannerVisible: false, welcomeBannerTimeoutId: newTimeoutId as unknown as number });
    },
    clearWelcomeBannerTimeout: () => {
        const existingTimeoutId = get().welcomeBannerTimeoutId;
        if (existingTimeoutId) clearTimeout(existingTimeoutId);
        set({ welcomeBannerTimeoutId: null });
    },
    openConfirmation: (message, onConfirm) => set({ confirmationState: { isOpen: true, message, onConfirm } }),
    closeConfirmation: () => set({ confirmationState: { isOpen: false, message: '', onConfirm: () => {} } }),
    viewEmployeeProfile: (employeeId) => set({ viewingEmployeeId: employeeId, activeView: 'adminEmployeeDetail' }),
    clearViewingEmployeeId: () => set({ viewingEmployeeId: null }),

    // Workflow State
    requests: mockRequests,
    activeWorkflowId: null,
    setActiveWorkflowId: (id) => set({ activeWorkflowId: id }),
    createRequest: (request) => set(state => ({ requests: [request, ...state.requests], isWorkflowModalOpen: false })),
    updateRequest: (request) => set(state => ({ requests: state.requests.map(r => r.id === request.id ? request : r) })),

    // Reports State
    reports: mockReports,
    activeReportId: null,
    editingReportId: null,
    reportForPrinting: null,
    initialAllReportsFilter: null,
    reportsLogFilters: null,
    setActiveReportId: (id) => set({ activeReportId: id }),
    setEditingReportId: (id) => set({ editingReportId: id }),
    addReport: (reportData) => {
        const newReport = {
            ...reportData,
            id: `R${Date.now()}`
        };
        set(state => ({ reports: [newReport, ...state.reports] }));
    },
    updateReport: (report, userRole) => {
        set(state => ({
            reports: state.reports.map(r => r.id === report.id ? report : r),
            editingReportId: null,
            activeView: userRole === Role.Admin ? 'allReports' : 'log'
        }));
    },
    deleteReport: (reportId) => {
        set(state => ({
            reports: state.reports.filter(r => r.id !== reportId),
            activeReportId: state.activeReportId === reportId ? null : state.activeReportId,
        }));
    },
    viewReport: (reportId) => set({ activeReportId: reportId, activeView: 'reportDetail' }),
    editReport: (report) => {
        const viewMap: { [key in ReportType]?: string } = {
            [ReportType.Sales]: 'sales',
            [ReportType.Maintenance]: 'maintenance',
            [ReportType.Project]: 'createProjectReport'
        };
        const view = viewMap[report.type];
        if (view) set({ editingReportId: report.id, activeView: view });
    },
    printReport: (reportId) => {
        const report = get().reports.find(r => r.id === reportId);
        if (report) set({ reportForPrinting: report });
    },
    clearReportForPrinting: () => set({ reportForPrinting: null }),
    setInitialAllReportsFilter: (filter) => set({ initialAllReportsFilter: filter }),
    clearInitialAllReportsFilter: () => set({ initialAllReportsFilter: null }),
    setReportsLogFilters: (filters) => {
        if (filters) {
            set({ reportsLogFilters: filters, activeView: 'log' });
        } else {
            set({ reportsLogFilters: null });
        }
    },
    
    // Admin Data State
    users: mockUsers,
    branches: mockBranches,
    addUser: (userData) => {
        const newUser: User = {
            ...userData,
            id: `U${Date.now()}`,
            joinDate: new Date().toISOString(),
            avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        };
        set(state => ({ users: [newUser, ...state.users] }));
    },
    updateUser: (userData) => {
        set(state => ({ 
            users: state.users.map(u => u.id === userData.id ? { ...u, ...userData } : u) 
        }));
    },
    deleteUser: (userId) => {
        set(state => ({ users: state.users.filter(u => u.id !== userId) }));
    },
     addBranch: (branchData) => {
        const newBranch: Branch = {
            ...branchData,
            id: `B${Date.now()}`,
            creationDate: new Date().toISOString(),
        };
        set(state => ({ branches: [newBranch, ...state.branches] }));
    },
    updateBranch: (branchData) => {
        set(state => ({ 
            branches: state.branches.map(b => b.id === branchData.id ? { ...b, ...branchData } : b) 
        }));
    },
    deleteBranch: (branchId) => {
        set(state => ({ branches: state.branches.filter(b => b.id !== branchId) }));
    },

    // AI Chat State
    chatSessions: [initialChatSession],
    quickChat: null,

    createNewSession: () => {
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            title: 'محادثة جديدة',
            isLoading: false,
            messages: [
                { id: 'msg-1', sender: 'ai', content: 'أهلاً بك. كيف يمكنني مساعدتك؟' }
            ]
        };
        set(state => ({ chatSessions: [newSession, ...state.chatSessions] }));
    },

    deleteSession: (sessionId) => {
        set(state => ({ chatSessions: state.chatSessions.filter(s => s.id !== sessionId) }));
    },

    sendNaseehMessage: async (messageContent, sessionId, user) => {
        const userMessage: ChatMessage = {
            id: `msg-user-${Date.now()}`,
            sender: 'user',
            content: messageContent,
        };

        set(state => ({
            chatSessions: state.chatSessions.map(s =>
                s.id === sessionId
                    ? { ...s, messages: [...s.messages, userMessage], isLoading: true }
                    : s
            ),
        }));
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        const aiResponse: ChatMessage = {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            content: `هذا رد تجريبي على سؤالك: "${messageContent}". أنا حالياً في وضع التطوير.`,
            sources: [
                { uri: '#', title: 'مصدر معلومات تجريبي 1' },
                { uri: '#', title: 'مصدر تجريبي آخر للمعلومات' },
            ]
        };

        set(state => ({
            chatSessions: state.chatSessions.map(s =>
                s.id === sessionId
                    ? { ...s, messages: [...s.messages, aiResponse], isLoading: false }
                    : s
            ),
        }));
    },
    
    sendQuickChatMessage: async (messageContent, user) => {
        const userMessage: ChatMessage = {
            id: `q-msg-user-${Date.now()}`,
            sender: 'user',
            content: messageContent,
        };

        let currentQuickChat = get().quickChat;
        if (!currentQuickChat) {
            currentQuickChat = {
                id: 'quick-chat-session',
                title: 'محادثة سريعة',
                isLoading: false,
                messages: [],
            };
        }

        set({
            quickChat: {
                ...currentQuickChat,
                messages: [...currentQuickChat.messages, userMessage],
                isLoading: true,
            }
        });
        
        // محاكاة وقت الاستجابة
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // ردود ذكية محلية بناءً على محتوى الرسالة
        const getSmartResponse = (message: string): string => {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('تقرير') || lowerMessage.includes('تقارير')) {
                return 'يمكنك إنشاء التقارير من خلال الذهاب إلى القسم المناسب في الشريط الجانبي. هل تحتاج مساعدة في نوع معين من التقارير؟';
            }
            
            if (lowerMessage.includes('صيانة')) {
                return 'لإنشاء تقرير صيانة، اذهب إلى "تقارير الصيانة" من القائمة الرئيسية. يمكنك إضافة تفاصيل العمل والصور قبل وبعد الصيانة.';
            }
            
            if (lowerMessage.includes('مبيعات') || lowerMessage.includes('بيع')) {
                return 'تقارير المبيعات متاحة في قسم "تقارير المبيعات". يمكنك تسجيل العملاء والمنتجات والمبالغ بسهولة.';
            }
            
            if (lowerMessage.includes('مشروع') || lowerMessage.includes('مشاريع')) {
                return 'لإدارة المشاريع، استخدم قسم "تقارير المشاريع" حيث يمكنك تتبع التقدم وإضافة التحديثات والملفات.';
            }
            
            if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
                return 'أنا هنا لمساعدتك! يمكنني الإجابة على أسئلتك حول:\n• إنشاء التقارير\n• إدارة المشاريع\n• تتبع الصيانة\n• إدارة المبيعات\n\nما الذي تحتاج مساعدة فيه؟';
            }
            
            if (lowerMessage.includes('كيف') || lowerMessage.includes('طريقة')) {
                return 'سأكون سعيداً لمساعدتك! يرجى تحديد ما تريد تعلم كيفية القيام به، مثل إنشاء تقرير معين أو استخدام ميزة محددة.';
            }
            
            if (lowerMessage.includes('شكر') || lowerMessage.includes('thanks')) {
                return 'العفو! أنا هنا دائماً لمساعدتك. لا تتردد في السؤال عن أي شيء آخر.';
            }
            
            // رد افتراضي ذكي
            return `فهمت سؤالك حول "${messageContent}". كمساعد ذكي لنظام تقارير قصن، يمكنني مساعدتك في إدارة التقارير والمشاريع. هل يمكنك توضيح كيف يمكنني مساعدتك بشكل أكثر تحديداً؟`;
        };
        
        const aiResponse: ChatMessage = {
            id: `q-msg-ai-${Date.now()}`,
            sender: 'ai',
            content: getSmartResponse(messageContent),
        };
        
        set(state => ({
            quickChat: state.quickChat ? {
                ...state.quickChat,
                messages: [...state.quickChat.messages, aiResponse],
                isLoading: false,
            } : null,
        }));
    },
    
    clearQuickChat: () => set({ quickChat: null }),
}));

export default useAppStore;
