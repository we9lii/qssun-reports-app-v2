import React from 'react';
import { FileText, Wrench, Briefcase, BarChart2, Download, User, ChevronLeft, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { Card, CardContent } from '../../components/ui/Card';
import StatCard from '../../components/StatCard';
import useAppStore from '../../store/useAppStore';
import { mockReports } from '../../data/mockData';

const EmployeeDashboardScreen: React.FC = () => {
    const { t, user } = useAppContext();
    const { setActiveView } = useAppStore();

    if (!user) return null;

    const services = [
        { title: t('salesReports'), icon: FileText, view: 'sales', color: 'nav-sales', shadow: 'shadow-sales', cardType: 'sales' },
        { title: t('maintenanceReports'), icon: Wrench, view: 'maintenance', color: 'nav-maintenance', shadow: 'shadow-maintenance', cardType: 'maintenance' },
        { title: t('projectReports'), icon: Briefcase, view: 'projects', color: 'nav-project', shadow: 'shadow-project', cardType: 'projects' },
        { title: t('reportsLog'), icon: BarChart2, view: 'log', color: 'nav-log', shadow: 'shadow-log', cardType: 'log' },
        { title: t('importExport'), icon: Download, view: 'workflow', color: 'nav-workflow', shadow: 'shadow-workflow', cardType: 'workflow' },
        { title: t('profile'), icon: User, view: 'profile', color: 'nav-profile', shadow: 'shadow-profile', cardType: 'profile' },
    ];


    
    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'صباح الخير';
        if (hour < 18) return 'مساء الخير';
        return 'مساء الخير';
    };

    const getMotivationalMessage = () => {
        const messages = [
            'استعد لتحقيق إنجازات رائعة اليوم! 🚀',
            'كل يوم جديد فرصة لتطوير مهاراتك وتحقيق أهدافك 💪',
            'النجاح يبدأ بخطوة واحدة، ابدأ رحلتك الآن! ⭐',
            'اجعل اليوم مميزاً بإنجازاتك وإبداعك 🌟',
            'التميز ليس حدثاً، بل عادة يومية 🎯'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    // Calculate statistics from mock data
    const userReports = mockReports.filter(report => report.employeeId === user.employeeId);
    const todayReports = userReports.filter(report => {
        const reportDate = new Date(report.date);
        const today = new Date();
        return reportDate.toDateString() === today.toDateString();
    });
    const pendingReports = userReports.filter(report => report.status === 'pending').length;
    const completedReports = userReports.filter(report => report.status === 'approved').length;

    const statsData = [
        {
            title: 'التقارير اليوم',
            value: todayReports.length.toString(),
            change: '+2 من أمس',
            icon: FileText,
            color: 'text-blue-600'
        },
        {
            title: 'المهام المعلقة',
            value: pendingReports.toString(),
            change: '-1 من أمس',
            icon: Clock,
            color: 'text-orange-600'
        },
        {
            title: 'المكتملة',
            value: completedReports.toString(),
            change: '+3 هذا الأسبوع',
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            title: 'معدل الإنجاز',
            value: `${Math.round((completedReports / (completedReports + pendingReports)) * 100)}%`,
            change: '+5% من الشهر الماضي',
            icon: TrendingUp,
            color: 'text-amber-600'
        }
    ];

    return (
        <div className="relative space-y-8">
        <div className="aurora-bg"></div>
            <div className="relative z-10">
                {/* Enhanced Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-down-fade-in">
                                {getWelcomeMessage()}، {user.name.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-slate-600 dark:text-slate-300 mt-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                {getMotivationalMessage()}
                            </p>
                        </div>
                        <div className="text-right text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="space-y-1">
                                {/* Arabic Gregorian Date */}
                                <p className="font-medium">{new Date().toLocaleDateString('ar-SA-u-ca-gregory', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                {/* English Date */}
                                <p className="text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                {/* Hijri Date */}
                                <p className="text-xs">{new Date().toLocaleDateString('ar-SA-u-ca-islamic', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                {/* Time in 12-hour format with English numbers */}
                                <p className="font-mono text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                            </div>
                        </div>
                    </div>
                </div>







                {/* Enhanced Services Section */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-3 text-primary">
                        <Briefcase size={28} className="text-primary" />
                        مركز الخدمات المتقدمة
                    </h2>
                    
                    {/* Mobile & Tablet View: List Layout with Slice Effect */}
                    <div className="space-y-3 lg:hidden">
                        {services.map((service, index) => (
                            <button 
                                key={service.view}
                                onClick={() => setActiveView(service.view)}
                                className="slice relative w-full text-right rounded-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 group animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms`}}
                            >
                                <div className="flex items-center w-full p-4 transition-colors duration-200">
                                    <div className={`p-3 rounded-full text-slate-900 dark:text-white bg-${service.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                        <service.icon size={22} />
                                    </div>
                                    <span className="flex-1 mx-4 text-base font-semibold">{service.title}</span>
                                    <ChevronLeft size={24} className="text-slate-400 transition-transform duration-300 group-hover:-translate-x-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    {/* Desktop View: Enhanced Grid Cards with New Design */}
                    <div className="hidden lg:flex flex-wrap justify-center gap-8">
                        {services.map((service, index) => {
                            // تحديد الكلمة المناسبة لكل نوع خدمة
                            const getServiceLabel = (cardType: string) => {
                                switch(cardType) {
                                    case 'sales': return 'مركز المبيعات';
                                    case 'maintenance': return 'مركز الصيانة';
                                    case 'projects': return 'مركز المشاريع';
                                    case 'log': return 'مركز السجلات';
                                    case 'workflow': return 'مركز العمليات';
                                    case 'profile': return 'مركز الملف الشخصي';
                                    default: return 'مركز الخدمات';
                                }
                            };
                            
                            return (
                                <div
                                    key={service.view}
                                    onClick={() => setActiveView(service.view)}
                                    className={`card ${service.cardType} playing group cursor-pointer animate-fade-in-up`}
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="image"></div>
                                    
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    
                                    <div className="particles"></div>
                                    
                                    <div className="infotop">
                                        <service.icon size={32} className="icon mb-2" />
                                        <div className="card-name">{service.title}</div>
                                        <div className="author">{getServiceLabel(service.cardType)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboardScreen;