

import React, { useState, useRef } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Briefcase, Building2, Shield, Lock, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import useAppStore from '../../store/useAppStore';
import toast from 'react-hot-toast';

const ProfileScreen: React.FC = () => {
    const { t, user, updateUser } = useAppContext();
    const { setActiveView } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    
    if (!user) return null; // Should not happen if routed correctly

    const [formData, setFormData] = useState({
        name: user.name,
        phone: user.phone,
        position: user.position,
        bio: 'مسؤول مبيعات متخصص في حلول الطاقة الشمسية للمشاريع الكبرى.',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ avatarUrl: reader.result as string });
                toast.success('تم تحديث الصورة الشخصية!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Here you would typically save the data to the backend
        updateUser({
            name: formData.name,
            phone: formData.phone,
            position: formData.position,
        });
        toast.success('تم حفظ التعديلات بنجاح');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user.name,
            phone: user.phone,
            position: user.position,
            bio: 'مسؤول مبيعات متخصص في حلول الطاقة الشمسية للمشاريع الكبرى.',
        });
        setIsEditing(false);
    }
    
    const formattedJoinDate = format(new Date(user.joinDate), 'PPP', { locale: arSA });

    return (
        <div className="space-y-6">
            <input
                type="file"
                ref={avatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
            />
            <ScreenHeader 
                icon={UserIcon} 
                title={t('profile')} 
                colorClass="bg-nav-profile"
                onBack={() => setActiveView('dashboard')}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4 group">
                                    <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full border-4 border-primary/20 shadow-lg"/>
                                    <button 
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 h-auto rounded-full bg-primary text-slate-900 dark:text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <Upload size={14}/>
                                    </button>
                                </div>
                                {isEditing ? (
                                    <Input name="name" value={formData.name} onChange={handleInputChange} className="text-center text-2xl font-bold" />
                                ) : (
                                    <h2 className="text-2xl font-bold">{formData.name}</h2>
                                )}
                                
                                {isEditing ? (
                                    <Input name="position" value={formData.position} onChange={handleInputChange} className="text-center mt-1" />
                                ) : (
                                    <Badge variant="default" className="mt-1">{formData.position}</Badge>
                                )}
                            </div>
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-center gap-3"><Mail size={16} className="text-slate-400"/><span dir="ltr">{user.email}</span></div>
                                <div className="flex items-center gap-3"><Phone size={16} className="text-slate-400"/>
                                    {isEditing ? <Input name="phone" dir="ltr" value={formData.phone} onChange={handleInputChange} /> : <span dir="ltr">{formData.phone}</span>}
                                </div>
                                <div className="flex items-center gap-3"><MapPin size={16} className="text-slate-400"/><span>{user.branch}</span></div>
                                <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-400"/><span>انضم في: {formattedJoinDate}</span></div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {!isEditing ? (
                                <Button className="w-full" icon={<Edit3 size={16}/>} onClick={() => setIsEditing(true)}>تعديل المعلومات</Button>
                            ) : (
                                <div className="w-full flex gap-2">
                                    <Button className="flex-1" variant="secondary" icon={<X size={16}/>} onClick={handleCancel}>إلغاء</Button>
                                    <Button className="flex-1" icon={<Save size={16}/>} onClick={handleSave}>حفظ</Button>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {isEditing && (
                        <Card>
                            <CardHeader><CardTitle>نبذة شخصية</CardTitle></CardHeader>
                            <CardContent><Textarea name="bio" value={formData.bio} onChange={handleInputChange} /></CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader><CardTitle>معلومات العمل</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg"><Briefcase size={20} className="text-primary"/><div><p className="text-xs">القسم</p><p className="font-semibold">{user.department}</p></div></div>
                            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg"><Building2 size={20} className="text-primary"/><div><p className="text-xs">الفرع</p><p className="font-semibold">{user.branch}</p></div></div>
                            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg"><Shield size={20} className="text-primary"/><div><p className="text-xs">رقم الموظف</p><p className="font-semibold">{user.employeeId}</p></div></div>
                            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg"><Calendar size={20} className="text-primary"/><div><p className="text-xs">تاريخ الانضمام</p><p className="font-semibold">{formattedJoinDate}</p></div></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>إعدادات الأمان</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div><label className="text-sm">كلمة المرور الحالية</label><Input type="password" icon={<Lock size={16} />} required /></div>
                            <div><label className="text-sm">كلمة المرور الجديدة</label><Input type="password" icon={<Lock size={16} />} required /></div>
                            <div><label className="text-sm">تأكيد كلمة المرور الجديدة</label><Input type="password" icon={<Lock size={16} />} required /></div>
                        </CardContent>
                        <CardFooter>
                            <Button>تغيير كلمة المرور</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;