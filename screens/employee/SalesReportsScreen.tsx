import React, { useEffect, useState, useCallback } from 'react';
import { PlusCircle, Trash2, User, FileText, Upload, AlertCircle, CheckCircle, TrendingUp, Users, Phone, MapPin, Download, Printer } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { useAppContext } from '../../hooks/useAppContext';
import { Report, ReportType, ReportStatus, SalesDetails, SalesCustomer } from '../../types';
import useAppStore from '../../store/useAppStore';
import toast from 'react-hot-toast';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';

interface SalesReportsScreenProps {
    reportToEdit: Report | null;
}

type SalesReportFormInputs = {
    totalCustomers: number;
    serviceType: string;
    customers: SalesCustomer[];
};

const SalesReportsScreen: React.FC<SalesReportsScreenProps> = ({ reportToEdit }) => {
    const { user } = useAppContext();
    const { addReport, updateReport, setActiveView, reports } = useAppStore();
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SalesReportFormInputs>({
        defaultValues: {
            totalCustomers: 1,
            serviceType: 'تركيب نظام شمسي',
            customers: [{ id: Date.now(), name: '', phone: '', region: '', requestType: 'استفسار سعر', notes: '', files: [] }]
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "customers"
    });

    const isEditMode = !!reportToEdit;

    useEffect(() => {
        if (isEditMode && reportToEdit) {
            const details = reportToEdit.details as SalesDetails;
            reset({
                totalCustomers: details.totalCustomers,
                serviceType: details.serviceType,
                customers: details.customers,
            });
        } else {
             reset({
                totalCustomers: 1,
                serviceType: 'تركيب نظام شمسي',
                customers: [{ id: Date.now(), name: '', phone: '', region: '', requestType: 'استفسار سعر', notes: '', files: [] }]
            });
        }
    }, [reportToEdit, isEditMode, reset]);
    
    const handleFileChange = (customerIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const currentFiles = watch(`customers.${customerIndex}.files`) || [];
            const newFiles = Array.from(e.target.files).map(file => ({ id: `${file.name}-${Date.now()}`, file }));
            setValue(`customers.${customerIndex}.files`, [...currentFiles, ...newFiles]);
        }
    };
    
    const removeFile = (customerIndex: number, fileId: string) => {
        const currentFiles = watch(`customers.${customerIndex}.files`) || [];
        setValue(`customers.${customerIndex}.files`, currentFiles.filter(f => f.id !== fileId));
    };


    // دالة التحقق من صحة البيانات
    const validateForm = (data: SalesReportFormInputs): boolean => {
        const errors: {[key: string]: string} = {};
        
        // التحقق من العدد الإجمالي للعملاء
        if (!data.totalCustomers || data.totalCustomers < 1) {
            errors.totalCustomers = 'يجب أن يكون عدد العملاء أكبر من صفر';
        }
        
        // التحقق من بيانات العملاء
        data.customers.forEach((customer, index) => {
            if (!customer.name.trim()) {
                errors[`customer_${index}_name`] = 'اسم العميل مطلوب';
            }
            
            if (!customer.phone.trim()) {
                errors[`customer_${index}_phone`] = 'رقم الجوال مطلوب';
            } else if (!/^(05|5)\d{8}$/.test(customer.phone.replace(/\s/g, ''))) {
                errors[`customer_${index}_phone`] = 'رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام)';
            }
            
            if (!customer.region.trim()) {
                errors[`customer_${index}_region`] = 'المنطقة مطلوبة';
            }
        });
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Auto-save functionality
    const autoSave = useCallback(async (data: any) => {
        setAutoSaveStatus('saving');
        try {
            // Simulate auto-save to localStorage or server
            localStorage.setItem('draft-sales-report', JSON.stringify(data));
            setAutoSaveStatus('saved');
            setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch (error) {
            setAutoSaveStatus('error');
            setTimeout(() => setAutoSaveStatus('idle'), 3000);
        }
    }, []);

    // Smart suggestions based on previous reports
    const generateSuggestions = useCallback((currentData: any) => {
        const newSuggestions: string[] = [];
        
        if (reports && reports.length > 0) {
            // Suggest common service types
            const commonServices = reports
                .map(r => r.serviceType)
                .filter(Boolean)
                .reduce((acc: Record<string, number>, service) => {
                    acc[service] = (acc[service] || 0) + 1;
                    return acc;
                }, {});
            
            const topService = Object.entries(commonServices)
                .sort(([,a], [,b]) => b - a)[0]?.[0];
            
            if (topService && currentData.serviceType !== topService) {
                newSuggestions.push(`الخدمة الأكثر طلباً: ${topService}`);
            }
            
            // Suggest optimal customer count
            const avgCustomers = reports.reduce((sum, r) => sum + (r.totalCustomers || 0), 0) / reports.length;
            if (currentData.totalCustomers && currentData.totalCustomers < avgCustomers * 0.8) {
                newSuggestions.push(`متوسط العملاء في التقارير السابقة: ${Math.round(avgCustomers)}`);
            }
        }
        
        setSuggestions(newSuggestions);
    }, [reports]);

    // Watch form changes for auto-save and suggestions
    const watchedValues = watch();
    useEffect(() => {
        const timer = setTimeout(() => {
            if (Object.keys(watchedValues).length > 0) {
                autoSave(watchedValues);
                generateSuggestions(watchedValues);
            }
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [watchedValues, autoSave, generateSuggestions]);

    // حساب الإحصائيات السريعة
    const quickStats = React.useMemo(() => {
        const userReports = reports.filter(r => r.employeeId === user?.employeeId && r.type === ReportType.Sales);
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const thisMonthReports = userReports.filter(r => {
            const reportDate = new Date(r.date);
            return reportDate.getMonth() === thisMonth && reportDate.getFullYear() === thisYear;
        });
        
        const totalCustomersThisMonth = thisMonthReports.reduce((sum, report) => {
            const details = report.details as SalesDetails;
            return sum + (details.totalCustomers || 0);
        }, 0);
        
        const avgCustomersPerReport = thisMonthReports.length > 0 ? 
            Math.round(totalCustomersThisMonth / thisMonthReports.length) : 0;
            
        const mostCommonService = thisMonthReports.reduce((acc, report) => {
            const details = report.details as SalesDetails;
            acc[details.serviceType] = (acc[details.serviceType] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});
        
        const topService = Object.entries(mostCommonService).sort(([,a], [,b]) => b - a)[0];
        
        return {
            totalReports: thisMonthReports.length,
            totalCustomers: totalCustomersThisMonth,
            avgCustomersPerReport,
            topService: topService ? topService[0] : 'لا توجد بيانات'
        };
    }, [reports, user?.employeeId]);

    const onSubmit: SubmitHandler<SalesReportFormInputs> = async (data) => {
        if (!user) return;
        
        setIsSubmitting(true);
        
        // التحقق من صحة البيانات
        if (!validateForm(data)) {
            setIsSubmitting(false);
            toast.error('يرجى تصحيح الأخطاء المذكورة أعلاه');
            return;
        }

        const reportDetails: SalesDetails = {
            totalCustomers: Number(data.totalCustomers) || data.customers.length,
            serviceType: data.serviceType,
            customers: data.customers
        };
        
        try {
            if (isEditMode && reportToEdit) {
                const updatedReport: Report = {
                    ...reportToEdit,
                    details: reportDetails,
                    modifications: [
                        ...(reportToEdit.modifications || []),
                        { modifiedBy: user.name, timestamp: new Date().toISOString() }
                    ]
                };
                updateReport(updatedReport, user.role);
                toast.success('تم تحديث التقرير بنجاح!');
            } else {
                const newReport: Omit<Report, 'id'> = {
                    employeeId: user.employeeId,
                    employeeName: user.name,
                    branch: user.branch,
                    department: user.department,
                    type: ReportType.Sales,
                    date: new Date().toISOString(),
                    status: ReportStatus.Pending,
                    details: reportDetails
                };
                addReport(newReport);
                toast.success('تم حفظ تقرير المبيعات بنجاح!');
            }
            
            setActiveView('log');
        } catch (error) {
            toast.error('حدث خطأ أثناء حفظ التقرير');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <ScreenHeader 
                icon={FileText} 
                title={isEditMode ? "تعديل تقرير مبيعات" : "تقرير موظف مبيعات"}
                colorClass="bg-nav-sales"
                onBack={() => setActiveView(isEditMode ? 'log' : 'dashboard')}
            />
            
            {/* Smart Suggestions Panel */}
                {suggestions.length > 0 && (
                    <Card className="slice mb-6 border-l-4 border-l-yellow-400">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                        اقتراحات ذكية
                                    </h3>
                                    <ul className="space-y-1">
                                        {suggestions.map((suggestion, index) => (
                                            <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}


            <Card className="slice shadow-lg border-0">
                <CardContent className="p-6">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                    <User size={16} />
                                    إجمالي العملاء
                                </label>
                                <Input 
                                    type="number" 
                                    icon={<User size={16}/>} 
                                    {...register("totalCustomers", { 
                                        required: "عدد العملاء مطلوب", 
                                        valueAsNumber: true, 
                                        min: { value: 1, message: "يجب أن يكون العدد أكبر من صفر" }
                                    })}
                                    placeholder="أدخل العدد الإجمالي للعملاء"
                                    className={`transition-all duration-200 ${errors.totalCustomers || validationErrors.totalCustomers ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                />
                                {(errors.totalCustomers || validationErrors.totalCustomers) && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.totalCustomers?.message || validationErrors.totalCustomers}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    نوع الخدمة
                                </label>
                                <select 
                                    {...register("serviceType")}
                                    className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 py-2 px-3 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-400"
                                >
                                    <option>تركيب نظام شمسي</option>
                                    <option>صيانة</option>
                                    <option>استشارة فنية</option>
                                    <option>معاينة موقع</option>
                                    <option>ألواح شمسية</option>
                                    <option>بطاريات</option>
                                    <option>محولات</option>
                                    <option>ملحقات</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                                <Users size={20} />
                                بيانات العملاء (تفصيلي)
                            </h3>
                            {fields.map((field, index) => {
                                const customerFiles = watch(`customers.${index}.files`) || [];
                                const hasNameError = errors.customers?.[index]?.name || validationErrors[`customer_${index}_name`];
                                const hasPhoneError = errors.customers?.[index]?.phone || validationErrors[`customer_${index}_phone`];
                                const hasRegionError = errors.customers?.[index]?.region || validationErrors[`customer_${index}_region`];
                                
                                return (
                                <div key={field.id} className="p-6 border-2 rounded-xl space-y-4 relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-700">
                                    <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                                <User size={14} />
                                                الاسم
                                            </label>
                                            <Input 
                                                placeholder="الاسم" 
                                                {...register(`customers.${index}.name`, { required: "اسم العميل مطلوب" })} 
                                                className={`transition-all duration-200 ${hasNameError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                            />
                                            {hasNameError && (
                                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                                    <AlertCircle size={12} />
                                                    <span>{errors.customers?.[index]?.name?.message || validationErrors[`customer_${index}_name`]}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                                <Phone size={14} />
                                                رقم الجوال
                                            </label>
                                            <Input 
                                                placeholder="05xxxxxxxx" 
                                                dir="ltr" 
                                                {...register(`customers.${index}.phone`, { 
                                                    required: "رقم الجوال مطلوب",
                                                    pattern: {
                                                        value: /^(05|5)\d{8}$/,
                                                        message: "رقم الجوال غير صحيح"
                                                    }
                                                })} 
                                                className={`transition-all duration-200 ${hasPhoneError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                            />
                                            {hasPhoneError && (
                                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                                    <AlertCircle size={12} />
                                                    <span>{errors.customers?.[index]?.phone?.message || validationErrors[`customer_${index}_phone`]}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                                <MapPin size={14} />
                                                المنطقة/المدينة
                                            </label>
                                            <Input 
                                                placeholder="المنطقة/المدينة" 
                                                {...register(`customers.${index}.region`, { required: "المنطقة مطلوبة" })} 
                                                className={`transition-all duration-200 ${hasRegionError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                            />
                                            {hasRegionError && (
                                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                                    <AlertCircle size={12} />
                                                    <span>{errors.customers?.[index]?.region?.message || validationErrors[`customer_${index}_region`]}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-1">نوع الطلب</label>
                                            <select 
                                                className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 py-2 px-3 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-400" 
                                                {...register(`customers.${index}.requestType`)}
                                            >
                                                <option>استفسار سعر</option>
                                                <option>طلب عرض سعر</option>
                                                <option>متابعة</option>
                                                <option>شكوى</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <Textarea 
                                            placeholder="الملاحظات..." 
                                            {...register(`customers.${index}.notes`)} 
                                            className="transition-all duration-200 focus:ring-blue-500 hover:border-blue-400"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                            <Upload size={16} />
                                            المستندات
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="file" 
                                                multiple 
                                                id={`file-upload-${field.id}`} 
                                                className="hidden" 
                                                onChange={(e) => handleFileChange(index, e)}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                            <Button 
                                                type="button" 
                                                variant="secondary" 
                                                size="sm" 
                                                icon={<Upload size={14}/>} 
                                                onClick={() => document.getElementById(`file-upload-${field.id}`)?.click()}
                                                className="hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                                            >
                                                رفع ملفات
                                            </Button>
                                            <span className="text-xs text-slate-500">PDF, Word, صور</span>
                                        </div>
                                        
                                        {customerFiles.length > 0 && (
                                            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {customerFiles.map(f => (
                                                    <div key={f.id} className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-xs p-2 rounded-lg flex items-center justify-between gap-2 border border-blue-200 dark:border-blue-700">
                                                        <span className="truncate flex-1" title={f.file.name}>
                                                            {f.file.name.length > 15 ? f.file.name.substring(0, 15) + '...' : f.file.name}
                                                        </span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeFile(index, f.id)} 
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded p-1 transition-colors duration-200"
                                                            title="حذف الملف"
                                                        >
                                                            <Trash2 size={12}/>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {fields.length > 1 && (
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="sm" 
                                            className="absolute -top-3 -left-3 p-2 h-auto rounded-full hover:scale-110 transition-transform duration-200 shadow-lg" 
                                            onClick={() => remove(index)}
                                            title="حذف العميل"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    )}
                                </div>
                            )})}
                            
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => append({ id: Date.now(), name: '', phone: '', region: '', requestType: 'استفسار سعر', notes: '', files: [] })} 
                                icon={<PlusCircle size={16} />}
                                className="w-full md:w-auto hover:bg-green-100 hover:text-green-700 hover:border-green-300 transition-all duration-200"
                            >
                                إضافة عميل جديد
                            </Button>
                        </div>

                        <div className="flex justify-end pt-6 border-t-2 border-slate-200 dark:border-slate-700">
                            <Button 
                                type="submit" 
                                size="lg"
                                disabled={isSubmitting}
                                className={`min-w-[200px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-200`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        جاري الحفظ...
                                    </div>
                                ) : (
                                    isEditMode ? "حفظ التعديلات" : "حفظ وإرسال التقرير"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            
            {/* Auto-save Status Indicator */}
            {autoSaveStatus !== 'idle' && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                        autoSaveStatus === 'saving' ? 'bg-blue-500 text-slate-900 dark:text-white' :
                            autoSaveStatus === 'saved' ? 'bg-green-500 text-slate-900 dark:text-white' :
                            'bg-red-500 text-slate-900 dark:text-white'
                    }`}>
                        {autoSaveStatus === 'saving' && (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                جاري الحفظ التلقائي...
                            </>
                        )}
                        {autoSaveStatus === 'saved' && (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                تم الحفظ التلقائي
                            </>
                        )}
                        {autoSaveStatus === 'error' && (
                            <>
                                <AlertCircle className="h-4 w-4" />
                                خطأ في الحفظ التلقائي
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesReportsScreen;