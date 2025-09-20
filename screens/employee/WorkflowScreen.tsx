

import React from 'react';
import { Download, PlusCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { WorkflowRequest } from '../../types';
import { WORKFLOW_STAGES } from '../../data/mockData';
import { Input } from '../../components/ui/Input';
import useAppStore from '../../store/useAppStore';

interface WorkflowScreenProps {
    // Props removed
}

const priorityVariant: { [key: string]: 'destructive' | 'warning' | 'default' } = {
    'عالية': 'destructive',
    'متوسطة': 'warning',
    'منخفضة': 'default',
}

const WorkflowCard: React.FC<{ request: WorkflowRequest; onViewDetails: () => void; }> = ({ request, onViewDetails }) => {
    const currentStage = WORKFLOW_STAGES.find(s => s.id === request.currentStageId);
    return (
        <Card className="slice hover:shadow-workflow transition-all duration-300 flex flex-col transform hover:-translate-y-1.5">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="mb-1">{request.title}</CardTitle>
                        <p className="text-xs text-slate-500 font-mono">{request.id}</p>
                    </div>
                    <Badge variant={priorityVariant[request.priority]}>{request.priority}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">المرحلة الحالية: {currentStage?.name}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(request.currentStageId / WORKFLOW_STAGES.length) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-center">{request.currentStageId} / {WORKFLOW_STAGES.length}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500 border-t pt-4">
                    <span>{request.type === 'استيراد' ? '📥' : '📤'} {request.type}</span>
                    <span>{new Date(request.creationDate).toLocaleDateString('ar-SA')}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="secondary" className="w-full" onClick={onViewDetails}>عرض التفاصيل</Button>
            </CardFooter>
        </Card>
    )
}

const WorkflowScreen: React.FC<WorkflowScreenProps> = () => {
    const { t } = useAppContext();
    const { requests, setActiveWorkflowId, setWorkflowModalOpen, setActiveView } = useAppStore();

    return (
        <div className="space-y-6">
            <ScreenHeader 
                icon={Download} 
                title={t('importExport')} 
                colorClass="bg-nav-workflow"
                onBack={() => setActiveView('dashboard')}
                actionButton={
                    <>
                        {/* Desktop Button */}
                        <Button 
                            icon={<PlusCircle size={18} />} 
                            onClick={() => setWorkflowModalOpen(true)}
                            className="hidden md:inline-flex"
                        >
                            {t('createNewRequest')}
                        </Button>
                        {/* Mobile Icon Button */}
                        <Button
                            onClick={() => setWorkflowModalOpen(true)}
                            variant="primary"
                            size="sm"
                            className="md:hidden p-2 h-10 w-10 rounded-full flex items-center justify-center"
                            aria-label={t('createNewRequest')}
                        >
                            <PlusCircle size={20} />
                        </Button>
                    </>
                }
            />

            <Card className="slice">
                <CardContent className="pt-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-2">
                            <Input placeholder="بحث في العنوان والوصف..." icon={<Search size={16}/>} />
                        </div>
                        <select className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-3 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                            <option>كل الأنواع</option>
                            <option>استيراد</option>
                            <option>تصدير</option>
                        </select>
                        <select className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-3 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                            <option>كل المراحل</option>
                            {WORKFLOW_STAGES.map(s => <option key={s.id}>{s.name}</option>)}
                        </select>
                        <select className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-3 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                            <option>كل الأولويات</option>
                            <option>عالية</option>
                            <option>متوسطة</option>
                            <option>منخفضة</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {requests && requests.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(req => <WorkflowCard key={req.id} request={req} onViewDetails={() => setActiveWorkflowId(req.id)} />)}
                </div>
            ) : (
                <Card className="slice">
                    <CardContent className="pt-6 text-center text-slate-500 py-12">
                        <p className="mb-4">لا توجد طلبات لعرضها حالياً.</p>
                        <Button onClick={() => setWorkflowModalOpen(true)} icon={<PlusCircle size={16}/>}>
                            {t('createNewRequest')}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default WorkflowScreen;