/**
 * Modal de Reporte de Contenido
 * 
 * Permite a los usuarios reportar contenido inapropiado.
 * 
 * @module components/modals/ReportModal
 */
import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Loader2 } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { reportsService, Report } from '../../services/modules/reports';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: 'project' | 'article' | 'comment' | 'user';
    contentId: string;
    contentTitle?: string;
}

const REPORT_REASONS: { value: Report['reason']; label: string; description: string }[] = [
    { value: 'spam', label: 'Spam', description: 'Contenido promocional no deseado o repetitivo' },
    { value: 'inappropriate', label: 'Contenido inapropiado', description: 'Contenido ofensivo, violento o para adultos' },
    { value: 'harassment', label: 'Acoso', description: 'Comportamiento abusivo hacia otros usuarios' },
    { value: 'copyright', label: 'Infracción de derechos', description: 'Uso no autorizado de contenido protegido' },
    { value: 'other', label: 'Otro', description: 'Otro motivo no listado arriba' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    contentType,
    contentId,
    contentTitle
}) => {
    const { state, actions } = useAppStore();
    const { user, contentMode } = state;

    const [selectedReason, setSelectedReason] = useState<Report['reason'] | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasReported, setHasReported] = useState(false);

    const accentClass = contentMode === 'dev' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-600';
    const accentBorder = contentMode === 'dev' ? 'border-blue-500' : 'border-amber-500';

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!user || !selectedReason) return;

        setIsSubmitting(true);
        try {
            // Verificar si ya reportó
            const alreadyReported = await reportsService.hasUserReported(contentId, user.id);
            if (alreadyReported) {
                actions.showToast('Ya has reportado este contenido anteriormente', 'info');
                setHasReported(true);
                setIsSubmitting(false);
                return;
            }

            await reportsService.createReport({
                contentType,
                contentId,
                contentTitle,
                reporterId: user.id,
                reporterName: user.name || user.username || 'Usuario',
                reason: selectedReason,
                description: description.trim() || undefined
            });

            actions.showToast('Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.', 'success');
            setHasReported(true);
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error('Error submitting report:', error);
            actions.showToast('Error al enviar el reporte. Intenta de nuevo.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contentTypeLabel = {
        project: 'proyecto',
        article: 'artículo',
        comment: 'comentario',
        user: 'usuario'
    }[contentType];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0F1115] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/10">
                            <Flag className="h-5 w-5 text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Reportar {contentTypeLabel}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                {hasReported ? (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                            <Flag className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Reporte enviado</h3>
                        <p className="text-slate-400">
                            Revisaremos el contenido y tomaremos las medidas necesarias.
                        </p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {contentTitle && (
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-xs text-slate-400 mb-1">Reportando:</p>
                                <p className="text-sm text-white font-medium truncate">{contentTitle}</p>
                            </div>
                        )}

                        {/* Razones */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Motivo del reporte</label>
                            <div className="space-y-2">
                                {REPORT_REASONS.map((reason) => (
                                    <button
                                        key={reason.value}
                                        onClick={() => setSelectedReason(reason.value)}
                                        className={`w-full p-3 rounded-xl text-left transition-all border ${selectedReason === reason.value
                                                ? `${accentBorder} bg-white/5`
                                                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                    >
                                        <p className="text-sm font-medium text-white">{reason.label}</p>
                                        <p className="text-xs text-slate-400">{reason.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Descripción adicional */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">
                                Detalles adicionales <span className="text-slate-500">(opcional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Proporciona más contexto sobre el problema..."
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-white/20 min-h-[80px] resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-slate-500 text-right">{description.length}/500</p>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-200/80">
                                Los reportes falsos o abusivos pueden resultar en la suspensión de tu cuenta.
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {!hasReported && (
                    <div className="p-6 border-t border-white/10 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedReason || isSubmitting}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${accentClass}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar reporte'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
