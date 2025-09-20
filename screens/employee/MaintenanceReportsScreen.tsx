import React, { useEffect, useState, useCallback } from 'react';
import { Wrench, Upload, AlertCircle, CheckCircle, MapPin, Clock, User, FileText, Camera, Download, Printer } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { useAppContext } from '../../hooks/useAppContext';
import { Report, ReportType, ReportStatus, MaintenanceDetails } from '../../types';
import useAppStore from '../../store/useAppStore';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';

interface MaintenanceReportsScreenProps {
    reportToEdit: Report | null;
}

type MaintenanceReportFormInputs = {
    serviceType: 'repair' | 'install' | 'preview' | 'periodic';
    workStatus: 'completed' | 'in_progress' | 'pending' | 'cancelled';
    customerName: string;
    location: string;
    equipment: string;
    duration: number;
    notes: string;
};

const MaintenanceReportsScreen: React.FC<MaintenanceReportsScreenProps> = ({ reportToEdit }) => {
    const { user } = useAppContext();
    const { addReport, updateReport, setActiveView } = useAppStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [beforeImages, setBeforeImages] = useState<File[]>([]);
    const [afterImages, setAfterImages] = useState<File[]>([]);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MaintenanceReportFormInputs>({
        defaultValues: {
            serviceType: 'repair',
            workStatus: 'pending',
            customerName: '',
            location: '',
            equipment: '',
            duration: 1,
            notes: ''
        },
        mode: 'onChange'
    });

    const isEditMode = !!reportToEdit;

    useEffect(() => {
        if (isEditMode && reportToEdit) {
            const details = reportToEdit.details as MaintenanceDetails;
            setValue('serviceType', details.serviceType);
            setValue('workStatus', details.workStatus);
            setValue('customerName', details.customerName);
            setValue('location', details.location || '');
            setValue('equipment', details.equipment);
            setValue('duration', details.duration || 1);
            setValue('notes', details.notes || '');
        }
    }, [reportToEdit, isEditMode, setValue]);

    const onSubmit: SubmitHandler<MaintenanceReportFormInputs> = async (data) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const maintenanceDetails: MaintenanceDetails = {
                serviceType: data.serviceType,
                workStatus: data.workStatus,
                customerName: data.customerName,
                location: data.location,
                equipment: data.equipment,
                duration: data.duration,
                notes: data.notes,
                beforeImages: beforeImages.map(file => file.name),
                afterImages: afterImages.map(file => file.name)
            };

            const reportData: Omit<Report, 'id'> = {
                type: 'maintenance' as ReportType,
                status: data.workStatus === 'completed' ? 'completed' : 'draft' as ReportStatus,
                createdAt: isEditMode ? reportToEdit!.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: user.id,
                branchId: user.branchId,
                details: maintenanceDetails
            };

            if (isEditMode && reportToEdit) {
                updateReport(reportToEdit.id, reportData);
                toast.success('تم تحديث تقرير الصيانة بنجاح');
            } else {
                addReport(reportData);
                toast.success('تم إنشاء تقرير الصيانة بنجاح');
            }

            reset();
            setBeforeImages([]);
            setAfterImages([]);
            setActiveView('log');
        } catch (error) {
            toast.error('حدث خطأ أثناء حفظ التقرير');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (type: 'before' | 'after', files: FileList | null) => {
        if (!files) return;
        
        const fileArray = Array.from(files);
        if (type === 'before') {
            setBeforeImages(prev => [...prev, ...fileArray]);
        } else {
            setAfterImages(prev => [...prev, ...fileArray]);
        }
    };

    const removeImage = (type: 'before' | 'after', index: number) => {
        if (type === 'before') {
            setBeforeImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setAfterImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-6">
            <ScreenHeader 
                icon={Wrench}
                title={isEditMode ? 'تعديل تقرير الصيانة' : 'إنشاء تقرير صيانة جديد'}
                colorClass="bg-nav-maintenance"
                onBack={() => setActiveView('log')}
                actionButton={
                    <Button
                        variant="secondary"
                        onClick={() => setActiveView('log')}
                        icon={<FileText size={16} />}
                    >
                        عرض التقارير
                    </Button>
                }
            />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="slice">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Wrench className="text-nav-maintenance" size={20} />
                                معلومات الخدمة
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">نوع الخدمة</label>
                                    <select 
                                        {...register('serviceType', { required: 'نوع الخدمة مطلوب' })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nav-maintenance focus:border-transparent"
                                    >
                                        <option value="repair">إصلاح</option>
                                        <option value="install">تركيب</option>
                                        <option value="preview">معاينة</option>
                                        <option value="periodic">صيانة دورية</option>
                                    </select>
                                    {errors.serviceType && (
                                        <p className="text-red-500 text-sm mt-1">{errors.serviceType.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">حالة العمل</label>
                                    <select 
                                        {...register('workStatus', { required: 'حالة العمل مطلوبة' })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nav-maintenance focus:border-transparent"
                                    >
                                        <option value="pending">معلق</option>
                                        <option value="in_progress">قيد التنفيذ</option>
                                        <option value="completed">مكتمل</option>
                                        <option value="cancelled">ملغي</option>
                                    </select>
                                    {errors.workStatus && (
                                        <p className="text-red-500 text-sm mt-1">{errors.workStatus.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="slice">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="text-nav-maintenance" size={20} />
                                معلومات العميل والموقع
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">اسم العميل</label>
                                    <Input
                                        {...register('customerName', { required: 'اسم العميل مطلوب' })}
                                        placeholder="أدخل اسم العميل"
                                        error={errors.customerName?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">الموقع</label>
                                    <Input
                                        {...register('location')}
                                        placeholder="أدخل موقع الخدمة"
                                        icon={<MapPin size={16} />}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="slice">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="text-nav-maintenance" size={20} />
                                تفاصيل العمل
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">المعدات</label>
                                    <Input
                                        {...register('equipment', { required: 'المعدات مطلوبة' })}
                                        placeholder="أدخل نوع المعدات"
                                        error={errors.equipment?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">المدة (بالساعات)</label>
                                    <Input
                                        type="number"
                                        min="0.5"
                                        step="0.5"
                                        {...register('duration', { 
                                            required: 'المدة مطلوبة',
                                            min: { value: 0.5, message: 'المدة يجب أن تكون على الأقل نصف ساعة' }
                                        })}
                                        placeholder="أدخل مدة العمل"
                                        icon={<Clock size={16} />}
                                        error={errors.duration?.message}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                                <Textarea
                                    {...register('notes')}
                                    placeholder="أدخل أي ملاحظات إضافية..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="slice">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Camera className="text-nav-maintenance" size={20} />
                                الصور
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">صور قبل العمل</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload('before', e.target.files)}
                                            className="hidden"
                                            id="before-images"
                                        />
                                        <label htmlFor="before-images" className="cursor-pointer">
                                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p className="text-sm text-gray-600">اضغط لرفع الصور</p>
                                        </label>
                                    </div>
                                    {beforeImages.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {beforeImages.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm truncate">{file.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => removeImage('before', index)}
                                                    >
                                                        حذف
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">صور بعد العمل</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload('after', e.target.files)}
                                            className="hidden"
                                            id="after-images"
                                        />
                                        <label htmlFor="after-images" className="cursor-pointer">
                                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p className="text-sm text-gray-600">اضغط لرفع الصور</p>
                                        </label>
                                    </div>
                                    {afterImages.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {afterImages.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm truncate">{file.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => removeImage('after', index)}
                                                    >
                                                        حذف
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setActiveView('log')}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-nav-maintenance hover:bg-nav-maintenance/90"
                        >
                            {isSubmitting ? 'جاري الحفظ...' : isEditMode ? 'تحديث التقرير' : 'إنشاء التقرير'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceReportsScreen;