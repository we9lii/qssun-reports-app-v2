import React, { useMemo } from 'react';
import StatCard from '../../components/StatCard';
import { useAppContext } from '../../hooks/useAppContext';
import useAppStore from '../../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ReportStatus, ReportType } from '../../types';
import { FileText, Users, Building2, Star, TrendingUp, Eye, BarChart, Wrench, Briefcase, HelpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';

const AdminDashboardScreen: React.FC = () => {
    const { t } = useAppContext();
    const { reports, users, branches, viewReport, setActiveView, setInitialAllReportsFilter, viewEmployeeProfile } = useAppStore();

    const liveStats = useMemo(() => {
        const reportsToday = reports.filter(r => isToday(new Date(r.date))).length;
        const pendingReviews = reports.filter(r => !r.evaluation && r.status !== ReportStatus.Rejected).length;
        const weekReports = reports.filter(r => isThisWeek(new Date(r.date))).length;
        const salesThisMonth = reports.filter(r => r.type === ReportType.Sales && isThisMonth(new Date(r.date))).length;
        const monthRevenue = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(salesThisMonth * 7500);

        return [
            { id: 'reportsToday', title: t('reportsToday'), value: String(reportsToday), icon: FileText, color: 'text-success' },
            { id: 'totalEmployees', title: t('totalEmployees'), value: String(users.length), icon: Users, color: 'text-primary' },
            { id: 'totalBranches', title: t('totalBranches'), value: String(branches.length), icon: Building2, color: 'text-secondary' },
            { id: 'pendingReviews', title: t('pendingReviews'), value: String(pendingReviews), icon: Star, color: 'text-warning' },
            { id: 'weekReports', title: t('weekReports'), value: String(weekReports), icon: TrendingUp, color: 'text-success' },
            { id: 'monthRevenue', title: t('monthRevenue'), value: monthRevenue, icon: TrendingUp, color: 'text-primary' },
        ];
    }, [reports, users, branches, t]);
    
    const statClickHandlers: { [key: string]: () => void } = {
        reportsToday: () => setActiveView('allReports'),
        totalEmployees: () => setActiveView('manageEmployees'),
        totalBranches: () => setActiveView('manageBranches'),
        pendingReviews: () => setActiveView('serviceEvaluation'),
        weekReports: () => setActiveView('allReports'),
        monthRevenue: () => setActiveView('analytics'),
    };
    
    const pieData = useMemo(() => {
        const reportDistribution = reports.reduce((acc, report) => {
            acc[report.type] = (acc[report.type] || 0) + 1;
            return acc;
        }, {} as { [key in ReportType]: number });
        return Object.entries(reportDistribution).map(([name, value]) => ({ name, value }));
    }, [reports]);

    const COLORS = {
        [ReportType.Sales]: '#3b82f6',
        [ReportType.Maintenance]: '#10b981',
        [ReportType.Project]: '#f97316',
        [ReportType.Inquiry]: '#64748b'
    };

    const handlePieClick = (data: any) => {
        if (data && data.name) {
            setInitialAllReportsFilter({ type: data.name as ReportType });
            setActiveView('allReports');
        }
    };

    const recentReports = useMemo(() => {
        return [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    }, [reports]);
    
    const reportTypeIcons: { [key in ReportType]: React.ElementType } = {
        [ReportType.Sales]: BarChart,
        [ReportType.Maintenance]: Wrench,
        [ReportType.Project]: Briefcase,
        [ReportType.Inquiry]: HelpCircle,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t('adminDashboard')}</h1>
            
            {/* Statistics List View */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart size={24} className="text-primary" />
                        إحصائيات النظام
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {liveStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div 
                                    key={stat.id} 
                                    onClick={statClickHandlers[stat.id]} 
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full bg-primary/10 ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-200">
                                                {stat.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">انقر للعرض التفصيلي</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className={`text-2xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-200`}>
                                            {stat.value}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Reports List View */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText size={20} className="text-primary" />
                            التقارير الأخيرة
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentReports.map((report) => (
                                <div 
                                    key={report.id} 
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <button onClick={() => viewEmployeeProfile(report.employeeId)} className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-200 hover:underline">
                                                {report.employeeName}
                                            </button>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {report.type} • {new Date(report.date).toLocaleDateString('ar-SA')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => viewReport(report.id)} icon={<Eye size={14}/>}>عرض</Button>
                                        <Button size="sm" variant="secondary" onClick={() => setActiveView('serviceEvaluation')} icon={<Star size={14}/>}>تقييم</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Report Distribution Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>توزيع التقارير</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    onClick={handlePieClick}
                                    className="cursor-pointer"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as ReportType]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboardScreen;