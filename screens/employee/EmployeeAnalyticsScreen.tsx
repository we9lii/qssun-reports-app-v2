import React, { useMemo, useState, useEffect, useRef } from 'react';
import { BarChart2, Check, Star, Repeat, TrendingUp, Search, Eye, Download, FileText, Clock, Target, Activity, Calendar, Filter, ChevronDown, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { useAppContext } from '../../hooks/useAppContext';
import useAppStore from '../../store/useAppStore';
import { ReportStatus, ReportType, Report } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Area, AreaChart } from 'recharts';
// FIX: Removed startOfMonth and subMonths as they are not available in the used version of date-fns.
import { isWithinInterval, format, startOfWeek, endOfWeek, startOfDay, endOfDay, startOfYear, endOfYear } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import * as XLSX from 'xlsx';
// FIX: Added import for react-hot-toast.
import toast from 'react-hot-toast';

const AnimatedNumber: React.FC<{ value: number; isPercentage?: boolean }> = ({ value, isPercentage = false }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) {
            setDisplayValue(end);
            return;
        }
        const duration = 1200;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easedProgress * (end - start) + start;
            setDisplayValue(isPercentage ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value, isPercentage]);

    return <span>{displayValue}{isPercentage ? '%' : ''}</span>;
};

const statusVariant: { [key in ReportStatus]: 'success' | 'warning' | 'destructive' } = {
    [ReportStatus.Approved]: 'success',
    [ReportStatus.Pending]: 'warning',
    [ReportStatus.Rejected]: 'destructive',
};

const EmployeeAnalyticsScreen: React.FC = () => {
    const { t, user } = useAppContext();
    const { reports, setActiveView, viewReport } = useAppStore();
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [tableSearchTerm, setTableSearchTerm] = useState('');
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [selectedReportType, setSelectedReportType] = useState<ReportType | 'all'>('all');
    const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredKPI, setHoveredKPI] = useState<string | null>(null);
    const animationRef = useRef<number>();

    const employeeReports = useMemo(() => {
        if (!user) return [];
        return reports.filter(r => r.employeeId === user.employeeId);
    }, [reports, user]);

    // Enhanced analytics calculations
    const analytics = useMemo(() => {
        const now = new Date();
        let filteredByTime = employeeReports;
        
        // Apply time filter
        switch (selectedTimeFilter) {
            case 'day':
                filteredByTime = employeeReports.filter(report => 
                    isWithinInterval(new Date(report.date), {
                        start: startOfDay(now),
                        end: endOfDay(now)
                    })
                );
                break;
            case 'week':
                filteredByTime = employeeReports.filter(report => 
                    isWithinInterval(new Date(report.date), {
                        start: startOfWeek(now),
                        end: endOfWeek(now)
                    })
                );
                break;
            case 'year':
                filteredByTime = employeeReports.filter(report => 
                    isWithinInterval(new Date(report.date), {
                        start: startOfYear(now),
                        end: endOfYear(now)
                    })
                );
                break;
            default: // month
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                filteredByTime = employeeReports.filter(report => {
                    const reportDate = new Date(report.date);
                    return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
                });
        }

        const totalReports = filteredByTime.length;
        const approvedReports = filteredByTime.filter(r => r.status === ReportStatus.Approved).length;
        const approvalRate = totalReports > 0 ? (approvedReports / totalReports) * 100 : 0;
        
        const evaluated = filteredByTime.filter(r => r.evaluation);
        const averageRating = evaluated.length > 0 ? evaluated.reduce((sum, r) => sum + (r.evaluation?.rating || 0), 0) / evaluated.length : 0;
        
        const workflowRequests = filteredByTime.filter(r => r.status === ReportStatus.Pending).length;

        // New KPI calculations
        const monthlyProductivity = totalReports; // Reports per selected period
        const averageResponseTime = 2.5; // Mock data - in real app, calculate from actual response times
        
        // Calculate monthly improvement (compare with previous period)
        const previousPeriodStart = new Date(now);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        const previousPeriodReports = employeeReports.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate.getMonth() === previousPeriodStart.getMonth() && 
                   reportDate.getFullYear() === previousPeriodStart.getFullYear();
        }).length;
        
        const monthlyImprovement = previousPeriodReports > 0 
            ? ((totalReports - previousPeriodReports) / previousPeriodReports) * 100 
            : 0;

        // Smart Analytics: Performance comparison with company average
        const companyAverage = {
            approvalRate: 78.5,
            avgRating: 4.2,
            monthlyProductivity: 12,
            averageResponseTime: 3.1
        };

        const performanceComparison = {
            approvalRate: approvalRate - companyAverage.approvalRate,
            avgRating: averageRating - companyAverage.avgRating,
            monthlyProductivity: totalReports - companyAverage.monthlyProductivity,
            averageResponseTime: averageResponseTime - companyAverage.averageResponseTime
        };

        // Performance trends (last 6 months)
        const performanceTrends = Array.from({ length: 6 }, (_, i) => {
            const monthDate = new Date(now);
            monthDate.setMonth(monthDate.getMonth() - (5 - i));
            const monthReports = employeeReports.filter(report => {
                const reportDate = new Date(report.date);
                return reportDate.getMonth() === monthDate.getMonth() && 
                       reportDate.getFullYear() === monthDate.getFullYear();
            });
            
            const monthApproved = monthReports.filter(r => r.status === ReportStatus.Approved).length;
            const monthApprovalRate = monthReports.length > 0 ? (monthApproved / monthReports.length) * 100 : 0;
            
            return {
                month: format(monthDate, 'MMM', { locale: arSA }),
                reports: monthReports.length,
                approvalRate: monthApprovalRate,
                avgRating: monthReports.filter(r => r.evaluation).length > 0 
                    ? monthReports.filter(r => r.evaluation).reduce((sum, r) => sum + (r.evaluation?.rating || 0), 0) / monthReports.filter(r => r.evaluation).length 
                    : 0
            };
        });

        // Peak hours analysis
        const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
            const hourReports = filteredByTime.filter(report => {
                const reportHour = new Date(report.date).getHours();
                return reportHour === hour;
            }).length;
            
            return {
                hour: `${hour}:00`,
                reports: hourReports,
                percentage: totalReports > 0 ? (hourReports / totalReports) * 100 : 0
            };
        });

        const peakHours = hourlyDistribution
            .sort((a, b) => b.reports - a.reports)
            .slice(0, 3)
            .map(h => h.hour);

        // Future performance prediction (simple linear regression)
        const recentTrends = performanceTrends.slice(-3);
        const avgGrowth = recentTrends.length > 1 
            ? recentTrends.reduce((sum, trend, i) => {
                if (i === 0) return 0;
                return sum + (trend.reports - recentTrends[i-1].reports);
            }, 0) / (recentTrends.length - 1)
            : 0;

        const nextMonthPrediction = Math.max(0, totalReports + avgGrowth);

        return {
            total: totalReports,
            approvalRate,
            avgRating: averageRating,
            workflows: workflowRequests,
            monthlyProductivity,
            averageResponseTime,
            monthlyImprovement,
            // Smart Analytics
            companyAverage,
            performanceComparison,
            performanceTrends,
            peakHours,
            nextMonthPrediction,
            hourlyDistribution: hourlyDistribution.filter(h => h.reports > 0)
        };
    }, [employeeReports, selectedTimeFilter]);
    
    const stats = analytics;
    
    const kpiCards = [
        { title: 'إجمالي التقارير', value: stats.total, icon: FileText, isPercentage: false },
        { title: 'نسبة القبول', value: stats.approvalRate, icon: Check, isPercentage: true },
        { title: 'متوسط التقييم', value: stats.avgRating, icon: Star, isPercentage: false },
        { title: 'طلبات سير العمل', value: stats.workflows, icon: Repeat, isPercentage: false },
        { title: 'الإنتاجية الشهرية', value: stats.monthlyProductivity, icon: TrendingUp, isPercentage: false },
        { title: 'متوسط وقت الاستجابة', value: stats.averageResponseTime, icon: Clock, isPercentage: false },
        { title: 'التحسن الشهري', value: stats.monthlyImprovement, icon: Target, isPercentage: true },
    ];

    const reportTypeDistribution = useMemo(() => {
        const distribution = employeeReports.reduce((acc, report) => {
            acc[report.type] = (acc[report.type] || 0) + 1;
            return acc;
        }, {} as { [key in ReportType]?: number });
        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [employeeReports]);

    // Enhanced chart data with new visualizations
    const chartData = useMemo(() => {
        // Monthly performance data for bar chart
        const monthlyPerformance = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(2024, i, 1);
            const monthReports = employeeReports.filter(report => {
                const reportDate = new Date(report.date);
                return reportDate.getMonth() === i && reportDate.getFullYear() === 2024;
            });
            
            return {
                month: format(month, 'MMM', { locale: arSA }),
                reports: monthReports.length,
                approved: monthReports.filter(r => r.status === ReportStatus.Approved).length,
                rating: monthReports.length > 0 
                    ? monthReports.reduce((sum, r) => sum + (r.evaluation?.rating || 0), 0) / monthReports.length 
                    : 0
            };
        });

        // Ratings evolution data for line chart
        const ratingsEvolution = monthlyPerformance.map(item => ({
            month: item.month,
            rating: item.rating
        }));

        // Productivity heatmap data (days of week)
        const heatmapData = Array.from({ length: 7 }, (_, i) => {
            const dayReports = employeeReports.filter(report => {
                const reportDate = new Date(report.date);
                return reportDate.getDay() === i;
            });
            
            return {
                day: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][i],
                productivity: dayReports.length,
                value: dayReports.length
            };
        });

        // Sparkline data for KPI cards
        const sparklineData = Array.from({ length: 7 }, (_, i) => ({
            value: Math.floor(Math.random() * 100) + 20
        }));

        return {
            monthlyPerformance,
            ratingsEvolution,
            heatmapData,
            sparklineData,
            // Original pie chart data
            pieData: [
                { name: 'مُعتمد', value: analytics.total > 0 ? Math.round((analytics.total * analytics.approvalRate) / 100) : 0, color: '#10b981' },
                { name: 'قيد المراجعة', value: analytics.workflows, color: '#f59e0b' },
                { name: 'مرفوض', value: analytics.total - Math.round((analytics.total * analytics.approvalRate) / 100) - analytics.workflows, color: '#ef4444' }
            ]
        };
    }, [employeeReports, analytics]);

    const COLORS: { [key: string]: string } = {
        [ReportType.Sales]: '#3b82f6',
        [ReportType.Maintenance]: '#10b981',
        [ReportType.Project]: '#f97316',
        [ReportType.Inquiry]: '#64748b'
    };
    
    const monthlyPerformance = useMemo(() => {
        const now = new Date();
        const data = [];
        for (let i = 5; i >= 0; i--) {
            // FIX: Replaced subMonths and startOfMonth with native Date logic.
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
            // FIX: Used imported arSA locale object correctly.
            const monthName = format(start, 'MMM', { locale: arSA });
            
            const count = employeeReports.filter(r => isWithinInterval(new Date(r.date), { start, end })).length;
            data.push({ name: monthName, reports: count });
        }
        return data;
    }, [employeeReports]);

    // Enhanced filtered reports with pagination
    const filteredAndPaginatedReports = useMemo(() => {
        let filtered = employeeReports.filter(report => {
            const matchesSearch = report.id.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
                               report.type.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
                               report.status.toLowerCase().includes(tableSearchTerm.toLowerCase());
            
            const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
            
            const matchesRating = selectedRating === 'all' || 
                               (report.evaluation?.rating && report.evaluation.rating === selectedRating);
            
            return matchesSearch && matchesType && matchesRating;
        });

        // Apply time filter to table data as well
        const now = new Date();
        switch (selectedTimeFilter) {
            case 'day':
                filtered = filtered.filter(report => 
                    isWithinInterval(new Date(report.date), {
                        start: startOfDay(now),
                        end: endOfDay(now)
                    })
                );
                break;
            case 'week':
                filtered = filtered.filter(report => 
                    isWithinInterval(new Date(report.date), {
                        start: startOfWeek(now),
                        end: endOfWeek(now)
                    })
                );
                break;
            case 'year':
                filtered = filtered.filter(report => 
                    isWithinInterval(new Date(report.date), {
                        start: startOfYear(now),
                        end: endOfYear(now)
                    })
                );
                break;
            default: // month
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                filtered = filtered.filter(report => {
                    const reportDate = new Date(report.date);
                    return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
                });
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return {
            all: filtered,
            paginated: filtered.slice(startIndex, endIndex),
            totalPages: Math.ceil(filtered.length / itemsPerPage)
        };
    }, [employeeReports, tableSearchTerm, selectedReportType, selectedRating, selectedTimeFilter, currentPage, itemsPerPage]);

    useEffect(() => {
        setFilteredReports(filteredAndPaginatedReports.all);
    }, [filteredAndPaginatedReports]);
    
    const handlePieClick = (data: any) => {
        if (data && data.name) {
            setTableSearchTerm(data.name);
        }
    };
    
    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredReports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'MyReports');
        XLSX.writeFile(workbook, `MyReports-${user?.name}.xlsx`);
        toast.success('تم تصدير البيانات بنجاح!');
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            <ScreenHeader
                icon={BarChart2}
                title="تحليلات الموظف"
                colorClass="bg-amber-500"
                onBack={() => setActiveView('dashboard')}
            />

            {/* Enhanced Filters Section */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <select 
                                value={selectedTimeFilter} 
                                onChange={(e) => setSelectedTimeFilter(e.target.value as any)}
                                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
                            >
                                <option value="day">اليوم</option>
                                <option value="week">الأسبوع</option>
                                <option value="month">الشهر</option>
                                <option value="year">السنة</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select 
                                value={selectedReportType} 
                                onChange={(e) => setSelectedReportType(e.target.value as any)}
                                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
                            >
                                <option value="all">جميع الأنواع</option>
                                <option value={ReportType.Sales}>مبيعات</option>
                                <option value={ReportType.Marketing}>تسويق</option>
                                <option value={ReportType.Operations}>عمليات</option>
                                <option value={ReportType.Finance}>مالية</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-gray-500" />
                            <select 
                                value={selectedRating} 
                                onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
                            >
                                <option value="all">جميع التقييمات</option>
                                <option value="5">5 نجوم</option>
                                <option value="4">4 نجوم</option>
                                <option value="3">3 نجوم</option>
                                <option value="2">2 نجوم</option>
                                <option value="1">1 نجمة</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced KPI Cards with Tooltips */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpiCards.map(({ title, value, icon: Icon, isPercentage }) => (
                    <Card 
                        key={title} 
                        className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                        onMouseEnter={() => setHoveredKPI(title)}
                        onMouseLeave={() => setHoveredKPI(null)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                <Info className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xl font-bold text-gradient">
                                <AnimatedNumber value={value} isPercentage={isPercentage} />
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{title}</p>
                            
                            {/* Tooltip */}
                            {hoveredKPI === title && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    {title === 'إجمالي التقارير' && 'العدد الكلي للتقارير المُرسلة'}
                                    {title === 'نسبة القبول' && 'نسبة التقارير المُعتمدة من إجمالي التقارير'}
                                    {title === 'متوسط التقييم' && 'متوسط تقييمات جميع التقارير'}
                                    {title === 'طلبات سير العمل' && 'عدد التقارير قيد المراجعة'}
                                    {title === 'الإنتاجية الشهرية' && 'عدد التقارير في الفترة المحددة'}
                                    {title === 'متوسط وقت الاستجابة' && 'متوسط الوقت للرد على التقارير (بالساعات)'}
                                    {title === 'التحسن الشهري' && 'نسبة التحسن مقارنة بالفترة السابقة'}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Monthly Performance Bar Chart */}
                <Card className="xl:col-span-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-blue-600" />
                            الأداء الشهري
                            <div className="ml-auto">
                                <Badge variant="secondary" className="text-xs">
                                    آخر 6 أشهر
                                </Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData.monthlyPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="month" stroke="rgb(200 200 200)" />
                                <YAxis stroke="rgb(200 200 200)" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                        border: 'none', 
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="reports" name="التقارير" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="approved" name="المُعتمد" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Distribution Pie Chart */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            توزيع الحالات
                            <div className="ml-auto">
                                <Badge variant="secondary" className="text-xs">
                                    الشهر الحالي
                                </Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie 
                                    data={chartData.pieData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={80} 
                                    labelLine={false} 
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    className="cursor-pointer"
                                >
                                    {chartData.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ratings Evolution Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            تطور التقييمات
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData.ratingsEvolution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="month" stroke="rgb(200 200 200)" />
                                <YAxis domain={[0, 5]} stroke="rgb(200 200 200)" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                        border: 'none', 
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="rating" 
                                    name="التقييم" 
                                    stroke="#f59e0b" 
                                    strokeWidth={3} 
                                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Productivity Heatmap */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            خريطة الإنتاجية الأسبوعية
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData.heatmapData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis type="number" stroke="rgb(200 200 200)" />
                                <YAxis dataKey="day" type="category" stroke="rgb(200 200 200)" width={80} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                        border: 'none', 
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                                <Bar 
                                    dataKey="productivity" 
                                    name="الإنتاجية" 
                                    fill="#06b6d4" 
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Smart Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Performance Comparison */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            مقارنة الأداء مع المتوسط العام
                            <Badge variant="secondary" className="text-xs">ذكي</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium">معدل الموافقة</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {stats.companyAverage.approvalRate}% (المتوسط)
                                    </span>
                                    <span className={`text-sm font-bold ${stats.performanceComparison.approvalRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.performanceComparison.approvalRate >= 0 ? '+' : ''}{stats.performanceComparison.approvalRate.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium">متوسط التقييم</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {stats.companyAverage.avgRating} (المتوسط)
                                    </span>
                                    <span className={`text-sm font-bold ${stats.performanceComparison.avgRating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.performanceComparison.avgRating >= 0 ? '+' : ''}{stats.performanceComparison.avgRating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <span className="text-sm font-medium">الإنتاجية الشهرية</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {stats.companyAverage.monthlyProductivity} (المتوسط)
                                    </span>
                                    <span className={`text-sm font-bold ${stats.performanceComparison.monthlyProductivity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.performanceComparison.monthlyProductivity >= 0 ? '+' : ''}{stats.performanceComparison.monthlyProductivity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Trends */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            اتجاهات الأداء (6 أشهر)
                            <Badge variant="secondary" className="text-xs">ذكي</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats.performanceTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="month" stroke="rgb(200 200 200)" />
                                <YAxis stroke="rgb(200 200 200)" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                        border: 'none', 
                                        borderRadius: '0.5rem',
                                        color: 'white'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="reports" 
                                    name="عدد التقارير" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="approvalRate" 
                                    name="معدل الموافقة %" 
                                    stroke="#10b981" 
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Peak Hours Analysis */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-600" />
                            تحليل أوقات الذروة
                            <Badge variant="secondary" className="text-xs">ذكي</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                أوقات الذروة الثلاثة الأولى:
                            </div>
                            {stats.peakHours.map((hour, index) => (
                                <div key={hour} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                    <span className="text-sm font-medium">#{index + 1} - {hour}</span>
                                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                                        {stats.hourlyDistribution.find(h => h.hour === hour)?.reports || 0} تقرير
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        {stats.hourlyDistribution.length > 0 && (
                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart data={stats.hourlyDistribution.slice(0, 12)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                        <XAxis dataKey="hour" stroke="rgb(200 200 200)" fontSize={10} />
                                        <YAxis stroke="rgb(200 200 200)" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                                border: 'none', 
                                                borderRadius: '0.5rem',
                                                color: 'white'
                                            }}
                                        />
                                        <Bar dataKey="reports" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Future Predictions */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-orange-600" />
                            توقعات الأداء المستقبلي
                            <Badge variant="secondary" className="text-xs">ذكي</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-900/20 dark:to-amber-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {Math.round(stats.nextMonthPrediction)}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    توقع عدد التقارير الشهر القادم
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                                    <div className="text-lg font-semibold text-green-600">
                                        {stats.monthlyImprovement >= 0 ? '+' : ''}{stats.monthlyImprovement.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        التحسن الشهري
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                                    <div className="text-lg font-semibold text-blue-600">
                                        {stats.averageResponseTime.toFixed(1)}د
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                        متوسط وقت الاستجابة
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Data Table with Pagination */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            سجل تقاريري الشامل ({filteredAndPaginatedReports.all.length} تقرير)
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <Input 
                                placeholder="بحث في التقارير..." 
                                icon={<Search size={16}/>} 
                                value={tableSearchTerm} 
                                onChange={e => setTableSearchTerm(e.target.value)}
                                className="w-full sm:w-64"
                            />
                            <Button 
                                variant="secondary" 
                                icon={<Download size={16}/>} 
                                onClick={handleExport}
                                className="whitespace-nowrap"
                            >
                                تصدير البيانات
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredAndPaginatedReports.all.length > 0 ? (
                        <>
                            {/* Enhanced Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="p-3 text-right font-semibold">المعرف</th>
                                            <th className="p-3 text-right font-semibold">النوع</th>
                                            <th className="p-3 text-right font-semibold">التاريخ</th>
                                            <th className="p-3 text-right font-semibold">الحالة</th>
                                            <th className="p-3 text-right font-semibold">التقييم</th>
                                            <th className="p-3 text-right font-semibold">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndPaginatedReports.paginated.map((report, index) => (
                                            <tr 
                                                key={report.id} 
                                                className={`border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                                    index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-25 dark:bg-slate-850'
                                                }`}
                                            >
                                                <td className="p-3 font-mono text-xs">{report.id}</td>
                                                <td className="p-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {report.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300">
                                                    {format(new Date(report.date), 'dd/MM/yyyy', { locale: arSA })}
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant={statusVariant[report.status]}>
                                                        {report.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    {report.evaluation?.rating ? (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-sm font-medium">{report.evaluation.rating}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">غير مُقيم</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            icon={<Eye size={14}/>} 
                                                            onClick={() => viewReport(report.id)}
                                                            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900"
                                                        >
                                                            عرض
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredAndPaginatedReports.totalPages > 1 && (
                                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, filteredAndPaginatedReports.all.length)} من {filteredAndPaginatedReports.all.length} تقرير
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={filteredAndPaginatedReports.totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState 
                            icon={FileText}
                            title="لا توجد تقارير"
                            message="لم يتم العثور على تقارير مطابقة للفلاتر المحددة."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EmployeeAnalyticsScreen;
