import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import toast from 'react-hot-toast';

type Theme = 'light' | 'dark';
type Language = 'ar' | 'en';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  user: User | null;
  login: (employeeId: string, password: string) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: { [key in Language]: { [key:string]: string } } = {
  ar: {
    welcome: "مرحباً بك في نظام QssunReports",
    dailyReportsSystem: "نظام التقارير اليومية",
    employeeId: "رقم الموظف",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    enterEmployeeId: "الرجاء إدخال رقم الموظف",
    employeeNotFound: "رقم الموظف غير موجود",
    incorrectPassword: "كلمة المرور غير صحيحة",
    back: "رجوع",
    hello: "مرحباً",
    employeeDashboard: "لوحة تحكم الموظف",
    adminDashboard: "لوحة تحكم المسؤول",
    salesReports: "تقارير المبيعات",
    maintenanceReports: "تقارير الصيانة والضمان",
    projectReports: "تقارير المشاريع",
    reportsLog: "سجل التقارير",
    importExport: "الاستيراد والتصدير",
    profile: "الملف الشخصي",
    dashboard: "الرئيسية",
    analytics: "التحليلات",
    manageEmployees: "إدارة الموظفين",
    reportsToday: "تقارير اليوم",
    totalEmployees: "إجمالي الموظفين",
    totalBranches: "إجمالي الفروع",
    pendingReviews: "تقييمات معلقة",
    weekReports: "تقارير الأسبوع",
    monthRevenue: "إيرادات الشهر",
    logout: "خروج",
    allReports: "جميع التقارير",
    serviceEvaluation: "تقييم الخدمة",
    manageBranches: "إدارة الفروع",
    manageNotifications: "إدارة الإشعارات",
    managePermissions: "الأدوار والصلاحيات",
    componentsShowcase: "عرض المكونات",
    loadingDemo: "عرض مكونات التحميل",
    // New Workflow Translations
    createNewRequest: "إنشاء طلب جديد",
    requestType: "نوع الطلب",
    import: "استيراد",
    export: "تصدير",
    requestTitle: "عنوان الطلب",
    requestDescription: "وصف تفصيلي",
    priority: "الأولوية",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
    supplierName: "اسم المورد",
    supplierContact: "معلومات الاتصال",
    estimatedCost: "التكلفة المتوقعة",
    expectedDeliveryDate: "تاريخ التسليم المتوقع",
    notes: "ملاحظات إضافية",
    saveRequest: "حفظ الطلب",
  },
  en: {
    welcome: "Welcome to QssunReports System",
    dailyReportsSystem: "Daily Reports System",
    employeeId: "Employee ID",
    password: "Password",
    login: "Login",
    enterEmployeeId: "Please enter your Employee ID",
    employeeNotFound: "Employee ID not found",
    incorrectPassword: "Incorrect password",
    back: "Back",
    hello: "Hello",
    employeeDashboard: "Employee Dashboard",
    adminDashboard: "Admin Dashboard",
    salesReports: "Sales Reports",
    maintenanceReports: "Maintenance & Warranty Reports",
    projectReports: "Project Reports",
    reportsLog: "Reports Log",
    importExport: "Import / Export",
    profile: "Profile",
    dashboard: "Dashboard",
    analytics: "Analytics",
    manageEmployees: "Manage Employees",
    reportsToday: "Reports Today",
    totalEmployees: "Total Employees",
    totalBranches: "Total Branches",
    pendingReviews: "Pending Reviews",
    weekReports: "Week's Reports",
    monthRevenue: "Month's Revenue",
    logout: "Logout",
    allReports: "All Reports",
    serviceEvaluation: "Service Evaluation",
    manageBranches: "Manage Branches",
    manageNotifications: "Manage Notifications",
    managePermissions: "Roles & Permissions",
    componentsShowcase: "Components Showcase",
    loadingDemo: "Loading Components Demo",
    // New Workflow Translations
    createNewRequest: "Create New Request",
    requestType: "Request Type",
    import: "Import",
    export: "Export",
    requestTitle: "Request Title",
    requestDescription: "Detailed Description",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    supplierName: "Supplier Name",
    contactInfo: "Contact Info",
    estimatedCost: "Estimated Cost",
    expectedDeliveryDate: "Expected Delivery Date",
    notes: "Additional Notes",
    saveRequest: "Save Request",
  },
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('ar');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Simplified loading state

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === 'ar' ? 'en' : 'ar'));
  };

  const t = useCallback((key: string) => {
    return translations[lang][key] || key;
  }, [lang]);

  const login = (employeeId: string, password: string) => {
    const foundUser = mockUsers.find(u => u.employeeId === employeeId);
    
    // Using a generic password for demo purposes
    if (foundUser && password === '123321') {
      toast.success(`مرحباً بك مجدداً، ${foundUser.name}`);
      setUser(foundUser);
    } else if (foundUser) {
      toast.error(t('incorrectPassword'));
    } else {
      toast.error(t('employeeNotFound'));
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUserData: Partial<User>) => {
      setUser(prevUser => (prevUser ? { ...prevUser, ...updatedUserData } : null));
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t, user, login, logout, updateUser, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};