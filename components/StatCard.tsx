import React from 'react';
import { Card, CardContent } from './ui/Card';
import { StatCardData } from '../types';

interface StatCardProps {
    data: StatCardData;
    type?: 'projects' | 'sales' | 'maintenance' | 'analytics' | 'employees' | 'reports';
}

const StatCard: React.FC<StatCardProps> = ({ data, type = 'analytics' }) => {
    const { title, value, change, icon: Icon, color } = data;

    return (
        <div className={`card ${type}`}>
            <div className="card-name">{title}</div>
            <div className="quote">
                <div className={`p-3 rounded-full bg-white/20 transition-colors duration-300 hover:bg-white/30`}>
                    <Icon size={32} className="transition-transform duration-300 hover:scale-110"/>
                </div>
            </div>
            <div className="body-text">{value}</div>
            <div className="author">
                {change && (
                    <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-200' : 'text-red-200'}`}>
                        {change}
                    </span>
                )}
                <svg height="" width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H24V24H0z" fill="none"></path>
                    <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>
                </svg>
            </div>
        </div>
    );
};

export default StatCard;