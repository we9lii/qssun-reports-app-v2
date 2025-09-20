

import React, { useState } from 'react';
import { PlusCircle, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAppContext } from '../../hooks/useAppContext';
import { Role, PermissionAssignment } from '../../types';
import { mockPermissions, mockUsers, mockBranches } from '../../data/mockData';
import useAppStore from '../../store/useAppStore';


const PermissionFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: PermissionAssignment) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [userId, setUserId] = useState(mockUsers[0].id);
    const [role, setRole] = useState<Role>(Role.Employee);
    const [branch, setBranch] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return;

        const newAssignment: PermissionAssignment = {
            id: `P${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userAvatarUrl: user.avatarUrl,
            role,
            assignedBranch: role === Role.BranchManager ? branch : (role === Role.Admin ? 'جميع الفروع' : undefined),
            assignmentDate: new Date().toISOString().split('T')[0],
        };
        onSave(newAssignment);
    };

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <CardHeader><CardTitle>تعيين دور جديد</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اختيار المستخدم</label>
              <select value={userId} onChange={e => setUserId(e.target.value)} className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 p-2">
                {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">اختيار الدور</label>
              <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 p-2">
                {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {role === Role.BranchManager && (
                 <div>
                  <label className="block text-sm font-medium mb-1">اختيار الفرع</label>
                  <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 p-2">
                    {mockBranches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit">حفظ التعيين</Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
};

const ManagePermissionsScreen: React.FC = () => {
    const { t } = useAppContext();
    const { setActiveView } = useAppStore();
    const [assignments, setAssignments] = useState(mockPermissions);
    const [isModalOpen, setModalOpen] = useState(false);
    
    const handleSave = (assignment: PermissionAssignment) => {
        setAssignments([assignment, ...assignments]);
        setModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('هل أنت متأكد من إزالة هذا الدور؟')) {
            setAssignments(assignments.filter(a => a.id !== id));
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{t('managePermissions')}</h1>
                    <div className="flex items-center gap-2">
                        <Button icon={<PlusCircle size={18} />} onClick={() => setModalOpen(true)}>تعيين دور</Button>
                        <Button onClick={() => setActiveView('dashboard')} variant="secondary">
                            <ArrowRight size={16} className="me-2" />
                            رجوع
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader><CardTitle>الأدوار المعينة حالياً</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">المستخدم</th>
                                        <th scope="col" className="px-6 py-3">الدور</th>
                                        <th scope="col" className="px-6 py-3">الفرع المخصص</th>
                                        <th scope="col" className="px-6 py-3">تاريخ التعيين</th>
                                        <th scope="col" className="px-6 py-3">إجراء</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(a => (
                                        <tr key={a.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <img src={a.userAvatarUrl} alt={a.userName} className="w-10 h-10 rounded-full" />
                                                <span className="font-medium text-slate-900 dark:text-white">{a.userName}</span>
                                            </td>
                                            <td className="px-6 py-4"><Badge>{a.role}</Badge></td>
                                            <td className="px-6 py-4">{a.assignedBranch || '---'}</td>
                                            <td className="px-6 py-4">{new Date(a.assignmentDate).toLocaleDateString('ar-SA')}</td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="sm" className="p-2 h-auto text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <PermissionFormModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
        </>
    )
};

export default ManagePermissionsScreen;