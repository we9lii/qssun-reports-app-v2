import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAppContext } from './hooks/useAppContext';
import LoginScreen from './screens/LoginScreen';
import EmployeeDashboardScreen from './screens/employee/EmployeeDashboardScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import { Role } from './types';
import SalesReportsScreen from './screens/employee/SalesReportsScreen';
import MaintenanceReportsScreen from './screens/employee/MaintenanceReportsScreen';
import ProjectReportsScreen from './screens/employee/ProjectReportsScreen';
import AdminAnalyticsScreen from './screens/admin/AnalyticsScreen';
import ManageEmployeesScreen from './screens/admin/ManageEmployeesScreen';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import ReportsLogScreen from './screens/employee/ReportsLogScreen';
import WorkflowScreen from './screens/employee/WorkflowScreen';
import ProfileScreen from './screens/employee/ProfileScreen';
import AllReportsScreen from './screens/admin/AllReportsScreen';
import ServiceEvaluationScreen from './screens/admin/ServiceEvaluationScreen';
import ManageBranchesScreen from './screens/admin/ManageBranchesScreen';
import ManageNotificationsScreen from './screens/admin/ManageNotificationsScreen';
import ManagePermissionsScreen from './screens/admin/ManagePermissionsScreen';
import ComponentsShowcaseScreen from './screens/admin/ComponentsShowcaseScreen';
import WorkflowDetailScreen from './screens/employee/WorkflowDetailScreen';
import WorkflowRequestModal from './screens/employee/WorkflowRequestModal';
import ReportDetailScreen from './screens/common/ReportDetailScreen';
import ProjectDashboardScreen from './screens/employee/ProjectDashboardScreen';
import CreateQuotationScreen from './screens/employee/CreateQuotationScreen';
import useAppStore from './store/useAppStore';
import { Toaster } from 'react-hot-toast';
import { PrintableView } from './components/ui/PrintableView';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import AdminEmployeeDetailScreen from './screens/admin/AdminEmployeeDetailScreen';
import OnboardingScreen from './screens/common/OnboardingScreen';
import { Skeleton } from './components/common/Skeleton';
import EmployeeAnalyticsScreen from './screens/employee/EmployeeAnalyticsScreen';
import LoadingDemo from './screens/common/LoadingDemo';


const App: React.FC = () => {
  const { theme, lang, user, isLoading: isAuthLoading } = useAppContext();

  const {
    activeView,
    activeWorkflowId,
    setActiveWorkflowId,
    requests,
    isWorkflowModalOpen,
    reports,
    activeReportId,
    setActiveReportId,
    editingReportId,
    setEditingReportId,
    isSidebarCollapsed,
    isMobileMenuOpen,
    setMobileMenuOpen,
    reportForPrinting,
    clearReportForPrinting,
    confirmationState,
    closeConfirmation,
    viewingEmployeeId,
    clearViewingEmployeeId,
    isWelcomeBannerVisible,
    dismissWelcomeBanner,
    clearWelcomeBannerTimeout,
  } = useAppStore();
  
  const printMountPoint = useMemo(() => document.getElementById('print-mount-point'), []);

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.lang = lang;
    if(activeView !== 'workflow') {
        setActiveWorkflowId(null);
    }
    if (activeView !== 'reportDetail' && activeReportId) {
        setActiveReportId(null);
    }
    const isEditingView = ['sales', 'maintenance', 'createProjectReport'].includes(activeView);
    if (!isEditingView && editingReportId) {
        setEditingReportId(null);
    }
     if (activeView !== 'adminEmployeeDetail' && viewingEmployeeId) {
        clearViewingEmployeeId();
    }
    if (!user) {
        clearWelcomeBannerTimeout();
    }
  }, [theme, lang, activeView, editingReportId, viewingEmployeeId, user, clearWelcomeBannerTimeout, setActiveWorkflowId, setActiveReportId, setEditingReportId, clearViewingEmployeeId, activeReportId]);

  useEffect(() => {
    const handleAfterPrint = () => {
        clearReportForPrinting();
    };

    if (reportForPrinting) {
        window.addEventListener('afterprint', handleAfterPrint);
        
        requestAnimationFrame(() => {
            window.print();
        });

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint);
            clearReportForPrinting(); 
        };
    }
  }, [reportForPrinting, clearReportForPrinting]);

  if (isAuthLoading) {
    return (
        <div className="bg-slate-100 dark:bg-slate-800 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-4">
                <Skeleton className="h-16 w-32 mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full mt-4" />
            </div>
        </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (user.isFirstLogin) {
    return <OnboardingScreen onComplete={() => { /* State is handled in component now */ }}/>
  }
  
  const editingReport = editingReportId ? reports.find(r => r.id === editingReportId) : null;
  
  const EmployeeScreens: { [key: string]: React.ReactNode } = {
    dashboard: <EmployeeDashboardScreen />,
    sales: <SalesReportsScreen reportToEdit={editingReport} />,
    maintenance: <MaintenanceReportsScreen reportToEdit={editingReport} />,
    projects: <ProjectDashboardScreen />,
    createProjectReport: <ProjectReportsScreen reportToEdit={editingReport} />,
    createQuotation: <CreateQuotationScreen />,
    log: <ReportsLogScreen />,
    workflow: <WorkflowScreen />,
    profile: <ProfileScreen />,
  };
  
  const AdminScreens: { [key: string]: React.ReactNode } = {
    dashboard: <AdminDashboardScreen />,
    allReports: <AllReportsScreen />,
    analytics: <AdminAnalyticsScreen />,
    manageEmployees: <ManageEmployeesScreen />,
    serviceEvaluation: <ServiceEvaluationScreen />,
    manageBranches: <ManageBranchesScreen />,
    manageNotifications: <ManageNotificationsScreen />,
    managePermissions: <ManagePermissionsScreen />,
    componentsShowcase: <ComponentsShowcaseScreen />,
    loadingDemo: <LoadingDemo />,
    adminEmployeeDetail: <AdminEmployeeDetailScreen />,
  };

  const renderContent = () => {
    const activeReport = activeReportId ? reports.find(r => r.id === activeReportId) : null;
    if (activeReport) {
        return <ReportDetailScreen report={activeReport} />;
    }

    if(user.role === Role.Admin) {
        if (viewingEmployeeId) {
            return <AdminEmployeeDetailScreen />;
        }
        return AdminScreens[activeView] || <AdminDashboardScreen />;
    } else {
        if (activeView === 'workflow' && activeWorkflowId) {
            const request = requests.find(r => r.id === activeWorkflowId);
            if (request) {
                return <WorkflowDetailScreen request={request} />;
            }
        }
        return EmployeeScreens[activeView] || <EmployeeDashboardScreen />;
    }
  }

  return (
    <>
        <Toaster position="bottom-center" reverseOrder={false} />
        <ConfirmationModal
            isOpen={confirmationState.isOpen}
            message={confirmationState.message}
            onConfirm={() => {
                confirmationState.onConfirm();
                closeConfirmation();
            }}
            onCancel={closeConfirmation}
        />
        <div className="bg-slate-100 dark:bg-slate-800 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
        {isWelcomeBannerVisible && (
            <div className="relative text-slate-700 dark:text-slate-300 text-center py-2 px-4 overflow-hidden">
                <div className="animate-slide-right text-sm">
                    <span>تم تطوير هذا النظام بواسطة </span>
                    <strong className="text-primary">فيصل بن محمد النتيفي</strong>
                    <span> - لا تتردد في طلب الدعم الفني أو طرح أي استفسار</span>
                </div>
                
                <button 
                    onClick={dismissWelcomeBanner}
                    className="absolute top-1/2 -translate-y-1/2 end-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="إغلاق الرسالة"
                >
                    <X size={14} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" />
                </button>
            </div>
        )}
        <Sidebar />
        <div className={`relative lg:mr-64 ${isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64'} flex flex-col min-h-screen transition-all duration-300`}>
             <Header toggleMobileMenu={() => setMobileMenuOpen(!isMobileMenuOpen)} />
             <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div key={activeView + viewingEmployeeId} className="max-w-7xl mx-auto w-full animate-content-fade-in">
                    {renderContent()}
                </div>
            </main>
        </div>
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
            ></div>
        )}
        </div>
        <WorkflowRequestModal isOpen={isWorkflowModalOpen} />
        {printMountPoint && reportForPrinting && createPortal(
            <PrintableView report={reportForPrinting} />,
            printMountPoint
        )}
    </>
  );
};

export default App;