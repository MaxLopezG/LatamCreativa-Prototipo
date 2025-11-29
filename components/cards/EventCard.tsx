
import React from 'react';
import { CalendarDays, MapPin, Ticket, Clock, Users } from 'lucide-react';
import { EventItem } from '../../types';

interface EventCardProps {
  event: EventItem;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="group flex flex-col h-full bg-white dark:bg-white/[0.02] rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 hover:ring-amber-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img 
          src={event.image} 
          alt={event.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-3 right-3 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md text-black rounded-lg p-2 min-w-[50px] shadow-lg">
            <span className="text-[10px] uppercase font-bold text-red-500">{event.month}</span>
            <span className="text-xl font-bold leading-none">{event.day}</span>
        </div>
        <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md text-white shadow-lg border border-white/20 ${
                event.location === 'Online' ? 'bg-blue-500' : 'bg-amber-500'
            }`}>
                {event.location === 'Online' ? 'Virtual' : 'Presencial'}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">{event.type}</span>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 mb-3 group-hover:text-amber-500 transition-colors leading-tight">
            {event.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {event.time}
            </div>
            {event.location !== 'Online' && (
                <div className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="h-3.5 w-3.5" /> {event.location}
                </div>
            )}
        </div>

        <div className="flex items-center gap-3 mb-4">
            <img src={event.organizerAvatar} alt={event.organizer} className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">por {event.organizer}</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" /> {event.attendees} asistirán
            </div>
            <span className={`text-sm font-bold ${event.price === 0 ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                {event.price === 0 ? 'Gratis' : `$${event.price}`}
            </span>
        </div>
      </div>
    </div>
  );
};
